// backend/src/utils/youtube.js
const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// --- CAMBIO AQUÍ ---
// La función ahora acepta searchTerm y location
async function searchYoutubeVideos(searchTerm, location, maxResults = 10) {
    if (!YOUTUBE_API_KEY) {
        throw new Error('La clave API de YouTube no está configurada.');
    }

    // Construimos la consulta final. Si hay ubicación, la añadimos.
    const finalQuery = location ? `${searchTerm} ${location}` : searchTerm;

    try {
        const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
            params: {
                key: YOUTUBE_API_KEY,
                q: finalQuery, // Usamos la consulta final
                part: 'snippet',
                type: 'video',
                maxResults: maxResults,
                // --- TRUCO EXTRA ---
                // Le decimos a YouTube que priorice resultados relevantes para México (MX)
                regionCode: 'MX' 
            }
        });

        // Mapear los resultados a un formato más limpio
        return response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));

    } catch (error) {
        console.error('Error al buscar videos en YouTube:', error.response ? error.response.data : error.message);
        throw new Error('Error al buscar videos de YouTube.');
    }
}

module.exports = { searchYoutubeVideos };