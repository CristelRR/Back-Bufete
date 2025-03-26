import { Request, Response } from "express";
import usuarioModel from "../models/usuario-model";
import axios from "axios";

class UsuarioController {
  async getUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await usuarioModel.getUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, recaptcha } = req.body;
      console.log("Datos recibidos:", email, password, recaptcha);

      const secretKey = "6LemDAArAAAAANKFrntBm5gGMtjLGGB9X23Ml-RC";
      const recaptchaResponse = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        { params: { secret: secretKey, response: recaptcha } }
      );

      console.log("Respuesta reCAPTCHA:", recaptchaResponse.data);

      if (!recaptchaResponse.data.success) {
        return res.status(400).json({ message: "reCAPTCHA inválido" });
      }

      const usuario = await usuarioModel.findByEmail(email);
      if (usuario && usuario.pass === password) {
        return res.json({
          message: "Inicio de sesión exitoso",
          usuario: {
            id: usuario.idUsuario,
            nombre: usuario.nombreUsuario,
            rol: usuario.idRolFK,
            idEmpleado: usuario.idEmpleadoFK,
            idCliente: usuario.idClienteFK
          }
        });
      }

      res.status(401).json({ message: "Credenciales incorrectas" });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }

  async crearUsuario(req: Request, res: Response) {
    try {
      const usuarioData = req.body; // Asegúrate de validar los datos aquí
      await usuarioModel.crearUsuario(usuarioData);
      res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ message: "Error al crear usuario" });
    }
  }

  async updateUsuario(req: Request, res: Response) {
    try {
      const usuarioData = req.body; // Asegúrate de validar los datos aquí
      await usuarioModel.updateUsuario(usuarioData);
      res.json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }

  async deleteUsuario(req: Request, res: Response) {
    try {
      const { idUsuario } = req.body; // Asegúrate de validar el ID aquí
      await usuarioModel.deleteUsuario(idUsuario);
      res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  }
}

export const usuarioController = new UsuarioController();
