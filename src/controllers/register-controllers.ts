import { Request, Response } from "express";
import { connectDB } from "../config/db";
import sql from "mssql";
import bcryptjs from 'bcryptjs';  // Importa bcryptjs en lugar de bcrypt

const saltRounds = 10;

class RegisterController {
    // Método para obtener todos los registros de usuarios
    async getRegister(req: Request, res: Response): Promise<void> {
        try {
            // Conexión a la base de datos
            const pool = await connectDB();
            // Realizar consulta para obtener todos los usuarios
            const result = await pool.request().query('SELECT * FROM tblUsuario');
            res.json(result.recordset);  // Enviar los resultados como respuesta
        } catch (error) {
            console.error('Error al obtener los registros:', error);
            res.status(500).json({ message: 'Error al obtener los registros' });
        }
    }

    // Método para registrar un nuevo usuario
    async registerUser(req: Request, res: Response): Promise<void> {
        const { nombreUsuario, pass, idRolFK } = req.body;

        // Verificar que los datos necesarios estén presentes
        if (!nombreUsuario || !pass || idRolFK === undefined) {
            res.status(400).json({ message: 'Faltan datos de usuario, contraseña o rol.' });
            return;
        }

        try {
            // Conexión a la base de datos
            const pool = await connectDB();
            // Verificar si el usuario ya existe
            const existingUser = await pool.request()
                .input('username', sql.VarChar, nombreUsuario)
                .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');

            if (existingUser.recordset.length > 0) {
                res.status(400).json({ message: 'El usuario ya existe.' });
                return;
            }

            // Hashear la contraseña antes de guardarla utilizando bcryptjs
            const hashedPassword = await bcryptjs.hash(pass, saltRounds);  // Usa bcryptjs.hash()

            // Insertar el nuevo usuario en la base de datos
            await pool.request()
                .input('username', sql.VarChar, nombreUsuario)
                .input('password', sql.VarChar, hashedPassword)
                .input('estado', sql.Bit, true)
                .input('idRolFK', sql.Int, idRolFK)
                .query(`
                    INSERT INTO tblUsuario (nombreUsuario, pass, estado, idRolFK) 
                    VALUES (@username, @password, @estado, @idRolFK)
                `);

            // Respuesta exitosa
            res.status(201).json({ message: 'Usuario registrado con éxito.' });
        } catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).json({ message: 'Error al registrar el usuario.' });
        }
    }
}

// Exportar la instancia del controlador para ser utilizada en las rutas
export const registerController = new RegisterController();
