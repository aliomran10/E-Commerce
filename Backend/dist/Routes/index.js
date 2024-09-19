"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoriesRoute_1 = __importDefault(require("./categoriesRoute"));
const subCategoriesRoute_1 = __importDefault(require("./subCategoriesRoute"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const globalErrors_1 = __importDefault(require("../middleware/globalErrors"));
const productsRoute_1 = __importDefault(require("./productsRoute"));
const reviewsRoute_1 = __importDefault(require("./reviewsRoute"));
const couponsRoute_1 = __importDefault(require("./couponsRoute"));
const cartsRoute_1 = __importDefault(require("./cartsRoute"));
const ordersRoute_1 = __importDefault(require("./ordersRoute"));
const usersRoute_1 = __importDefault(require("./usersRoute"));
const authRoute_1 = __importDefault(require("./authRoute"));
const wishlistRoute_1 = __importDefault(require("./wishlistRoute"));
const mountRoutes = (app) => {
    app.use('/api/v1/categories', categoriesRoute_1.default);
    app.use('/api/v1/subcategories', subCategoriesRoute_1.default);
    app.use('/api/v1/products', productsRoute_1.default);
    app.use('/api/v1/reviews', reviewsRoute_1.default);
    app.use('/api/v1/wishlist', wishlistRoute_1.default);
    app.use('/api/v1/coupons', couponsRoute_1.default);
    app.use('/api/v1/carts', cartsRoute_1.default);
    app.use('/api/v1/orders', ordersRoute_1.default);
    app.use('/api/v1/users', usersRoute_1.default);
    app.use('/api/v1/auth', authRoute_1.default);
    app.all('*', (req, res, next) => {
        next(new apiError_1.default(`The router ${req.originalUrl} is not found`, 400));
    });
    app.use(globalErrors_1.default);
};
exports.default = mountRoutes;
