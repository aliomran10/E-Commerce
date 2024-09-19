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
exports.deleteReviewValidator = exports.getReviewValidator = exports.updateReviewValidator = exports.createReviewValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const reviewsModel_1 = __importDefault(require("../../models/reviewsModel"));
exports.createReviewValidator = [
    (0, express_validator_1.check)('comment').notEmpty().withMessage('Subcategory Name is Required'),
    (0, express_validator_1.check)('rating').notEmpty().withMessage('rating Required'),
    (0, express_validator_1.check)('user')
        .notEmpty().withMessage('user Required')
        .isMongoId().withMessage('invalid Mongo id'),
    (0, express_validator_1.check)('product')
        .notEmpty().withMessage('product Required')
        .isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const review = yield reviewsModel_1.default.findOne({ user: req.user._id, product: val });
        if (review) {
            throw new Error('you already created review before');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.updateReviewValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const review = yield reviewsModel_1.default.findById(val);
        if (!review) {
            throw new Error('review not found');
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
            throw new Error('you are not allowed to perform this action');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.getReviewValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.deleteReviewValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        if (req.user.role === 'user') {
            const review = yield reviewsModel_1.default.findById(val);
            if (!review) {
                throw new Error('review not found');
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error('you are not allowed to perform this action');
            }
        }
        return true;
    })),
    validatorMiddleware_1.default
];
