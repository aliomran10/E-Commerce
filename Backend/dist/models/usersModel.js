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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usersSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, maxlength: 20 },
    image: String,
    role: { type: String, required: true, enum: ['manager', 'admin', 'user'], default: 'user' },
    active: { type: Boolean, default: true },
    wishlist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'products' }],
    passwordChangedAt: Date,
    resetCode: String,
    resetCodeExpireTime: Date,
    resetCodeVerify: Boolean
}, { timestamps: true });
usersSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next;
        this.password = yield bcryptjs_1.default.hash(this.password, 13);
    });
});
exports.default = (0, mongoose_1.model)('users', usersSchema);
