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
exports.registerController = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
class RegisterController {
    getRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query('SELECT * FROM tblUsuario');
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener los registros:', error);
                res.status(500).json({ message: 'Error al obtener los registros' });
            }
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombreUsuario, pass, idRolFK } = req.body;
            if (!nombreUsuario || !pass || idRolFK === undefined) {
                res.status(400).json({ message: 'Faltan datos de usuario, contraseña o rol.' });
                return;
            }
            try {
                const pool = yield (0, db_1.connectDB)();
                const existingUser = yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');
                if (existingUser.recordset.length > 0) {
                    res.status(400).json({ message: 'El usuario ya existe.' });
                    return;
                }
                const hashedPassword = yield bcrypt_1.default.hash(pass, saltRounds);
                yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .input('password', mssql_1.default.VarChar, hashedPassword)
                    .input('estado', mssql_1.default.Bit, true)
                    .input('idRolFK', mssql_1.default.Int, idRolFK)
                    .query(`
                    INSERT INTO tblUsuario (nombreUsuario, pass, estado, idRolFK) 
                    VALUES (@username, @password, @estado, @idRolFK)
                `);
                res.status(201).json({ message: 'Usuario registrado con éxito.' });
            }
            catch (error) {
                console.error('Error en el registro:', error);
                res.status(500).json({ message: 'Error al registrar el usuario.' });
            }
        });
    }
}
exports.registerController = new RegisterController();

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
exports.registerController = void 0;
const db_1 = require("../config/db");
class RegisterController {
    getRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query('SELECT * FROM tblUsuario');
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener los registros:', error);
                res.status(500).json({ message: 'Error al obtener los registros' });
            }
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombreUsuario, pass, idRolFK } = req.body;
            if (!nombreUsuario || !pass || idRolFK === undefined) {
                res.status(400).json({ message: 'Faltan datos de usuario, contraseña o rol.' });
                return;
            }
            try {
                const pool = yield (0, db_1.connectDB)();
                const existingUser = yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');
                if (existingUser.recordset.length > 0) {
                    res.status(400).json({ message: 'El usuario ya existe.' });
                    return;
                }
                const hashedPassword = yield bcrypt_1.default.hash(pass, saltRounds);
                yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .input('password', mssql_1.default.VarChar, hashedPassword)
                    .input('estado', mssql_1.default.Bit, true)
                    .input('idRolFK', mssql_1.default.Int, idRolFK)
                    .query(`
                    INSERT INTO tblUsuario (nombreUsuario, pass, estado, idRolFK) 
                    VALUES (@username, @password, @estado, @idRolFK)
                `);
                res.status(201).json({ message: 'Usuario registrado con éxito.' });
            }
            catch (error) {
                console.error('Error en el registro:', error);
                res.status(500).json({ message: 'Error al registrar el usuario.' });
            }
        });
    }
}
exports.registerController = new RegisterController();

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
exports.registerController = void 0;
const db_1 = require("../config/db");
class RegisterController {
    getRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query('SELECT * FROM tblUsuario');
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener los registros:', error);
                res.status(500).json({ message: 'Error al obtener los registros' });
            }
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombreUsuario, pass, idRolFK } = req.body;
            if (!nombreUsuario || !pass || idRolFK === undefined) {
                res.status(400).json({ message: 'Faltan datos de usuario, contraseña o rol.' });
                return;
            }
            try {
                const pool = yield (0, db_1.connectDB)();
                const existingUser = yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');
                if (existingUser.recordset.length > 0) {
                    res.status(400).json({ message: 'El usuario ya existe.' });
                    return;
                }
                const hashedPassword = yield bcrypt_1.default.hash(pass, saltRounds);
                yield pool.request()
                    .input('username', mssql_1.default.VarChar, nombreUsuario)
                    .input('password', mssql_1.default.VarChar, hashedPassword)
                    .input('estado', mssql_1.default.Bit, true)
                    .input('idRolFK', mssql_1.default.Int, idRolFK)
                    .query(`
                    INSERT INTO tblUsuario (nombreUsuario, pass, estado, idRolFK) 
                    VALUES (@username, @password, @estado, @idRolFK)
                `);
                res.status(201).json({ message: 'Usuario registrado con éxito.' });
            }
            catch (error) {
                console.error('Error en el registro:', error);
                res.status(500).json({ message: 'Error al registrar el usuario.' });
            }
        });
    }
}
exports.registerController = new RegisterController();
