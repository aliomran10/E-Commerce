"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiErrors extends Error {
    constructor(msg, statusCode) {
        super(msg);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? "Client Failure" : "Server Error";
    }
    ;
}
exports.default = ApiErrors;
