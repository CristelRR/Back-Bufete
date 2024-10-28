"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const especialidad_controller_1 = require("../controllers/especialidad-controller");
class EspecialidadRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', especialidad_controller_1.especialidadController.getEspecialidades);
        this.router.post('/', especialidad_controller_1.especialidadController.crearEspecialidad);
        this.router.put('/', especialidad_controller_1.especialidadController.updateEspecialidad);
        this.router.delete('/', especialidad_controller_1.especialidadController.deleteEspecialidad);
    }
}
const especialidadRoutes = new EspecialidadRoutes();
exports.default = especialidadRoutes.router;
