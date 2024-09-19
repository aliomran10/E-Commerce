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
exports.clearCart = exports.applyCoupon = exports.updateProductQuantity = exports.removeProduct = exports.addProductToCart = exports.getLoggedUserCart = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cartsModel_1 = __importDefault(require("../models/cartsModel"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const productsModel_1 = __importDefault(require("../models/productsModel"));
const couponsModel_1 = __importDefault(require("../models/couponsModel"));
// Get user cart
exports.getLoggedUserCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield cartsModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!cart) {
        return next(new apiError_1.default("This user doesn't have a cart yet", 404));
    }
    ;
    res.status(200).json({ length: cart.cartItems.length, data: cart });
}));
// Add product to cart
exports.addProductToCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const product = yield productsModel_1.default.findById(req.body.product);
    if (!product) {
        return next(new apiError_1.default('Product Not found', 404));
    }
    let cart = yield cartsModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!cart) {
        cart = yield cartsModel_1.default.create({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            cartItems: [{ product: req.body.product, price: product === null || product === void 0 ? void 0 : product.price }]
        });
    }
    else {
        const productIndex = cart.cartItems.findIndex((item) => item.product._id.toString() === req.body.product.toString());
        if (productIndex > -1) {
            cart.cartItems[productIndex].quantity += 1;
        }
        else {
            cart.cartItems.push({ product: req.body.product, price: product.price });
        }
    }
    calcTotalPrice(cart);
    yield cart.save();
    res.status(200).json({ length: cart.cartItems.length, data: cart });
}));
// remove product from cart
exports.removeProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield cartsModel_1.default.findOneAndUpdate({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, {
        $pull: { cartItems: { _id: req.params.itemId } }
    }, { new: true });
    calcTotalPrice(cart);
    yield cart.save();
    res.status(200).json({ length: cart.cartItems.length, data: cart });
}));
// update product quantity
exports.updateProductQuantity = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield cartsModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!cart) {
        return next(new apiError_1.default("This user doesn't have a cart yet", 404));
    }
    const productIndex = cart.cartItems.findIndex((item) => item._id.toString() === req.params.itemId.toString());
    if (productIndex > -1) {
        cart.cartItems[productIndex].quantity = req.body.quantity;
        calcTotalPrice(cart);
    }
    else {
        return next(new apiError_1.default("Product not found in cart", 404));
    }
    yield cart.save();
    res.status(200).json({ length: cart.cartItems.length, data: cart });
}));
// Apply coupon
exports.applyCoupon = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const coupon = yield couponsModel_1.default.findOne({
        name: req.body.name,
        expireTime: { $gt: Date.now() }
    });
    if (!coupon) {
        return next(new apiError_1.default('Invalid or Expired coupon', 400));
    }
    const cart = yield cartsModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    const totalPrice = cart.totalPrice;
    const totalPriceAfterDiscount = (totalPrice - (totalPrice * (coupon.discount / 100))).toFixed(2);
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    yield cart.save();
    res.status(200).json({ length: cart.cartItems.length, data: cart });
}));
// clear cart
exports.clearCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield cartsModel_1.default.findOneAndDelete({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    res.status(204).json();
}));
// calc total cart price
const calcTotalPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};
