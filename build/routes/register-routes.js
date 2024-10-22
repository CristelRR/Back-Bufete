"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controllers_1 = require("../controllers/register-controllers");
class RegisterRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', register_controllers_1.registerController.getRegister);
        this.router.post('/', register_controllers_1.registerController.registerUser);
    }
}
const registerRoutes = new RegisterRoutes();
exports.default = registerRoutes.router;
