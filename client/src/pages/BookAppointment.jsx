import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Utility function to generate placeholder time slots for a day
const generateTimeSlots = () => {
    // In a real app, this would come from the doctor's schedule API
    return [
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"
    ];
};

function BookAppointment() {
    // --- Hooks and State ---
    const { doctorId } = useParams(); // Get the doctor ID from the URL
    const navigate = useNavigate();
    
    // Get user info for the sidebar
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = userInfo.username;

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Form state for booking
    const [bookingDetails, setBookingDetails] = useState({
        date: '',
        time: '',
        reason: '',
        patientId: userInfo._id || null, // Capture logged-in user's ID
        doctorId: doctorId
    });

    const availableSlots = generateTimeSlots();
    const isFormValid = bookingDetails.date && bookingDetails.time && bookingDetails.reason;

    // --- Data Fetching: Get Doctor Details ---
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                // Fetch the specific doctor's profile data
                const { data } = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
                setDoctor(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch doctor details:", err);
                setError('Could not load doctor details.');
                setLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctorDetails();
        } else {
            // Handle case where doctorId is missing in URL
            navigate('/dashboard');
        }
    }, [doctorId, navigate]);

    // --- Handlers ---
    const handleInputChange = (e) => {
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            setError('Please fill out all required fields.');
            return;
        }

        if (!bookingDetails.patientId) {
            alert("You must be logged in to book an appointment.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // In a real app, you would pass the patient's JWT in the headers.
            // For now, we'll send the data to the API endpoint we planned:
            const { data } = await axios.post(
                'http://localhost:5000/api/appointments', // API endpoint to be built later
                bookingDetails
            );

            alert('Appointment successfully booked!');
            console.log('Booking confirmed:', data);
            
            // Redirect to the appointments list or dashboard
            navigate('/my-appointments'); 

        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    // --- Render Logic ---

    if (loading) return <div className="min-h-screen flex items-center justify-center ml-64">Loading doctor...</div>;
    if (error && !doctor) return <div className="min-h-screen flex items-center justify-center ml-64 text-red-500">{error}</div>;
    if (!doctor) return <div className="min-h-screen flex items-center justify-center ml-64">Doctor not found.</div>;
    
    // If successful, render the form:
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar userName={userName} /> 
            
            <main className="ml-64 p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-pink-700 mb-8">Book Appointment</h1>
                    
                    {/* Doctor Header Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-pink-500 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">{doctor.fullName}</h2>
                        <p className="text-lg text-gray-600 mt-1">{doctor.specialization}</p>
                        <p className="text-sm text-gray-500">Fee: ₹{doctor.feesPerConsultation} | Experience: {doctor.experience} yrs</p>
                    </div>

                    {error && <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg' role='alert'>{error}</div>}

                    {/* Booking Form */}
                    <form onSubmit={handleBookingSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                        
                        {/* 1. Date Selection */}
                        <div>
                            <label htmlFor="date" className="block text-lg font-semibold text-gray-700 mb-2">Select Date:</label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                min={new Date().toISOString().split('T')[0]} // Prevents booking in the past
                                value={bookingDetails.date}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* 2. Time Slot Selection */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">Select Time Slot:</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setBookingDetails({...bookingDetails, time: slot})}
                                        className={`p-3 rounded-lg font-medium transition duration-150
                                            ${bookingDetails.time === slot
                                                ? 'bg-pink-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Reason for Visit (Added Detail) */}
                         <div>
                            <label htmlFor="reason" className="block text-lg font-semibold text-gray-700 mb-2">Reason for Visit:</label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={bookingDetails.reason}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Briefly describe why you are booking this appointment..."
                                required
                                className="w-full p-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            ></textarea>
                        </div>
                        
                        {/* 4. Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={`w-full text-white py-3 px-4 rounded-lg font-semibold transition duration-150 
                                ${loading || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {loading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default BookAppointment;