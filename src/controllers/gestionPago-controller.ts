import { Request, Response } from 'express';
import { connectDB } from '../config/db'; // Importa la conexión a la base de datos
import { Pago } from '../models/gestionPago-model';

export class PagoController {

    //Método para obtener FOLIO 
    // async obtenerFolio(req: Request, res: Response): Promise<void> {
    //     const folio = req.query.folio as string;
    //     if (!folio) {
    //         // Valida que el folio no sea nulo o indefinido
    //         res.status(400).json({ message: 'Folio es requerido' });
    //         return; // Salir del método si no hay folio
    //     }
    //     try {
    //         // Conéctate a la base de datos usando connectDB
    //         const pool = await connectDB();

    //         // Ejecuta la query para obtener el folio
    //         const result = await pool.request()
    //             .input('folio', parseInt(folio)) //COnvierte string a number 
    //             .query(`
    //                 SELECT cs.folio, cs.idCliente, cs.idServicio
    //                 FROM tblCliente_Servicio cs
    //                 WHERE cs.folio = @folio;
    //             `);
    //         res.status(200).json(result.recordset);
    //     } catch (e) {
    //         console.error('Error al obtener el folio:', e);
    //         res.status(500).json({ message: 'Error al obtener el folio' });
    //     }
    // }    
    
    //Método para obtener datos del pago
    async obtenerPagos(req: Request, res: Response): Promise<void> {   
        
        try {
            const folio = req.query.folio;
        if (!folio) {
            res.status(400).json({ message: 'Folio es requerido' });
            return;
          }
            // Conéctate a la base de datos usando connectDB
            const pool = await connectDB();
            
            // Ejecuta la query para obtener los pagos
            const result = await pool.request()
               .input('folio', folio)
               .query(`
                        SELECT p.idPago, p.fecha AS fechaPago, p.metodo, p.estado,  p.idCliente, p.idServicio, p.montoInicial,
                        c.nombreCliente AS nomCliente, s.nombreServicio AS nomServicio, s.costo,p.monto, p.montoRestante, cs.folio
                        FROM tblPago p
                        JOIN tblCliente c ON p.idCliente = c.idCliente
                        JOIN tblServicio s ON p.idServicio = s.idServicio
                        JOIN tblCliente_Servicio cs ON cs.idCliente = c.idCliente AND cs.idServicio = s.idServicio  -- JOIN adicional para obtener el folio
                        where cs.folio = @folio ;
                `);
                res.status(200).json(result.recordset); 
                console.log("Se muestran los datos back")
                console.log(folio)
                
        } catch (e) {
            console.error('Error al obtener los pagos:', e);
            res.status(500).json({ message: 'Error al obtener los pagos' });
        }         
    }

    // Método para crear un nuevo pago
    async crearPago(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        try {
            const nuevoPago = new Pago();
            nuevoPago.monto = req.body.monto;
            nuevoPago.montoRestante = req.body.montoRestante;
            nuevoPago.montoInicial = req.body.montoInicial;
            nuevoPago.metodo = req.body.metodo;
            nuevoPago.estado = req.body.estado;
            nuevoPago.fechaPago = req.body.fechaPago;
            nuevoPago.idCliente = req.body.idCliente;
            nuevoPago.idServicio = req.body.idServicio;

            // Conéctate a la base de datos usando connectDB
            const pool = await connectDB();
            
            // Ejecuta la query para insertar el nuevo pago
            const result = await pool.request()
                .input('monto', nuevoPago.monto)
                .input('montoRestante', nuevoPago.montoRestante)
                .input('montoInicial', nuevoPago.montoInicial)
                .input('metodo', nuevoPago.metodo)
                .input('estado', nuevoPago.estado ? 1 : 0)
                .input('fechaPago', nuevoPago.fechaPago)
                .input('idCliente', nuevoPago.idCliente)
                .input('idServicio', nuevoPago.idServicio)
                .query(`
                    INSERT INTO tblPago (monto,montoRestante,montoInicial,metodo,estado,fecha,idCliente,idServicio)
                    VALUES (@monto, @montoRestante, @montoInicial, @metodo, @estado, @fechaPago, @idCliente, @idServicio);
                    SELECT SCOPE_IDENTITY() AS idPago;
                `);

            const newPagoId = result.recordset[0].idPago;

            res.status(201).json({
                message: 'Pago creado exitosamente',
                idPago: newPagoId,
            });
        } catch (error) {
            console.error('Error al crear el pago:', error); 
            res.status(500).json({ message: 'Error al crear el pago' });
        }
    }
}

export const pagoController = new PagoController();
