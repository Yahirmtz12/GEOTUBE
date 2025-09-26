// frontend/src/pages/ExplorePage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';
import MapComponent from '../components/MapComponent'; // Importa el mapa
import '../styles/ExplorePage.css'; // Crearemos este archivo de estilos

const API_URL = 'http://localhost:5000/api';

const ExplorePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [locationName, setLocationName] = useState('tu ubicación');
    const [mapCenter, setMapCenter] = useState(null); // Estado para las coordenadas del mapa

    // Función para obtener videos, la envolvemos en useCallback para optimización
    const fetchVideosForLocation = useCallback(async (lat, lng) => {
        setLoading(true);
        setError('');
        try {
            // 1. Obtener nombre de la ubicación a partir de las coordenadas
            const geoRes = await axios.get(`${API_URL}/location/geocode`, {
                params: { lat, lon: lng }
            });
            const fetchedLocationName = geoRes.data.locationName;
            setLocationName(fetchedLocationName);

            // 2. Buscar videos para esa ubicación
            const videoRes = await axios.get(`${API_URL}/videos/search`, {
                params: { searchTerm: `videos de ${fetchedLocationName}`, maxResults: 15 }
            });
            setVideos(videoRes.data);

        } catch (err) {
            console.error('Error al cargar videos por ubicación:', err);
            setError('No se pudieron cargar los videos para esta ubicación.');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, []); // El array vacío significa que esta función no se recreará en cada render

    // Efecto para obtener la ubicación inicial del usuario
    useEffect(() => {
        const getInitialLocation = async () => {
            try {
                const { latitude, longitude } = await getUserLocation();
                setMapCenter({ lat: latitude, lng: longitude });
            } catch (error) {
                console.error('Error obteniendo ubicación inicial:', error);
                setError('No se pudo obtener tu ubicación inicial. Mostrando una ubicación por defecto.');
                // Ubicación de fallback (ej. Ciudad de México)
                setMapCenter({ lat: 19.4326, lng: -99.1332 });
            }
        };
        getInitialLocation();
    }, []); // Se ejecuta solo una vez al montar

    // Efecto que se activa cuando el centro del mapa cambia
    useEffect(() => {
        if (mapCenter) {
            fetchVideosForLocation(mapCenter.lat, mapCenter.lng);
        }
    }, [mapCenter, fetchVideosForLocation]); // Depende de mapCenter y de la función de fetch

    // Función que se pasará al mapa para manejar el movimiento
    const handleMapMove = (newCenter) => {
        setMapCenter(newCenter); // Actualiza el estado del centro del mapa
    };

    return (
        <div className="explore-container">
            <div className="map-section">
                <MapComponent center={mapCenter} onMapMove={handleMapMove} />
            </div>
            <div className="videos-section">
                <h2 className="section-title">Explorando videos en: <br/><span className="location-highlight">{locationName}</span></h2>
                
                {loading && <p className="loading-message">Actualizando videos...</p>}
                {error && <p className="error-message">{error}</p>}
                
                <div className="videos-list">
                    {videos.map(video => (
                        <div key={video.id} className="video-item">
                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                <img src={video.thumbnail} alt={video.title} className="video-thumbnail-small" />
                                <div className="video-info">
                                    <h4 className="video-title-small">{video.title}</h4>
                                    <p className="video-channel-small">{video.channelTitle}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;