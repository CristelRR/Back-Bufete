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
class UsuarioModel {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('email', email)
                .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @email');
            return result.recordset[0];
        });
    }
    getUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblUsuario');
            return result.recordset;
        });
    }
    crearUsuario(usuarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('nombreUsuario', usuarioData.nombreUsuario)
                .input('pass', usuarioData.pass)
                .input('estado', usuarioData.estado)
                .input('idRolFK', usuarioData.idRolFK)
                .query(`
                INSERT INTO tblUsuario 
                (nombreUsuario, pass, estado, idRolFK) 
                VALUES (@nombreUsuario, @pass, @estado, @idRolFK)
            `);
            return result;
        });
    }
    updateUsuario(usuarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idUsuario', usuarioData.idUsuario)
                .input('nombreUsuario', usuarioData.nombreUsuario)
                .input('pass', usuarioData.pass)
                .input('estado', usuarioData.estado)
                .input('idRolFK', usuarioData.idRolFK)
                .query(`
                UPDATE tblUsuario 
                SET 
                    nombreUsuario = @nombreUsuario,
                    pass = @pass,
                    estado = @estado,
                    idRolFK = @idRolFK 
                WHERE idUsuario = @idUsuario
            `);
            return result;
        });
    }
    deleteUsuario(idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idUsuario', idUsuario)
                .query('DELETE FROM tblUsuario WHERE idUsuario = @idUsuario');
            return result;
        });
    }
    findById(idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idUsuario', idUsuario)
                .query('SELECT * FROM tblUsuario WHERE idUsuario = @idUsuario');
            return result.recordset;
        });
    }
}
const usuarioModel = new UsuarioModel();
exports.default = usuarioModel;
