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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
class ExpedienteController {
    constructor() {
        this.insertarDocumentos = (pool, idExpediente, documentos) => __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            for (const doc of documentos) {
                const { archivoBase64, tipoDocumento } = doc;
                if (!archivoBase64 || !tipoDocumento) {
                    errors.push('Faltan datos necesarios para los documentos');
                    continue;
                }
                const base64Regex = /^data:([A-Za-z-+/]+)?;base64,/;
                if (!base64Regex.test(archivoBase64)) {
                    errors.push('El archivo no está en formato Base64');
                    continue;
                }
                const fileBuffer = Buffer.from(archivoBase64.replace(base64Regex, ''), 'base64');
                try {
                    yield pool.request()
                        .input('tipoDocumento', tipoDocumento)
                        .input('documentoBase64', fileBuffer)
                        .input('idExpedienteFK', idExpediente)
                        .query(`
                        INSERT INTO tblDocumentosExpediente (idExpedienteFK, idTipoDocumentoFK, documentoBase64)
                        VALUES (@idExpedienteFK, (SELECT idTipoDocumento FROM tblTipoDocumento WHERE tipoDocumento = @tipoDocumento), @documentoBase64);
                    `);
                }
                catch (error) {
                    console.error(`Error al insertar documento ${tipoDocumento}:`, error);
                    errors.push(`Error al insertar documento de tipo ${tipoDocumento}`);
                }
            }
            return errors;
        });
    }
    obtenerDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idDocumento } = req.params;
                if (!idDocumento) {
                    res.status(400).json({ error: 'Falta el ID del documento' });
                    return;
                }
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request()
                    .input('idDocumento', idDocumento)
                    .query(`
                    SELECT d.documentoBase64, t.tipoDocumento 
                    FROM tblDocumentosExpediente d
                    LEFT JOIN tblTipoDocumento t ON d.idTipoDocumentoFK = t.idTipoDocumento
                    WHERE d.idDocumento = @idDocumento;
                `);
                if (result.recordset.length === 0) {
                    res.status(404).json({ error: 'Documento no encontrado' });
                    return;
                }
                const documento = result.recordset[0];
                const base64String = documento.documentoBase64;
                const tipoDocumento = documento.tipoDocumento;
                res.status(200).json({
                    tipoDocumento,
                    documentoBase64: base64String
                });
            }
            catch (error) {
                console.error('Error al obtener el documento:', error);
                res.status(500).json({ error: 'Error al obtener el documento' });
            }
        });
    }
    obtenerExpedientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query("SELECT * FROM tblExpediente");
                res.status(200).json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener los expedientes:', error);
                res.status(500).json({ error: 'Error al obtener los expedientes' });
            }
        });
    }
    crearExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { numeroExpediente, estado, descripcion, nombreExpediente, idClienteFK, idEmpleadoFK, documentos } = req.body;
                if (!numeroExpediente || !estado || !idClienteFK) {
                    res.status(400).json({ error: 'Faltan datos necesarios para crear el expediente' });
                    return;
                }
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request()
                    .input('numeroExpediente', numeroExpediente)
                    .input('estado', estado)
                    .input('descripcion', descripcion || '')
                    .input('nombreExpediente', nombreExpediente || 'Nombre por Defecto')
                    .input('idClienteFK', idClienteFK)
                    .input('idEmpleadoFK', idEmpleadoFK || null)
                    .query(`
                    INSERT INTO tblExpediente (numeroExpediente, estado, descripcion, nombreExpediente, idClienteFK, idEmpleadoFK)
                    VALUES (@numeroExpediente, @estado, @descripcion, @nombreExpediente, @idClienteFK, @idEmpleadoFK);
                    SELECT SCOPE_IDENTITY() AS idExpediente;
                `);
                const idExpediente = Number(result.recordset[0].idExpediente);
                // Asegurarse de que los documentos se procesen correctamente
                if (documentos && documentos.length > 0) {
                    const documentInsertErrors = yield this.insertarDocumentos(pool, idExpediente, documentos);
                    if (documentInsertErrors.length > 0) {
                        // Si hay errores al insertar los documentos, devuelve el error
                        res.status(400).json({ errors: documentInsertErrors });
                        return;
                    }
                }
                res.status(201).json({ message: 'Expediente y documentos creados correctamente' });
            }
            catch (error) {
                console.error('Error al crear el expediente:', error);
                res.status(500).json({ error: 'Error al crear el expediente' });
            }
        });
    }
    obtenerExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idExpediente } = req.params;
                if (!idExpediente) {
                    res.status(400).json({ error: 'Falta el ID del expediente' });
                    return;
                }
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request()
                    .input('idExpediente', idExpediente)
                    .query(`
                    SELECT e.*, d.idDocumento, d.documentoBase64, t.tipoDocumento 
                    FROM tblExpediente e
                    LEFT JOIN tblDocumentosExpediente d ON e.idExpediente = d.idExpedienteFK
                    LEFT JOIN tblTipoDocumento t ON d.idTipoDocumentoFK = t.idTipoDocumento
                    WHERE e.idExpediente = @idExpediente;
                `);
                if (result.recordset.length === 0) {
                    res.status(404).json({ error: 'Expediente no encontrado' });
                    return;
                }
                res.status(200).json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener el expediente:', error);
                res.status(500).json({ error: 'Error al obtener el expediente' });
            }
        });
    }
    eliminarExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idExpediente } = req.params;
                if (!idExpediente) {
                    res.status(400).json({ error: 'Falta el ID del expediente' });
                    return;
                }
                const pool = yield (0, db_1.connectDB)();
                yield pool.request().input('idExpediente', idExpediente).query(`
                DELETE FROM tblDocumentosExpediente WHERE idExpedienteFK = @idExpediente;
                DELETE FROM tblExpediente WHERE idExpediente = @idExpediente;
            `);
                res.status(200).json({ message: 'Expediente y documentos eliminados correctamente' });
            }
            catch (error) {
                console.error('Error al eliminar el expediente:', error);
                res.status(500).json({ error: 'Error al eliminar el expediente' });
            }
        });
    }
    actualizarExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idExpediente } = req.params;
                const { numeroExpediente, estado, descripcion, nombreExpediente, documentos } = req.body;
                if (!idExpediente) {
                    res.status(400).json({ error: 'Falta el ID del expediente' });
                    return;
                }
                const pool = yield (0, db_1.connectDB)();
                yield pool.request()
                    .input('idExpediente', idExpediente)
                    .input('numeroExpediente', numeroExpediente)
                    .input('estado', estado)
                    .input('descripcion', descripcion || '')
                    .input('nombreExpediente', nombreExpediente || 'Nombre por Defecto')
                    .query(`
                    UPDATE tblExpediente
                    SET numeroExpediente = @numeroExpediente, estado = @estado, descripcion = @descripcion, nombreExpediente = @nombreExpediente
                    WHERE idExpediente = @idExpediente;
                `);
                if (documentos && documentos.length > 0) {
                    const documentUpdateErrors = yield this.insertarDocumentos(pool, Number(idExpediente), documentos);
                    if (documentUpdateErrors.length > 0) {
                        res.status(400).json({ errors: documentUpdateErrors });
                        return;
                    }
                }
                res.status(200).json({ message: 'Expediente y documentos actualizados correctamente' });
            }
            catch (error) {
                console.error('Error al actualizar el expediente:', error);
                res.status(500).json({ error: 'Error al actualizar el expediente' });
            }
        });
    }
}
exports.expedienteController = new ExpedienteController();
