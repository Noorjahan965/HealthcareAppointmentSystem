import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { format } from 'date-fns'; 

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = userInfo.username;
    const patientId = userInfo._id;

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!patientId) {
                setError('User not logged in or ID missing.');
                setLoading(false);
                return;
            }

            try {
                const url = `http://localhost:5000/api/appointments/me?patientId=${patientId}`;
                const { data } = await axios.get(url);
                setAppointments(data); 
                setLoading(false);
            } catch (err) {
                console.error('Appointment fetch error:', err);
                setError('Failed to load appointments.');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]); 
    
    const AppointmentCard = ({ appt }) => {
        const doctorName = appt.doctorId ? appt.doctorId.fullName : 'Doctor Deleted';
        
        const date = format(new Date(appt.date), 'EEEE, MMM do, yyyy'); 
        
        const statusClasses = {
            'confirmed': 'border-green-500 bg-green-100 text-green-700',
            'pending': 'border-pink-500 bg-pink-100 text-pink-700',
            'canceled': 'border-red-500 bg-red-100 text-red-700',
            'completed': 'border-gray-500 bg-gray-100 text-gray-700',
        };

        const currentStatus = appt.status.toLowerCase();
        const { border, statusBg, statusText } = {
            border: statusClasses[currentStatus].split(' ')[0],
            statusBg: statusClasses[currentStatus].split(' ')[1],
            statusText: statusClasses[currentStatus].split(' ')[2],
        };


        return (
            <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${border}`}>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Appointment with Dr. {doctorName}
                </h3>
                
                <div className="text-gray-600 space-y-1">
                    <p><span className="font-semibold">Date:</span> {date}</p>
                    <p><span className="font-semibold">Time:</span> {appt.time}</p>
                    <p><span className="font-semibold">Reason:</span> {appt.reason}</p>
                    <p><span className="font-semibold">Fee:</span> ₹{appt.doctorFees}</p>
                    <p>
                        <span className="font-semibold">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${statusBg} ${statusText}`}>
                            {appt.status.toUpperCase()}
                        </span>
                    </p>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50">
            
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-md lg:hidden"
                onClick={toggleSidebar}
            >
                
                Menu
            </button>

            <Sidebar 
                userName={userName}
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            /> 
            
            <main className="ml-0 lg:ml-64 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-pink-700 mb-8">My Appointments</h1>
                    
                    {loading && <p className="text-center text-pink-500">Loading appointments...</p>}
                    {error && <p className="text-red-500 font-medium text-center">{error}</p>}
                    
                    <div className="space-y-6">
                        {appointments.length === 0 && !loading && !error ? (
                            <p className="text-gray-500 text-center py-10 border-2 border-dashed border-gray-300 rounded-xl">
                                You currently have no appointments booked.
                            </p>
                        ) : (
                            appointments.map(appt => (
                                <AppointmentCard key={appt._id} appt={appt} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MyAppointments;