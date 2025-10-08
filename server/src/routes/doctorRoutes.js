import express from 'express';
import { getAllDoctors, getDoctorDetailsById } from '../controllers/doctorController.js';

const router = express.Router();

router.route('/').get(getAllDoctors);

router.route('/:userId').get(getDoctorDetailsById)

export default router;