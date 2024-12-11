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
        this.router.get("/abogados/:idServicio", cita_controller_1.citaController.getAbogadosPorServicio);
        this.router.get('/horarios/:idAbogado', cita_controller_1.citaController.getHorariosDisponiblesPorAbogado);
        this.router.post('/crear-cita', cita_controller_1.citaController.crearCitaConTransaccion);
        this.router.get('/consultar-citaC/:idCliente', cita_controller_1.citaController.getCitasByCliente);
        this.router.get('/consultar-citaA/:idAbogado', cita_controller_1.citaController.getCitasByAbogado);
        this.router.get('/consultar-citaS/', cita_controller_1.citaController.getCitasBySecretaria);
        this.router.get('/clientes/abogado/:idAbogado', cita_controller_1.citaController.getClientesPorAbogado);
        this.router.put('/cancelar', cita_controller_1.citaController.cancelarCita);
        this.router.get('/clientes/:idCliente/servicios', cita_controller_1.citaController.getServiciosPorCitasDeCliente);
        this.router.get("/detalladas", cita_controller_1.citaController.getAllCitas);
        this.router.put('/completar-cita/:idCita', cita_controller_1.citaController.completarCita);
        this.router.get('/expediente/:idExpediente', cita_controller_1.citaController.getCitasCompletadasByExpediente);
    }
}
const citaRoutes = new CitaRoutes();
exports.default = citaRoutes.router;
