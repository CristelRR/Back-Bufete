import { Router } from "express";
import { notaController } from "../controllers/nota-controller";

class NotaRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        // Ruta para obtener todas las notas
        this.router.get('/', notaController.getNotas);

        // Ruta para obtener notas por ID de cita o expediente
        this.router.get('/por-cita-o-expediente/:idCita', notaController.getNotasPorCitaOExpediente);

        // Ruta para obtener una nota por su ID
        this.router.get('/:idNota', notaController.getNotaById);

        // Ruta para crear una nueva nota
        this.router.post('/', notaController.crearNota);

        // Ruta para actualizar una nota existente
        this.router.put('/', notaController.updateNota);

        // Ruta para eliminar una nota
        this.router.delete('/', notaController.deleteNota);

        // Ruta para obtener notas por ID de cita
        this.router.get('/cita/:idCita', notaController.getNotasPorCita);
    }
}

const notaRoutes = new NotaRoutes();
export default notaRoutes.router;
