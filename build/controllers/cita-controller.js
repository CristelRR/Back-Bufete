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
const notificar_cita_cliente_1 = require("./notificar-cita-cliente");
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
    crearCitaConTransaccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const citaData = req.body;
                // Llama al modelo para crear la cita en una transacción
                const result = yield cita_model_1.default.crearCitaConTransaccion(citaData);
                // Obtén los datos del cliente desde la base de datos
                const datosCliente = yield cita_model_1.default.obtenerDatosCliente(citaData.idClienteFK);
                if (!datosCliente || !datosCliente.emailCliente) {
                    return res.status(500).json({ message: "No se encontró el correo del cliente" });
                }
                // Envía la notificación por correo electrónico usando los datos del cliente
                const { emailCliente, nombreCliente, aPCliente, aMCliente } = datosCliente;
                const clienteNombre = `${nombreCliente} ${aPCliente} ${aMCliente}`;
                const fechaCita = citaData.fechaCita; // Si tienes la fecha de la cita en citaData
                const motivoCita = citaData.motivo;
                yield (0, notificar_cita_cliente_1.notificarClienteCita)(emailCliente, clienteNombre, fechaCita, motivoCita);
                res.status(201).json({ message: result.message, notification: 'Correo de notificación enviado' });
            }
            catch (error) {
                console.error('Error al crear cita con transacción:', error);
                res.status(500).json({ message: 'Error al crear cita con transacción', error: error.message });
            }
        });
    }
    getCitasByCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCliente } = req.params; // Obtiene el ID del cliente de los parámetros de la URL
                const citas = yield cita_model_1.default.getCitasByCliente(Number(idCliente));
                res.json(citas);
            }
            catch (error) {
                console.error('Error al obtener citas del cliente:', error);
                res.status(500).json({ message: 'Error al obtener citas del cliente' });
            }
        });
    }
    // Método para obtener las citas de un abogado específico
    getCitasByAbogado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idAbogado } = req.params; // Obtiene el idAbogado de los parámetros de la URL
                const citas = yield cita_model_1.default.getCitasByAbogado(Number(idAbogado)); // Llama al modelo con el idAbogado
                res.json(citas); // Devuelve las citas como respuesta
            }
            catch (error) {
                console.error('Error al obtener citas del abogado:', error);
                res.status(500).json({ message: 'Error al obtener citas del abogado' });
            }
        });
    }
    // Método para obtener los clientes únicos con citas programadas para un abogado específico
    getClientesPorAbogado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idAbogado } = req.params; // Obtiene el idAbogado de los parámetros de la URL
                const clientes = yield cita_model_1.default.getClientesPorAbogado(Number(idAbogado)); // Llama al modelo para obtener clientes únicos
                res.json(clientes); // Envía los clientes como respuesta en formato JSON
            }
            catch (error) {
                console.error('Error al obtener clientes del abogado:', error);
                res.status(500).json({ message: 'Error al obtener clientes del abogado' });
            }
        });
    }
    // Método para cancelar cita
    cancelarCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCita } = req.body;
                if (!idCita) {
                    return res.status(400).json({ message: 'ID de cita no proporcionado' });
                }
                // Llama al método cancelarCita del modelo
                const result = yield cita_model_1.default.cancelarCita(Number(idCita));
                res.json(result); // Responde con el resultado de la operación
            }
            catch (error) {
                console.error('Error al cancelar la cita:', error);
                res.status(500).json({ message: 'Error al cancelar la cita' });
            }
        });
    }
    // Obtener servicios de un cliente
    // Método para obtener los servicios asociados a las citas de un cliente
    getServiciosPorCitasDeCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCliente } = req.params;
                const servicios = yield cita_model_1.default.getServiciosPorCitasDeCliente(Number(idCliente));
                res.json(servicios);
            }
            catch (error) {
                console.error('Error al obtener servicios asociados a las citas del cliente:', error);
                res.status(500).json({ message: 'Error al obtener servicios asociados a las citas del cliente' });
            }
        });
    }
    // Método para obtener todas las citas con información detallada
    getAllCitas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const citas = yield cita_model_1.default.getAllCitas();
                res.json(citas);
            }
            catch (error) {
                console.error('Error al obtener todas las citas:', error);
                res.status(500).json({ message: 'Error al obtener todas las citas' });
            }
        });
    }
}
exports.citaController = new CitaController();
