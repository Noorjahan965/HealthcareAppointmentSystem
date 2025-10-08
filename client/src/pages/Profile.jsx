// client/src/pages/Profile.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
// 🚨 NEW: Importing icons for a better look
import { FaUser, FaEnvelope, FaTag, FaIdCard, FaBars } from 'react-icons/fa'; 

function Profile() {
    // Retrieve user data from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const { username, email, role, _id } = userInfo;
    
    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (!username) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-red-500">Please log in to view your profile.</p>
            </div>
        );
    }

    // Helper to determine the color/icon for the role
    const roleDetails = {
        'patient': { color: 'text-pink-600 bg-pink-100', icon: FaTag, label: 'Patient' },
        'doctor': { color: 'text-green-600 bg-green-100', icon: FaTag, label: 'Doctor' },
        'admin': { color: 'text-blue-600 bg-blue-100', icon: FaTag, label: 'Admin' },
    }[role] || { color: 'text-gray-600 bg-gray-100', icon: FaTag, label: 'User' };


    // Reusable component for a single detail item
    const ProfileDetail = ({ Icon, title, value, colorClass }) => (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border-l-4 border-gray-200 hover:border-pink-500 transition duration-150">
            <Icon className={`w-6 h-6 mr-4 ${colorClass || 'text-gray-500'}`} />
            <div>
                <p className="text-sm font-semibold text-gray-500">{title}</p>
                <p className="text-lg font-medium text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-50">
            
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-md lg:hidden"
                onClick={toggleSidebar}
            >
                <FaBars className="w-6 h-6" />
            </button>
            
            <Sidebar 
                userName={username}
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            /> 
            
            <main className="ml-0 lg:ml-64 p-4 sm:p-8">
                <div className="max-w-xl mx-auto">
                    
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b pb-4">My Profile</h1>
                    
                    {/* Profile Header Card */}
                    <div className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {username[0]?.toUpperCase() || 'U'}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">{username}</h2>
                        <span className={`mt-2 px-4 py-1 text-sm font-semibold rounded-full ${roleDetails.color}`}>
                            {roleDetails.label}
                        </span>
                    </div>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        
                        <ProfileDetail 
                            Icon={FaUser} 
                            title="Username" 
                            value={username} 
                            colorClass="text-pink-500"
                        />
                        
                        <ProfileDetail 
                            Icon={FaEnvelope} 
                            title="Email Address" 
                            value={email} 
                            colorClass="text-indigo-500"
                        />
                        
                        <ProfileDetail 
                            Icon={FaIdCard} 
                            title="Unique User ID" 
                            value={_id} 
                            colorClass="text-gray-500"
                        />
                    </div>
                    
                </div>
            </main>
        </div>
    );
}

export default Profile;