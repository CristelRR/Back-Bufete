"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const citas_expedinete_controller_1 = require("../controllers/citas-expedinete-controller");
class CitaExpedineteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idExpediente', citas_expedinete_controller_1.citaExpedienteController.getCitasExpediente);
        this.router.post('/', citas_expedinete_controller_1.citaExpedienteController.crearCitaExpediente);
        this.router.put('/', citas_expedinete_controller_1.citaExpedienteController.updateCitaExpediente);
        this.router.delete('/', citas_expedinete_controller_1.citaExpedienteController.deleteCitaExpediente);
        this.router.delete('/expediente', citas_expedinete_controller_1.citaExpedienteController.getExpediente);
    }
}
const citaExpedineteRoutes = new CitaExpedineteRoutes();
exports.default = citaExpedineteRoutes.router;
