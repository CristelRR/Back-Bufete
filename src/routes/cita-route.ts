import { Router } from "express";
import { citaController } from "../controllers/cita-controller"; 

class CitaRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', citaController.getCitas);
        this.router.post('/', citaController.crearCita);
        this.router.put('/', citaController.updateCita);
        this.router.delete('/', citaController.deleteCita);    }
}

const citaRoutes = new CitaRoutes();
export default citaRoutes.router;