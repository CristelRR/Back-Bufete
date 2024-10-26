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
Object.defineProperty(exports, "__esModule", { value: true });
exports.empleadoController = void 0;
const db_1 = require("../config/db");
class EmpleadoController {
    getEmpleadoAbogado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query('SELECT * FROM tblEmpleado');
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener empleados:', error);
                res.status(500).json({ message: 'Error al obtener empleados' });
            }
        });
    }
    crearEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pass, estado, idRol, fechaIngreso, numeroLicencia, correo, nombreEmpleado, aPEmpleado, aMEmpleado, telefono, especialidad } = req.body;
            // Verificar que los campos obligatorios están presentes
            if (!pass || !idRol || !fechaIngreso || !correo || !nombreEmpleado || !aPEmpleado || !aMEmpleado || !telefono) {
                return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos' });
            }
            try {
                const pool = yield (0, db_1.connectDB)();
                // Iniciar una transacción
                const transaction = pool.transaction();
                yield transaction.begin();
                try {
                    // Insertar el usuario en la tabla tblUsuario (usando el correo como nombreUsuario)
                    const resultUsuario = yield transaction.request()
                        .input("nombreUsuario", correo)
                        .input("pass", pass)
                        .input("estado", estado)
                        .input("idRolFK", idRol)
                        .query(`
                        INSERT INTO tblUsuario (nombreUsuario, pass, estado, idRolFK)
                        OUTPUT INSERTED.idUsuario
                        VALUES (@nombreUsuario, @pass, @estado, @idRolFK)
                    `);
                    const idUsuario = resultUsuario.recordset[0].idUsuario;
                    // Insertar el empleado en la tabla tblEmpleado
                    yield transaction.request()
                        .input("fechaIngreso", fechaIngreso)
                        .input("numeroLicencia", numeroLicencia)
                        .input("correo", correo)
                        .input("nombreEmpleado", nombreEmpleado)
                        .input("aPEmpleado", aPEmpleado)
                        .input("aMEmpleado", aMEmpleado)
                        .input("telefono", telefono)
                        .input("especialidad", especialidad)
                        .input("idUsuarioFK", idUsuario)
                        .query(`
                        INSERT INTO tblEmpleado (fechaIngreso, numeroLicencia, correo, nombreEmpleado, aPEmpleado, aMEmpleado, telefono, especialidad, idUsuarioFK)
                        VALUES (@fechaIngreso, @numeroLicencia, @correo, @nombreEmpleado, @aPEmpleado, @aMEmpleado, @telefono, @especialidad, @idUsuarioFK)
                    `);
                    // Confirmar la transacción
                    yield transaction.commit();
                    res.status(201).json({ message: 'Empleado creado exitosamente' });
                }
                catch (error) {
                    // Revertir la transacción en caso de error
                    yield transaction.rollback();
                    console.error('Error al crear empleado:', error);
                    res.status(500).json({ message: 'Error al crear empleado' });
                }
            }
            catch (error) {
                console.error('Error al conectar con la base de datos:', error);
                res.status(500).json({ message: 'Error al conectar con la base de datos' });
            }
        });
    }
}
exports.empleadoController = new EmpleadoController();
