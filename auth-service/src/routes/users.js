import { Router } from "express";
import { signUp, login, validateToken } from '../controllers/users'

const router = Router();


router.route("/signup")
        .post(signUp);


router.route("/login")
        .post(login);

router.route("/validate")
        .get(validateToken)


export default router;
