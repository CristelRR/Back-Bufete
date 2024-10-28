import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './config/db'; 
import rolRoutes from './routes/rol-route'; 
import empleadoRoutes from './routes/empleado-route';
import citaRoutes from './routes/cita-route';
import clienteRoutes from './routes/cliente-route';
import usuarioRoutes from './routes/usuario-route';
import servicioRoutes  from './routes/servicio-route';
import especialidadRoutes  from './routes/especialidad-route';
import pagoRoutes from './routes/gestionPago-route';
import agendaRoutes from './routes/agenda-route';
import registerRoutes from './routes/register-routes';
import loginRoutes from './routes/login-routes';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.connectToDatabase();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(cors({ origin: 'http://localhost:4200' })); //Habilitado para cors
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morgan('dev'));
        this.app.use(cors());
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
        this.app.use('/roles', rolRoutes);
        this.app.use('/empleados', empleadoRoutes);
        this.app.use('/register', registerRoutes);
        this.app.use('/login', loginRoutes);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor corriendo en el puerto', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
