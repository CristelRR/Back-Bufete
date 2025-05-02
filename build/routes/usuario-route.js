"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = require("../controllers/usuario-controller");
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', usuario_controller_1.usuarioController.getUsuarios);
        this.router.post('/', usuario_controller_1.usuarioController.crearUsuario);
        this.router.put('/', usuario_controller_1.usuarioController.updateUsuario);
        this.router.delete('/', usuario_controller_1.usuarioController.deleteUsuario);
        this.router.post('/login', usuario_controller_1.usuarioController.login);
        this.router.post('/verify-otp', usuario_controller_1.usuarioController.verificarOTP);
        this.router.post('/recuperar-contrasena', usuario_controller_1.usuarioController.enviarCorreoRecuperacion);
        this.router.post('/restablecer-contrasena', usuario_controller_1.usuarioController.restablecerContrasena);
        this.router.post('/extender-sesion', usuario_controller_1.usuarioController.extenderSesion);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
