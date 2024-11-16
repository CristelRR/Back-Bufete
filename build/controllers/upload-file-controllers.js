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
    obtenerExpedienteCompleto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idExpediente, year, numeroExpediente, nombreCliente } = req.query;
                const pool = yield (0, db_1.connectDB)();
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
                if (idExpediente)
                    expedienteRequest.input('idExpediente', idExpediente);
                if (year)
                    expedienteRequest.input('year', year);
                if (numeroExpediente)
                    expedienteRequest.input('numeroExpediente', numeroExpediente);
                if (nombreCliente)
                    expedienteRequest.input('nombreCliente', nombreCliente);
                const expedienteResult = yield expedienteRequest.query(expedienteQuery);
                if (expedienteResult.recordset.length === 0) {
                    res.status(404).json({ error: 'Expediente no encontrado' });
                    return;
                }
                const expediente = expedienteResult.recordset[0];
                // Consulta para los documentos relacionados con el expediente
                const documentosResult = yield pool.request()
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
            }
            catch (error) {
                console.error('Error al obtener el expediente completo:', error);
                res.status(500).json({ error: 'Error al obtener el expediente' });
            }
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
        (0, db_1.connectDB)()
            .then(pool => {
            const query = `
                    SELECT 
                        e.idExpediente,
                        e.numeroExpediente,
                        e.fechaCreacion,
                        e.estado,
                        e.descripcion,
                        e.nombreExpediente,
                        d.documentoBase64,
                        d.fechaSubida,
                        d.estado AS estadoDocumento,
                        d.idTipoDocumentoFK,
                        td.tipoDocumento
                    FROM 
                        tblExpediente e
                    LEFT JOIN 
                        tblDocumentosExpediente d ON e.idExpediente = d.idExpedienteFK
                    LEFT JOIN
                        tblTipoDocumento td ON d.idTipoDocumentoFK = td.idTipoDocumento;
                `;
            return pool.request().query(query);
        })
            .then(result => {
            // Agrupamos los documentos por expediente
            const expedientesMap = new Map();
            result.recordset.forEach((row) => {
                const expedienteId = row.idExpediente;
                // Verificamos si el expediente ya existe en el mapa
                if (!expedientesMap.has(expedienteId)) {
                    expedientesMap.set(expedienteId, {
                        idExpediente: row.idExpediente,
                        numeroExpediente: row.numeroExpediente,
                        fechaCreacion: row.fechaCreacion,
                        estado: row.estado,
                        descripcion: row.descripcion,
                        nombreExpediente: row.nombreExpediente,
                        documentos: []
                    });
                }
                // Agregamos el documento si existe en el registro
                if (row.documentoBase64) {
                    expedientesMap.get(expedienteId).documentos.push({
                        documentoBase64: row.documentoBase64,
                        fechaSubida: row.fechaSubida,
                        estadoDocumento: row.estadoDocumento,
                        tipoDocumento: row.tipoDocumento
                    });
                }
            });
            // Convertimos el mapa en un arreglo de expedientes
            const expedientes = Array.from(expedientesMap.values());
            res.status(200).json(expedientes);
        })
            .catch(error => {
            console.error('Error al obtener los expedientes:', error);
            res.status(500).json({ error: 'Error al obtener los expedientes' });
        });
    }
    insertarDocumentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expedienteId = req.body.idExpedienteFK;
                const tipoDocumento = req.body.idTipoDocumentoFK;
                const documentos = req.files; // Array de archivos
                if (!expedienteId || !tipoDocumento || documentos.length === 0) {
                    return res.status(400).json({ error: 'Expediente ID, tipo de documento y archivos son requeridos' });
                }
                const errores = [];
                for (const documento of documentos) {
                    const { path: filePath, mimetype, size } = documento;
                    // Validaciones
                    if (size > 10 * 1024 * 1024) { // Limitar tamaño de archivo a 10MB
                        errores.push(`El archivo ${documento.originalname} es demasiado grande.`);
                        continue;
                    }
                    if (!['application/pdf'].includes(mimetype)) {
                        errores.push(`El archivo ${documento.originalname} no es un PDF válido.`);
                        continue;
                    }
                    // Lee el archivo como Base64
                    const documentoBase64 = fs_1.default.readFileSync(filePath, { encoding: 'base64' });
                    // Inserción en la base de datos
                    yield expedienteService.insertarDocumento(expedienteId, documentoBase64, documento.originalname);
                    // Elimina el archivo después de cargarlo
                    fs_1.default.unlinkSync(filePath);
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
    // Método para crear expediente
    crearExpediente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { numeroExpediente, estado, descripcion, nombreExpediente, idClienteFK, idEmpleadoFK } = req.body;
                if (!numeroExpediente || !estado || !idClienteFK) {
                    return res.status(400).json({ error: 'Faltan campos obligatorios' });
                }
                const pool = yield (0, db_1.connectDB)();
                const transaction = pool.transaction();
                yield transaction.begin();
                try {
                    // Crear el expediente
                    const result = yield transaction.request()
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
                    // Obtener el idExpediente recién creado
                    const idExpediente = Number(result.recordset[0].idExpediente);
                    yield transaction.commit();
                    return res.status(200).json({ message: 'Expediente creado correctamente', idExpediente });
                }
                catch (error) {
                    console.error('Error al insertar expediente:', error);
                    yield transaction.rollback();
                    return res.status(500).json({ error: 'Error al insertar el expediente' });
                }
            }
            catch (error) {
                console.error('Error al conectar a la base de datos:', error);
                return res.status(500).json({ error: 'Error al conectar a la base de datos' });
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
            var _a;
            try {
                const { idExpediente } = req.params;
                const responsableEliminacion = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.nombre) || 'Usuario desconocido'; // Ejemplo: Obtener el nombre del usuario actual
                if (!idExpediente) {
                    res.status(400).json({ error: 'Falta el ID del expediente' });
                    return;
                }
                const pool = yield (0, db_1.connectDB)();
                // Iniciar una transacción
                const transaction = pool.transaction();
                yield transaction.begin();
                try {
                    // Obtener los datos del expediente
                    const expedienteResult = yield transaction.request()
                        .input('idExpediente', idExpediente)
                        .query(`
                        SELECT * FROM tblExpediente WHERE idExpediente = @idExpediente
                    `);
                    if (expedienteResult.recordset.length === 0) {
                        res.status(404).json({ error: 'Expediente no encontrado' });
                        return;
                    }
                    const expediente = expedienteResult.recordset[0];
                    // Insertar en tblHistorialExpediente
                    const historialExpedienteResult = yield transaction.request()
                        .input('idExpedienteOriginal', expediente.idExpediente)
                        .input('numeroExpediente', expediente.numeroExpediente)
                        .input('nombreExpediente', expediente.nombreExpediente)
                        .input('descripcion', expediente.descripcion)
                        .input('estado', expediente.estado)
                        .input('fechaCreacion', expediente.fechaCreacion)
                        .input('responsableEliminacion', responsableEliminacion)
                        .input('idClienteFK', expediente.idClienteFK)
                        .input('idEmpleadoFK', expediente.idEmpleadoFK)
                        .query(`
                        INSERT INTO tblHistorialExpediente (
                            idExpedienteOriginal, numeroExpediente, nombreExpediente,
                            descripcion, estado, fechaCreacion, responsableEliminacion,
                            idClienteFK, idEmpleadoFK
                        ) OUTPUT INSERTED.idHistorialExpediente
                        VALUES (
                            @idExpedienteOriginal, @numeroExpediente, @nombreExpediente,
                            @descripcion, @estado, @fechaCreacion, @responsableEliminacion,
                            @idClienteFK, @idEmpleadoFK
                        )
                    `);
                    const idHistorialExpediente = historialExpedienteResult.recordset[0].idHistorialExpediente;
                    // Obtener los documentos del expediente
                    const documentosResult = yield transaction.request()
                        .input('idExpediente', idExpediente)
                        .query(`
                        SELECT * FROM tblDocumentosExpediente WHERE idExpedienteFK = @idExpediente
                    `);
                    const documentos = documentosResult.recordset;
                    // Insertar los documentos en tblHistorialDocumentosExpediente
                    for (const documento of documentos) {
                        yield transaction.request()
                            .input('idExpedienteHistorialFK', idHistorialExpediente)
                            .input('idTipoDocumentoFK', documento.idTipoDocumentoFK)
                            .input('fechaSubida', documento.fechaSubida)
                            .input('estado', documento.estado)
                            .input('documentoBase64', documento.documentoBase64)
                            .query(`
                            INSERT INTO tblHistorialDocumentosExpediente (
                                idExpedienteHistorialFK, idTipoDocumentoFK, fechaSubida,
                                estado, documentoBase64
                            ) VALUES (
                                @idExpedienteHistorialFK, @idTipoDocumentoFK, @fechaSubida,
                                @estado, @documentoBase64
                            )
                        `);
                    }
                    // Eliminar los documentos del expediente original
                    yield transaction.request()
                        .input('idExpediente', idExpediente)
                        .query(`
                        DELETE FROM tblDocumentosExpediente WHERE idExpedienteFK = @idExpediente;
                    `);
                    // Eliminar el expediente original
                    yield transaction.request()
                        .input('idExpediente', idExpediente)
                        .query(`
                        DELETE FROM tblExpediente WHERE idExpediente = @idExpediente;
                    `);
                    // Confirmar la transacción
                    yield transaction.commit();
                    res.status(200).json({ message: 'Expediente y documentos movidos al historial correctamente' });
                }
                catch (innerError) {
                    yield transaction.rollback();
                    console.error('Error durante la transacción:', innerError);
                    res.status(500).json({ error: 'Error al mover el expediente al historial' });
                }
            }
            catch (error) {
                console.error('Error al eliminar el expediente:', error);
                res.status(500).json({ error: 'Error al eliminar el expediente' });
            }
        });
    }
    obtenerHistorialExpedientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, db_1.connectDB)()
                .then(pool => {
                const query = `
                    SELECT 
                        he.idExpedienteOriginal,
                        he.fechaEliminacion,
                        he.responsableEliminacion,
                        he.numeroExpediente,
                        he.fechaCreacion,
                        he.estado AS estadoExpediente,
                        he.descripcion,
                        he.nombreExpediente,
                        hd.documentoBase64,
                        hd.fechaSubida,
                        hd.estado AS estadoDocumento,
                        hd.idTipoDocumentoFK,
                        td.tipoDocumento
                    FROM 
                        tblHistorialExpediente he
                    LEFT JOIN 
                        tblHistorialDocumentosExpediente hd 
                        ON he.idHistorialExpediente = hd.idExpedienteHistorialFK
                    LEFT JOIN
                        tblTipoDocumento td 
                        ON hd.idTipoDocumentoFK = td.idTipoDocumento;
                `;
                return pool.request().query(query);
            })
                .then(result => {
                // Agrupamos los documentos por expediente
                const expedientesMap = new Map();
                result.recordset.forEach((row) => {
                    const expedienteId = row.idExpedienteOriginal; // Cambiado a `idExpedienteOriginal` para que coincida con la consulta
                    // Verificamos si el expediente ya existe en el mapa
                    if (!expedientesMap.has(expedienteId)) {
                        expedientesMap.set(expedienteId, {
                            idExpedienteOriginal: expedienteId,
                            numeroExpediente: row.numeroExpediente,
                            fechaCreacion: row.fechaCreacion,
                            estadoExpediente: row.estadoExpediente,
                            descripcion: row.descripcion,
                            fechaEliminacion: row.fechaEliminacion,
                            responsableEliminacion: row.responsableEliminacion,
                            nombreExpediente: row.nombreExpediente,
                            documentos: []
                        });
                    }
                    // Agregamos el documento si existe en el registro
                    if (row.documentoBase64) {
                        expedientesMap.get(expedienteId).documentos.push({
                            documentoBase64: row.documentoBase64,
                            fechaSubida: row.fechaSubida,
                            estadoDocumento: row.estadoDocumento,
                            idTipoDocumentoFK: row.idTipoDocumentoFK,
                            tipoDocumento: row.tipoDocumento
                        });
                    }
                });
                // Convertimos el mapa en un arreglo de expedientes
                const expedientes = Array.from(expedientesMap.values());
                res.status(200).json(expedientes);
            })
                .catch(error => {
                console.error('Error al obtener el historial de los expedientes:', error);
                res.status(500).json({ error: 'Error al obtener el historial de los expedientes' });
            });
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
