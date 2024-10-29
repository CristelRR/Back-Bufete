import { connectDB } from "../config/db";

class UsuarioModel {
    async getUsuarios() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM tblUsuario');
        return result.recordset;
    }

    async crearUsuario(usuarioData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('nombreUsuario', usuarioData.nombreUsuario)
            .input('pass', usuarioData.pass)
            .input('estado', usuarioData.estado)
            .input('idRolFK', usuarioData.idRolFK)
            .query(`
                INSERT INTO tblUsuario 
                (nombreUsuario, pass, estado, idRolFK) 
                VALUES (@nombreUsuario, @pass, @estado, @idRolFK)
            `);
        return result;
    }

    async updateUsuario(usuarioData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idUsuario', usuarioData.idUsuario)
            .input('nombreUsuario', usuarioData.nombreUsuario)
            .input('pass', usuarioData.pass)
            .input('estado', usuarioData.estado)
            .input('idRolFK', usuarioData.idRolFK)
            .query(`
                UPDATE tblUsuario 
                SET 
                    nombreUsuario = @nombreUsuario,
                    pass = @pass,
                    estado = @estado,
                    idRolFK = @idRolFK 
                WHERE idUsuario = @idUsuario
            `);
        return result;
    }

    async deleteUsuario(idUsuario: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idUsuario', idUsuario)
            .query('DELETE FROM tblUsuario WHERE idUsuario = @idUsuario');
        return result;
    }

    async findById(idUsuario: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idUsuario', idUsuario)
            .query('SELECT * FROM tblUsuario WHERE idUsuario = @idUsuario');
        return result.recordset;
    }
}

const usuarioModel = new UsuarioModel();
export default usuarioModel;
