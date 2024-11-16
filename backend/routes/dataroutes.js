import express from 'express';
import { verifyToken } from '../utils/jwt.js';
import { createdata, updatedata, deletedata } from '../controllers/datacontroller.js';

const router = express.Router();

router.post('/',verifyToken, createdata);
router.put('/:id',verifyToken, updatedata);
router.delete('/:id',verifyToken, deletedata);

export default router;