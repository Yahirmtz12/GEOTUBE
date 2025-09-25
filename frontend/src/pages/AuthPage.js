// frontend/src/pages/AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css'; // 👈 Asegúrate de que esta línea esté presente


const AuthPage = ({ setAuthToken }) => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:5000/api/auth';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            let res;
            if (isRegister) {
                res = await axios.post(`${API_URL}/register`, { username, email, password, country });
                setMessage('Registro exitoso! Ya puedes iniciar sesión.');
                setIsRegister(false);
            } else {
                res = await axios.post(`${API_URL}/login`, { email, password });
                setMessage('Inicio de sesión exitoso!');
                localStorage.setItem('token', res.data.token);
                setAuthToken(res.data.token);
                navigate('/');
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
        setUsername('');
        setEmail('');
        setPassword('');
        setCountry('');
    };

    return (
        <div className="auth-page-container">
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
        </div>
    );
};

export default AuthPage;