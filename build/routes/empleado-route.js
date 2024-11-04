"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleado_controller_1 = require("../controllers/empleado-controller");
class EmpleadoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', empleado_controller_1.empleadoController.getEmpleados);
        this.router.post('/', empleado_controller_1.empleadoController.crearEmpleado);
        this.router.put('/:idEmpleado', empleado_controller_1.empleadoController.updateEmpleado);
        this.router.delete('/', empleado_controller_1.empleadoController.deleteEmpleado);
        this.router.get('/abogados', empleado_controller_1.empleadoController.getAbogados);
        this.router.get('/:idEmpleado', empleado_controller_1.empleadoController.getEmpleadoById);
    }
}
const empleadoRoutes = new EmpleadoRoutes();
exports.default = empleadoRoutes.router;
