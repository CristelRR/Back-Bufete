// rol-controllers.ts
import { Request, Response } from "express";
import { connectDB } from "../config/db";

class EmpleadoController {
    async getEmpleadoAbogado(req: Request, res: Response) {
        try {
            const pool = await connectDB();
            const result = await pool.request().query('SELECT * FROM tblEmpleado');
            res.json(result.recordset);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ message: 'Error al obtener empleados' });
        }
    }
    
    async crearEmpleado(req: Request, res: Response) {
        const {
            pass,
            estado,
            idRol,
            fechaIngreso,
            numeroLicencia,
            correo,
            nombreEmpleado,
            aPEmpleado,
            aMEmpleado,
            telefono,
            especialidad
        } = req.body;
    
        // Verificar que los campos obligatorios están presentes
        if (!pass || !idRol || !fechaIngreso || !correo || !nombreEmpleado || !aPEmpleado || !aMEmpleado || !telefono) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos' });
        }
    
        try {
            const pool = await connectDB();
    
            // Iniciar una transacción
            const transaction = pool.transaction();
            await transaction.begin();
    
            try {
                // Insertar el usuario en la tabla tblUsuario (usando el correo como nombreUsuario)
                const resultUsuario = await transaction.request()
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
                await transaction.request()
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
                await transaction.commit();
    
                res.status(201).json({ message: 'Empleado creado exitosamente' });
            } catch (error) {
                // Revertir la transacción en caso de error
                await transaction.rollback();
                console.error('Error al crear empleado:', error);
                res.status(500).json({ message: 'Error al crear empleado' });
            }
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
            res.status(500).json({ message: 'Error al conectar con la base de datos' });
        }
    }
    
}

export const empleadoController = new EmpleadoController();
