import { Router } from "express";
// import validateFirebaseIdToken from "../middlewares/auth.middleware";
import { createUser, testServer } from "../controllers/user.controller";

const router = Router();

router.route('/create').get(createUser)
router.route('/hello-world').get(testServer)

export default router;