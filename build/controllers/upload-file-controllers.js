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
exports.expedienteController = void 0;
const db_1 = require("../config/db");
const path_1 = __importDefault(require("path"));
const mssql_1 = __importDefault(require("mssql"));
class ExpedienteController {
    crearExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombreExpediente, numeroExpediente } = req.body;
                const archivo = req.file;
                if (!nombreExpediente || !numeroExpediente || !archivo) {
                    res.status(400).json({ error: 'Todos los campos son obligatorios' });
                    return;
                }
                const archivoPath = path_1.default.join(__dirname, '../uploads', archivo.filename);
                const pool = yield (0, db_1.connectDB)();
                const query = `
                INSERT INTO tlbExpedientes (nombreExpediente, numeroExpediente, archivoPath)
                VALUES (@nombreExpediente, @numeroExpediente, @archivoPath)
            `;
                yield pool.request()
                    .input('nombreExpediente', mssql_1.default.NVarChar, nombreExpediente)
                    .input('numeroExpediente', mssql_1.default.NVarChar, numeroExpediente)
                    .input('archivoPath', mssql_1.default.NVarChar, archivoPath)
                    .query(query);
                res.status(201).json({ message: 'Expediente creado exitosamente' });
            }
            catch (error) {
                console.error('Error al crear el expediente:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
    }
    obtenerExpedientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query('SELECT * FROM tlbExpedientes');
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener expedientes:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
    }
    eliminarExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request()
                    .input('id', mssql_1.default.Int, id)
                    .query('DELETE FROM Expedientes WHERE id = @id');
                if (result.rowsAffected[0] === 0) {
                    res.status(404).json({ error: 'Expediente no encontrado' });
                    return;
                }
                res.json({ message: 'Expediente eliminado exitosamente' });
            }
            catch (error) {
                console.error('Error al eliminar el expediente:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
    }
}
exports.expedienteController = new ExpedienteController();
