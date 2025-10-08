import Appointment from '../models/AppointmentModel.js';
import User from '../models/User.js'; 
import Doctor from '../models/Doctor.js'; 


const bookAppointment = async (req, res) => {
    try {
        const { date, time, reason, patientId, doctorId } = req.body;

        
        if (!date || !time || !reason || !patientId || !doctorId) {
            return res.status(400).json({ message: 'Missing required booking details.' });
        }

        
        const doctorProfile = await Doctor.findOne({ userId: doctorId });
        if (!doctorProfile) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

       
        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date: new Date(date), 
            time,
            reason,
            doctorFees: doctorProfile.feesPerConsultation, 
            status: 'pending',
        });

        const createdAppointment = await newAppointment.save();
        
        res.status(201).json({
            message: 'Appointment request sent successfully.',
            appointment: createdAppointment
        });

    } catch (error) {
        console.error('Appointment booking error:', error);
        res.status(500).json({ message: 'Server error during appointment booking.' });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) {
            return res.status(400).json({message: 'Patient ID is required.' });
        }
        const appointments = await Appointment.find({ patientId: patientId })
             .populate({
                path: 'doctorId',
                select: 'fullName specialization',
                model: User
             })
             .sort({ date: 1,time: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        res.status(500).json({ message: 'Server error while fetching appointments.' });
    }
};

export { bookAppointment, getMyAppointments };