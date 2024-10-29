import { Request, Response } from "express";
import { connectDB } from "../config/db";
import path from "path";
import sql from "mssql";
import fs from "fs";

class ExpedienteController {
    async crearExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { nombreExpediente, numeroExpediente} = req.body;
            const archivo = req.file;

            if (!nombreExpediente || !numeroExpediente || !archivo) {
                res.status(400).json({ error: 'Todos los campos son obligatorios' });
                return;
            }

            const archivoPath = path.join(__dirname, '../uploads', archivo.filename);

            const pool = await connectDB();
            const query = `
                INSERT INTO tlbExpedientes (nombreExpediente, numeroExpediente, archivoPath)
                VALUES (@nombreExpediente, @numeroExpediente, @archivoPath)
            `;

            await pool.request()
                .input('nombreExpediente', sql.NVarChar, nombreExpediente)
                .input('numeroExpediente', sql.NVarChar, numeroExpediente)
                .input('archivoPath', sql.NVarChar, archivoPath)
                .query(query);

            res.status(201).json({ message: 'Expediente creado exitosamente' });
        } catch (error) {
            console.error('Error al crear el expediente:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async obtenerExpedientes(req: Request, res: Response): Promise<void> {
        try {
            const pool = await connectDB();
            const result = await pool.request().query('SELECT * FROM tlbExpedientes');
            res.json(result.recordset);
        } catch (error) {
            console.error('Error al obtener expedientes:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async eliminarExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const pool = await connectDB();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Expedientes WHERE id = @id');

            if (result.rowsAffected[0] === 0) {
                res.status(404).json({ error: 'Expediente no encontrado' });
                return;
            }

            res.json({ message: 'Expediente eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar el expediente:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

export const expedienteController = new ExpedienteController();
