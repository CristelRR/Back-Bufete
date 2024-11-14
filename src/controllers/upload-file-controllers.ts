import { Request, Response } from "express";
import { connectDB } from "../config/db";
import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

class ExpedienteController {

    async obtenerExpedienteCompleto(req: Request, res: Response): Promise<void> {
        try {
            const { idExpediente, year, numeroExpediente, nombreCliente } = req.query;
    
            const pool = await connectDB();
    
            // Consulta SQL para el expediente con condiciones variables
            let expedienteQuery = `SELECT e.*, c.nombre AS nombreCliente
                                   FROM tblExpediente e
                                   LEFT JOIN tblCliente c ON e.idClienteFK = c.idCliente
                                   WHERE 1 = 1`; // Iniciamos con una condición siempre verdadera
    
            // Agregamos condiciones en función de los parámetros recibidos
            if (idExpediente) {
                expedienteQuery += ` AND e.idExpediente = @idExpediente`;
            }
            if (year) {
                expedienteQuery += ` AND YEAR(e.fechaCreacion) = @year`;
            }
            if (numeroExpediente) {
                expedienteQuery += ` AND e.numeroExpediente = @numeroExpediente`;
            }
            if (nombreCliente) {
                expedienteQuery += ` AND c.nombre LIKE '%' + @nombreCliente + '%'`;
            }
    
            // Preparar la consulta y añadir parámetros de manera dinámica
            const expedienteRequest = pool.request();
            if (idExpediente) expedienteRequest.input('idExpediente', idExpediente);
            if (year) expedienteRequest.input('year', year);
            if (numeroExpediente) expedienteRequest.input('numeroExpediente', numeroExpediente);
            if (nombreCliente) expedienteRequest.input('nombreCliente', nombreCliente);
    
            const expedienteResult = await expedienteRequest.query(expedienteQuery);
    
            if (expedienteResult.recordset.length === 0) {
                res.status(404).json({ error: 'Expediente no encontrado' });
                return;
            }
    
            const expediente = expedienteResult.recordset[0];
    
            // Consulta para los documentos relacionados con el expediente
            const documentosResult = await pool.request()
                .input('idExpediente', expediente.idExpediente)
                .query(`
                    SELECT d.idDocumento, d.documentoBase64, t.tipoDocumento
                    FROM tblDocumentosExpediente d
                    LEFT JOIN tblTipoDocumento t ON d.idTipoDocumentoFK = t.idTipoDocumento
                    WHERE d.idExpedienteFK = @idExpediente;
                `);
    
            // Respuesta con los datos del expediente y sus documentos
            res.status(200).json({
                expediente,
                documentos: documentosResult.recordset
            });
        } catch (error) {
            console.error('Error al obtener el expediente completo:', error);
            res.status(500).json({ error: 'Error al obtener el expediente' });
        }
    }
    
    

    async obtenerDocumento(req: Request, res: Response): Promise<void> {
        try {
            const { idDocumento } = req.params;

            if (!idDocumento) {
                res.status(400).json({ error: 'Falta el ID del documento' });
                return;
            }

            const pool = await connectDB();
            const result = await pool.request()
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
        } catch (error) {
            console.error('Error al obtener el documento:', error);
            res.status(500).json({ error: 'Error al obtener el documento' });
        }
    }

    obtenerExpedientes(req: Request, res: Response): void {
    connectDB()
        .then(pool => {
            const query = `
                SELECT 
                    e.idExpediente,
                    e.numeroExpediente,
                    e.fechaCreacion,
                    e.estado,
                    e.descripcion,
                    e.nombreExpediente,
                    d.documentoBase64
                FROM 
                    tblExpediente e
                LEFT JOIN 
                    tblDocumentosExpediente d ON e.idExpediente = d.idExpedienteFK;
            `;
            return pool.request().query(query);
        })
        .then(result => {
            // Aquí devolvemos todos los expedientes con el nombre del cliente y los documentos
            res.status(200).json(result.recordset);
        })
        .catch(error => {
            console.error('Error al obtener los expedientes:', error);
            res.status(500).json({ error: 'Error al obtener los expedientes' });
        });
}


