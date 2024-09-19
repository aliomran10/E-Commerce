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
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAll = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const features_1 = __importDefault(require("../utils/features"));
const getAll = (model, modelName) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filterData = {};
    let searchLength = 0;
    if (req.filterData) {
        filterData = req.filterData;
    }
    if (req.query) {
        const searchResult = new features_1.default(model.find(filterData), req.query).filter().search(modelName);
        const searchData = yield searchResult.mongooseQuery;
        searchLength = searchData.length;
    }
    const countDocuments = searchLength || (yield model.find(filterData).countDocuments());
    const apiFeatures = new features_1.default(model.find(filterData), req.query).filter().sort().limitFields().search(modelName).pagination(countDocuments);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = yield mongooseQuery;
    res.status(200).json({ length: documents.length, pagination: paginationResult, data: documents });
}));
exports.getAll = getAll;
const getOne = (model, population) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = model.findById(req.params.id);
    if (population) {
        query = query.populate(population);
    }
    ;
    const document = yield query;
    if (!document) {
        return next(new apiError_1.default(`${req.__('not_found')}`, 404));
    }
    res.status(200).json({ data: document });
}));
exports.getOne = getOne;
const createOne = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield model.create(req.body);
    res.status(201).json({ data: document });
}));
exports.createOne = createOne;
const updateOne = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) {
        return next(new apiError_1.default(`${req.__('not_found')}`, 404));
    }
    document.save();
    res.status(200).json({ data: document });
}));
exports.updateOne = updateOne;
const deleteOne = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield model.findOneAndDelete({ _id: req.params.id });
    if (!document) {
        return next(new apiError_1.default(`${req.__('not_found')}`, 404));
    }
    res.status(204).json({ data: document });
}));
exports.deleteOne = deleteOne;
