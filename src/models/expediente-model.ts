import { connectDB } from "../config/db";

class ExpedienteNModel {
    async getExpedientes() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM tblExpediente');
        return result.recordset;
    }

    async crearExpediente(expedienteData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('numeroExpediente', expedienteData.numeroExpediente)
            .input('estado', expedienteData.estado)
            .input('descripcion', expedienteData.descripcion)
            .input('nombreExpediente', expedienteData.nombreExpediente)
            .input('idClienteFK', expedienteData.idClienteFK)
            .input('idEmpleadoFK', expedienteData.idEmpleadoFK)
            .query(`
                 INSERT INTO tblExpediente (numeroExpediente , estado , descripcion , nombreExpediente , idClienteFK , idEmpleadoFK)  
                VALUES (@numeroExpediente, @estado, @descripcion, @nombreExpediente, @idClienteFK, @idEmpleadoFK)
            `);
        return result;
    }

    async updateExpediente(expedienteData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idExpediente', expedienteData.idExpediente)
            .input('numeroExpediente', expedienteData.numeroExpediente)
            .input('estado', expedienteData.estado)
            .input('descripcion', expedienteData.descripcion)
            .input('nombreExpediente', expedienteData.nombreExpediente)
            .query(`
                UPDATE tblExpediente 
                SET 
                    numeroExpediente = @numeroExpediente,
                    estado = @estado,
                    descripcion = @descripcion,
                    nombreExpediente = @nombreExpediente
                WHERE idExpediente = @idExpediente
            `);
        return result;
    }

    async deleteExpediente(idExpediente: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idExpediente', idExpediente)
            .query('DELETE FROM tblExpediente WHERE idExpediente = @idExpediente');
        return result;
    }

    async findById(idExpediente: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idExpediente', idExpediente)
            .query(`
                SELECT 
                    E.idExpediente,
                    E.numeroExpediente,
                    E.estado,
                    E.descripcion,
                    E.nombreExpediente,
                    E.idClienteFK,
                    E.idEmpleadoFK,
                    C.nombreCliente,
                    C.aPCliente,
                    Em.nombreEmpleado,
                    Em.aPEmpleado
                FROM tblExpediente E
                JOIN tblCliente C ON E.idClienteFK = C.idCliente
                JOIN tblEmpleado Em ON E.idEmpleadoFK = Em.idEmpleado
                WHERE E.idExpediente = @idExpediente
            `);
        return result.recordset; // Devuelve el primer registro
    }

    // INFORMACION GENERAL POR NUMERO DE EXPEDIENTE
    async informacionGeneral(idExpediente: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idExpediente', idExpediente)
            .query(`
                SELECT 
                    idExpediente,
                    numeroExpediente,
                    descripcion,
                    estado,
                    nombreExpediente,
                    fechaApertura, 
                    anioExpediente
                FROM tblExpediente
                WHERE idExpediente = @idExpediente
            `);
        return result.recordset[0]; 
    }

    async getPartesPorExpediente(idExpediente: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idExpediente', idExpediente)
            .query(`
                SELECT 
                    'Demandante' AS tipoParte,
                    PD.idParteDemandante AS idParte,
                    PD.relacionCaso,
                    PD.nombreCompleto,
                    PD.identificacionOficial,
                    PD.fechaNacimiento,
                    PD.domicilio,
                    PD.telefono,
                    PD.correo,
                    PD.representanteLegalNombre,
                    PD.numeroLicencia AS representanteLegalLicencia,
                    PD.representanteLegalTelefono,
                    PD.representanteLegalCorreo
                FROM 
                    tblParteDemandante PD
                WHERE 
                    PD.idExpedienteFK = (SELECT idExpediente FROM tblExpediente WHERE idExpediente = @idExpediente)
    
                UNION ALL
    
                SELECT 
                    'Demandado' AS tipoParte,
                    PDM.idParteDemandada AS idParte,
                    PDM.relacionCaso,
                    PDM.nombreCompleto,
                    PDM.identificacionOficial,
                    PDM.fechaNacimiento,
                    PDM.domicilio,
                    PDM.telefono,
                    PDM.correo,
                    PDM.representanteLegalNombre,
                    PDM.representanteLegalCedula AS representanteLegalLicencia,
                    PDM.representanteLegalTelefono,
                    PDM.representanteLegalCorreo
                FROM 
                    tblParteDemandada PDM
                WHERE 
                    PDM.idExpedienteFK = (SELECT idExpediente FROM tblExpediente WHERE idExpediente = @idExpediente)
    
                UNION ALL
    
                SELECT 
                    'Tercero Relacionado' AS tipoParte,
                    TR.idTerceroRelacionado AS idParte,
                    TR.relacionCaso,
                    TR.nombreCompleto,
                    TR.identificacionOficial,
                    TR.fechaNacimiento,
                    TR.domicilio,
                    TR.telefono,
                    TR.correo,
                    NULL AS representanteLegalNombre,
                    NULL AS representanteLegalLicencia,
                    NULL AS representanteLegalTelefono,
                    NULL AS representanteLegalCorreo
                FROM 
                    tblTercerosRelacionados TR
                WHERE 
                    TR.idExpedienteFK = (SELECT idExpediente FROM tblExpediente WHERE idExpediente = @idExpediente);
            `);
        return result.recordset; // Devuelve los registros de las partes
    }
    
}

const expedienteNModel = new ExpedienteNModel();
export default expedienteNModel;
