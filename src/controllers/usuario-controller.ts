import { Request, Response } from "express";
import usuarioModel from "../models/usuario-model";
import axios from "axios";
import * as crypto from "crypto";
import { enviarCorreo } from "../config/mailer";
import { connectDB } from "../config/db";
import jwt from "jsonwebtoken";

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
      console.log("Solicitud de login recibida", req.body);

      const { email, password, recaptcha } = req.body;

      // Buscar usuario en la BD
      const usuario = await usuarioModel.findByEmail(email);

      if (!usuario || usuario.pass !== password) {
        console.log("Credenciales incorrectas");
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      // Verificar reCAPTCHA
      const secretKey = "6LemDAArAAAAANKFrntBm5gGMtjLGGB9X23Ml-RC";
      const recaptchaResponse = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        { params: { secret: secretKey, response: recaptcha } }
      );

      if (!recaptchaResponse.data.success) {
        return res.status(400).json({ message: "reCAPTCHA inválido" });
      }

      // Siempre generar un OTP (ya no es opcional)
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiration = Date.now() + 5 * 60 * 1000; // Expira en 5 minutos

      // Guardamos OTP en la base de datos
      await usuarioModel.updateOTP(usuario.idUsuario, otp, otpExpiration);

      // Enviar OTP al correo del usuario
      console.log("Enviando correo de OTP a:", usuario.nombreUsuario);
      await enviarCorreo(
        usuario.nombreUsuario, // Correo del usuario
        "Código de verificación OTP",
        `<p>Tu código de verificación es: <strong>${otp}</strong></p>`
      );

      return res.json({
        message: "OTP enviado",
        email: usuario.nombreUsuario, // Enviar email al frontend
      });
    } catch (error) {
      console.error("Error en el login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }

  async verificarOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      // Buscar usuario por email
      const usuario = await usuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      // Buscar OTP en la BD
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idUsuarioFK", usuario.idUsuario)
        .query(
          "SELECT otp, otpExpiration FROM tblUsuarioOTP WHERE idUsuarioFK = @idUsuarioFK"
        );

      if (result.recordset.length === 0) {
        return res.status(400).json({ message: "OTP no encontrado" });
      }

      const usuarioOTP = result.recordset[0];

      // Verificar si el OTP es válido
      if (usuarioOTP.otp !== otp) {
        return res.status(400).json({ message: "Código OTP incorrecto" });
      }

      if (Date.now() > usuarioOTP.otpExpiration) {
        return res.status(400).json({ message: "Código OTP expirado" });
      }

      // Limpiar OTP de la BD (opcional)
      await usuarioModel.deleteOTP(usuario.idUsuario);

      // Se genera el token con expiracion
      const token = jwt.sign(
        {
          id: usuario.idUsuario,
          rol: usuario.idRolFK,
          idEmpleado: usuario.idEmpleadoFK,
          idCliente: usuario.idClienteFK,
        },
        "CLAVE_SECRETA_SUPERSEGURA",
        //{ expiresIn: "30m" } // Token expira en 30 minutos
        { expiresIn: "30m" } //Expiracion de prueba

      );

      // Enviar respuesta con datos del usuario
      res.json({
        message: "OTP verificado correctamente",
        token,
        usuario: {
          id: usuario.idUsuario,
          nombre: usuario.nombreUsuario,
          rol: usuario.idRolFK,
          idEmpleado: usuario.idEmpleadoFK,
          idCliente: usuario.idClienteFK,
        },
      });
    } catch (error) {
      console.error("Error al verificar OTP:", error);
      res.status(500).json({ message: "Error al verificar OTP" });
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

  async enviarCorreoRecuperacion(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const usuario = await usuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiration = Date.now() + 15 * 60 * 1000; // 15 minutos

      await usuarioModel.guardarTokenRecuperacion(
        usuario.idUsuario,
        token,
        expiration
      );

      const link = `http://localhost:4200/restablecer-contrasena/${token}`;
      //const link = `https://lexvargas-bufet.web.app/restablecer-contrasena/${token}`;

      // El enlace se envía con el token
      await enviarCorreo(
        email,
        "Recuperación de Contraseña",
        `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
   <a href="${link}">${link}</a>
   <p>Este enlace expirará en 15 minutos.</p>`
      );

      res.json({ message: "Correo enviado correctamente" });
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      res.status(500).json({ message: "Error interno" });
    }
  }

  async restablecerContrasena(req: Request, res: Response) {
    try {
      const { token, nuevaContrasena } = req.body;

      const registro = await usuarioModel.buscarToken(token);
      if (!registro) {
        return res.status(400).json({ message: "Token inválido" });
      }

      if (Date.now() > registro.expiration) {
        return res.status(400).json({ message: "Token expirado" });
      }

      // Actualizar contraseña
      await usuarioModel.actualizarContrasena(
        registro.idUsuarioFK,
        nuevaContrasena
      );
      await usuarioModel.eliminarToken(registro.idUsuarioFK);

      // 📧 Obtener el correo del usuario
      const usuario = await usuarioModel.findById(registro.idUsuarioFK);
      const correoUsuario = usuario[0]?.nombreUsuario;

      // ✅ Enviar correo de confirmación
      if (correoUsuario) {
        await enviarCorreo(
          correoUsuario,
          "Confirmación de cambio de contraseña",
          `<p>Hola,</p>
           <p>Tu contraseña ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contáctanos inmediatamente.</p>`
        );
      }

      res.json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      res
        .status(500)
        .json({ message: "Error interno al restablecer contraseña" });
    }
  }
}

export const usuarioController = new UsuarioController();
