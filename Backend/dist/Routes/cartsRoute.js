"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../controllers/authorization");
const carts_1 = require("../controllers/carts");
const cartsValidator_1 = require("../utils/validator/cartsValidator");
const cartsRoute = (0, express_1.Router)();
cartsRoute.use(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'));
cartsRoute.route('/')
    .get(carts_1.getLoggedUserCart)
    .post(cartsValidator_1.addProductToCartValidator, carts_1.addProductToCart)
    .delete(carts_1.clearCart);
cartsRoute.put('/applyCoupon', carts_1.applyCoupon);
cartsRoute.route('/:itemId') // TODO: item id is belong to object id
    .put(cartsValidator_1.updateProductQuantityValidator, carts_1.updateProductQuantity)
    .delete(cartsValidator_1.removeProductFromCartValidator, carts_1.removeProduct);
exports.default = cartsRoute;
