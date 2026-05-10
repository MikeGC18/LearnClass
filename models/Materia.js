const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    codigoClase: { type: String, required: true, unique: true },
    descripcion: { type: String },
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Materia', materiaSchema);