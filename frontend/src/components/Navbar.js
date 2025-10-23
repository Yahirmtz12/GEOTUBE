// frontend/src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import miLogo from '../assets/images/LOGOGEOTUBE.jpg';

// Importa Bugsnag para la notificación directa
import Bugsnag from '@bugsnag/js';

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Estado para provocar el error de renderizado
    const [triggerRenderError, setTriggerRenderError] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Lógica para el error de renderizado
    if (triggerRenderError) {
        // Este error será capturado por el ErrorBoundary que envuelve AppWrapper en index.js
        throw new Error('Bugsnag Test Error - Navbar Render Crash!');
    }

    // Lógica para la notificación directa
    const handleDirectNotifyError = () => {
        try {
            // Este error no detendrá la aplicación, solo lo notificará
            throw new Error('Bugsnag Test Error - Navbar Direct Notification!');
        } catch (error) {
            Bugsnag.notify(error, event => {
                event.addMetadata('component', { name: 'Navbar', type: 'direct-notify' });
            });
            console.error("Error notificado directamente por Navbar:", error);
            alert("Error directo notificado a Bugsnag. Revisa el dashboard.");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
                    <FaBars />
                </button>
                <Link to="/" className="navbar-brand">
                    <img src={miLogo} alt="GeoTube Logo" className="navbar-logo" />
                    <span>GeoTube</span>
                </Link>
            </div>
            <div className="navbar-right">
                {/* Botones de prueba de Bugsnag */}
                <button
                    onClick={() => setTriggerRenderError(true)}
                    className="navbar-btn"
                    style={{ backgroundColor: 'darkred', color: 'white', marginRight: '10px' }}
                >
                    Crash Frontend
                </button>
                <button
                    onClick={handleDirectNotifyError}
                    className="navbar-btn"
                    style={{ backgroundColor: 'darkorange', color: 'white', marginRight: '10px' }}
                >
                    Notify Error
                </button>

                {user ? (
                    <div className="user-dropdown-container" ref={dropdownRef}>
                        <div className="user-info-clickable" onClick={toggleDropdown}>
                            <FaUserCircle className="user-icon" />
                            <span className="welcome-text">{user.username}</span>
                        </div>

                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={onLogout} className="dropdown-logout-btn">
                                    <FaSignOutAlt />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/auth" className="navbar-btn login-btn">
                            <FaUserCircle />
                            <span className="btn-text">Acceder</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;