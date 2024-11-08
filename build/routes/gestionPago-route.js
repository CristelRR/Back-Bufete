"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import express from 'express';
const gestionPago_controller_1 = require("../controllers/gestionPago-controller");
//const router = express.Router();
class PagoRoutes {
    //private pagoController: PagoController = new PagoController(); // Instanciar el controlador
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', gestionPago_controller_1.pagoController.obtenerPagos);
        this.router.post('/', gestionPago_controller_1.pagoController.crearPago);
    }
}
const pagoRoutes = new PagoRoutes();
exports.default = pagoRoutes.router;
