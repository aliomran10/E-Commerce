"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../controllers/authorization");
const reviews_1 = require("../controllers/reviews");
const reviewsValidator_1 = require("../utils/validator/reviewsValidator");
const reviewsRoute = (0, express_1.Router)({ mergeParams: true });
reviewsRoute.route('/')
    .get(reviews_1.filterReviews, reviews_1.getReviews)
    .post(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'), reviews_1.setProductAndUserId, reviewsValidator_1.createReviewValidator, reviews_1.createReview);
reviewsRoute.route('/myReviews').get(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'), reviews_1.filterReviews, reviews_1.getReviews);
reviewsRoute.route('/:id')
    .get(reviewsValidator_1.getReviewValidator, reviews_1.getReview)
    .put(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'), reviewsValidator_1.updateReviewValidator, reviews_1.updateReview)
    .delete(authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin', 'user'), reviewsValidator_1.deleteReviewValidator, reviews_1.deleteReview);
exports.default = reviewsRoute;
