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
const mongoose_1 = require("mongoose");
const productsModel_1 = __importDefault(require("./productsModel"));
const reviewsSchema = new mongoose_1.Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'products', required: true }
}, { timestamps: true });
reviewsSchema.statics.calcRatingAndQuantity = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield this.aggregate([
            { $match: { product: productId } },
            { $group: { _id: 'product', avgRating: { $avg: '$rating' }, ratingQuantity: { $sum: 1 } } }
        ]);
        console.log(productId);
        console.log(result);
        if (result.length > 0) {
            yield productsModel_1.default.findByIdAndUpdate(productId, {
                ratingAverage: result[0].avgRating,
                ratingCount: result[0].ratingQuantity
            });
        }
        else {
            yield productsModel_1.default.findByIdAndUpdate(productId, {
                ratingAverage: 0,
                ratingCount: 0
            });
        }
    });
};
reviewsSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () { yield this.constructor.calcRatingAndQuantity(this.product); });
});
reviewsSchema.post('findOneAndDelete', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviewDoc = doc;
        if (reviewDoc.product) {
            yield reviewDoc.constructor.calcRatingAndQuantity(reviewDoc.product);
        }
    });
});
reviewsSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name image' });
    next();
});
reviewsSchema.pre('find', function (next) {
    this.populate({ path: 'product', select: 'name cover' });
    next();
});
exports.default = (0, mongoose_1.model)('reviews', reviewsSchema);
