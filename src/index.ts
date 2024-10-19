import express, { Application } from 'express';
import morgan from 'morgan';

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(express.json()); // Para entender los cuerpos de las peticiones JSON
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan('dev'));
  }

  routes(): void {
    this.app.get('/', (req, res) => {
      res.send('¡Hola, mundo!');
    });
  }

  start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Servidor corriendo en el puerto', this.app.get('port'));
    });
  }
}

const server = new Server();
server.start();
