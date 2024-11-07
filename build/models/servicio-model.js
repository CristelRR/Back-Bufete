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
class ServicioModel {
    getServicios() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblServicio');
            return result.recordset;
        });
    }
    crearServicio(servicioData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('nombreServicio', servicioData.nombreServicio)
                .input('descripcion', servicioData.descripcion)
                .input('costo', servicioData.costo)
                .query(`
                INSERT INTO tblServicio (nombreServicio, descripcion, costo) 
                VALUES (@nombreServicio, @descripcion, @costo)
            `);
            return result;
        });
    }
    updateServicio(servicioData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idServicio', servicioData.idServicio)
                .input('nombreServicio', servicioData.nombreServicio)
                .input('descripcion', servicioData.descripcion)
                .input('costo', servicioData.costo)
                .query(`
                UPDATE tblServicio 
                SET 
                    nombreServicio = @nombreServicio,
                    descripcion = @descripcion,
                    costo = @costo 
                WHERE idServicio = @idServicio
            `);
            return result;
        });
    }
    deleteServicio(idServicio) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idServicio', idServicio)
                .query('DELETE FROM tblServicio WHERE idServicio = @idServicio');
            return result;
        });
    }
    findById(idServicio) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idServicio', idServicio)
                .query('SELECT * FROM tblServicio WHERE idServicio = @idServicio');
            return result.recordset;
        });
    }
    getServiciosPorAbogado(idAbogado) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idAbogado', idAbogado)
                .query(`
                SELECT s.idServicio, s.nombreServicio
                FROM tblEmpleado e
                JOIN tblEspecialidad_Servicio es ON e.idEspecialidadFK = es.idEspecialidad
                JOIN tblServicio s ON es.idServicio = s.idServicio
                WHERE e.idEmpleado = @idAbogado AND e.idRolFK = 2;  
            `);
            return result.recordset;
        });
    }
}
const servicioModel = new ServicioModel();
exports.default = servicioModel;
