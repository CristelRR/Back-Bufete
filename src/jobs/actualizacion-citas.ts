import cron from 'node-cron';
import { connectDB } from '../config/db'; 
import moment from 'moment';

async function marcarCitasCompletadas() {
    const pool = await connectDB();

    try {
        const result = await pool.request().query(`
            UPDATE tblCita 
            SET estado = 'completada'
            WHERE estado = 'programada'
              AND (
                  (fechaCita < CAST(GETDATE() AS DATE)) OR 
                  (fechaCita = CAST(GETDATE() AS DATE) AND horaCita <= CAST(GETDATE() AS TIME))
              )
        `);
        console.log(`Citas completadas automáticamente: ${result.rowsAffected}`);
    } catch (error) {
        console.error("Error al marcar citas como completadas:", error);
    }
}

// Programa la tarea para ejecutarse cada hora
cron.schedule('0 * * * *', () => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Ejecutando tarea para actualizar citas completadas...`);
    marcarCitasCompletadas();
});
