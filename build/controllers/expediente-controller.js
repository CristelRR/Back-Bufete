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
exports.expedienteNController = void 0;
const expediente_model_1 = __importDefault(require("../models/expediente-model"));
class ExpedienteNController {
    getExpedientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expedientes = yield expediente_model_1.default.getExpedientes();
                res.json(expedientes);
            }
            catch (error) {
                console.error('Error al obtener expedientes:', error);
                res.status(500).json({ message: 'Error al obtener expedientes' });
            }
        });
    }
    crearExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expedienteData = req.body; // Asegúrate de validar los datos aquí
                yield expediente_model_1.default.crearExpediente(expedienteData);
                res.status(201).json({ message: 'Expediente creada exitosamente' });
            }
            catch (error) {
                console.error('Error al crear expediente:', error);
                res.status(500).json({ message: 'Error al crear expediente' });
            }
        });
    }
    updateExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expedienteData = req.body; // Asegúrate de validar los datos aquí
                yield expediente_model_1.default.updateExpediente(expedienteData);
                res.json({ message: 'Expediente actualizada exitosamente' });
            }
            catch (error) {
                console.error('Error al actualizar expediente:', error);
                res.status(500).json({ message: 'Error al actualizar expediente' });
            }
        });
    }
    deleteExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idExpediente } = req.body; // Asegúrate de validar el ID aquí
                yield expediente_model_1.default.deleteExpediente(idExpediente);
                res.json({ message: 'Expediente eliminada exitosamente' });
            }
            catch (error) {
                console.error('Error al eliminar expediente:', error);
                res.status(500).json({ message: 'Error al eliminar expediente' });
            }
        });
    }
    // Método findById agregado
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Cambié a req.params porque típicamente el ID viene en la URL
                const expediente = yield expediente_model_1.default.findById(parseInt(id));
                if (!expediente) {
                    return res.status(404).json({ message: 'Expediente no encontrado' });
                }
                res.json(expediente);
            }
            catch (error) {
                console.error('Error al obtener expediente:', error);
                res.status(500).json({ message: 'Error al obtener expediente' });
            }
        });
    }
    //MÈTODO INFORMACIÒN GENERAL POR NUMERO DE EXPEDIENTE
    informacionGeneral(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { numeroExpediente } = req.params; // Obtener el número de expediente de los parámetros de la URL
                if (!numeroExpediente) {
                    return res.status(400).json({ message: "El número de expediente es requerido" });
                }
                const expediente = yield expediente_model_1.default.informacionGeneral(numeroExpediente);
                if (!expediente) {
                    return res.status(404).json({ message: "Expediente no encontrado" });
                }
                res.json(expediente); // Enviar el expediente como respuesta
            }
            catch (error) {
                console.error("Error al obtener la información general del expediente:", error);
                res.status(500).json({ message: "Error al obtener la información general del expediente" });
            }
        });
    }
    obtenerPartes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { numeroExpediente } = req.params; // Obtener número de expediente desde los parámetros
                if (!numeroExpediente) {
                    return res.status(400).json({ message: 'El número de expediente es requerido.' });
                }
                const partes = yield expediente_model_1.default.getPartesPorExpediente(numeroExpediente);
                if (!partes || partes.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron partes relacionadas con este expediente.' });
                }
                res.json(partes); // Enviar las partes como respuesta
            }
            catch (error) {
                console.error('Error al obtener las partes del expediente:', error);
                res.status(500).json({ message: 'Error interno del servidor.' });
            }
        });
    }
}
exports.expedienteNController = new ExpedienteNController();
