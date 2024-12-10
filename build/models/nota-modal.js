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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class NotaModel {
    /**
     * Obtener todas las notas
     */
    getNotas() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblNota');
            return result.recordset;
        });
    }
    /**
 * Buscar notas por el ID de la cita
 */
    findNotasByCitaId(idCita) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCita', idCita)
                .query('SELECT * FROM tblNota WHERE idCitaFK = @idCita');
            return result.recordset;
        });
    }
    /**
     * Obtener notas por cita o expediente
     */
    getNotasPorCitaOExpediente(idCita, idExpediente) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            let query = 'SELECT * FROM tblNota WHERE ';
            let filters = '';
            const request = pool.request();
            if (idCita) {
                filters += 'idCitaFK = @idCita ';
                request.input('idCita', idCita);
            }
            if (idExpediente) {
                if (filters)
                    filters += 'OR ';
                filters += 'idExpedienteFK = @idExpediente ';
                request.input('idExpediente', idExpediente);
            }
            if (!filters) {
                throw new Error('Debe proporcionar al menos un ID de cita o expediente');
            }
            const result = yield request.query(query + filters);
            return result.recordset;
        });
    }
    /**
     * Crear una nueva nota
     */
    crearNota(notaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('titulo', notaData.titulo)
                .input('descripcion', notaData.descripcion)
                .input('tipoNota', notaData.tipoNota)
                .input('idCitaFK', notaData.idCitaFK || null)
                .input('idExpedienteFK', notaData.idExpedienteFK || null)
                .query(`
                INSERT INTO tblNota (titulo, descripcion, tipoNota, idCitaFK, idExpedienteFK, fechaCreacion) 
                VALUES (@titulo, @descripcion, @tipoNota, @idCitaFK, @idExpedienteFK, GETDATE())
            `);
            return result;
        });
    }
    /**
     * Actualizar una nota existente
     */
    updateNota(notaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idNota', notaData.idNota)
                .input('titulo', notaData.titulo)
                .input('descripcion', notaData.descripcion)
                .input('tipoNota', notaData.tipoNota)
                .input('estado', notaData.estado || 'activa')
                .query(`
                UPDATE tblNota 
                SET titulo = @titulo, 
                    descripcion = @descripcion, 
                    tipoNota = @tipoNota, 
                    estado = @estado, 
                    ultimaActualizacion = GETDATE() 
                WHERE idNota = @idNota
            `);
            return result;
        });
    }
    /**
     * Eliminar una nota
     */
    deleteNota(idNota) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idNota', idNota)
                .query('DELETE FROM tblNota WHERE idNota = @idNota');
            return result;
        });
    }
    /**
     * Buscar una nota por su ID
     */
    findById(idNota) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idNota', idNota)
                .query('SELECT * FROM tblNota WHERE idNota = @idNota');
            return result.recordset;
        });
    }
}
const notaModel = new NotaModel();
exports.default = notaModel;
