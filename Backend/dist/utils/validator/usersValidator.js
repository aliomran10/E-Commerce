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
exports.changeLoggedUserPasswordValidator = exports.updateLoggedUserValidator = exports.changeUserPasswordValidator = exports.deleteUserValidator = exports.getUserValidator = exports.updateUserValidator = exports.createUserValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const usersModel_1 = __importDefault(require("../../models/usersModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.createUserValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty().withMessage('User Name is Required')
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Invalid Email')
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield usersModel_1.default.findOne({ email: val });
        if (user) {
            throw new Error(`email is already exist`);
        }
        return true;
    })),
    (0, express_validator_1.check)('password')
        .notEmpty().withMessage('password required')
        .isLength({ min: 6, max: 20 }).withMessage('password length must between 6 and 20 char')
        .custom((val, { req }) => {
        if (val !== req.body.confirmPassword) {
            throw new Error("passwords doesn't match");
        }
        return true;
    }),
    (0, express_validator_1.check)('confirmPassword')
        .notEmpty().withMessage('confirm password required')
        .isLength({ min: 6, max: 20 }).withMessage('confirm password length must between 6 and 20 char'),
    validatorMiddleware_1.default
];
exports.updateUserValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    (0, express_validator_1.check)('name').optional()
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('active').optional()
        .isBoolean().withMessage('Invalid Active value'),
    validatorMiddleware_1.default
];
exports.getUserValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.deleteUserValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.changeUserPasswordValidator = [
    (0, express_validator_1.check)('password')
        .notEmpty().withMessage('password required')
        .isLength({ min: 6, max: 20 }).withMessage('password length must between 6 and 20 char')
        .custom((val, { req }) => {
        if (val !== req.body.confirmPassword) {
            throw new Error("passwords doesn't match");
        }
        return true;
    }),
    (0, express_validator_1.check)('confirmPassword')
        .notEmpty().withMessage('confirm password required')
        .isLength({ min: 6, max: 20 }).withMessage('confirm password length must between 6 and 20 char'),
    validatorMiddleware_1.default
];
exports.updateLoggedUserValidator = [
    (0, express_validator_1.check)('name').optional()
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    validatorMiddleware_1.default
];
exports.changeLoggedUserPasswordValidator = [
    (0, express_validator_1.check)('currentPassword')
        .notEmpty().withMessage('current password required')
        .isLength({ min: 6, max: 20 }).withMessage('current password length must between 6 and 20 char')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const user = yield usersModel_1.default.findById(req.user._id);
        const isCorrectPassword = yield bcryptjs_1.default.compare(val, user.password);
        if (!isCorrectPassword) {
            throw new Error('current password invalid');
        }
    })),
    (0, express_validator_1.check)('password')
        .notEmpty().withMessage('password required')
        .isLength({ min: 6, max: 20 }).withMessage('password length must between 6 and 20 char')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        if (val !== req.body.confirmPassword) {
            throw new Error("passwords doesn't match");
        }
        return true;
    })),
    (0, express_validator_1.check)('confirmPassword')
        .notEmpty().withMessage('confirm password required')
        .isLength({ min: 6, max: 20 }).withMessage('confirm password length must between 6 and 20 char'),
    validatorMiddleware_1.default
];
