import { connectDB } from "../config/db";

class ClienteModel {
    async getClientes() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM tblCliente');
        return result.recordset;
    }

    async crearCliente(clienteData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCliente', clienteData.idCliente)
            .input('nombreCliente', clienteData.nombreCliente)
            .input('aPCliente', clienteData.aPCliente)
            .input('aMCliente', clienteData.aMCliente)
            .input('direccion', clienteData.direccion)
            .input('correo', clienteData.correo)
            .input('telefono', clienteData.telefono)
            .input('pass', clienteData.pass)
            .input('idRolFK', clienteData.idRolFK)
            .query(`
                INSERT INTO tblCliente 
                (idCliente, nombreCliente, aPCliente, aMCliente, direccion, correo, telefono, pass, idRolFK) 
                VALUES (@idCliente, @nombreCliente, @aPCliente, @aMCliente, @direccion, @correo, @telefono, @pass, @idRolFK)
            `);
        return result;
    }

    async updateCliente(clienteData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCliente', clienteData.idCliente)
            .input('nombreCliente', clienteData.nombreCliente)
            .input('aPCliente', clienteData.aPCliente)
            .input('aMCliente', clienteData.aMCliente)
            .input('direccion', clienteData.direccion)
            .input('correo', clienteData.correo)
            .input('telefono', clienteData.telefono)
            .input('pass', clienteData.pass)
            .input('idRolFK', clienteData.idRolFK)
            .query(`
                UPDATE tblCliente 
                SET 
                    nombreCliente = @nombreCliente,
                    aPCliente = @aPCliente,
                    aMCliente = @aMCliente,
                    direccion = @direccion,
                    correo = @correo,
                    telefono = @telefono,
                    pass = @pass,
                    idRolFK = @idRolFK 
                WHERE idCliente = @idCliente
            `);
        return result;
    }

    async deleteCliente(idCliente: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCliente', idCliente)
            .query('DELETE FROM tblCliente WHERE idCliente = @idCliente');
        return result;
    }

    async findById(idCliente: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idCliente', idCliente)
            .query('SELECT * FROM tblCliente WHERE idCliente = @idCliente');
        return result.recordset;
    }
}

const clienteModelo = new ClienteModel();
export default clienteModelo;
