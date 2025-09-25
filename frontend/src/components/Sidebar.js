// frontend/src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaVideo, FaTimes,FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose ,onLogout}) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-close-btn" onClick={onClose}>
                <FaTimes />
            </button>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/" onClick={onClose}>
                        <FaHome />
                        <span>Inicio</span>
                    </Link>
                </li>
                
                <li className="sidebar-separator"></li> {/* Separador visual */}
                

                
            </ul>
        </div>
    );
};

export default Sidebar;