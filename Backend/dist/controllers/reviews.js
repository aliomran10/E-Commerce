"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReview = exports.getReviews = exports.createReview = exports.setProductAndUserId = exports.filterReviews = void 0;
const reviewsModel_1 = __importDefault(require("../models/reviewsModel"));
const refactorHandler_1 = require("./refactorHandler");
const filterReviews = (req, res, next) => {
    var _a;
    let filterData = {};
    if (req.params.productId) {
        filterData.product = req.params.productId;
    }
    ;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'user' && !req.params.productId) {
        filterData.user = req.user._id;
    }
    ;
    req.filterData = filterData;
    next();
};
exports.filterReviews = filterReviews;
const setProductAndUserId = (req, res, next) => {
    var _a;
    if (!req.body.product) {
        req.body.product = req.params.productId;
    }
    ;
    if (!req.body.user) {
        req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    }
    ;
    next();
};
exports.setProductAndUserId = setProductAndUserId;
exports.createReview = (0, refactorHandler_1.createOne)(reviewsModel_1.default);
exports.getReviews = (0, refactorHandler_1.getAll)(reviewsModel_1.default, 'reviews');
exports.getReview = (0, refactorHandler_1.getOne)(reviewsModel_1.default);
exports.updateReview = (0, refactorHandler_1.updateOne)(reviewsModel_1.default);
exports.deleteReview = (0, refactorHandler_1.deleteOne)(reviewsModel_1.default);
