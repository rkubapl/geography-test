import {authenticateToken, getOptionalUser} from "../middleware/auth";
import ResultController from "../controllers/result.controller";

const express = require( 'express' ),
    router = express.Router();

const resultController = new ResultController();


router.post( '/create', getOptionalUser, resultController.create );
router.get( '/leaderboard', resultController.leaderboard );
router.get( '/results', resultController.getUserResults );
// router.delete( '/delete', authenticateToken, operationController.delete );
// router.patch( '/update', authenticateToken, operationController.update );
//
// router.post( '/uploadCSV', authenticateToken, upload.single('file'), operationController.updateCSV );



export default router;