"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = require("../controllers/categories");
const categoriesValidator_1 = require("../utils/validator/categoriesValidator");
const subCategoriesRoute_1 = __importDefault(require("./subCategoriesRoute"));
const authorization_1 = require("../controllers/authorization");
const categoriesRoute = (0, express_1.Router)();
categoriesRoute.use('/:categoryId/subcategories', subCategoriesRoute_1.default);
categoriesRoute.route('/')
    .get(categories_1.getCategories)
    .post(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), categories_1.uploadCategoryImage, categories_1.resizeCategoryImage, categoriesValidator_1.createCategoryValidator, categories_1.createCategory);
categoriesRoute.route('/:id')
    .get(categoriesValidator_1.getCategoryValidator, categories_1.getCategory)
    .put(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), categories_1.uploadCategoryImage, categories_1.resizeCategoryImage, categoriesValidator_1.updateCategoryValidator, categories_1.updateCategory)
    .delete(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), categoriesValidator_1.deleteCategoryValidator, categories_1.deleteCategory);
exports.default = categoriesRoute;
