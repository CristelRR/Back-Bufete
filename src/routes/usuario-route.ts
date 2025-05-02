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
        this.router.post('/login', usuarioController.login);
        this.router.post('/verify-otp', usuarioController.verificarOTP); 
        this.router.post('/recuperar-contrasena', usuarioController.enviarCorreoRecuperacion);
        this.router.post('/restablecer-contrasena', usuarioController.restablecerContrasena);
        this.router.post('/extender-sesion', usuarioController.extenderSesion);
    }
}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;