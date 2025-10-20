// backend/src/utils/youtube.js
const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';


// La función ahora acepta searchTerm y location
async function searchYoutubeVideos(searchTerm, location, maxResults = 20) {
    if (!YOUTUBE_API_KEY) {
        throw new Error('La clave API de YouTube no está configurada.');
    }

    // Construimos la consulta final. Si hay ubicación, la añadimos.
    const finalQuery = location ? `${searchTerm} ${location}` : searchTerm;

    try {
        const searchRes = await axios.get(`${YOUTUBE_API_URL}/search`, {
            params: {
                key: YOUTUBE_API_KEY,
                q: finalQuery, // Usamos la consulta final
                part: 'snippet',
                type: 'video',
                maxResults: maxResults,
                // Le decimos a YouTube que priorice resultados relevantes para México (MX)
                regionCode: 'MX'
            }
        });


        const items = searchRes.data.items || [];
        if (items.length === 0) return [];

        const ids = items.map(it => it.id.videoId).join(',');

        // 2) videos.list para obtener contentDetails (para rating) y snippet
        const detailsRes = await axios.get(`${YOUTUBE_API_URL}/videos`, {
            params: {
                key: YOUTUBE_API_KEY,
                id: ids,
                part: 'snippet,contentDetails'
            }
        });


        const details = detailsRes.data.items || [];

        // Mapear por id para combinar info
        const detailsById = {};
        details.forEach(d => {
            detailsById[d.id] = d;
        });

        // Revisar restricciones adicionales para EE. UU. y Japón
        const extraRegions = ['US', 'JP'];
        for (const region of extraRegions) {
            try {
                const regionalDetails = await axios.get(`${YOUTUBE_API_URL}/videos`, {
                    params: {
                        key: YOUTUBE_API_KEY,
                        id: ids,
                        part: 'contentDetails',
                        regionCode: region
                    }
                });

                regionalDetails.data.items.forEach(d => {
                    const id = d.id;
                    const cr = d.contentDetails?.contentRating;
                    if (
                        cr?.ytRating === 'ytAgeRestricted' ||
                        cr?.ageRestricted === true ||
                        cr?.audiovisualRating === '18+'
                    ) {
                        if (!detailsById[id]) detailsById[id] = {};
                        detailsById[id].ageRestricted = true;
                    }
                });
            } catch (regionErr) {
                console.warn(`No se pudieron obtener detalles para ${region}:`, regionErr.message);
            }
        }

        // 4️⃣ Armar el resultado final combinando datos y bandera de edad
        const results = items.map(it => {
            const vidId = it.id.videoId;
            const det = detailsById[vidId] || {};
            const snippet = det.snippet || it.snippet || {};

            // Determinar si está restringido por edad
            let ageRestricted = false;
            const cr = det.contentDetails?.contentRating;
            if (
                cr?.ytRating === 'ytAgeRestricted' ||
                cr?.ageRestricted === true ||
                cr?.audiovisualRating === '18+'
            ) {
                ageRestricted = true;
            }

            // O si se marcó durante la revisión regional
            if (det.ageRestricted) ageRestricted = true;

            const thumbnail =
                snippet.thumbnails?.high?.url ||
                snippet.thumbnails?.default?.url ||
                '';

            return {
                id: vidId,
                title: snippet.title || it.snippet.title,
                description: snippet.description || '',
                thumbnail,
                channelTitle: snippet.channelTitle || '',
                publishedAt: snippet.publishedAt || '',
                ageRestricted
            };
        });

        return results;
    } catch (error) {
        console.error('Error al buscar videos en YouTube:', error.response ? error.response.data : error.message);
        throw new Error('Error al buscar videos de YouTube.');
    }
}

module.exports = { searchYoutubeVideos };