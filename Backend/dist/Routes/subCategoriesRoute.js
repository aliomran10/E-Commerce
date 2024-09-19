"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subCategories_1 = require("../controllers/subCategories");
const subCategoriesRoute = (0, express_1.Router)();
subCategoriesRoute.route('/')
    .post(subCategories_1.createSubCategory)
    .get(subCategories_1.getSubCategories);
subCategoriesRoute.route('/:id')
    .get(subCategories_1.getSubCategory)
    .put(subCategories_1.updateSubCategory)
    .delete(subCategories_1.deleteSubCategory);
exports.default = subCategoriesRoute;
