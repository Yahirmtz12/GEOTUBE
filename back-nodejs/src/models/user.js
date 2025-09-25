// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para hashear contraseñas

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, introduce un email válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    country: { // Para filtrar videos por el país del usuario si fuera necesario
        type: String,
        trim: true,
        default: 'Desconocido'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware de Mongoose: Hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);