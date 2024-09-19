"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subCategories_1 = require("../controllers/subCategories");
const subCategoriesValidator_1 = require("../utils/validator/subCategoriesValidator");
const authorization_1 = require("../controllers/authorization");
const subcategoriesRoute = (0, express_1.Router)({ mergeParams: true });
subcategoriesRoute.route('/')
    .get(subCategories_1.filterData, subCategories_1.getSubcategories)
    .post(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), subCategories_1.setCategoryId, subCategoriesValidator_1.createSubcategoryValidator, subCategories_1.createSubcategory);
subcategoriesRoute.route('/:id')
    .get(subCategoriesValidator_1.getSubcategoryValidator, subCategories_1.getSubcategory)
    .put(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), subCategoriesValidator_1.updateSubcategoryValidator, subCategories_1.updateSubcategory)
    .delete(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), subCategoriesValidator_1.deleteSubcategoryValidator, subCategories_1.deleteSubcategory);
exports.default = subcategoriesRoute;
