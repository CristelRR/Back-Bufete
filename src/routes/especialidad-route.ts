import { Router } from "express";
import { especialidadController } from "../controllers/especialidad-controller";

class EspecialidadRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', especialidadController.getEspecialidades);
        this.router.post('/', especialidadController.crearEspecialidad);
        this.router.put('/', especialidadController.updateEspecialidad);
        this.router.delete('/', especialidadController.deleteEspecialidad);
    }
}

const especialidadRoutes = new EspecialidadRoutes();
export default especialidadRoutes.router;
