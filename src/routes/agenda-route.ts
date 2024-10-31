import { Router } from "express";
import { agendaController } from "../controllers/agenda-controller";

class AgendaRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', agendaController.getAgendas);
        this.router.post('/', agendaController.crearAgenda);
        this.router.put('/:idAgenda', agendaController.updateAgenda); 
        this.router.delete('/', agendaController.deleteAgenda);
    }
}

const agendaRoutes = new AgendaRoutes();
export default agendaRoutes.router;
