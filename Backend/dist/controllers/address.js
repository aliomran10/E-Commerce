"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.getAddress = exports.getAddresses = exports.createAddress = void 0;
const addressModel_1 = __importDefault(require("../models/addressModel"));
const refactorHandler_1 = require("./refactorHandler");
exports.createAddress = (0, refactorHandler_1.createOne)(addressModel_1.default);
exports.getAddresses = (0, refactorHandler_1.getAll)(addressModel_1.default, 'address');
exports.getAddress = (0, refactorHandler_1.getOne)(addressModel_1.default);
exports.updateAddress = (0, refactorHandler_1.updateOne)(addressModel_1.default);
exports.deleteAddress = (0, refactorHandler_1.deleteOne)(addressModel_1.default);
