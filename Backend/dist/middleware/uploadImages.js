"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiImages = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const uploadOptions = () => {
    const multerStorage = multer_1.default.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        }
        else {
            cb(new apiError_1.default('File is not an image', 400));
        }
    };
    const upload = (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
};
const uploadSingleImage = (fieldName) => uploadOptions().single(fieldName);
exports.uploadSingleImage = uploadSingleImage;
const uploadMultiImages = (fields) => uploadOptions().fields(fields);
exports.uploadMultiImages = uploadMultiImages;
