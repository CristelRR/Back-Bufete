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
class CitaModel {
    getCitas() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblCita');
            return result.recordset;
        });
    }
    crearCita(citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('motivo', citaData.motivo)
                .input('estado', citaData.estado)
                .input('idClienteFK', citaData.idClienteFK)
                .input('idAgendaFK', citaData.idAgendaFK)
                .query(`
                INSERT INTO tblCita (motivo, estado, idClienteFK, idAgendaFK) 
                VALUES (@motivo, @estado, @idClienteFK, @idAgendaFK)
            `);
            return result;
        });
    }
    updateCita(citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCita', citaData.idCita)
                .input('motivo', citaData.motivo)
                .input('estado', citaData.estado)
                .query(`
                UPDATE tblCita 
                SET 
                    motivo = @motivo,
                    estado = @estado 
                WHERE idCita = @idCita
            `);
            return result;
        });
    }
    deleteCita(idCita) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCita', idCita)
                .query('DELETE FROM tblCita WHERE idCita = @idCita');
            return result;
        });
    }
    findById(idCita) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCita', idCita)
                .query('SELECT * FROM tblCita WHERE idCita = @idCita');
            return result.recordset;
        });
    }
    getAbogadosPorServicio(idServicio) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idServicio', idServicio)
                .query(`
                SELECT e.idEmpleado, e.nombreEmpleado, e.aPEmpleado, e.aMEmpleado
                FROM tblServicio s JOIN 
                     tblEspecialidad_Servicio es ON s.idServicio = es.idServicio JOIN 
                     tblEmpleado e ON es.idEspecialidad = e.idEspecialidadFK
                WHERE s.idServicio = @idServicio AND e.idRolFK = 2;  
            `);
            return result.recordset;
        });
    }
    getHorariosDisponiblesPorAbogado(idAbogado) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idAbogado', idAbogado)
                .query(`
                SELECT a.fecha, a.horaInicio, a.horaFinal
                FROM tblAgenda a
                WHERE 
                    a.idEmpleadoFK = @idAbogado  -- Filtra por el ID del abogado
                    AND a.estado = 'Disponible'  -- Solo horarios disponibles
                    AND a.fecha >= CAST(GETDATE() AS DATE)  -- Solo fechas futuras
                    AND NOT EXISTS (
                        SELECT 1
                        FROM tblCita c
                        WHERE 
                            c.idAgendaFK = a.idAgenda
                            AND c.estado = 'programada'  -- Solo citas programadas
                    )
                ORDER BY 
                    a.fecha, a.horaInicio;
            `);
            return result.recordset;
        });
    }
}
const citaModel = new CitaModel();
exports.default = citaModel;
