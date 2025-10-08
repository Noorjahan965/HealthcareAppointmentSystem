import express from 'express';
import { bookAppointment, getMyAppointments } from '../controllers/appointmentController.js';
// import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/').post(bookAppointment); 

router.route('/me').get(getMyAppointments);;

export default router;