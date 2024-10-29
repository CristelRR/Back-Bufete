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
class EspecialidadModel {
    getEspecialidades() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblEspecialidad');
            return result.recordset;
        });
    }
    crearEspecialidad(especialidadData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('nombreEspecialidad', especialidadData.nombreEspecialidad)
                .query(`
                INSERT INTO tblEspecialidad (nombreEspecialidad) 
                VALUES (@nombreEspecialidad)
            `);
            return result;
        });
    }
    updateEspecialidad(especialidadData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idEspecialidad', especialidadData.idEspecialidad)
                .input('nombreEspecialidad', especialidadData.nombreEspecialidad)
                .query(`
                UPDATE tblEspecialidad 
                SET nombreEspecialidad = @nombreEspecialidad 
                WHERE idEspecialidad = @idEspecialidad
            `);
            return result;
        });
    }
    deleteEspecialidad(idEspecialidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idEspecialidad', idEspecialidad)
                .query('DELETE FROM tblEspecialidad WHERE idEspecialidad = @idEspecialidad');
            return result;
        });
    }
    findById(idEspecialidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idEspecialidad', idEspecialidad)
                .query('SELECT * FROM tblEspecialidad WHERE idEspecialidad = @idEspecialidad');
            return result.recordset;
        });
    }
}
const especialidadModel = new EspecialidadModel();
exports.default = especialidadModel;
