import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { Users } from '../Interfaces/users';
import usersModel from '../models/usersModel';
import ApiErrors from '../utils/apiError';
import { createResetToken, createToken } from '../utils/createToken';
import sendMail from '../utils/sendMail';

export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user: Users = await usersModel.create(req.body);
  const token = createToken(user._id, user.role);
  res.status(201).json({ token, data: user })
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await usersModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiErrors('Invalid email or password', 401));
  }
  const token = createToken(user._id, user.role);
  res.status(200).json({ token, message: 'logged in successfully' });
});

export const protectRoutes = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // 1- check if token found
  let token: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else { return next(new ApiErrors('login first to access the application', 401)) }
  // 2- check if token not expired
  const decodedToken: any = Jwt.verify(token, process.env.JWT_SECRET_KEY!);
  // 3- check if user exist
  const currentUser = await usersModel.findById(decodedToken._id);
  if (!currentUser) { return next(new ApiErrors("user doesn't exist", 401)) }
  // 4- check if password changed
  if (currentUser.passwordChangedAt instanceof Date) {
    const changedPasswordTime: number = parseInt((currentUser.passwordChangedAt.getTime() / 1000).toString());
    if (changedPasswordTime > decodedToken.iat) { return next(new ApiErrors('please login again', 401)) }
  }
  req.user = currentUser;
  next();
});

export const forgetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await usersModel.findOne({ email: req.body.email });
  if (!user) { return next(new ApiErrors('User not found', 404)) };
  const resetCode: string = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
  user.resetCodeExpireTime = Date.now() + (10 * 60 * 1000);
  user.resetCodeVerify = false;
  const message: string = `Your reset password code is ${resetCode}`
  try {
    await sendMail({ email: user.email, subject: 'Reset Password', message });
    await user.save({ validateModifiedOnly: true });
  } catch (err) {
    console.log(err);
    return next(new ApiErrors('Error sending email', 400))
  }
  const resetToken: string = createResetToken(user._id);
  res.status(200).json({ message: 'Reset password code sent to your email', resetToken })
});

export const verifyResetCode = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let resetToken: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    resetToken = req.headers.authorization.split(' ')[1];
  } else { return next(new ApiErrors('Get your reset code first', 400)) }
  const decodedToken: any = Jwt.verify(resetToken, process.env.JWT_SECRET_KEY!);
  const hashedResetCode: string = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
  const user = await usersModel.findOne({
    _id: decodedToken._id,
    resetCode: hashedResetCode,
    resetCodeExpireTime: { $gt: Date.now() }
  })
  if (!user) { return next(new ApiErrors('Invalid or Expired reset code', 400)) };
  user.resetCodeVerify = true;
  await user.save({ validateModifiedOnly: true });
  res.status(200).json({ message: 'Reset code verified' });
});

export const resetCode = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let resetToken: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    resetToken = req.headers.authorization.split(' ')[1];
  } else { return next(new ApiErrors("You can't do this action", 400)) }
  const decodedToken: any = Jwt.verify(resetToken, process.env.JWT_SECRET_KEY!);
  const user = await usersModel.findOne({
    _id: decodedToken._id,
    resetCodeVerify: true
  })
  if (!user) { return next(new ApiErrors('Verify your reset code first', 400)) };
  user.password = req.body.password;
  user.resetCode = undefined;
  user.resetCodeExpireTime = undefined;
  user.resetCodeVerify = undefined;
  user.passwordChangedAt = Date.now();
  await user.save({ validateModifiedOnly: true });
  res.status(200).json({ message: 'Your password has been changed' });
});

export const allowedTo = (...roles: string[]) => asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!(roles.includes(req.user?.role!))) {
    return next(new ApiErrors("You can't access this", 403))
  }
  next();
});

export const checkActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.active) {
    return next(new ApiErrors('Your account is not active', 403))
  }
  next();
});