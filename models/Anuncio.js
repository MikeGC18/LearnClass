const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
    asunto: { type: String, required: true },
    mensaje: { type: String, required: true },
    materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    leidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anuncio', anuncioSchema);
