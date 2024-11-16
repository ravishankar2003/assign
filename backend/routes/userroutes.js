import express from 'express';

const router = express.Router();

import { updatecountry, getuser, getdata } from '../controllers/usercontroller.js';
import { verifyToken} from '../utils/jwt.js'

router.post('/country',verifyToken, updatecountry);
router.get('/getuser',verifyToken, getuser);
router.get('/data',verifyToken, getdata);

export default router;