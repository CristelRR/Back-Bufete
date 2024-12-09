"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nota_controller_1 = require("../controllers/nota-controller");
class NotaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // Ruta para obtener todas las notas
        this.router.get('/', nota_controller_1.notaController.getNotas);
        // Ruta para obtener notas por ID de cita o expediente
        this.router.get('/por-cita-o-expediente/:idCita', nota_controller_1.notaController.getNotasPorCitaOExpediente);
        // Ruta para obtener una nota por su ID
        this.router.get('/:idNota', nota_controller_1.notaController.getNotaById);
        // Ruta para crear una nueva nota
        this.router.post('/', nota_controller_1.notaController.crearNota);
        // Ruta para actualizar una nota existente
        this.router.put('/', nota_controller_1.notaController.updateNota);
        // Ruta para eliminar una nota
        this.router.delete('/', nota_controller_1.notaController.deleteNota);
        // Ruta para obtener notas por ID de cita
        this.router.get('/cita/:idCita', nota_controller_1.notaController.getNotasPorCita);
    }
}
const notaRoutes = new NotaRoutes();
exports.default = notaRoutes.router;
