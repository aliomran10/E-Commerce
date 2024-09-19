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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = exports.resizeImages = exports.uploadProductImages = void 0;
const refactorHandler_1 = require("./refactorHandler");
const sharp_1 = __importDefault(require("sharp"));
const productsModel_1 = __importDefault(require("../models/productsModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uploadImages_1 = require("../middleware/uploadImages");
exports.uploadProductImages = (0, uploadImages_1.uploadMultiImages)([
    { name: 'cover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);
exports.resizeImages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files) {
        if (req.files.cover) {
            const coverName = `Product-${Date.now()}-cover.png`;
            yield (0, sharp_1.default)(req.files.cover[0].buffer)
                .toFormat('png')
                .png({ quality: 95 })
                .toFile(`uploads/products/${coverName}`);
            req.body.cover = coverName;
        }
        if (req.files.images) {
            req.body.images = [];
            yield Promise.all(req.files.images.map((img, index) => __awaiter(void 0, void 0, void 0, function* () {
                const imageName = `Product-${Date.now()}N${index + 1}.png`;
                yield (0, sharp_1.default)(img.buffer)
                    .toFormat('png')
                    .png({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                req.body.images.push(imageName);
            })));
        }
    }
    next();
}));
exports.createProduct = (0, refactorHandler_1.createOne)(productsModel_1.default);
exports.getProducts = (0, refactorHandler_1.getAll)(productsModel_1.default, 'products');
exports.getProduct = (0, refactorHandler_1.getOne)(productsModel_1.default, 'reviews');
exports.updateProduct = (0, refactorHandler_1.updateOne)(productsModel_1.default);
exports.deleteProduct = (0, refactorHandler_1.deleteOne)(productsModel_1.default);
