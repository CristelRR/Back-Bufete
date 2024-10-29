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
exports.clienteController = void 0;
const cliente_model_1 = __importDefault(require("../models/cliente-model")); // Asegúrate de tener el modelo correspondiente
class ClienteController {
    getClientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientes = yield cliente_model_1.default.getClientes();
                res.json(clientes);
            }
            catch (error) {
                console.error('Error al obtener clientes:', error);
                res.status(500).json({ message: 'Error al obtener clientes' });
            }
        });
    }
    crearCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clienteData = req.body; // Asegúrate de validar los datos aquí
                yield cliente_model_1.default.crearCliente(clienteData);
                res.status(201).json({ message: 'Cliente creado exitosamente' });
            }
            catch (error) {
                console.error('Error al crear cliente:', error);
                res.status(500).json({ message: 'Error al crear cliente' });
            }
        });
    }
    updateCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clienteData = req.body; // Asegúrate de validar los datos aquí
                yield cliente_model_1.default.updateCliente(clienteData);
                res.json({ message: 'Cliente actualizado exitosamente' });
            }
            catch (error) {
                console.error('Error al actualizar cliente:', error);
                res.status(500).json({ message: 'Error al actualizar cliente' });
            }
        });
    }
    deleteCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCliente } = req.body; // Asegúrate de validar el ID aquí
                yield cliente_model_1.default.deleteCliente(idCliente);
                res.json({ message: 'Cliente eliminado exitosamente' });
            }
            catch (error) {
                console.error('Error al eliminar cliente:', error);
                res.status(500).json({ message: 'Error al eliminar cliente' });
            }
        });
    }
}
exports.clienteController = new ClienteController();
