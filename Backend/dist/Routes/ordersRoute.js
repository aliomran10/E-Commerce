"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../controllers/authorization");
const orders_1 = require("../controllers/orders");
const ordersValidator_1 = require("../utils/validator/ordersValidator");
const ordersRoute = (0, express_1.Router)();
ordersRoute.use(authorization_1.protectRoutes, authorization_1.checkActive);
ordersRoute.route('/')
    .get(orders_1.filterOrders, orders_1.getOrders)
    .post((0, authorization_1.allowedTo)('user'), ordersValidator_1.createOrderValidator, orders_1.createOrder);
ordersRoute.route('/:id').get(ordersValidator_1.getOrderValidator, orders_1.getOrder);
ordersRoute.use((0, authorization_1.allowedTo)('manager', 'admin'));
ordersRoute.route('/:id/paid').put(ordersValidator_1.getOrderValidator, orders_1.isOrderPaid);
ordersRoute.route('/:id/delivered').put(ordersValidator_1.getOrderValidator, orders_1.isOrderDelivered);
exports.default = ordersRoute;
