"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicio_controller_1 = require("../controllers/servicio-controller");
class ServicioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', servicio_controller_1.servicioController.getServicios);
        this.router.post('/', servicio_controller_1.servicioController.crearServicio);
        this.router.put('/', servicio_controller_1.servicioController.updateServicio);
        this.router.delete('/', servicio_controller_1.servicioController.deleteServicio);
        this.router.get('/servicio-abogado/:idAbogado', servicio_controller_1.servicioController.getServiciosPorAbogado);
    }
}
const servicioRoutes = new ServicioRoutes();
exports.default = servicioRoutes.router;
