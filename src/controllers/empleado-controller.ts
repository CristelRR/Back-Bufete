import { Request, Response } from "express";
import empleadoModel from "../models/empleado-model";

class EmpleadoController {
    async getEmpleados(req: Request, res: Response) {
        try {
            const empleados = await empleadoModel.getEmpleados();
            res.json(empleados);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ message: 'Error al obtener empleados' });
        }
    }

    async crearEmpleado(req: Request, res: Response) {
        try {
            const empleadoData = req.body; // Asegúrate de validar los datos aquí
            await empleadoModel.crearEmpleado(empleadoData);
            res.status(201).json({ message: 'Empleado creado exitosamente' });
        } catch (error) {
            console.error('Error al crear empleado:', error);
            res.status(500).json({ message: 'Error al crear empleado' });
        }
    }

    async updateEmpleado(req: Request, res: Response) {
        try {
            const empleadoData = req.body; // Asegúrate de validar los datos aquí
            await empleadoModel.updateEmpleado(empleadoData);
            res.json({ message: 'Empleado actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            res.status(500).json({ message: 'Error al actualizar empleado' });
        }
    }

    async deleteEmpleado(req: Request, res: Response) {
        try {
            const { idEmpleado } = req.body; // Asegúrate de validar el ID aquí
            await empleadoModel.deleteEmpleado(idEmpleado);
            res.json({ message: 'Empleado eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            res.status(500).json({ message: 'Error al eliminar empleado' });
        }
    }
}

export const empleadoController = new EmpleadoController();
