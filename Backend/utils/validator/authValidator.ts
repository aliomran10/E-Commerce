import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware";
import usersModel from "../../models/usersModel";

export const signupValidator: RequestHandler[] = [
  check('name')
    .notEmpty().withMessage('User Name is Required')
    .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
  check('email')
    .notEmpty().withMessage('Email is Required')
    .isEmail().withMessage('Invalid Email')
    .custom(async (val: string) => {
      const user = await usersModel.findOne({ email: val });
      if (user) { throw new Error(`Email already exists`) }
      return true;
    }),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 char')
    .custom((val: string, { req }) => {
      if (val !== req.body.confirmPassword) { throw new Error("Passwords don't match") }
      return true
    }),
  check('confirmPassword')
    .notEmpty().withMessage('Confirm password required')
    .isLength({ min: 6, max: 20 }).withMessage('Confirm password length must be between 6 and 20 characters'),
  validatorMiddleware
]

export const loginValidator: RequestHandler[] = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 characters'),
  validatorMiddleware
]

export const sendMailValidator: RequestHandler[] = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),
  validatorMiddleware
]

export const resetCodeValidator: RequestHandler[] = [
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 char')
    .custom((val: string, { req }) => {
      if (val !== req.body.confirmPassword) { throw new Error("Passwords don't match") }
      return true
    }),
  check('confirmPassword')
    .notEmpty().withMessage('Confirm password required')
    .isLength({ min: 6, max: 20 }).withMessage('Confirm password length must between 6 and 20 char'),
  validatorMiddleware
]