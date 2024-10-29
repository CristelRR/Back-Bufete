import { Router } from "express";
import { usuarioController } from "../controllers/usuario-controller";

class UsuarioRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', usuarioController.getUsuarios);
        this.router.post('/', usuarioController.crearUsuario);
        this.router.put('/', usuarioController.updateUsuario);
        this.router.delete('/', usuarioController.deleteUsuario);
    }
}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;
