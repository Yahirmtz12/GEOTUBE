// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Importar Rutas ---
const authRoutes = require('./routes/authRoutes');
// Por ahora, no necesitamos importar videoRoutes si hemos quitado las funciones de CRUD
// Ya que la funcionalidad de video la haremos en Semana 2 y 3
// const videoRoutes = require('./routes/videoRoutes'); 
// --------------------

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos (este bloque ya lo tienes)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube_geo';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado exitosamente a MongoDB.');
        mongoose.connection.on('error', err => console.error('Error de conexión a MongoDB:', err));
        mongoose.connection.on('disconnected', () => console.warn('MongoDB se ha desconectado. Intentando reconectar...'));
    })
    .catch(err => {
        console.error('ERROR al conectar a MongoDB:', err);
        process.exit(1);
    });

// --- Usar Rutas ---
app.use('/api/auth', authRoutes); // Todas las rutas de autenticación irán bajo /api/auth
// Las rutas de video las añadiremos en la Semana 2 cuando implementemos home y search
// app.use('/api/videos', videoRoutes);
// --------------------

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de YouTube Geo en funcionamiento!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});