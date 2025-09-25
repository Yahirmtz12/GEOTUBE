// backend/routes/videoRoutes.js
const express = require('express');
const { uploadVideo, getVideoById } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware'); // Necesitaremos este middleware

const router = express.Router();

// Ruta protegida: Solo usuarios autenticados pueden subir videos
router.post('/', protect, uploadVideo);
router.get('/:id', getVideoById);

// (Más adelante, aquí irán las rutas para 'home videos' y 'search videos')

module.exports = router;