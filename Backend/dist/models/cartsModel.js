"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartsSchema = new mongoose_1.Schema({
    cartItems: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: Number, default: 1 },
            price: Number
        }],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });
cartsSchema.pre(/^find/, function (next) {
    this.populate({ path: 'cartItems.product', select: 'name cover' });
    next();
});
exports.default = (0, mongoose_1.model)('carts', cartsSchema);
