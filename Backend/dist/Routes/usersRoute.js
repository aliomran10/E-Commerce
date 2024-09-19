"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const usersValidator_1 = require("../utils/validator/usersValidator");
const authorization_1 = require("../controllers/authorization");
const usersRoute = (0, express_1.Router)();
usersRoute.use(authorization_1.protectRoutes, authorization_1.checkActive);
usersRoute.get('/me', users_1.setLoggedUserId, users_1.getUser);
usersRoute.put('/updateMe', users_1.uploadUserImage, users_1.resizeUserImage, usersValidator_1.updateLoggedUserValidator, users_1.updateLoggedUser);
usersRoute.put('/changeMyPassword', usersValidator_1.changeLoggedUserPasswordValidator, users_1.changeLoggedUserPassword);
usersRoute.delete('/deleteMe', (0, authorization_1.allowedTo)('user'), users_1.setLoggedUserId, users_1.deleteUser);
usersRoute.use((0, authorization_1.allowedTo)('manager'));
usersRoute.route('/')
    .get(users_1.getUsers)
    .post(users_1.uploadUserImage, users_1.resizeUserImage, usersValidator_1.createUserValidator, users_1.createUser);
usersRoute.route('/:id')
    .get(usersValidator_1.getUserValidator, users_1.getUser)
    .put(users_1.uploadUserImage, users_1.resizeUserImage, usersValidator_1.updateUserValidator, users_1.updateUser)
    .delete(usersValidator_1.deleteUserValidator, users_1.deleteUser);
usersRoute.put('/:id/changePassword', usersValidator_1.changeUserPasswordValidator, users_1.changeUserPassword);
exports.default = usersRoute;
