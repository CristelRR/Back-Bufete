import { connectDB } from "../config/db";

class CitaModel {
    async getCitas() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM tblCita');
        return result.recordset;
    }

    async crearCita(citaData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('motivo', citaData.motivo)
            .input('estado', citaData.estado)
            .input('idClienteFK', citaData.idClienteFK)
            .input('idAgendaFK', citaData.idAgendaFK)
            .query(`
                INSERT INTO tblCita (motivo, estado, idClienteFK, idAgendaFK) 
                VALUES (@motivo, @estado, @idClienteFK, @idAgendaFK)
            `);
        return result;
    }

    async updateCita(citaData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCita', citaData.idCita)
            .input('motivo', citaData.motivo)
            .input('estado', citaData.estado)
            .query(`
                UPDATE tblCita 
                SET 
                    motivo = @motivo,
                    estado = @estado 
                WHERE idCita = @idCita
            `);
        return result;
    }

    async deleteCita(idCita: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCita', idCita)
            .query('DELETE FROM tblCita WHERE idCita = @idCita');
        return result;
    }

    async findById(idCita: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCita', idCita)
            .query('SELECT * FROM tblCita WHERE idCita = @idCita');
        return result.recordset;
    }

    async getAbogadosPorServicio(idServicio:number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idServicio', idServicio)
            .query(`
                SELECT e.idEmpleado, e.nombreEmpleado, e.aPEmpleado, e.aMEmpleado
                FROM tblServicio s JOIN 
                     tblEspecialidad_Servicio es ON s.idServicio = es.idServicio JOIN 
                     tblEmpleado e ON es.idEspecialidad = e.idEspecialidadFK
                WHERE s.idServicio = @idServicio AND e.idRolFK = 2;  
            `);
        return result.recordset; 
    }

    async getHorariosDisponiblesPorAbogado(idAbogado: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idAbogado', idAbogado)
            .query(`
                SELECT a.fecha, a.horaInicio, a.horaFinal, a.estado, a.idAgenda
                FROM tblAgenda a
                WHERE 
                    a.idEmpleadoFK = @idAbogado  -- Filtra por el ID del abogado
                    AND a.estado = 'Disponible'  -- Solo horarios disponibles
                    AND a.fecha >= CAST(GETDATE() AS DATE)  -- Solo fechas futuras
                    AND NOT EXISTS (
                        SELECT 1
                        FROM tblCita c
                        WHERE 
                            c.idAgendaFK = a.idAgenda
                            AND c.estado = 'programada'  -- Solo citas programadas
                    )
                ORDER BY 
                    a.fecha, a.horaInicio;
            `);
        return result.recordset;
    }

    async crearCitaConTransaccion(citaData: any) {
        const pool = await connectDB();
        const transaction = pool.transaction(); // Crear la transacción
    
        try {
            await transaction.begin(); // Iniciar la transacción
    
            // Crear un "request" desde la transacción
            const request = transaction.request();
    
            // 1. Crear la cita en tblCita
            await request
                .input('motivo', citaData.motivo)
                .input('estado', citaData.estado)
                .input('idClienteFK', citaData.idClienteFK)
                .input('idAgendaFK', citaData.idAgendaFK)
                .query(`
                    INSERT INTO tblCita (motivo, estado, idClienteFK, idAgendaFK) 
                    VALUES (@motivo, @estado, @idClienteFK, @idAgendaFK)
                `);
    
            // 2. Actualizar el estado de la agenda en tblAgenda
            await request
                .input('idAgenda', citaData.idAgendaFK)
                .input('nuevoEstado', 'Programada') 
                .query(`
                    UPDATE tblAgenda 
                    SET estado = @nuevoEstado
                    WHERE idAgenda = @idAgenda
                `);
    
            // Confirmar la transacción si todo ha salido bien
            await transaction.commit();
            return { message: 'Cita creada y agenda actualizada correctamente' };
        } catch (error: any) { 
            // Revertir la transacción si ocurre un error
            await transaction.rollback();
            throw new Error('Error en la transacción: ' + error.message);
        }
    }
    
}

const citaModel = new CitaModel();
export default citaModel;
