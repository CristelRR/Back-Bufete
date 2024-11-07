import { enviarCorreo } from '../config/mailer';

export const notificarClienteCita = async (clienteEmail: string, clienteNombre: string, fechaCita: string, motivoCita: string) => {
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
    await enviarCorreo(clienteEmail, asunto, mensaje);
    console.log('Correo de confirmación enviado al cliente:', clienteEmail);
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error);
  }
};
