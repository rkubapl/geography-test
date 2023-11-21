import UserController from "../controllers/user.controller";
import {authenticateToken} from "../middleware/auth";

const express = require( 'express' ),
    router = express.Router();

const userController = new UserController();

router.post( '/register', userController.register);
router.post( '/login', userController.login);
router.post( '/info', authenticateToken, userController.info);
export default router;