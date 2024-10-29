"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_controllers_1 = require("../controllers/middleware.controllers");
class SomeProtectedRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/admin', middleware_controllers_1.authenticateToken, this.adminRoute.bind(this)); // Asegúrate de enlazar el contexto
    }
    adminRoute(req, res) {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.rol) !== 1) { // Usar encadenamiento opcional
            return res.sendStatus(403); // Prohibido
        }
        res.status(200).json({ message: 'Bienvenido, administrador!' });
    }
}
const protectedRoutes = new SomeProtectedRoutes();
exports.default = protectedRoutes.router;
