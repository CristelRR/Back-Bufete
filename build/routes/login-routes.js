"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controllers_1 = require("../controllers/login-controllers");
class LoginRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/', login_controllers_1.loginController.loginUser.bind(login_controllers_1.loginController));
    }
}
const loginRoutes = new LoginRoutes();
exports.default = loginRoutes.router;
