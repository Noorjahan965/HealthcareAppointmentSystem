import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    // Link to the User who booked the appointment (Patient)
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    
    // Link to the User who will perform the consultation (Doctor)
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model (Doctor's User ID)
        required: true,
    },

    // Details captured from the form
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String, // Storing as string (e.g., "10:30 AM")
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },

    // Status of the appointment
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending',
    },
    
    // Additional Doctor details (optional, but good for quick reference)
    doctorFees: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;