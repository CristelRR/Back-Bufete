import { Router } from "express";
import { clienteController } from "../controllers/cliente-controller";

class ClienteRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', clienteController.getClientes);
        this.router.post('/', clienteController.crearCliente);
        this.router.put('/:idCliente', clienteController.updateCliente); 
        this.router.delete('/', clienteController.deleteCliente);
        this.router.get('/:idCliente', clienteController.getClienteById);
    }
}

const clienteRoutes = new ClienteRoutes();
export default clienteRoutes.router;
