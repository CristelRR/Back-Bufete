"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db"); // Asegúrate de que esta ruta sea correcta
const rol_routes_1 = __importDefault(require("./routes/rol-routes")); // Ajusta la ruta según la ubicación
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.connectToDatabase(); // Conectar a la base de datos
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, morgan_1.default)('dev'));
    }
    connectToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_1.connectDB)();
                console.log('Conexión a la base de datos establecida con éxito');
            }
            catch (error) {
                console.error('Error al conectar a la base de datos:', error.message);
                process.exit(1);
            }
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.send('¡Hola, mundo!');
        });
        this.app.use('/roles', rol_routes_1.default); // Aquí es donde se usa el router
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor corriendo en el puerto', this.app.get('port'));
        });
    }
}
// Inicializa el servidor
const server = new Server();
server.start();
