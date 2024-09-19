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
exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategory = exports.getSubCategories = exports.createSubCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
exports.createSubCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield subCategoryModel_1.default.create(req.body);
    res.status(201).json({ data: subCategory });
}));
exports.getSubCategories = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategories = yield subCategoryModel_1.default.find();
    res.status(200).json({ data: subCategories });
}));
exports.getSubCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield subCategoryModel_1.default.findById(req.params.id);
    res.status(200).json({ data: subCategory });
}));
exports.updateSubCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield subCategoryModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ data: subCategory });
}));
exports.deleteSubCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield subCategoryModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json();
}));
