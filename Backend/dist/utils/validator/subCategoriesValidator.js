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
exports.deleteSubcategoryValidator = exports.getSubcategoryValidator = exports.updateSubcategoryValidator = exports.createSubcategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const categoryModel_1 = __importDefault(require("../../models/categoryModel"));
exports.createSubcategoryValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty().withMessage('Subcategory Name is Required')
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('category')
        .notEmpty().withMessage('Category is Required')
        .isMongoId().withMessage('Invalid Mongo Id')
        // * Check if category exist
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield categoryModel_1.default.findById(val);
        if (!category) {
            throw new Error('Category Not Found');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.updateSubcategoryValidator = [
    (0, express_validator_1.check)('name').optional()
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('category').optional()
        .isMongoId().withMessage('Invalid Mongo Id')
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield categoryModel_1.default.findById(val);
        if (!category) {
            throw new Error('Category Not Found');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.getSubcategoryValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.deleteSubcategoryValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
