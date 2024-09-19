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
exports.changeLoggedUserPassword = exports.updateLoggedUser = exports.setLoggedUserId = exports.changeUserPassword = exports.resizeUserImage = exports.uploadUserImage = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
const refactorHandler_1 = require("./refactorHandler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const uploadImages_1 = require("../middleware/uploadImages");
const sharp_1 = __importDefault(require("sharp"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createToken_1 = require("../utils/createToken");
exports.createUser = (0, refactorHandler_1.createOne)(usersModel_1.default);
exports.getUsers = (0, refactorHandler_1.getAll)(usersModel_1.default, 'users');
exports.getUser = (0, refactorHandler_1.getOne)(usersModel_1.default);
exports.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        active: req.body.active,
        address: req.body.address
    }, { new: true });
    if (!user) {
        return next(new apiError_1.default('user not found', 404));
    }
    ;
    res.status(200).json({ data: user, message: 'User updated successfully' });
}));
exports.deleteUser = (0, refactorHandler_1.deleteOne)(usersModel_1.default);
exports.uploadUserImage = (0, uploadImages_1.uploadSingleImage)('image');
exports.resizeUserImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const imageName = `user-${Date.now()}.jpeg`;
        yield (0, sharp_1.default)(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${imageName}`);
        req.body.image = imageName;
    }
    next();
}));
exports.changeUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findByIdAndUpdate(req.params.id, {
        password: yield bcryptjs_1.default.hash(req.body.password, 13),
        passwordChangedAt: Date.now()
    }, { new: true });
    if (!user) {
        return next(new apiError_1.default('user not found', 404));
    }
    res.status(200).json({ message: 'user password changed successfully', data: user });
}));
exports.setLoggedUserId = (0, express_async_handler_1.default)((req, res, next) => {
    var _a;
    req.params.id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
    next();
});
exports.updateLoggedUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield usersModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
        name: req.body.name,
        image: req.body.image,
    }, { new: true });
    res.status(200).json({ data: user, message: 'user updated successfully' });
}));
exports.changeLoggedUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield usersModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
        password: yield bcryptjs_1.default.hash(req.body.password, 13),
        passwordChangedAt: Date.now()
    }, { new: true });
    const token = (0, createToken_1.createToken)(user === null || user === void 0 ? void 0 : user._id, user === null || user === void 0 ? void 0 : user.role);
    res.status(200).json({ message: 'password changed successfully', token });
}));
