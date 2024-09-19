"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.addressSchema = new mongoose_1.Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    apartmentNo: { type: Number, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true });
exports.addressSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name image' });
    next();
});
const addressModel = (0, mongoose_1.model)('address', exports.addressSchema);
exports.default = addressModel;
