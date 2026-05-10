const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    archivo: { type: String, required: true },
    materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);