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
exports.resizeCategoryImage = exports.uploadCategoryImage = exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sharp_1 = __importDefault(require("sharp"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const refactorHandler_1 = require("./refactorHandler");
const uploadImages_1 = require("../middleware/uploadImages");
exports.createCategory = (0, refactorHandler_1.createOne)(categoryModel_1.default);
exports.getCategories = (0, refactorHandler_1.getAll)(categoryModel_1.default, 'categories');
exports.getCategory = (0, refactorHandler_1.getOne)(categoryModel_1.default);
exports.updateCategory = (0, refactorHandler_1.updateOne)(categoryModel_1.default);
exports.deleteCategory = (0, refactorHandler_1.deleteOne)(categoryModel_1.default);
exports.uploadCategoryImage = (0, uploadImages_1.uploadSingleImage)('image');
exports.resizeCategoryImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const imageName = `category-${Date.now()}.jpeg`;
        yield (0, sharp_1.default)(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/categories/${imageName}`);
        req.body.image = imageName;
    }
    next();
}));
