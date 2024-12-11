"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cargarDocumentos_1 = require("../controllers/cargarDocumentos");
class CargarDocumentosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/subirDocumento', cargarDocumentos_1.cargarDocumentosController.insertarDocumentos);
        this.router.get('/obtenerCategoriasYSubcategorias', cargarDocumentos_1.cargarDocumentosController.obtenerCategoriasYSubcategorias);
        this.router.get('/obtenerExp', cargarDocumentos_1.cargarDocumentosController.obtenerExpedientes);
        this.router.get('/obtenerSubCategorias/:idCategoria', cargarDocumentos_1.cargarDocumentosController.obtenerSubCategorias);
    }
}
const cargarDocumentosRoutes = new CargarDocumentosRoutes();
exports.default = cargarDocumentosRoutes.router;
