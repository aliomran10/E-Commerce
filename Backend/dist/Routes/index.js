"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoriesRoute_1 = __importDefault(require("./categoriesRoute"));
const subCategoriesRoute_1 = __importDefault(require("./subCategoriesRoute"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const globalErrors_1 = __importDefault(require("../middleware/globalErrors"));
const mountRoutes = (app) => {
    app.use('/api/v1/categories', categoriesRoute_1.default);
    app.use('/api/v1/subcategories', subCategoriesRoute_1.default);
    app.all('*', (req, res, next) => {
        next(new apiError_1.default(`Route ${req.originalUrl} is not found`, 400));
    });
    app.use(globalErrors_1.default);
};
exports.default = mountRoutes;
