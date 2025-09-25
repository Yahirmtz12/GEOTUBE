// frontend/src/components/AuthForm.js
import React from 'react';
import miLogo from '../assets/images/LOGOGEOTUBEs.png';
import { FaUser, FaEnvelope, FaLock, FaGlobe } from 'react-icons/fa';

const AuthForm = ({
    isRegister,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    country, setCountry,
    onSubmit,
    message, error,
    onToggleAuthMode
}) => {
    return (
        // Quitamos los estilos en línea del div principal
        <div className="auth-form-card">
            <img
              src={miLogo}
              alt="Logo de GeoTube"
              className="auth-logo" // Usamos una clase CSS para el logo
            />
            {/* Quitamos estilos en línea del h2 */}
            <h2 className="auth-title">{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>

            {/* Quitamos estilos en línea del form */}
            <form onSubmit={onSubmit} className="auth-form">
                {isRegister && (
                    <>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nombre de usuario"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <FaGlobe className="input-icon" />
                            <input
                                type="text"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="País"
                                required
                            />
                        </div>
                    </>
                )}
                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Dirección de email"
                        required
                    />
                </div>
                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                </div>
                {/* Botón de submit con clase CSS */}
                <button type="submit" className="auth-submit-btn">
                    {isRegister ? 'Registrar' : 'Iniciar Sesión'}
                </button>
            </form>
            {/* Mensajes con clases CSS */}
            {message && <p className="auth-message success">{message}</p>}
            {error && <p className="auth-message error">{error}</p>}
            {/* Botón de toggle con clase CSS */}
            <button
                onClick={onToggleAuthMode}
                className="auth-toggle-btn"
            >
                {isRegister ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes una cuenta? Regístrate'}
            </button>
        </div>
    );
};

export default AuthForm;