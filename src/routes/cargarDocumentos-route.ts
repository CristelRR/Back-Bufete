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
        this.router.get('/obtenerCategoriasYSubcategorias', cargarDocumentosController.obtenerCategoriasYSubcategorias);
        this.router.get('/obtenerExp', cargarDocumentosController.obtenerExpedientes);
        this.router.get('/obtenerSubCategorias/:idCategoria', cargarDocumentosController.obtenerSubCategorias);

    }
}

const cargarDocumentosRoutes = new CargarDocumentosRoutes();
export default cargarDocumentosRoutes.router;
