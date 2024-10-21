import express, { Application } from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db'; // Asegúrate de que esta ruta sea correcta
import rolRoutes from './routes/rol-routes'; // Ajusta la ruta según la ubicación

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.connectToDatabase(); // Conectar a la base de datos
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morgan('dev'));
    }

    async connectToDatabase(): Promise<void> {
        try {
            await connectDB();
            console.log('Conexión a la base de datos establecida con éxito');
        } catch (error: any) {
            console.error('Error al conectar a la base de datos:', error.message);
            process.exit(1);
        }
    }

    routes(): void {
        this.app.get('/', (req, res) => {
            res.send('¡Hola, mundo!');
        });
        this.app.use('/roles', rolRoutes); // Aquí es donde se usa el router
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor corriendo en el puerto', this.app.get('port'));
        });
    }
}

// Inicializa el servidor
const server = new Server();
server.start();
