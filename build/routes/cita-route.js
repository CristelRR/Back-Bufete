"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cita_controller_1 = require("../controllers/cita-controller");
class CitaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', cita_controller_1.citaController.getCitas);
        this.router.post('/', cita_controller_1.citaController.crearCita);
        this.router.put('/', cita_controller_1.citaController.updateCita);
        this.router.delete('/', cita_controller_1.citaController.deleteCita);
    }
}
const citaRoutes = new CitaRoutes();
exports.default = citaRoutes.router;
