// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage'; // Importa tu página de autenticación
import './App.css'; // Tus estilos globales

// Un componente placeholder para la página de inicio
const HomePage = ({ authToken, user, onLogout }) => {
  // useEffect para cargar data de videos si authToken existe
  // En las próximas semanas aquí cargaremos los videos por geolocalización
  return (
    <div style={{ padding: '20px' }}>
      <h2>Bienvenido, {user ? user.username : 'Usuario'}!</h2>
      <p>Este es el inicio de tu aplicación de visualización de videos.</p>
      <p>Aquí se mostrarán los videos recomendados y la funcionalidad de búsqueda (¡próximamente!).</p>
      <button onClick={onLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>Cerrar Sesión</button>
    </div>
  );
};

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Aquí podrías guardar más info del usuario si la API de login la devuelve
  const navigate = useNavigate(); // Para redirigir desde App.js si el token cambia

  useEffect(() => {
    // Si el token cambia (ej. el usuario se loguea), redirigir a la página de inicio
    if (authToken && !user) {
      // En una aplicación real, harías una petición a /api/auth/me para obtener
      // los detalles del usuario con el token, para mostrar "Bienvenido [nombre]".
      // Por ahora, solo indicaremos que estamos logueados.
      console.log('Usuario autenticado con token:', authToken);
      setUser({ username: 'Registrado' }); // Placeholder
      // navigate('/'); // Ya se redirige desde AuthPage al iniciar sesión
    } else if (!authToken && user) {
      // Si el token se elimina (logout), limpiar info del usuario
      setUser(null);
      navigate('/auth'); // Redirigir a la página de autenticación al cerrar sesión
    }
  }, [authToken, user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    // setUser(null); // Esto se maneja en el useEffect
    // navigate('/auth'); // Esto se maneja en el useEffect
  };

  return (
    <div className="App">
      <nav style={{ backgroundColor: '#282c34', padding: '10px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>GeoTube</Link>
        <div>
          {authToken ? (
            <>
              <span style={{ marginRight: '15px' }}>Bienvenido {user ? user.username : ''}!</span>
              <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/auth" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Iniciar Sesión / Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      <div className="content">
        <Routes>
          {authToken ? (
            <Route path="/" element={<HomePage authToken={authToken} user={user} onLogout={handleLogout} />} />
          ) : (
            <Route path="/" element={<AuthPage setAuthToken={setAuthToken} />} />
          )}
          <Route path="/auth" element={<AuthPage setAuthToken={setAuthToken} />} />
          {/* Aquí irán las rutas para videos individuales, búsqueda, etc. en el futuro */}
        </Routes>
      </div>
    </div>
  );
}

// Wrapper para usar useNavigate fuera de un componente Route
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;