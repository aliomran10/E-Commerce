"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productsSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
    price: { type: Number, required: true, min: 1, max: 1000000 },
    priceAfterDiscount: { type: Number, min: 1, max: 1000000 },
    quantity: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    cover: String,
    images: [String],
    category: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'categories' },
    subcategory: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'subCategories' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
productsSchema.virtual('reviews', { ref: 'reviews', foreignField: 'product', localField: '_id' });
productsSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' });
    this.populate({ path: 'subcategory', select: 'name' });
    next();
});
exports.default = (0, mongoose_1.model)('products', productsSchema);
