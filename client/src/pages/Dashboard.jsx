import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx'; 
import { FaBars } from 'react-icons/fa'; // 🚨 NEW: Import the hamburger icon

function Dashboard() {
    
    const [userName, setUserName] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 🚨 NEW: State for sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navigate = useNavigate();

    const fetchDoctors = async (keyword = '') => {
        setLoading(true);
        setError(null);
        try {
            const url = `http://localhost:5000/api/doctors?keyword=${keyword}`;
            const { data } = await axios.get(url);
            setDoctors(data); 
            setLoading(false);
        } catch (err) {
            console.error('Doctor fetch error:', err);
            setError('Failed to load doctors. Please try again.');
            setLoading(false);
            setDoctors([]); 
        }
    };
    
    // Initial fetch and user check
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUserName(JSON.parse(userInfo).username);
        } else {
             navigate('/login');
        }
        fetchDoctors(); 
    }, [navigate]); 

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors(searchKeyword);
    };

    
    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 🚨 NEW: Hamburger Button (Visible only on small screens) */}
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-md lg:hidden"
                onClick={toggleSidebar}
            >
                <FaBars className="w-6 h-6" /> 
            </button>
            
            {/* Sidebar - Passing new props */}
            <Sidebar 
                userName={userName} 
                isOpen={isSidebarOpen} // 🚨 NEW PROP
                toggleSidebar={toggleSidebar} // 🚨 NEW PROP
            /> 

            {/* Main Content - Updated with responsive margin */}
            <main className="ml-0 lg:ml-64 p-4 sm:p-8"> 
                
                <header className="mb-8 mt-12 lg:mt-0"> {/* Adjust mt-12 for mobile space */}
                    <h1 className="text-3xl font-bold text-gray-800">Welcome to HealthConnect</h1>
                    <p className="text-lg text-gray-500">Find your ideal healthcare professional.</p>
                </header>

                {/* ... Search Section ... */}
                <section className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-pink-600">Search</h2>
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text"
                            placeholder="Search by specialty, name, or location..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </form>
                </section>
                
                {/* ... Doctor Cards Section ... */}
                <section>
                    {loading && <p className="text-center text-pink-500">Loading doctors...</p>}
                    {error && <p className="text-red-500 font-medium text-center">{error}</p>}
                    
                    <div className="space-y-6">
                        {doctors.length === 0 && !loading && !error && (
                            <p className="text-gray-500 text-center py-10 border-2 border-dashed border-gray-300 rounded-xl">
                                No doctors found matching your search. Try a different keyword.
                            </p>
                        )}
                        
                        {doctors.map(doctor => (
                            <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500">
                                
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{doctor.fullName}</h3>
                                
                                <div className="text-gray-600 space-y-1 pl-4 border-l-4 border-gray-200">
                                    <p><span className="font-semibold text-pink-600">Specialty:</span> {doctor.specialization}</p>
                                    <p><span className="font-semibold">Experience:</span> {doctor.experience} years</p>
                                    <p><span className="font-semibold">Fee:</span> ₹{doctor.feesPerConsultation} / Consultation</p>
                                    <p><span className="font-semibold">Next Available:</span> {doctor.timings[0] || 'Check Schedule'}</p>
                                </div>
                                
                                <button
                                    onClick={() => navigate(`/book-appointment/${doctor.userId}`)}
                                    className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-150 font-semibold shadow-md">
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;