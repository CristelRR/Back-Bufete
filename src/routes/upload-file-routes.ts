import { Router } from "express";
import multer from "multer";
import { expedienteController } from "../controllers/upload-file-controllers";

class ExpedienteRoutes {
    public router: Router = Router();
    private upload = multer({ dest: 'uploads/' });

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/', expedienteController.crearExpediente);
        this.router.get('/historial-expedientes', expedienteController.obtenerHistorialExpedientes);
        this.router.get('/', expedienteController.obtenerExpedientes);
        this.router.get('/documento/:idDocumento', expedienteController.obtenerDocumento);
        this.router.get('/:idExpediente', expedienteController.obtenerExpediente);
        this.router.delete('/:idExpediente', expedienteController.eliminarExpediente);
        this.router.put('/:idExpediente', expedienteController.actualizarExpediente);
    }
}

const expedienteRoutes = new ExpedienteRoutes();
export default expedienteRoutes.router;
