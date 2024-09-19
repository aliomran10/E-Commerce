"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_1 = require("../controllers/address");
const authorization_1 = require("../controllers/authorization");
const addressValidator_1 = require("../utils/validator/addressValidator");
const addressRoute = (0, express_1.Router)({ mergeParams: true });
addressRoute.route('/')
    .get(address_1.getAddresses)
    .post(addressValidator_1.createAddressValidator, authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'), address_1.createAddress);
addressRoute.route('/:id')
    .get(addressValidator_1.getAddressValidator, address_1.getAddress)
    .put(addressValidator_1.updateAddressValidator, authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('user'), address_1.updateAddress)
    .delete(addressValidator_1.deleteAddressValidator, authorization_1.protectRoutes, authorization_1.checkActive, (0, authorization_1.allowedTo)('manager', 'admin', 'user'), address_1.deleteAddress);
exports.default = addressRoute;
