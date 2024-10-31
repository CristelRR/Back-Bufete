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
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const rol_route_1 = __importDefault(require("./routes/rol-route"));
const empleado_route_1 = __importDefault(require("./routes/empleado-route"));
const cita_route_1 = __importDefault(require("./routes/cita-route"));
const cliente_route_1 = __importDefault(require("./routes/cliente-route"));
const usuario_route_1 = __importDefault(require("./routes/usuario-route"));
const servicio_route_1 = __importDefault(require("./routes/servicio-route"));
const especialidad_route_1 = __importDefault(require("./routes/especialidad-route"));
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
        this.app.use((0, cors_1.default)());
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
        this.app.use('/roles', rol_route_1.default);
        this.app.use('/empleados', empleado_route_1.default);
        this.app.use('/clientes', cliente_route_1.default);
        this.app.use('/citas', cita_route_1.default);
        this.app.use('/usuarios', usuario_route_1.default);
        this.app.use('/servicios', servicio_route_1.default);
        this.app.use('/especialidades', especialidad_route_1.default);
        this.app.use('/agendas', especialidad_route_1.default);
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
