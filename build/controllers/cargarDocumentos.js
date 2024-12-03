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
exports.cargarDocumentosController = void 0;
const db_1 = require("../config/db");
class CargarDocumentosController {
    // Método para obtener los expedientes
    obtenerExpedientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                // Consulta para obtener los expedientes
                const result = yield pool.request().query(`
                SELECT idExpediente, idClienteFK, idEmpleadoFK, numeroExpediente, numeroExpediente
                FROM tblExpediente
                ORDER BY idExpediente DESC
            `);
                res.status(200).json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener expedientes:', error);
                res.status(500).json({ error: 'Hubo un error al obtener los expedientes.' });
            }
        });
    }
    // Método para obtener los tipos de documentos con su jerarquía
    obtenerTiposDeDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                // Obtenemos los tipos de documentos con su jerarquía (padre e hijo)
                const result = yield pool.request().query(`
                WITH TipoDocumentoJerarquico AS (
                    SELECT idTipoDocumento, tipoDocumento, idPadre
                    FROM tblTipoDocumento
                )
                SELECT td.idTipoDocumento, td.tipoDocumento, td.idPadre, tds.tipoDocumento AS tipoDocumentoPadre
                FROM TipoDocumentoJerarquico td
                LEFT JOIN TipoDocumentoJerarquico tds ON td.idPadre = tds.idTipoDocumento
                ORDER BY td.idPadre, td.tipoDocumento
            `);
                res.status(200).json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener tipos de documentos:', error);
                res.status(500).json({ error: 'Hubo un error al obtener los tipos de documentos.' });
            }
        });
    }
    // Método para insertar documentos
    insertarDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expedienteId = req.body.idExpedienteFK; // ID del expediente seleccionado
                const documentos = req.body.documentos; // Arreglo de documentos en formato JSON
                if (!expedienteId || !documentos || documentos.length === 0) {
                    return res.status(400).json({ error: 'ID de expediente y documentos son requeridos' });
                }
                const pool = yield (0, db_1.connectDB)();
                const errores = [];
                for (const doc of documentos) {
                    const { documentoBase64, idTipoDocumentoFK } = doc;
                    // Validaciones
                    if (!documentoBase64 || !idTipoDocumentoFK) {
                        errores.push('Cada documento debe incluir Base64 y un ID de tipo de documento.');
                        continue;
                    }
                    // Inserción en la base de datos
                    yield pool.request()
                        .input('idExpedienteFK', expedienteId)
                        .input('idTipoDocumentoFK', idTipoDocumentoFK)
                        .input('documentoBase64', documentoBase64)
                        .query(`
                        INSERT INTO tblDocumentosExpediente (idExpedienteFK, idTipoDocumentoFK, documentoBase64, fechaSubida, estado)
                        VALUES (@idExpedienteFK, @idTipoDocumentoFK, @documentoBase64, GETDATE(), 'Pendiente');
                    `);
                }
                if (errores.length > 0) {
                    return res.status(400).json({ errors: errores });
                }
                res.status(200).json({ message: 'Documentos subidos exitosamente.' });
            }
            catch (error) {
                console.error('Error al subir documentos:', error);
                res.status(500).json({ error: 'Hubo un error al procesar los documentos.' });
            }
        });
    }
}
exports.cargarDocumentosController = new CargarDocumentosController();
