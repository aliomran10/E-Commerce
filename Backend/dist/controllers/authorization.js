"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkActive = exports.allowedTo = exports.resetCode = exports.verifyResetCode = exports.forgetPassword = exports.protectRoutes = exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersModel_1 = __importDefault(require("../models/usersModel"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const createToken_1 = require("../utils/createToken");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
exports.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.create(req.body);
    const token = (0, createToken_1.createToken)(user._id, user.role);
    res.status(201).json({ token, data: user });
}));
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findOne({ email: req.body.email });
    if (!user || !(yield bcryptjs_1.default.compare(req.body.password, user.password))) {
        return next(new apiError_1.default('Invalid email or password', 401));
    }
    const token = (0, createToken_1.createToken)(user._id, user.role);
    res.status(200).json({ token, message: 'logged in successfully' });
}));
exports.protectRoutes = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1- check if token found
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else {
        return next(new apiError_1.default('login first to access the application', 401));
    }
    // 2- check if token not expired
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user exist
    const currentUser = yield usersModel_1.default.findById(decodedToken._id);
    if (!currentUser) {
        return next(new apiError_1.default("user doesn't exist", 401));
    }
    // 4- check if password changed
    if (currentUser.passwordChangedAt instanceof Date) {
        const changedPasswordTime = parseInt((currentUser.passwordChangedAt.getTime() / 1000).toString());
        if (changedPasswordTime > decodedToken.iat) {
            return next(new apiError_1.default('please login again', 401));
        }
    }
    req.user = currentUser;
    next();
}));
exports.forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new apiError_1.default('User not found', 404));
    }
    ;
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = crypto_1.default.createHash('sha256').update(resetCode).digest('hex');
    user.resetCodeExpireTime = Date.now() + (10 * 60 * 1000);
    user.resetCodeVerify = false;
    const message = `Your reset password code is ${resetCode}`;
    try {
        yield (0, sendMail_1.default)({ email: user.email, subject: 'Reset Password', message });
        yield user.save({ validateModifiedOnly: true });
    }
    catch (err) {
        console.log(err);
        return next(new apiError_1.default('Error sending email', 400));
    }
    const resetToken = (0, createToken_1.createResetToken)(user._id);
    res.status(200).json({ message: 'Reset password code sent to your email', resetToken });
}));
exports.verifyResetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let resetToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        resetToken = req.headers.authorization.split(' ')[1];
    }
    else {
        return next(new apiError_1.default('Get your reset code first', 400));
    }
    const decodedToken = jsonwebtoken_1.default.verify(resetToken, process.env.JWT_SECRET_KEY);
    const hashedResetCode = crypto_1.default.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user = yield usersModel_1.default.findOne({
        _id: decodedToken._id,
        resetCode: hashedResetCode,
        resetCodeExpireTime: { $gt: Date.now() }
    });
    if (!user) {
        return next(new apiError_1.default('Invalid or Expired reset code', 400));
    }
    ;
    user.resetCodeVerify = true;
    yield user.save({ validateModifiedOnly: true });
    res.status(200).json({ message: 'Reset code verified' });
}));
exports.resetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let resetToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        resetToken = req.headers.authorization.split(' ')[1];
    }
    else {
        return next(new apiError_1.default("You can't do this action", 400));
    }
    const decodedToken = jsonwebtoken_1.default.verify(resetToken, process.env.JWT_SECRET_KEY);
    const user = yield usersModel_1.default.findOne({
        _id: decodedToken._id,
        resetCodeVerify: true
    });
    if (!user) {
        return next(new apiError_1.default('Verify your reset code first', 400));
    }
    ;
    user.password = req.body.password;
    user.resetCode = undefined;
    user.resetCodeExpireTime = undefined;
    user.resetCodeVerify = undefined;
    user.passwordChangedAt = Date.now();
    yield user.save({ validateModifiedOnly: true });
    res.status(200).json({ message: 'Your password has been changed' });
}));
const allowedTo = (...roles) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role))) {
        return next(new apiError_1.default("You can't access this", 403));
    }
    next();
}));
exports.allowedTo = allowedTo;
exports.checkActive = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.active)) {
        return next(new apiError_1.default('Your account is not active', 403));
    }
    next();
}));
