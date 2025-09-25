// frontend/src/pages/AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm'; // Importa el componente de formulario
import { useNavigate } from 'react-router-dom'; // Para redirigir

const AuthPage = ({ setAuthToken }) => {
    const navigate = useNavigate(); // Hook para la navegación
    const [isRegister, setIsRegister] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:5000/api/auth'; // ¡VERIFICA QUE COINCIDA CON EL PUERTO DE TU BACKEND!

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            let res;
            if (isRegister) {
                res = await axios.post(`${API_URL}/register`, { username, email, password, country });
                setMessage('Registro exitoso! Ya puedes iniciar sesión.');
                // Después de registrar, podríamos cambiar a modo login automáticamente
                setIsRegister(false);
            } else {
                res = await axios.post(`${API_URL}/login`, { email, password });
                setMessage('Inicio de sesión exitoso!');
                localStorage.setItem('token', res.data.token); // Guardar token en localStorage
                setAuthToken(res.data.token); // Actualizar el estado del token en App.js
                navigate('/'); // Redirigir a la página de inicio
            }
        } catch (err) {
            console.error('Error de autenticación:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.message ? err.response.data.message : 'Error de red o del servidor.');
        }
    };

    const handleToggleAuthMode = () => {
        setIsRegister(!isRegister);
        setMessage('');
        setError('');
        // Limpiar campos al cambiar de modo
        setUsername('');
        setEmail('');
        setPassword('');
        setCountry('');
    };

    return (
        <AuthForm
            isRegister={isRegister}
            username={username} setUsername={setUsername}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            country={country} setCountry={setCountry}
            onSubmit={handleSubmit}
            message={message} error={error}
            onToggleAuthMode={handleToggleAuthMode}
        />
    );
};

export default AuthPage;