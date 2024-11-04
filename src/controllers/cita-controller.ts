import { Request, Response } from "express";
import citaModel from "../models/cita-model";

class CitaController {
    async getCitas(req: Request, res: Response) {
        try {
            const citas = await citaModel.getCitas();
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas:', error);
            res.status(500).json({ message: 'Error al obtener citas' });
        }
    }

    async crearCita(req: Request, res: Response) {
        try {
            const citaData = req.body; // Asegúrate de validar los datos aquí
            await citaModel.crearCita(citaData);
            res.status(201).json({ message: 'Cita creada exitosamente' });
        } catch (error) {
            console.error('Error al crear cita:', error);
            res.status(500).json({ message: 'Error al crear cita' });
        }
    }

    async updateCita(req: Request, res: Response) {
        try {
            const citaData = req.body; // Asegúrate de validar los datos aquí
            await citaModel.updateCita(citaData);
            res.json({ message: 'Cita actualizada exitosamente' });
        } catch (error) {
            console.error('Error al actualizar cita:', error);
            res.status(500).json({ message: 'Error al actualizar cita' });
        }
    }

    async deleteCita(req: Request, res: Response) {
        try {
            const { idCita } = req.body; // Asegúrate de validar el ID aquí
            await citaModel.deleteCita(idCita);
            res.json({ message: 'Cita eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            res.status(500).json({ message: 'Error al eliminar cita' });
        }
    }

    async getAbogadosPorServicio(req: Request, res: Response) {
        try {
            const { idServicio } = req.params; // Obtiene el ID del servicio de los parámetros de la URL
            const abogados = await citaModel.getAbogadosPorServicio(Number(idServicio));
            res.json(abogados);
        } catch (error) {
            console.error('Error al obtener abogados:', error);
            res.status(500).json({ message: 'Error al obtener abogados' });
        }
    }

    async getHorariosDisponiblesPorAbogado(req: Request, res: Response) {
        try {
            const { idAbogado } = req.params; // Obtiene el ID del abogado de los parámetros de la URL
            const horarios = await citaModel.getHorariosDisponiblesPorAbogado(Number(idAbogado));
            res.json(horarios);
        } catch (error) {
            console.error('Error al obtener horarios disponibles:', error);
            res.status(500).json({ message: 'Error al obtener horarios disponibles' });
        }
    }
        
}

export const citaController = new CitaController();
