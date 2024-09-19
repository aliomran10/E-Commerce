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
exports.deleteCouponValidator = exports.getCouponValidator = exports.updateCouponValidator = exports.createCouponValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const couponsModel_1 = __importDefault(require("../../models/couponsModel"));
exports.createCouponValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty().withMessage('Coupon name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50')
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield couponsModel_1.default.findOne({ name: val });
        if (coupon) {
            throw new Error('Coupon name already exists');
        }
        return true;
    })),
    (0, express_validator_1.check)('expireTime')
        .notEmpty().withMessage('Coupon expire time required')
        .isDate().withMessage('Invalid Date'),
    (0, express_validator_1.check)('discount')
        .notEmpty().withMessage('Discount required')
        .isNumeric().withMessage('Discount must be a number')
        .custom((val) => {
        if (val <= 0 || val > 100) {
            throw new Error('Invalid discount value');
        }
        return true;
    }),
    validatorMiddleware_1.default
];
exports.updateCouponValidator = [
    (0, express_validator_1.check)('name').optional()
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('expireTime').optional()
        .isDate().withMessage('Invalid Date'),
    (0, express_validator_1.check)('discount')
        .notEmpty().withMessage('Discount required')
        .isNumeric().withMessage('Discount must be a number')
        .custom((val) => {
        if (val <= 0 || val > 100) {
            throw new Error('invalid Discount value');
        }
        return true;
    }),
    validatorMiddleware_1.default
];
exports.getCouponValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.deleteCouponValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
