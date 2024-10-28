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
class RolModel {
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblRol');
            return result.recordset;
        });
    }
    crearRol(rolData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('nombreRol', rolData.nombreRol)
                .query(`
                INSERT INTO tblRol (nombreRol) 
                VALUES (@nombreRol)
            `);
            return result;
        });
    }
    updateRol(rolData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idRol', rolData.idRol)
                .input('nombreRol', rolData.nombreRol)
                .query(`
                UPDATE tblRol 
                SET nombreRol = @nombreRol 
                WHERE idRol = @idRol
            `);
            return result;
        });
    }
    deleteRol(idRol) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idRol', idRol)
                .query('DELETE FROM tblRol WHERE idRol = @idRol');
            return result;
        });
    }
    findById(idRol) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idRol', idRol)
                .query('SELECT * FROM tblRol WHERE idRol = @idRol');
            return result.recordset;
        });
    }
}
const rolModel = new RolModel();
exports.default = rolModel;
