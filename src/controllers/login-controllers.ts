import { Request, Response } from "express";
import { connectDB } from "../config/db";
import bcryptjs from "bcryptjs";  // Cambié 'bcrypt' por 'bcryptjs'
import sql from "mssql";

class LoginController {
    async loginUser(req: Request, res: Response): Promise<void> {
        const { nombreUsuario, pass } = req.body;

        // Verifica si el usuario y la contraseña fueron proporcionados
        if (!nombreUsuario || !pass) {
            res.status(400).json({ message: 'Faltan usuario o contraseña.' });
            return;
        }

        try {
            // Conectar a la base de datos
            const pool = await connectDB();
            const result = await pool.request()
                .input('username', sql.VarChar, nombreUsuario)
                .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');

            // Verificar si el usuario existe
            if (result.recordset.length === 0) {
                res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
                return;
            }

            const user = result.recordset[0];

            // Compara la contraseña proporcionada con la almacenada en la base de datos
            const isMatch = await bcryptjs.compare(pass, user.pass);  // Cambié 'bcrypt' por 'bcryptjs'
            if (!isMatch) {
                res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
                return;
            }

            // Si las contraseñas coinciden, responde con el éxito
            res.status(200).json({ message: 'Inicio de sesión exitoso', user });
        } catch (error) {
            // Captura y maneja errores
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ message: 'Error al iniciar sesión' });
        }
    }
}

export const loginController = new LoginController();
