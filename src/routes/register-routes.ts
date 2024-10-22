import { Router } from "express";
import { registerController } from "../controllers/register-controllers";

class RegisterRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', registerController.getRegister);
        this.router.post('/', registerController.registerUser);
    }
}

const registerRoutes = new RegisterRoutes();
export default registerRoutes.router;
