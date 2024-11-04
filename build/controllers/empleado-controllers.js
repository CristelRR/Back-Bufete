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
exports.empleadoController = void 0;
const empleado_model_1 = __importDefault(require("../models/empleado-model"));
class EmpleadoController {
    getEmpleados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empleados = yield empleado_model_1.default.getEmpleados();
                res.json(empleados);
            }
            catch (error) {
                console.error('Error al obtener empleados:', error);
                res.status(500).json({ message: 'Error al obtener empleados' });
            }
        });
    }
    crearEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empleadoData = req.body; // Asegúrate de validar los datos aquí
                yield empleado_model_1.default.crearEmpleado(empleadoData);
                res.status(201).json({ message: 'Empleado creado exitosamente' });
            }
            catch (error) {
                console.error('Error al crear empleado:', error);
                res.status(500).json({ message: 'Error al crear empleado' });
            }
        });
    }
    updateEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empleadoData = req.body; // Asegúrate de validar los datos aquí
                yield empleado_model_1.default.updateEmpleado(empleadoData);
                res.json({ message: 'Empleado actualizado exitosamente' });
            }
            catch (error) {
                console.error('Error al actualizar empleado:', error);
                res.status(500).json({ message: 'Error al actualizar empleado' });
            }
        });
    }
    deleteEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idEmpleado } = req.body; // Asegúrate de validar el ID aquí
                yield empleado_model_1.default.deleteEmpleado(idEmpleado);
                res.json({ message: 'Empleado eliminado exitosamente' });
            }
            catch (error) {
                console.error('Error al eliminar empleado:', error);
                res.status(500).json({ message: 'Error al eliminar empleado' });
            }
        });
    }
}
exports.empleadoController = new EmpleadoController();