const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    nombreUsuario: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true
    },
    institucion: {
        type: String,
        required: [true, 'La institución es obligatoria']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
    verificado: {
        type: Boolean,
        default: false
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UsuarioSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);