import { Router } from "express";
import { citaExpedienteController } from "../controllers/citas-expedinete-controller";

class CitaExpedineteRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', citaExpedienteController.getCitasExpediente);
        this.router.post('/', citaExpedienteController.crearCitaExpediente);
        this.router.put('/', citaExpedienteController.updateCitaExpediente);
        this.router.delete('/', citaExpedienteController.deleteCitaExpediente);
        this.router.delete('/expediente', citaExpedienteController.getExpediente);    
    }
}

const citaExpedineteRoutes = new CitaExpedineteRoutes();
export default citaExpedineteRoutes.router;