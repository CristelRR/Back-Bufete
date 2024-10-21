// rol-controllers.ts
import { Request, Response } from "express";
import { connectDB } from "../config/db";

class RolController {
    async getRol(req: Request, res: Response) {
        try {
            const pool = await connectDB();
            const result = await pool.request().query('SELECT * FROM tblRol');
            res.json(result.recordset);
        } catch (error) {
            console.error('Error al obtener roles:', error);
            res.status(500).json({ message: 'Error al obtener roles' });
        }
    }
}

export const rolController = new RolController();
