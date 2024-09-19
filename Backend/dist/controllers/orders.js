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
exports.isOrderDelivered = exports.isOrderPaid = exports.createOrder = exports.getOrder = exports.getOrders = exports.filterOrders = void 0;
const ordersModel_1 = __importDefault(require("../models/ordersModel"));
const refactorHandler_1 = require("./refactorHandler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cartsModel_1 = __importDefault(require("../models/cartsModel"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const productsModel_1 = __importDefault(require("../models/productsModel"));
// filterOrders
const filterOrders = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'user') {
        const filterData = { user: req.user._id };
        req.filterData = filterData;
    }
    next();
};
exports.filterOrders = filterOrders;
// get all orders
exports.getOrders = (0, refactorHandler_1.getAll)(ordersModel_1.default, 'orders');
// get one order
exports.getOrder = (0, refactorHandler_1.getOne)(ordersModel_1.default);
// create order
exports.createOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // 0 tax price
    const taxPrice = 100;
    // 1 Get user cart
    const cart = yield cartsModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!cart) {
        return next(new apiError_1.default('Cart not found', 404));
    }
    ;
    // 2 get order price
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const totalOrderPrice = cartPrice + taxPrice;
    // 3 create order
    const order = yield ordersModel_1.default.create({
        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        totalPrice: totalOrderPrice,
        address: req.body.address || 'No Address',
        cartItems: cart.cartItems,
        taxPrice
    });
    // 4 delete cart, update product quantity and sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }));
        yield productsModel_1.default.bulkWrite(bulkOption);
        yield cartsModel_1.default.findByIdAndDelete(cart._id);
    }
    res.status(201).json({ data: order });
}));
// update order [isPaid, isDelivered]
exports.isOrderPaid = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield ordersModel_1.default.findByIdAndUpdate(req.params.id, {
        isPaid: true,
        paidAt: Date.now()
    }, { new: true });
    if (!order) {
        return next(new apiError_1.default('Order not found', 404));
    }
    ;
    res.status(200).json({ data: order });
}));
exports.isOrderDelivered = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield ordersModel_1.default.findByIdAndUpdate(req.params.id, {
        isDelivered: true,
        deliveredAt: Date.now()
    }, { new: true });
    if (!order) {
        return next(new apiError_1.default('Order not found', 404));
    }
    ;
    res.status(200).json({ data: order });
}));
