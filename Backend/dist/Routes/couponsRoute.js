"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../controllers/authorization");
const coupons_1 = require("../controllers/coupons");
const couponsValidator_1 = require("../utils/validator/couponsValidator");
const couponsRoute = (0, express_1.Router)();
couponsRoute.use(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin'));
couponsRoute.route('/')
    .get(coupons_1.getCoupons)
    .post(couponsValidator_1.createCouponValidator, coupons_1.createCoupon);
couponsRoute.route('/:id')
    .get(couponsValidator_1.getCouponValidator, coupons_1.getCoupon)
    .put(couponsValidator_1.updateCouponValidator, coupons_1.updateCoupon)
    .delete(couponsValidator_1.deleteCouponValidator, coupons_1.deleteCoupon);
exports.default = couponsRoute;
