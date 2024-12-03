import { Request, Response } from "express";
import { connectDB } from "../config/db";


class CargarDocumentosController {

    // Método para obtener los expedientes
    async obtenerExpedientes(req: Request, res: Response) {
        try {
            const pool = await connectDB();
            
            // Consulta para obtener los expedientes
            const result = await pool.request().query(`
                SELECT idExpediente, idClienteFK, idEmpleadoFK, numeroExpediente, nombreExpediente
                FROM tblExpediente
                ORDER BY idExpediente DESC
            `);

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error al obtener expedientes:', error);
            res.status(500).json({ error: 'Hubo un error al obtener los expedientes.' });
        }
    }

    // Método para obtener los tipos de documentos con su jerarquía
    async obtenerTiposDeDocumentos(req: Request, res: Response) {
        try {
            const pool = await connectDB();
    
            // Obtenemos los tipos de documentos con su jerarquía (padre e hijo)
            const result = await pool.request().query(`
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
        } catch (error) {
            console.error('Error al obtener tipos de documentos:', error);
            res.status(500).json({ error: 'Hubo un error al obtener los tipos de documentos.' });
        }
    }

    // Método para insertar documentos
    async insertarDocumentos(req: Request, res: Response) {
        try {
            const expedienteId = req.body.idExpedienteFK;  // ID del expediente seleccionado
            const documentos = req.body.documentos;  // Arreglo de documentos en formato JSON
    
            if (!expedienteId || !documentos || documentos.length === 0) {
                return res.status(400).json({ error: 'ID de expediente y documentos son requeridos' });
            }
    
            const pool = await connectDB();
            const errores = [];
    
            for (const doc of documentos) {
                const { documentoBase64, idTipoDocumentoFK } = doc;
    
                // Validaciones
                if (!documentoBase64 || !idTipoDocumentoFK) {
                    errores.push('Cada documento debe incluir Base64 y un ID de tipo de documento.');
                    continue;
                }
    
                // Inserción en la base de datos
                await pool.request()
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
        } catch (error) {
            console.error('Error al subir documentos:', error);
            res.status(500).json({ error: 'Hubo un error al procesar los documentos.' });
        }
    }
}

export const cargarDocumentosController = new CargarDocumentosController();
