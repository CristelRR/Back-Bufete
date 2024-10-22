import { Request, Response } from "express";
import { connectDB } from "../config/db";
import sql from "mssql";
import bcrypt from 'bcrypt';

const saltRounds = 10;

class RegisterController {
    async getRegister(req: Request, res: Response): Promise<void> {
        try {
            const pool = await connectDB();
            const result = await pool.request().query('SELECT * FROM tblUsuario');
            res.json(result.recordset);
        } catch (error) {
            console.error('Error al obtener los registros:', error);
            res.status(500).json({ message: 'Error al obtener los registros' });
        }
    }

    async registerUser(req: Request, res: Response): Promise<void> {
        const { nombreUsuario, pass, idRolFK } = req.body;

        if (!nombreUsuario || !pass || idRolFK === undefined) {
            res.status(400).json({ message: 'Faltan datos de usuario, contraseña o rol.' });
            return;
        }

        try {
            const pool = await connectDB();
            const existingUser = await pool.request()
                .input('username', sql.VarChar, nombreUsuario)
                .query('SELECT * FROM tblUsuario WHERE nombreUsuario = @username');

            if (existingUser.recordset.length > 0) {
                res.status(400).json({ message: 'El usuario ya existe.' });
                return;
            }

            const hashedPassword = await bcrypt.hash(pass, saltRounds);

            await pool.request()
                .input('username', sql.VarChar, nombreUsuario)
                .input('password', sql.VarChar, hashedPassword)
                .input('estado', sql.Bit, true)
                .input('idRolFK', sql.Int, idRolFK)
                .query(`
                    INSERT INTO tblUsuario (nombreUsuario, pass, estado, idRolFK) 
                    VALUES (@username, @password, @estado, @idRolFK)
                `);

            res.status(201).json({ message: 'Usuario registrado con éxito.' });
        } catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).json({ message: 'Error al registrar el usuario.' });
        }
    }
}

export const registerController = new RegisterController();
