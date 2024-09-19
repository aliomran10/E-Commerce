"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const Routes_1 = __importDefault(require("./Routes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
(0, database_1.default)();
(0, Routes_1.default)(app);
app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
});
