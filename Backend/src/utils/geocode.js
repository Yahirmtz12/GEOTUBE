// backend/src/utils/geocode.js
const axios = require('axios');

// Nominatim API de OpenStreetMap
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

// Función para obtener el nombre de una ubicación a partir de latitud y longitud
async function reverseGeocode(latitude, longitude) {
    try {
        const response = await axios.get(NOMINATIM_API_URL, {
            params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
                zoom: 10, // Nivel de detalle (10 para ciudad/estado)
                addressdetails: 1, // Incluir detalles de la dirección
                // --- ¡CAMBIO AQUÍ! ---
                // Le pedimos a la API que prefiera los nombres en español
                'accept-language': 'es'
            },
            headers: {
                'User-Agent': 'GeoTubeApp/1.0 (21161600@itoaxaca.edu.mx)' 
            },
            timeout: 10000
        });
        

        const data = response.data;
        let locationName = 'Mundo';
        let countryCode = 'MX'; // Código por defecto

        if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state || data.address.county;
            const country = data.address.country;

            if (city) locationName = city;
            else if (state) locationName = state;
            else if (country) locationName = country;

            if (data.address.country_code) {
                countryCode = data.address.country_code.toLowerCase();
            }
        }
        
        return { locationName, countryCode };

    } catch (error) {
    console.error('Error al hacer geocodificación inversa DETALLADO:');
    // Imprimir el objeto de error completo para ver todos los detalles
    console.error(error); 
    // Si es un error de Axios, `error.response` contendrá más detalles de la API
    if (error.response) {
        console.error('Respuesta de error de Nominatim API:', error.response.data);
        console.error('Estado de error de Nominatim API:', error.response.status);
    }
    return { locationName: 'Mundo', countryCode: 'mx' }; 
    }
}

module.exports = { reverseGeocode };