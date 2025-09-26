// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';
import { FaSearch,FaMapMarkedAlt } from 'react-icons/fa';
import '../styles/HomePage.css';
import { addVideoToUserHistory } from '../utils/history'; // 👈 Importa la función

const API_URL = 'http://localhost:5000/api';

const HomePage = ({ user }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [locationName, setLocationName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchVideosByLocation = async () => {
            setLoading(true);
            setError('');
            try {
                // 1. Obtener ubicación
                const { latitude, longitude } = await getUserLocation();

                // 2. Obtener nombre de la ubicación
                const geoRes = await axios.get(`${API_URL}/location/geocode`, {
                    params: { lat: latitude, lon: longitude }
                });
                const fetchedLocationName = geoRes.data.locationName;
                setLocationName(fetchedLocationName);

                // --- CORRECCIÓN AQUÍ ---
                // 3. Buscar videos iniciales usando los parámetros correctos
                const videoRes = await axios.get(`${API_URL}/videos/search`, {
                    params: {
                        searchTerm: "videos populares", // Un término de búsqueda inicial
                        location: fetchedLocationName,   // La ubicación detectada
                        maxResults: 20
                    }
                });
                setVideos(videoRes.data);

            } catch (err) {
                console.error('Error al cargar videos por ubicación:', err);
                setError('No se pudieron cargar los videos. Revisa tus permisos de ubicación.');
                // Fallback a tendencias globales
                try {
                    const genericVideoRes = await axios.get(`${API_URL}/videos/search`, {
                        // El fallback también debe usar los parámetros correctos
                        params: {
                            searchTerm: 'tendencias globales',
                            location: '', // No especificamos ubicación para el fallback
                            maxResults: 20
                        }
                    });
                    setVideos(genericVideoRes.data);
                    setLocationName('Global');
                } catch (genericErr) {
                    console.error('Error al cargar videos genéricos:', genericErr);
                    setError('No se pudieron cargar videos en este momento.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideosByLocation();
    }, []); // Se ejecuta solo una vez al montar el componente
    const openVideoLink = (video) => { // Ahora recibe el objeto video completo
        addVideoToUserHistory(video); // 👈 Añade esta línea
        window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener noreferrer');
    };
    // Esta función ya está correcta, no necesita cambios
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        try {
            const searchResult = await axios.get(`${API_URL}/videos/search`, {
                params: {
                    searchTerm: searchQuery,
                    location: locationName,
                    maxResults: 20
                }
            });
            setVideos(searchResult.data);
        } catch (err) {
            console.error('Error al buscar videos:', err);
            setError('No se encontraron videos para tu búsqueda.');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="homepage-container">
            <div className="search-bar-container">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Busca videos en tu área..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        <FaSearch />
                    </button>
                </form>
            </div>

            <h2 className="section-title">
                Recomendaciones según tu ubicación:
                <FaMapMarkedAlt className="location-title-icon" /> <span className="location-highlight">{locationName}</span>
            </h2>

            {loading && <p className="loading-message">Cargando videos...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && videos.length === 0 && !error && (
                <p className="no-videos-message">No se encontraron videos. ¡Intenta otra búsqueda!</p>
            )}

            <div className="video-grid">
                {videos.map(video => (
                    // Modifica el onClick para llamar a openVideoLink con el objeto video
                    <a
                        key={video.id}
                        href={`https://www.youtube.com/watch?v=${video.id}`} // Enlace directo a YouTube
                        target="_blank" // Abre en una nueva pestaña
                        rel="noopener noreferrer" // Mejora la seguridad
                        className="video-card-link"
                        onClick={() => openVideoLink(video)} // 👈 Llama a la nueva función
                    >
                        <div className="video-card">
                            <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                            <h3 className="video-title">{video.title}</h3>
                            <p className="video-channel">{video.channelTitle}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default HomePage;