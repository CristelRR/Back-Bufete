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
exports.loginController = void 0;
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mssql_1 = __importDefault(require("mssql"));
class LoginController {
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombreUsuario, pass } = req.body;
            if (!nombreUsuario || !pass) {
                res.status(400).json({ message: 'Faltan usuario o contraseña.' });
                return;
            }
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');
                if (result.recordset.length === 0) {
                    res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
                    return;
                }
                const user = result.recordset[0];
                const isMatch = yield bcrypt_1.default.compare(pass, user.pass);
                if (!isMatch) {
                    res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
                    return;
                }
                res.status(200).json({ message: 'Inicio de sesión exitoso', user });
            }
            catch (error) {
                console.error('Error al iniciar sesión:', error);
                res.status(500).json({ message: 'Error al iniciar sesión' });
            }
        });
    }
}
exports.loginController = new LoginController();
