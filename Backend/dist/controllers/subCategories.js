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
exports.resizeSubcategoryImage = exports.uploadSubcategoryImage = exports.deleteSubcategory = exports.updateSubcategory = exports.getSubcategory = exports.getSubcategories = exports.createSubcategory = exports.setCategoryId = exports.filterData = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sharp_1 = __importDefault(require("sharp"));
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
const refactorHandler_1 = require("./refactorHandler");
const uploadImages_1 = require("../middleware/uploadImages");
const filterData = (req, res, next) => {
    let filterData = {};
    if (req.params.categoryId) {
        filterData.category = req.params.categoryId;
    }
    ;
    req.filterData = filterData;
    next();
};
exports.filterData = filterData;
const setCategoryId = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    ;
    next();
};
exports.setCategoryId = setCategoryId;
exports.createSubcategory = (0, refactorHandler_1.createOne)(subCategoryModel_1.default);
exports.getSubcategories = (0, refactorHandler_1.getAll)(subCategoryModel_1.default, 'subcategories');
exports.getSubcategory = (0, refactorHandler_1.getOne)(subCategoryModel_1.default);
exports.updateSubcategory = (0, refactorHandler_1.updateOne)(subCategoryModel_1.default);
exports.deleteSubcategory = (0, refactorHandler_1.deleteOne)(subCategoryModel_1.default);
exports.uploadSubcategoryImage = (0, uploadImages_1.uploadSingleImage)('image');
exports.resizeSubcategoryImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const imageName = `subcategory-${Date.now()}.jpeg`;
        yield (0, sharp_1.default)(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/subcategories/${imageName}`);
        req.body.image = imageName;
    }
    next();
}));
