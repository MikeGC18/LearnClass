const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Test = require('../models/Test');
const Materia = require('../models/Materia');

// Crear test
router.post('/crear', auth, async (req, res) => {
    try {
        const { titulo, preguntas, materiaId, fechaEntrega } = req.body;
        const test = new Test({
            titulo, preguntas,
            materia: materiaId,
            profesor: req.user.id,
            fechaEntrega
        });
        await test.save();
        res.json({ message: 'Test creado', test });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear test' });
    }
});

// Obtener tests de una materia (para el alumno)
router.get('/materia/:materiaId', auth, async (req, res) => {
    try {
        const tests = await Test.find({ materia: req.params.materiaId })
            .populate('materia', 'nombre')
            .sort({ createdAt: -1 });
        res.json({ tests });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tests' });
    }
});

// Obtener todos los tests del alumno (para el dashboard)
router.get('/mis-tests', auth, async (req, res) => {
    try {
        const materias = await Materia.find({ alumnos: req.user.id });
        const materiaIds = materias.map(m => m._id);
        const tests = await Test.find({ materia: { $in: materiaIds } })
            .populate('materia', 'nombre')
            .sort({ fechaEntrega: 1 });
        res.json({ tests });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tests' });
    }
});

// Obtener tests del profesor
router.get('/mis-tests-profesor', auth, async (req, res) => {
    try {
        const { materiaId } = req.query;
        const filtro = { profesor: req.user.id };
        if (materiaId) filtro.materia = materiaId;
        const tests = await Test.find(filtro)
            .populate('materia', 'nombre')
            .sort({ createdAt: -1 });
        res.json({ tests });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

module.exports = router;