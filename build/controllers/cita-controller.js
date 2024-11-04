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
exports.citaController = void 0;
const cita_model_1 = __importDefault(require("../models/cita-model"));
class CitaController {
    getCitas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const citas = yield cita_model_1.default.getCitas();
                res.json(citas);
            }
            catch (error) {
                console.error('Error al obtener citas:', error);
                res.status(500).json({ message: 'Error al obtener citas' });
            }
        });
    }
    crearCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const citaData = req.body; // Asegúrate de validar los datos aquí
                yield cita_model_1.default.crearCita(citaData);
                res.status(201).json({ message: 'Cita creada exitosamente' });
            }
            catch (error) {
                console.error('Error al crear cita:', error);
                res.status(500).json({ message: 'Error al crear cita' });
            }
        });
    }
    updateCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const citaData = req.body; // Asegúrate de validar los datos aquí
                yield cita_model_1.default.updateCita(citaData);
                res.json({ message: 'Cita actualizada exitosamente' });
            }
            catch (error) {
                console.error('Error al actualizar cita:', error);
                res.status(500).json({ message: 'Error al actualizar cita' });
            }
        });
    }
    deleteCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCita } = req.body; // Asegúrate de validar el ID aquí
                yield cita_model_1.default.deleteCita(idCita);
                res.json({ message: 'Cita eliminada exitosamente' });
            }
            catch (error) {
                console.error('Error al eliminar cita:', error);
                res.status(500).json({ message: 'Error al eliminar cita' });
            }
        });
    }
    getAbogadosPorServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idServicio } = req.params; // Obtiene el ID del servicio de los parámetros de la URL
                const abogados = yield cita_model_1.default.getAbogadosPorServicio(Number(idServicio));
                res.json(abogados);
            }
            catch (error) {
                console.error('Error al obtener abogados:', error);
                res.status(500).json({ message: 'Error al obtener abogados' });
            }
        });
    }
    getHorariosDisponiblesPorAbogado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idAbogado } = req.params; // Obtiene el ID del abogado de los parámetros de la URL
                const horarios = yield cita_model_1.default.getHorariosDisponiblesPorAbogado(Number(idAbogado));
                res.json(horarios);
            }
            catch (error) {
                console.error('Error al obtener horarios disponibles:', error);
                res.status(500).json({ message: 'Error al obtener horarios disponibles' });
            }
        });
    }
}
exports.citaController = new CitaController();
