import { Router } from "express";

class LoginRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
    }
}

const loginRoutes = new LoginRoutes();
export default loginRoutes.router;
