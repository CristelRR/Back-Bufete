import { Router } from "express";
import { rolController } from "../controllers/rol-controllers";

class RolRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }

    config(){
        this.router.get('/', rolController.getRol);
    }
}

const rolRoutes = new RolRoutes();
export default rolRoutes.router;