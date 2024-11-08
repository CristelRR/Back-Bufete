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
            const idCliente = Number(req.params.idCliente); // Obtiene el ID del cliente desde los parámetros de la URL
            if (isNaN(idCliente)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const clienteData = req.body; // Obtiene los datos del cliente desde el cuerpo de la solicitud
            await clienteModel.updateCliente(idCliente, clienteData); // Llama al método de actualización en el modelo
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

    getClienteById = async (req: Request, res: Response) => {
        try {
            const idCliente = Number(req.params.idCliente);
            if (isNaN(idCliente)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            const cliente = await clienteModel.findById(idCliente); 
            if (cliente.length === 0) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            res.status(200).json(cliente[0]); 
        } catch (error) {
            console.error('Error al obtener cliente por ID:', error);
            res.status(500).json({ message: 'Error al obtener cliente' });
        }
    }
    
}

export const clienteController = new ClienteController();
