const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
    texto: { type: String, required: true },
    opciones: [{ type: String }],
    correcta: { type: Number, required: true },
    multiple: { type: Boolean, default: false }
});

const testSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    preguntas: [preguntaSchema],
    materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaEntrega: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);