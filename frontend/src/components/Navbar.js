// frontend/src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import miLogo from '../assets/images/LOGOGEOTUBE.jpg';

// Importa Bugsnag para la notificación directa
import Bugsnag from '@bugsnag/js'; // Asegúrate de que esta línea esté presente

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // >>> LÓGICA DE PRUEBA DE BUGSNAG - INICIO <<<
    const handleTestBugsnagError = () => {
        try {
            // Este es el método exacto que mencionaste para probar:
            Bugsnag.notify(new Error('Test error from Navbar direct notify'));
            console.log("Error de prueba notificado a Bugsnag desde Navbar.");
            alert("Error de prueba notificado a Bugsnag. Revisa el dashboard.");
        } catch (error) {
            console.error("Fallo al notificar el error de prueba:", error);
            alert("Error al intentar notificar a Bugsnag. Revisa la consola.");
        }
    };
    // >>> LÓGICA DE PRUEBA DE BUGSNAG - FIN <<<

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
                {/* Botón de prueba de Bugsnag para notificación directa */}
                <button
                    onClick={handleTestBugsnagError}
                    className="navbar-btn"
                    style={{ backgroundColor: 'darkgreen', color: 'white', marginRight: '10px' }}
                >
                    Test Bugsnag Notify
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