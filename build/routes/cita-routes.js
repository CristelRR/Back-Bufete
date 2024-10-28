"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cita_controllers_1 = require("../controllers/cita-controllers");
class CitaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', cita_controllers_1.citaController.obtenerCitas);
    }
}
const citaRoutes = new CitaRoutes();
exports.default = citaRoutes.router;
