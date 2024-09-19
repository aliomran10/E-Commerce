"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../controllers/authorization");
const wishlist_1 = require("../controllers/wishlist");
const wishlistRoute = (0, express_1.Router)();
wishlistRoute.use(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'));
wishlistRoute.route('/')
    .get(wishlist_1.getLoggedUserWishlist)
    .post(wishlist_1.addProductToWishlist);
wishlistRoute.route('/:product')
    .delete(wishlist_1.removeProductFromWishlist);
exports.default = wishlistRoute;
