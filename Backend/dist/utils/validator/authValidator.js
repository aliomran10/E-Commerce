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
exports.resetCodeValidator = exports.sendMailValidator = exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const usersModel_1 = __importDefault(require("../../models/usersModel"));
exports.signupValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty().withMessage('User Name is Required')
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Invalid Email')
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield usersModel_1.default.findOne({ email: val });
        if (user) {
            throw new Error(`Email already exists`);
        }
        return true;
    })),
    (0, express_validator_1.check)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 char')
        .custom((val, { req }) => {
        if (val !== req.body.confirmPassword) {
            throw new Error("Passwords don't match");
        }
        return true;
    }),
    (0, express_validator_1.check)('confirmPassword')
        .notEmpty().withMessage('Confirm password required')
        .isLength({ min: 6, max: 20 }).withMessage('Confirm password length must be between 6 and 20 characters'),
    validatorMiddleware_1.default
];
exports.loginValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email'),
    (0, express_validator_1.check)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 characters'),
    validatorMiddleware_1.default
];
exports.sendMailValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email'),
    validatorMiddleware_1.default
];
exports.resetCodeValidator = [
    (0, express_validator_1.check)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 char')
        .custom((val, { req }) => {
        if (val !== req.body.confirmPassword) {
            throw new Error("Passwords don't match");
        }
        return true;
    }),
    (0, express_validator_1.check)('confirmPassword')
        .notEmpty().withMessage('Confirm password required')
        .isLength({ min: 6, max: 20 }).withMessage('Confirm password length must between 6 and 20 char'),
    validatorMiddleware_1.default
];
