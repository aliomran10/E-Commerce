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
exports.deleteProductValidator = exports.getProductValidator = exports.updateProductValidator = exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const categoryModel_1 = __importDefault(require("../../models/categoryModel"));
const subCategoryModel_1 = __importDefault(require("../../models/subCategoryModel"));
exports.createProductValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty().withMessage('Subcategory Name is Required')
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('description')
        .notEmpty().withMessage('description required')
        .isLength({ min: 10, max: 500 }),
    (0, express_validator_1.check)('price')
        .notEmpty().withMessage('Product Price required')
        .isNumeric().withMessage('price must be number').toFloat()
        .custom((val) => {
        if (val <= 0 || val > 1000000) {
            throw new Error('Invalid Price');
        }
        return true;
    }),
    (0, express_validator_1.check)('priceAfterDiscount').optional()
        .isNumeric().withMessage('price must be number').toFloat()
        .custom((val) => {
        if (val <= 0 || val > 1000000) {
            throw new Error('Invalid Price');
        }
        return true;
    }),
    (0, express_validator_1.check)('quantity').optional()
        .isNumeric().withMessage('price must be number').toInt()
        .custom((val) => {
        if (val < 0) {
            throw new Error('Invalid Quantity');
        }
        return true;
    }),
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
    (0, express_validator_1.check)('subcategory')
        .notEmpty().withMessage('subcategory is Required')
        .isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const subcategory = yield subCategoryModel_1.default.findById(val);
        if (!subcategory) {
            throw new Error('Subcategory Not Found');
        }
        if (subcategory.category._id.toString() !== req.body.category.toString()) {
            throw new Error('subcategory not exist in category');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.updateProductValidator = [
    (0, express_validator_1.check)('name')
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage('Name length must be between 2 and 50'),
    (0, express_validator_1.check)('description')
        .optional()
        .isLength({ min: 10, max: 500 }),
    (0, express_validator_1.check)('price')
        .optional()
        .isNumeric().withMessage('price must be number').toFloat()
        .custom((val) => {
        if (val <= 0 || val > 1000000) {
            throw new Error('Invalid Price');
        }
        return true;
    }),
    (0, express_validator_1.check)('priceAfterDiscount').optional()
        .isNumeric().withMessage('price must be number').toFloat()
        .custom((val) => {
        if (val <= 0 || val > 1000000) {
            throw new Error('Invalid Price');
        }
        return true;
    }),
    (0, express_validator_1.check)('quantity').optional()
        .isNumeric().withMessage('price must be number').toInt()
        .custom((val) => {
        if (val < 0) {
            throw new Error('Invalid Quantity');
        }
        return true;
    }),
    (0, express_validator_1.check)('category')
        .optional()
        .isMongoId().withMessage('Invalid Mongo Id')
        // * Check if category exist
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield categoryModel_1.default.findById(val);
        if (!category) {
            throw new Error('Category Not Found');
        }
        return true;
    })),
    (0, express_validator_1.check)('subcategory')
        .optional()
        .isMongoId().withMessage('Invalid Mongo Id')
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const subcategory = yield subCategoryModel_1.default.findById(val);
        if (!subcategory) {
            throw new Error('Subcategory Not Found');
        }
        if (subcategory.category._id.toString() !== req.body.category.toString()) {
            throw new Error('subcategory not exist in category');
        }
        return true;
    })),
    validatorMiddleware_1.default
];
exports.getProductValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
exports.deleteProductValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid Mongo Id'),
    validatorMiddleware_1.default
];
