import { Router } from "express";
import { empleadoController } from "../controllers/empleado-controller";

class EmpleadoRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', empleadoController.getEmpleados);
        this.router.post('/', empleadoController.crearEmpleado);
        this.router.delete('/', empleadoController.deleteEmpleado);
        this.router.get('/abogados', empleadoController.getAbogados);
        this.router.get('/:idEmpleado', empleadoController.getEmpleadoById); 
        this.router.put("/:idEmpleado", empleadoController.updateEmpleado); 


    }
}

const empleadoRoutes = new EmpleadoRoutes();
export default empleadoRoutes.router;
