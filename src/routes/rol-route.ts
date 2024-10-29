import { Router } from "express";
import { rolController } from "../controllers/rol-controller";

class RolRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', rolController.getRoles);
        this.router.post('/', rolController.crearRol);
        this.router.put('/', rolController.updateRol);
        this.router.delete('/', rolController.deleteRol);
    }
}

const rolRoutes = new RolRoutes();
export default rolRoutes.router;
