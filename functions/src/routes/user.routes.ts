import { Router } from "express";
import validateFirebaseIdToken from "../middlewares/auth.middleware";
import { testServer , registerUser, loginUser, logoutUser, editUser, deleteUser, saveNewNote, getAllNotes } from "../controllers/user.controller";

const router = Router();

//open routes
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

//secured routes
router.route('/logout').post(validateFirebaseIdToken, logoutUser)
router.route('/edit-user-details').post(validateFirebaseIdToken, editUser)
router.route('/delete-user').post(validateFirebaseIdToken, deleteUser)
router.route('/save-new-note').post(validateFirebaseIdToken, saveNewNote)
router.route('/get-notes').post(validateFirebaseIdToken, getAllNotes)


//test routes
router.route('/test').get(validateFirebaseIdToken, testServer)




export default router;