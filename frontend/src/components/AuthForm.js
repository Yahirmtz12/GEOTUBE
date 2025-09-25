// frontend/src/components/AuthForm.js
import React from 'react';
import miLogo from '../assets/images/LOGOGEOTUBE.jpg';
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <img 
              src={miLogo} 
              alt="Logo de GeoTube" 
              style={{ display: 'block', margin: '0 auto 20px', width: '100px' }} 
            />
            <h2 style={{ textAlign: 'center', color: '#333' }}>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {isRegister && (
                    <>
                        <div>
                            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="country" style={{ display: 'block', marginBottom: '5px' }}>País:</label>
                            <input
                                type="text"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                            />
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    {isRegister ? 'Registrar' : 'Iniciar Sesión'}
                </button>
            </form>
            {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '15px' }}>{message}</p>}
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{error}</p>}
            <button
                onClick={onToggleAuthMode}
                style={{ marginTop: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', alignSelf: 'center' }}
            >
                {isRegister ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes una cuenta? Regístrate'}
            </button>
        </div>
    );
};

export default AuthForm;