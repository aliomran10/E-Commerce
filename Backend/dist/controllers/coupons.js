"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.getCoupon = exports.getCoupons = exports.createCoupon = void 0;
const couponsModel_1 = __importDefault(require("../models/couponsModel"));
const refactorHandler_1 = require("./refactorHandler");
exports.createCoupon = (0, refactorHandler_1.createOne)(couponsModel_1.default);
exports.getCoupons = (0, refactorHandler_1.getAll)(couponsModel_1.default, 'coupons');
exports.getCoupon = (0, refactorHandler_1.getOne)(couponsModel_1.default);
exports.updateCoupon = (0, refactorHandler_1.updateOne)(couponsModel_1.default);
exports.deleteCoupon = (0, refactorHandler_1.deleteOne)(couponsModel_1.default);