    async crearExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { numeroExpediente, estado, descripcion, nombreExpediente, idClienteFK, idEmpleadoFK, documentos } = req.body;
    
            if (!numeroExpediente || !estado || !idClienteFK) {
                res.status(400).json({ error: 'Faltan datos necesarios para crear el expediente' });
                return;
            }
    
            const pool = await connectDB();
            const result = await pool.request()
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
    
            const idExpediente: number = Number(result.recordset[0].idExpediente);
    
            // Asegurarse de que los documentos se procesen correctamente
            if (documentos && documentos.length > 0) {
                const documentInsertErrors = await this.insertarDocumentos(pool, idExpediente, documentos);
                
                if (documentInsertErrors.length > 0) {
                    // Si hay errores al insertar los documentos, devuelve el error
                    res.status(400).json({ errors: documentInsertErrors });
                    return;
                }
            }
    
            res.status(201).json({ message: 'Expediente y documentos creados correctamente' });
        } catch (error) {
            console.error('Error al crear el expediente:', error);
            res.status(500).json({ error: 'Error al crear el expediente' });
        }
    }

    private insertarDocumentos = async (pool: any, idExpediente: number, documentos: any[]): Promise<string[]> => {
        const errors: string[] = [];
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
                await pool.request()
                    .input('tipoDocumento', tipoDocumento)
                    .input('documentoBase64', fileBuffer)
                    .input('idExpedienteFK', idExpediente)
                    .query(`
                        INSERT INTO tblDocumentosExpediente (idExpedienteFK, idTipoDocumentoFK, documentoBase64)
                        VALUES (@idExpedienteFK, (SELECT idTipoDocumento FROM tblTipoDocumento WHERE tipoDocumento = @tipoDocumento), @documentoBase64);
                    `);
            } catch (error) {
                console.error(`Error al insertar documento ${tipoDocumento}:`, error);
                errors.push(`Error al insertar documento de tipo ${tipoDocumento}`);
            }
        }
        return errors;
    }

    async obtenerExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { idExpediente } = req.params;

            if (!idExpediente) {
                res.status(400).json({ error: 'Falta el ID del expediente' });
                return
            }

            const pool = await connectDB();
            const result = await pool.request()
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
                return
            }

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error al obtener el expediente:', error);
            res.status(500).json({ error: 'Error al obtener el expediente' });
        }
    }

    async eliminarExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { idExpediente } = req.params;

            if (!idExpediente) {
                res.status(400).json({ error: 'Falta el ID del expediente' });
                return
            }

            const pool = await connectDB();
            await pool.request().input('idExpediente', idExpediente).query(`
                DELETE FROM tblDocumentosExpediente WHERE idExpedienteFK = @idExpediente;
                DELETE FROM tblExpediente WHERE idExpediente = @idExpediente;
            `);

            res.status(200).json({ message: 'Expediente y documentos eliminados correctamente' });
        } catch (error) {
            console.error('Error al eliminar el expediente:', error);
            res.status(500).json({ error: 'Error al eliminar el expediente' });
        }
    }

    async actualizarExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { idExpediente } = req.params;
            const { numeroExpediente, estado, descripcion, nombreExpediente, documentos } = req.body;

            if (!idExpediente) {
                res.status(400).json({ error: 'Falta el ID del expediente' });
                return
            }

            const pool = await connectDB();
            await pool.request()
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
                const documentUpdateErrors = await this.insertarDocumentos(pool, Number(idExpediente), documentos);
                if (documentUpdateErrors.length > 0) {
                    res.status(400).json({ errors: documentUpdateErrors });
                    return
                }
            }

            res.status(200).json({ message: 'Expediente y documentos actualizados correctamente' });
        } catch (error) {
            console.error('Error al actualizar el expediente:', error);
            res.status(500).json({ error: 'Error al actualizar el expediente' });
        }
    }
}

export const expedienteController = new ExpedienteController();
