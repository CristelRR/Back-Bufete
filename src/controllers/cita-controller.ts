import { Request, Response } from "express";
import citaModel from "../models/cita-model";
import { notificarClienteCita } from "./notificar-cita-cliente";

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

    async crearCitaConTransaccion(req: Request, res: Response) {
        try {
            const citaData = req.body;
            
            // Llama al modelo para crear la cita en una transacción
            const result = await citaModel.crearCitaConTransaccion(citaData);

            // Obtén los datos del cliente desde la base de datos
            const datosCliente = await citaModel.obtenerDatosCliente(citaData.idClienteFK);
            
            if (!datosCliente || !datosCliente.emailCliente) {
                return res.status(500).json({ message: "No se encontró el correo del cliente" });
            }

            // Envía la notificación por correo electrónico usando los datos del cliente
            const { emailCliente, nombreCliente, aPCliente, aMCliente } = datosCliente;
            const clienteNombre = `${nombreCliente} ${aPCliente} ${aMCliente}`;
            const fechaCita = citaData.fechaCita; // Si tienes la fecha de la cita en citaData
            const motivoCita = citaData.motivo;

            await notificarClienteCita(emailCliente, clienteNombre, fechaCita, motivoCita);

            res.status(201).json({ message: result.message, notification: 'Correo de notificación enviado' });
        } catch (error: any) {
            console.error('Error al crear cita con transacción:', error);
            res.status(500).json({ message: 'Error al crear cita con transacción', error: error.message });
        }
    }
 
    async getCitasByCliente(req: Request, res: Response) {
        try {
            const { idCliente } = req.params; // Obtiene el ID del cliente de los parámetros de la URL
            const citas = await citaModel.getCitasByCliente(Number(idCliente));
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas del cliente:', error);
            res.status(500).json({ message: 'Error al obtener citas del cliente' });
        }
    }

    // Método para obtener las citas de un abogado específico
    async getCitasByAbogado(req: Request, res: Response) {
        try {
            const { idAbogado } = req.params;  // Obtiene el idAbogado de los parámetros de la URL
            const citas = await citaModel.getCitasByAbogado(Number(idAbogado));  // Llama al modelo con el idAbogado
            res.json(citas);  // Devuelve las citas como respuesta
        } catch (error) {
            console.error('Error al obtener citas del abogado:', error);
            res.status(500).json({ message: 'Error al obtener citas del abogado' });
        }
    }

    // Método para obtener los clientes únicos con citas programadas para un abogado específico
    async getClientesPorAbogado(req: Request, res: Response) {
        try {
            const { idAbogado } = req.params;  // Obtiene el idAbogado de los parámetros de la URL
            const clientes = await citaModel.getClientesPorAbogado(Number(idAbogado));  // Llama al modelo para obtener clientes únicos
            res.json(clientes);  // Envía los clientes como respuesta en formato JSON
        } catch (error) {
            console.error('Error al obtener clientes del abogado:', error);
            res.status(500).json({ message: 'Error al obtener clientes del abogado' });
        }
    }

    // Método para cancelar cita
    async cancelarCita(req: Request, res: Response) {
        try {
            const { idCita } = req.body;
            if (!idCita) {
                return res.status(400).json({ message: 'ID de cita no proporcionado' });
            }
            
            // Llama al método cancelarCita del modelo
            const result = await citaModel.cancelarCita(Number(idCita));
            res.json(result);  // Responde con el resultado de la operación
        } catch (error) {
            console.error('Error al cancelar la cita:', error);
            res.status(500).json({ message: 'Error al cancelar la cita' });
        }
    }

}

export const citaController = new CitaController();
