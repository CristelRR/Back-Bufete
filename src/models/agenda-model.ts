import { connectDB } from "../config/db";

class AgendaModel {
    async getAgendas() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM tblAgenda');
        return result.recordset;
    }

    async crearAgenda(agendaData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('fechaIngreso', agendaData.fechaIngreso)
            .input('numeroLicencia', agendaData.numeroLicencia)
            .input('correo', agendaData.correo)
            .input('nombreAgenda', agendaData.nombreAgenda)
            .input('aPAgenda', agendaData.aPAgenda)
            .input('aMAgenda', agendaData.aMAgenda)
            .input('telefono', agendaData.telefono)
            .input('pass', agendaData.pass)
            .input('idRolFK', agendaData.idRolFK)
            .input('idEspecialidadFK', agendaData.idEspecialidadFK)
            .query(`
                INSERT INTO tblAgenda 
                (fechaIngreso, numeroLicencia, correo, nombreAgenda, aPAgenda, aMAgenda, telefono, pass, idRolFK, idEspecialidadFK) 
                VALUES (@fechaIngreso, @numeroLicencia, @correo, @nombreAgenda, @aPAgenda, @aMAgenda, @telefono, @pass, @idRolFK, @idEspecialidadFK)
            `);
        return result;
    }

    async updateAgenda(agendaData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idAgenda', agendaData.idAgenda)
            .input('fechaIngreso', agendaData.fechaIngreso)
            .input('numeroLicencia', agendaData.numeroLicencia)
            .input('correo', agendaData.correo)
            .input('nombreAgenda', agendaData.nombreAgenda)
            .input('aPAgenda', agendaData.aPAgenda)
            .input('aMAgenda', agendaData.aMAgenda)
            .input('telefono', agendaData.telefono)
            .input('pass', agendaData.pass)
            .input('idRolFK', agendaData.idRolFK)
            .input('idEspecialidadFK', agendaData.idEspecialidadFK)
            .query(`
                UPDATE tblAgenda 
                SET 
                    fechaIngreso = @fechaIngreso,
                    numeroLicencia = @numeroLicencia,
                    correo = @correo,
                    nombreAgenda = @nombreAgenda,
                    aPAgenda = @aPAgenda,
                    aMAgenda = @aMAgenda,
                    telefono = @telefono,
                    pass = @pass,
                    idRolFK = @idRolFK,
                    idEspecialidadFK = @idEspecialidadFK 
                WHERE idAgenda = @idAgenda
            `);
        return result;
    }

    async deleteAgenda(idAgenda: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idAgenda', idAgenda)
            .query('DELETE FROM tblAgenda WHERE idAgenda = @idAgenda');
        return result;
    }

    async findById(idAgenda: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idAgenda', idAgenda)
            .query('SELECT * FROM tblAgenda WHERE idAgenda = @idAgenda');
        return result.recordset;
    }
}

const agendaModelo = new AgendaModel();
export default agendaModelo;
