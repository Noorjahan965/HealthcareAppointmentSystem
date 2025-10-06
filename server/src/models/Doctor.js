import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    feesPerConsultation: {
        type: Number,
        required: true,
    },
    timings: {
        type: [String],
        required: true,
    },
}, {timestamps: true});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;