"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const i18n_1 = require("i18n");
const database_1 = __importDefault(require("./config/database"));
const Routes_1 = __importDefault(require("./Routes"));
const app = (0, express_1.default)();
let server;
dotenv_1.default.config();
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:4200', 'https://project.nti.giize.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)({ whitelist: ['price', 'category', 'subcategory', 'ratingAverage', 'sold'] }));
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express_1.default.static('uploads'));
(0, database_1.default)();
const i18n = new i18n_1.I18n({
    locales: ['en', 'ar'],
    directory: path_1.default.join(__dirname, 'locales'),
    defaultLocale: 'en',
    queryParameter: 'lang'
});
app.use(i18n.init);
(0, Routes_1.default)(app);
server = app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
});
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
        console.error('shutting the application down');
        process.exit(1);
    });
});
