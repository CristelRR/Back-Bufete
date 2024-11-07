"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarClienteCita = void 0;
const mailer_1 = require("../config/mailer");
const notificarClienteCita = (clienteEmail, clienteNombre, fechaCita, motivoCita) => __awaiter(void 0, void 0, void 0, function* () {
    const asunto = `Confirmación de Cita - ${clienteNombre}`;
    const mensaje = `
    <h3>Hola, ${clienteNombre}</h3>
    <p>Su cita ha sido programada con éxito.</p>
    <p><strong>Detalles de la cita:</strong></p>
    <ul>
      <li>Fecha: ${fechaCita}</li>
      <li>Motivo: ${motivoCita}</li>
    </ul>
    <p>Gracias por confiar en nuestros servicios.</p>
  `;
    try {
        yield (0, mailer_1.enviarCorreo)(clienteEmail, asunto, mensaje);
        console.log('Correo de confirmación enviado al cliente:', clienteEmail);
    }
    catch (error) {
        console.error('Error al enviar el correo de confirmación:', error);
    }
});
exports.notificarClienteCita = notificarClienteCita;
