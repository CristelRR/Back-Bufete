import { Router } from "express";
import { citaController } from "../controllers/cita-controller"; 

class CitaRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', citaController.getCitas);
        this.router.post('/', citaController.crearCita);
        this.router.put('/', citaController.updateCita);
        this.router.delete('/', citaController.deleteCita);    
        this.router.get("/abogados/:idServicio", citaController.getAbogadosPorServicio);
        this.router.get('/horarios/:idAbogado', citaController.getHorariosDisponiblesPorAbogado); 
        this.router.post('/crear-cita', citaController.crearCitaConTransaccion);
        this.router.get('/consultar-citaC/:idCliente', citaController.getCitasByCliente);
        this.router.get('/consultar-citaA/:idAbogado', citaController.getCitasByAbogado); 
        this.router.get('/consultar-citaS/', citaController.getCitasBySecretaria); 
        this.router.get('/clientes/abogado/:idAbogado', citaController.getClientesPorAbogado);
        this.router.put('/cancelar', citaController.cancelarCita); 
        this.router.get('/clientes/:idCliente/servicios', citaController.getServiciosPorCitasDeCliente);
        this.router.get("/detalladas", citaController.getAllCitas); 
        this.router.put('/completar-cita/:idCita', citaController.completarCita);
        this.router.get('/expediente/:idExpediente', citaController.getCitasCompletadasByExpediente);

    }
}

const citaRoutes = new CitaRoutes();
export default citaRoutes.router;