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
        this.router.post('/expedientes', this.upload.single('archivo'), expedienteController.crearExpediente);
        this.router.get('/', expedienteController.obtenerExpedientes);
        this.router.delete('/expedientes/:id', expedienteController.eliminarExpediente);
    }
}

const expedienteRoutes = new ExpedienteRoutes();
export default expedienteRoutes.router;
