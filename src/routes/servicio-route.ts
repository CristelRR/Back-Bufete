import { Router } from "express";
import { servicioController } from "../controllers/servicio-controller";

class ServicioRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', servicioController.getServicios);
        this.router.post('/', servicioController.crearServicio);
        this.router.put('/', servicioController.updateServicio);
        this.router.delete('/', servicioController.deleteServicio);
        this.router.get('/servicio-abogado/:idAbogado', servicioController.getServiciosPorAbogado);
    }
}

const servicioRoutes = new ServicioRoutes();
export default servicioRoutes.router;
