"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agenda_controller_1 = require("../controllers/agenda-controller");
class AgendaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', agenda_controller_1.agendaController.getAgendas);
        this.router.post('/', agenda_controller_1.agendaController.crearAgenda);
        this.router.put('/:idAgenda', agenda_controller_1.agendaController.updateAgenda);
        this.router.delete('/', agenda_controller_1.agendaController.deleteAgenda);
    }
}
const agendaRoutes = new AgendaRoutes();
exports.default = agendaRoutes.router;
