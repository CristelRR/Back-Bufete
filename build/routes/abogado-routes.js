"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AlumnoController_1 = require("../controllers/AlumnoController");
class AlumnoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', AlumnoController_1.alumnoController.getAlumno);
    }
}
const alumnoRoutes = new AlumnoRoutes();
exports.default = alumnoRoutes.router;
