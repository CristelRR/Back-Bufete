import { Request, Response } from "express";
import { connectDB } from "../config/db";
import bcrypt from "bcrypt";
import sql from "mssql";

class LoginController {
    async loginUser(req: Request, res: Response): Promise<void> {
        const { nombreUsuario, pass } = req.body;

        if (!nombreUsuario || !pass) {
            res.status(400).json({ message: 'Faltan usuario o contraseña.' });
            return;
        }

        try {
            const pool = await connectDB();
            const result = await pool.request()
                .input('username', sql.VarChar, nombreUsuario)
                .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');

            if (result.recordset.length === 0) {
                res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
                return;
            }

            const user = result.recordset[0];

            const isMatch = await bcrypt.compare(pass, user.pass);
            if (!isMatch) {
                res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
                return;
            }

            res.status(200).json({ message: 'Inicio de sesión exitoso', user });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ message: 'Error al iniciar sesión' });
        }
    }
}

export const loginController = new LoginController();
