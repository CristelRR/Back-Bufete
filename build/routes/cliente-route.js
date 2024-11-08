"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_controller_1 = require("../controllers/cliente-controller");
class ClienteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', cliente_controller_1.clienteController.getClientes);
        this.router.post('/', cliente_controller_1.clienteController.crearCliente);
        this.router.put('/:idCliente', cliente_controller_1.clienteController.updateCliente);
        this.router.delete('/', cliente_controller_1.clienteController.deleteCliente);
        this.router.get('/:idCliente', cliente_controller_1.clienteController.getClienteById);
    }
}
const clienteRoutes = new ClienteRoutes();
exports.default = clienteRoutes.router;
