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
class AgendaModel {
    getAgendas() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblAgenda');
            return result.recordset;
        });
    }
    crearAgenda(agendaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('fechaIngreso', agendaData.fechaIngreso)
                .input('numeroLicencia', agendaData.numeroLicencia)
                .input('correo', agendaData.correo)
                .input('nombreAgenda', agendaData.nombreAgenda)
                .input('aPAgenda', agendaData.aPAgenda)
                .input('aMAgenda', agendaData.aMAgenda)
                .input('telefono', agendaData.telefono)
                .input('pass', agendaData.pass)
                .input('idRolFK', agendaData.idRolFK)
                .input('idEspecialidadFK', agendaData.idEspecialidadFK)
                .query(`
                INSERT INTO tblAgenda 
                (fechaIngreso, numeroLicencia, correo, nombreAgenda, aPAgenda, aMAgenda, telefono, pass, idRolFK, idEspecialidadFK) 
                VALUES (@fechaIngreso, @numeroLicencia, @correo, @nombreAgenda, @aPAgenda, @aMAgenda, @telefono, @pass, @idRolFK, @idEspecialidadFK)
            `);
            return result;
        });
    }
    updateAgenda(agendaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idAgenda', agendaData.idAgenda)
                .input('fechaIngreso', agendaData.fechaIngreso)
                .input('numeroLicencia', agendaData.numeroLicencia)
                .input('correo', agendaData.correo)
                .input('nombreAgenda', agendaData.nombreAgenda)
                .input('aPAgenda', agendaData.aPAgenda)
                .input('aMAgenda', agendaData.aMAgenda)
                .input('telefono', agendaData.telefono)
                .input('pass', agendaData.pass)
                .input('idRolFK', agendaData.idRolFK)
                .input('idEspecialidadFK', agendaData.idEspecialidadFK)
                .query(`
                UPDATE tblAgenda 
                SET 
                    fechaIngreso = @fechaIngreso,
                    numeroLicencia = @numeroLicencia,
                    correo = @correo,
                    nombreAgenda = @nombreAgenda,
                    aPAgenda = @aPAgenda,
                    aMAgenda = @aMAgenda,
                    telefono = @telefono,
                    pass = @pass,
                    idRolFK = @idRolFK,
                    idEspecialidadFK = @idEspecialidadFK 
                WHERE idAgenda = @idAgenda
            `);
            return result;
        });
    }
    deleteAgenda(idAgenda) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idAgenda', idAgenda)
                .query('DELETE FROM tblAgenda WHERE idAgenda = @idAgenda');
            return result;
        });
    }
    findById(idAgenda) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idAgenda', idAgenda)
                .query('SELECT * FROM tblAgenda WHERE idAgenda = @idAgenda');
            return result.recordset;
        });
    }
}
const agendaModelo = new AgendaModel();
exports.default = agendaModelo;
