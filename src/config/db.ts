import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Obtiene las variables de entorno
const server = process.env.DB_SERVER || 'LAPTOP-Q49U05AS';
const database = process.env.DB_DATABASE || 'LEXVARGAS_BD';
const port = Number(process.env.DB_PORT) || 1433;
const user = process.env.DB_USER || 'LuciaRR';
const password = process.env.DB_PASSWORD || 'linux';

// Verifica que las variables necesarias estén definidas
if (!server || !database || !user || !password) {
    throw new Error('DB_SERVER, DB_DATABASE, DB_USER y DB_PASSWORD deben estar definidos en el archivo .env');
}

// Configuración de conexión
const dbConfig = {
    server: server,
    database: database,
    port: port,
    user: user,
    password: password,
    options: {
        encrypt: false, // Cambia a true si estás en Azure
        trustServerCertificate: true,
    },
};

// Función para conectar a la base de datos
export const connectDB = async () => {
    try {
        const pool = await sql.connect(dbConfig); // Conéctate y devuelve el pool
        console.log('Conectado a la base de datos SQL Server');
        return pool; // Devuelve el pool para realizar consultas
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
};
