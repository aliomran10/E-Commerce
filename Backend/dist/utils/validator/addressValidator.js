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
exports.deleteAddressValidator = exports.getAddressValidator = exports.updateAddressValidator = exports.createAddressValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const addressModel_1 = __importDefault(require("../../models/addressModel"));
exports.createAddressValidator = [
    (0, express_validator_1.check)('country').notEmpty().withMessage('Country is Required'),
    (0, express_validator_1.check)('city').notEmpty().withMessage('City is Required'),
    (0, express_validator_1.check)('street').notEmpty().withMessage('Street is required'),
    (0, express_validator_1.check)('apartmentNo').notEmpty().withMessage('Apartment number is required'),
    validatorMiddleware_1.default
];
exports.updateAddressValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const address = yield addressModel_1.default.findById(val);
        if (!address) {
            throw new Error('Address not found');
        }
        if (address.user._id.toString() !== req.user._id.toString()) {
            throw new Error('You are not allowed to perform this action');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.getAddressValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.deleteAddressValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        if (req.user.role === 'user') {
            const address = yield addressModel_1.default.findById(val);
            if (!address) {
                throw new Error('Address not found');
            }
            if (address.user._id.toString() !== req.user._id.toString()) {
                throw new Error('You are not allowed to perform this action');
            }
        }
        return true;
    })),
    validatorMiddleware_1.default
];
