import { Router } from "express";
//import express from 'express';
import { pagoController } from '../controllers/gestionPago-controller';

//const router = express.Router();
class PagoRoutes {
    public router: Router = Router();
    //private pagoController: PagoController = new PagoController(); // Instanciar el controlador

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', pagoController.obtenerPagos);
        this.router.post('/', pagoController.crearPago);        
    }
}

const pagoRoutes = new PagoRoutes();
export default pagoRoutes.router;
