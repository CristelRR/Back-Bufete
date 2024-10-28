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
}

const citaModel = new CitaModel();
export default citaModel;
