import { Request, Response } from "express";
import usuarioModel from "../models/usuario-model";

class UsuarioController {
    async getUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await usuarioModel.getUsuarios();
            res.json(usuarios);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    }

    async crearUsuario(req: Request, res: Response) {
        try {
            const usuarioData = req.body; // Asegúrate de validar los datos aquí
            await usuarioModel.crearUsuario(usuarioData);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    }

    async updateUsuario(req: Request, res: Response) {
        try {
            const usuarioData = req.body; // Asegúrate de validar los datos aquí
            await usuarioModel.updateUsuario(usuarioData);
            res.json({ message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    }

    async deleteUsuario(req: Request, res: Response) {
        try {
            const { idUsuario } = req.body; // Asegúrate de validar el ID aquí
            await usuarioModel.deleteUsuario(idUsuario);
            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    }
}

export const usuarioController = new UsuarioController();
