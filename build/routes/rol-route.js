"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controller_1 = require("../controllers/rol-controller");
class RolRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', rol_controller_1.rolController.getRoles);
        this.router.post('/', rol_controller_1.rolController.crearRol);
        this.router.put('/', rol_controller_1.rolController.updateRol);
        this.router.delete('/', rol_controller_1.rolController.deleteRol);
    }
}
const rolRoutes = new RolRoutes();
exports.default = rolRoutes.router;
