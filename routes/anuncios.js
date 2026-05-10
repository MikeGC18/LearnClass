const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Anuncio = require('../models/Anuncio');
const Materia = require('../models/Materia');

// Publicar anuncio
router.post('/publicar', auth, async (req, res) => {
    try {
        const { materiaId, asunto, mensaje } = req.body;
        const anuncio = new Anuncio({
            asunto, mensaje,
            materia: materiaId,
            profesor: req.user.id,
            leidoPor: []
        });
        await anuncio.save();
        res.json({ message: 'Anuncio publicado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al publicar' });
    }
});

// Obtener anuncios del alumno
router.get('/mis-anuncios', auth, async (req, res) => {
    try {
        const materias = await Materia.find({ alumnos: req.user.id });
        const materiaIds = materias.map(m => m._id);
        const anuncios = await Anuncio.find({ materia: { $in: materiaIds } })
            .populate('materia', 'nombre')
            .sort({ createdAt: -1 });

        const anunciosConEstado = anuncios.map(a => ({
            ...a.toObject(),
            leido: a.leidoPor.includes(req.user.id)
        }));

        res.json({ anuncios: anunciosConEstado });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

// ANUNCIOS NO-LEIDOS
router.get('/no-leidos', auth, async (req, res) => {
    try {
        // ID del alumno que hace la petición (viene del token JWT)
        const idAlumno = req.user.id;

        // Buscamos todas las materias donde está matriculado el alumno
        const materiasDelAlumno = await Materia.find({ alumnos: idAlumno });

        // Sacamos solo los IDs de esas materias
        const idsDeMateriasDelAlumno = materiasDelAlumno.map(materia => materia._id);

        // Contamos los anuncios que:
        // 1. Pertenezcan a alguna de sus materias ($in)
        // 2. El alumno todavía no haya leído ($ne = not equal)
        const totalAnunciosNoLeidos = await Anuncio.countDocuments({
            materia: { $in: idsDeMateriasDelAlumno },
            leidoPor: { $ne: idAlumno }
        });

        // Devolvemos el número al frontend para mostrarlo en la campana
        res.json({ count: totalAnunciosNoLeidos });

    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

// Marcar todos como leídos
router.post('/marcar-leidos', auth, async (req, res) => {
    try {
        const materias = await Materia.find({ alumnos: req.user.id });
        const materiaIds = materias.map(m => m._id);
        await Anuncio.updateMany(
            { materia: { $in: materiaIds }, leidoPor: { $ne: req.user.id } },
            { $push: { leidoPor: req.user.id } }
        );
        res.json({ message: 'Marcados como leídos' });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

module.exports = router;