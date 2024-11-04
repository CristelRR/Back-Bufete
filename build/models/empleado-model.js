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
class EmpleadoModel {
    getEmpleados() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblEmpleado');
            return result.recordset;
        });
    }
    getAbogados() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblEmpleado AS E WHERE E.idRolFK = 2');
            return result.recordset;
        });
    }
    crearEmpleado(empleadoData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('fechaIngreso', empleadoData.fechaIngreso)
                .input('numeroLicencia', empleadoData.numeroLicencia)
                .input('correo', empleadoData.correo)
                .input('nombreEmpleado', empleadoData.nombreEmpleado)
                .input('aPEmpleado', empleadoData.aPEmpleado)
                .input('aMEmpleado', empleadoData.aMEmpleado)
                .input('telefono', empleadoData.telefono)
                .input('pass', empleadoData.pass)
                .input('idRolFK', empleadoData.idRolFK)
                .input('idEspecialidadFK', empleadoData.idEspecialidadFK)
                .query(`
                INSERT INTO tblEmpleado 
                (fechaIngreso, numeroLicencia, correo, nombreEmpleado, aPEmpleado, aMEmpleado, telefono, pass, idRolFK, idEspecialidadFK) 
                VALUES (@fechaIngreso, @numeroLicencia, @correo, @nombreEmpleado, @aPEmpleado, @aMEmpleado, @telefono, @pass, @idRolFK, @idEspecialidadFK)
            `);
            return result;
        });
    }
    updateEmpleado(empleadoData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idEmpleado', empleadoData.idEmpleado)
                .input('fechaIngreso', empleadoData.fechaIngreso)
                .input('numeroLicencia', empleadoData.numeroLicencia)
                .input('correo', empleadoData.correo)
                .input('nombreEmpleado', empleadoData.nombreEmpleado)
                .input('aPEmpleado', empleadoData.aPEmpleado)
                .input('aMEmpleado', empleadoData.aMEmpleado)
                .input('telefono', empleadoData.telefono)
                .input('pass', empleadoData.pass)
                .input('idRolFK', empleadoData.idRolFK)
                .input('idEspecialidadFK', empleadoData.idEspecialidadFK)
                .query(`
                UPDATE tblEmpleado 
                SET 
                    fechaIngreso = @fechaIngreso,
                    numeroLicencia = @numeroLicencia,
                    correo = @correo,
                    nombreEmpleado = @nombreEmpleado,
                    aPEmpleado = @aPEmpleado,
                    aMEmpleado = @aMEmpleado,
                    telefono = @telefono,
                    pass = @pass,
                    idRolFK = @idRolFK,
                    idEspecialidadFK = @idEspecialidadFK 
                WHERE idEmpleado = @idEmpleado
            `);
            return result;
        });
    }
    deleteEmpleado(idEmpleado) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idEmpleado', idEmpleado)
                .query('DELETE FROM tblEmpleado WHERE idEmpleado = @idEmpleado');
            return result;
        });
    }
    findById(idEmpleado) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idEmpleado', idEmpleado)
                .query('SELECT * FROM tblEmpleado WHERE idEmpleado = @idEmpleado');
            return result.recordset;
        });
    }
}
const empleadoModelo = new EmpleadoModel();
exports.default = empleadoModelo;
