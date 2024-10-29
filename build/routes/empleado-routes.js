"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleado_controllers_1 = require("../controllers/empleado-controllers");
class EmpleadoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', empleado_controllers_1.empleadoController.getEmpleados);
        this.router.post('/crear', empleado_controllers_1.empleadoController.crearEmpleado);
        this.router.put('/actualizar', empleado_controllers_1.empleadoController.updateEmpleado);
        this.router.delete('/eliminar', empleado_controllers_1.empleadoController.deleteEmpleado);
    }
}
const empleadoRoutes = new EmpleadoRoutes();
exports.default = empleadoRoutes.router;
