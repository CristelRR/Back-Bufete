"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controllers_1 = require("../controllers/rol-controllers");
class RolRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', rol_controllers_1.rolController.getRol);
    }
}
const rolRoutes = new RolRoutes();
exports.default = rolRoutes.router;
