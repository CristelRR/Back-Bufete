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
class ClienteModel {
    getClientes() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request().query('SELECT * FROM tblCliente');
            return result.recordset;
        });
    }
    getClienteById(idCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCliente', idCliente)
                .query('SELECT * FROM tblCliente WHERE idCliente = @idCliente');
            return result.recordset;
        });
    }
    crearCliente(clienteData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('nombreCliente', clienteData.nombreCliente)
                .input('aPCliente', clienteData.aPCliente)
                .input('aMCliente', clienteData.aMCliente)
                .input('direccion', clienteData.direccion)
                .input('correo', clienteData.correo)
                .input('telefono', clienteData.telefono)
                .input('pass', clienteData.pass)
                .input('idRolFK', clienteData.idRolFK)
                .query(`
                INSERT INTO tblCliente 
                (nombreCliente, aPCliente, aMCliente, direccion, correo, telefono, pass, idRolFK) 
                VALUES (@nombreCliente, @aPCliente, @aMCliente, @direccion, @correo, @telefono, @pass, @idRolFK)
            `);
            return result;
        });
    }
    updateCliente(idCliente, clienteData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCliente', idCliente) // Identificador del cliente (no editable)
                .input('nombreCliente', clienteData.nombreCliente) // Campo editable
                .input('aPCliente', clienteData.aPCliente) // Campo editable
                .input('aMCliente', clienteData.aMCliente) // Campo editable
                .input('direccion', clienteData.direccion) // Campo editable
                .input('correo', clienteData.correo) // Campo editable
                .input('telefono', clienteData.telefono) // Campo editable
                .query(`
                UPDATE tblCliente 
                SET 
                    nombreCliente = @nombreCliente,
                    aPCliente = @aPCliente,
                    aMCliente = @aMCliente,
                    direccion = @direccion,
                    correo = @correo,
                    telefono = @telefono
                WHERE idCliente = @idCliente
            `);
            return result; // Retorna el resultado de la consulta
        });
    }
    deleteCliente(idCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCliente', idCliente)
                .query('DELETE FROM tblCliente WHERE idCliente = @idCliente');
            return result;
        });
    }
    findById(idCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, db_1.connectDB)();
            const result = yield pool.request()
                .input('idCliente', idCliente)
                .query('SELECT * FROM tblCliente WHERE idCliente = @idCliente');
            return result.recordset;
        });
    }
}
const clienteModelo = new ClienteModel();
exports.default = clienteModelo;
