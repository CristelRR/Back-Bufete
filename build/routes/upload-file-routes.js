"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_file_controllers_1 = require("../controllers/upload-file-controllers");
class ExpedienteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({ dest: 'uploads/' });
        this.config();
    }
    config() {
        this.router.post('/', upload_file_controllers_1.expedienteController.crearExpediente);
        this.router.get('/historial-expedientes', upload_file_controllers_1.expedienteController.obtenerHistorialExpedientes);
        this.router.get('/', upload_file_controllers_1.expedienteController.obtenerExpedientes);
        this.router.get('/documento/:idDocumento', upload_file_controllers_1.expedienteController.obtenerDocumento);
        this.router.get('/:idExpediente', upload_file_controllers_1.expedienteController.obtenerExpediente);
        this.router.delete('/:idExpediente', upload_file_controllers_1.expedienteController.eliminarExpediente);
        this.router.put('/:idExpediente', upload_file_controllers_1.expedienteController.actualizarExpediente);
    }
}
const expedienteRoutes = new ExpedienteRoutes();
exports.default = expedienteRoutes.router;
