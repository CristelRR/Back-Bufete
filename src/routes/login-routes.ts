import { Router } from "express";
import { loginController } from "../controllers/login-controllers";

class LoginRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.post('/', loginController.loginUser.bind(loginController));
    }
}

const loginRoutes = new LoginRoutes();
export default loginRoutes.router;
