import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Sidebar = ({ userName }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/dashboard' },
        { name: 'Book appointment', path: '/book-appointment' }, 
        { name: 'My appointments', path: '/my-appointments' }, 
        { name: 'Profile', path: '/profile' }, 
    ];

    return (
        <aside className="w-64 bg-white shadow-xl flex flex-col justify-between h-full fixed top-0 left-0 pt-8 pb-4">
            <div>
                {/* Header */}
                <div className="px-6 mb-8">
                    <h1 className="text-3xl font-extrabold text-pink-600">HealthConnect</h1>
                    <p className="text-sm text-gray-500 mt-2">Welcome, <span className="font-semibold">{userName || 'Patient'}</span></p>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-lg font-medium transition duration-150 
                                ${window.location.pathname === item.path 
                                    ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'}`
                            }
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Log Out Button */}
            <div className="px-6">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-150 shadow-md"
                >
                    Log out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;