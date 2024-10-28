import { Request, Response } from "express";
import clienteModel from "../models/cliente-model"; // Asegúrate de tener el modelo correspondiente

class ClienteController {
    async getClientes(req: Request, res: Response) {
        try {
            const clientes = await clienteModel.getClientes();
            res.json(clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({ message: 'Error al obtener clientes' });
        }
    }

    async crearCliente(req: Request, res: Response) {
        try {
            const clienteData = req.body; // Asegúrate de validar los datos aquí
            await clienteModel.crearCliente(clienteData);
            res.status(201).json({ message: 'Cliente creado exitosamente' });
        } catch (error) {
            console.error('Error al crear cliente:', error);
            res.status(500).json({ message: 'Error al crear cliente' });
        }
    }

    async updateCliente(req: Request, res: Response) {
        try {
            const clienteData = req.body; // Asegúrate de validar los datos aquí
            await clienteModel.updateCliente(clienteData);
            res.json({ message: 'Cliente actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ message: 'Error al actualizar cliente' });
        }
    }

    async deleteCliente(req: Request, res: Response) {
        try {
            const { idCliente } = req.body; // Asegúrate de validar el ID aquí
            await clienteModel.deleteCliente(idCliente);
            res.json({ message: 'Cliente eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            res.status(500).json({ message: 'Error al eliminar cliente' });
        }
    }
}

export const clienteController = new ClienteController();
