const mongoose = require('mongoose');

const entregaSchema = new mongoose.Schema({
    alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    archivo: { type: String },
    comentario: { type: String },
    fechaEntrega: { type: Date, default: Date.now },
    calificacion: { type: Number, default: null },
    feedback: { type: String }
});

const tareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
    profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    archivo: { type: String },
    fechaEntrega: { type: Date, required: true },
    entregas: [entregaSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tarea', tareaSchema);
