import asyncHandler from 'express-async-handler';
import Doctor from '../models/Doctor.js';

const getAllDoctors = asyncHandler(async(req, res) => {
    const keyword = req.query.keyword ? {
        $or: [
            { specialization: { $regex: req.query.keyword, $options: 'i'}},
            { fullName: { $regex: req.query.keyword, $options: 'i'}},
        ],
    } : {}; // No keyword ---> return all
    const doctors = await Doctor.find({ ...keyword }).select('-userId');

    if(doctors.length > 0){
        res.json(doctors);
    } else {
        res.json([]);
    }
});

export { getAllDoctors }