import { connectDB } from "../config/db";

class ServicioModel {
    async getServicios() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM tblServicio');
        return result.recordset;
    }

    async crearServicio(servicioData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('nombreServicio', servicioData.nombreServicio)
            .input('descripcion', servicioData.descripcion)
            .input('costo', servicioData.costo)
            .query(`
                INSERT INTO tblServicio (nombreServicio, descripcion, costo) 
                VALUES (@nombreServicio, @descripcion, @costo)
            `);
        return result;
    }

    async updateServicio(servicioData: any) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idServicio', servicioData.idServicio)
            .input('nombreServicio', servicioData.nombreServicio)
            .input('descripcion', servicioData.descripcion)
            .input('costo', servicioData.costo)
            .query(`
                UPDATE tblServicio 
                SET 
                    nombreServicio = @nombreServicio,
                    descripcion = @descripcion,
                    costo = @costo 
                WHERE idServicio = @idServicio
            `);
        return result;
    }

    async deleteServicio(idServicio: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idServicio', idServicio)
            .query('DELETE FROM tblServicio WHERE idServicio = @idServicio');
        return result;
    }

    async findById(idServicio: number) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('idServicio', idServicio)
            .query('SELECT * FROM tblServicio WHERE idServicio = @idServicio');
        return result.recordset;
    }
}

const servicioModel = new ServicioModel();
export default servicioModel;
