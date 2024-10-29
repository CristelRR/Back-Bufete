"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = void 0;
const usuario_model_1 = __importDefault(require("../models/usuario-model"));
class UsuarioController {
    getUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield usuario_model_1.default.getUsuarios();
                res.json(usuarios);
            }
            catch (error) {
                console.error('Error al obtener usuarios:', error);
                res.status(500).json({ message: 'Error al obtener usuarios' });
            }
        });
    }
    crearUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioData = req.body; // Asegúrate de validar los datos aquí
                yield usuario_model_1.default.crearUsuario(usuarioData);
                res.status(201).json({ message: 'Usuario creado exitosamente' });
            }
            catch (error) {
                console.error('Error al crear usuario:', error);
                res.status(500).json({ message: 'Error al crear usuario' });
            }
        });
    }
    updateUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioData = req.body; // Asegúrate de validar los datos aquí
                yield usuario_model_1.default.updateUsuario(usuarioData);
                res.json({ message: 'Usuario actualizado exitosamente' });
            }
            catch (error) {
                console.error('Error al actualizar usuario:', error);
                res.status(500).json({ message: 'Error al actualizar usuario' });
            }
        });
    }
    deleteUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUsuario } = req.body; // Asegúrate de validar el ID aquí
                yield usuario_model_1.default.deleteUsuario(idUsuario);
                res.json({ message: 'Usuario eliminado exitosamente' });
            }
            catch (error) {
                console.error('Error al eliminar usuario:', error);
                res.status(500).json({ message: 'Error al eliminar usuario' });
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
