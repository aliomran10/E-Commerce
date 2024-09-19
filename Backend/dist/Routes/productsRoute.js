"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const productsValidator_1 = require("../utils/validator/productsValidator");
const authorization_1 = require("../controllers/authorization");
const reviewsRoute_1 = __importDefault(require("./reviewsRoute"));
const productsRoute = (0, express_1.Router)();
productsRoute.use('/:productId/reviews', reviewsRoute_1.default);
productsRoute.route('/')
    .get(products_1.getProducts)
    .post(/*protectRoutes, checkActive, allowedTo('manager', 'admin'),*/ products_1.uploadProductImages, products_1.resizeImages, /*createProductValidator,*/ products_1.createProduct);
productsRoute.route('/:id')
    .get(productsValidator_1.getProductValidator, products_1.getProduct)
    .put(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), productsValidator_1.updateProductValidator, products_1.updateProduct)
    .delete(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'), productsValidator_1.deleteProductValidator, products_1.deleteProduct);
exports.default = productsRoute;
