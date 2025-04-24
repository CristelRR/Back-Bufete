import { Router } from "express";

class RegisterRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
    }
}

const registerRoutes = new RegisterRoutes();
export default registerRoutes.router;
