import { Router } from "express";
import { empleadoController } from "../controllers/empleado-controllers";

class EmpleadoRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', empleadoController.getEmpleadoAbogado);
        this.router.post('/crear', async (req, res, next) => {
            try {
                await empleadoController.crearEmpleado(req, res);
            } catch (error) {
                next(error); // Pasar el error al manejador de errores de Express
            }
        });
    }
}

const empleadoRoutes = new EmpleadoRoutes();
export default empleadoRoutes.router;