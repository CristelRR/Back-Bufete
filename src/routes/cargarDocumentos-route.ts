import { Router } from "express";
import multer from "multer";
import { cargarDocumentosController } from "../controllers/cargarDocumentos";

class CargarDocumentosRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/subirDocumento', cargarDocumentosController.insertarDocumentos);
        this.router.get('/tiposDocumentos', cargarDocumentosController.obtenerTiposDeDocumentos);
        this.router.get('/obtenerExp', cargarDocumentosController.obtenerExpedientes);

    }
}

const cargarDocumentosRoutes = new CargarDocumentosRoutes();
export default cargarDocumentosRoutes.router;
