const express = require('express');
const router = express.Router();
const materiaCtrl = require('../controllers/materiaController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});

const upload = multer({ storage });

// Materias
router.post('/crear-materia', auth, materiaCtrl.crearMateria);
router.get('/mis-materias', auth, materiaCtrl.getMisMaterias);
router.get('/mis-alumnos', auth, materiaCtrl.getAlumnos);
router.post('/unirse', auth, materiaCtrl.unirseMateria);

// Tareas
router.post('/crear-tarea', auth, upload.single('archivo'), materiaCtrl.crearTarea);
router.get('/tareas-alumno', auth, async (req, res) => {
    try {
        const Materia = require('../models/Materia');
        const Tarea = require('../models/Tarea');
        const alumnoId = req.user.id;

        const materias = await Materia.find({ alumnos: alumnoId });
        const materiaIds = materias.map(m => m._id);

        const tareas = await Tarea.find({ materia: { $in: materiaIds } })
            .populate('materia', 'nombre codigoClase')
            .populate('entregas.alumno', '_id')
            .sort({ fechaEntrega: 1 });

        const tareasConEstado = tareas.map(t => {
            const yaEntrego = t.entregas.some(e => e.alumno._id.toString() === alumnoId);
            return { ...t.toObject(), yaEntrego };
        });

        res.json({ tareas: tareasConEstado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

router.get('/mis-materias-alumno', auth, async (req, res) => {
    try {
        const Materia = require('../models/Materia');
        const materias = await Materia.find({ alumnos: req.user.id });
        res.json({ materias });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

router.get('/mis-tareas', auth, async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        const { materiaId } = req.query;
        const filtro = { profesor: req.user.id };
        if (materiaId) filtro.materia = materiaId;
        const tareas = await Tarea.find(filtro)
            .populate('materia', 'nombre codigoClase')
            .sort({ fechaEntrega: 1 });
        res.json({ tareas });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

// Ver tarea por ID
router.get('/tarea/:id', auth, async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        const tarea = await Tarea.findById(req.params.id).populate('materia', 'nombre');
        if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json({ tarea });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
});

// Editar tarea
router.put('/tarea/:id', auth, upload.single('archivo'), async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        const { titulo, descripcion, fechaEntrega } = req.body;
        const update = { titulo, descripcion, fechaEntrega };
        if (req.file) update.archivo = req.file.path;
        const tarea = await Tarea.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json({ tarea });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// Eliminar tarea
router.delete('/tarea/:id', auth, async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        await Tarea.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// Entregar tarea
router.post('/entregar-tarea/:id', auth, upload.single('archivo'), async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        const { comentario } = req.body;
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });

        // Verificar si ya entregó
        const yaEntrego = tarea.entregas.find(e => e.alumno.toString() === req.user.id);
        if (yaEntrego) return res.status(400).json({ error: 'Ya has entregado esta tarea' });

        tarea.entregas.push({
            alumno: req.user.id,
            archivo: req.file ? req.file.path : null,
            comentario,
            fechaEntrega: new Date()
        });

        await tarea.save();
        res.json({ message: 'Tarea entregada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al entregar' });
    }
});

router.post('/expulsar-alumno', auth, async (req, res) => {
    try {
        const Materia = require('../models/Materia');
        const { alumnoId, materiaId } = req.body;
        await Materia.updateOne(
            { _id: materiaId, profesor: req.user.id },
            { $pull: { alumnos: alumnoId } }
        );
        res.json({ message: 'Alumno expulsado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al expulsar' });
    }
});

// Subir material
// Subir material (CORREGIDO)
router.post('/subir-material', auth, upload.single('archivo'), async (req, res) => {
    try {
        const Material = require('../models/Material');

        // 1. Verificación de seguridad: ¿Llegó el archivo?
        if (!req.file) {
            return res.status(400).json({ error: 'Debes seleccionar un archivo' });
        }

        const { nombre, materiaId } = req.body;

        // 2. Verificación: ¿Tenemos la materia?
        if (!materiaId) {
            return res.status(400).json({ error: 'Debes seleccionar una materia' });
        }

        const material = new Material({
            nombre: nombre || 'Material sin título',
            archivo: req.file.path, // Multer guarda la ruta aquí
            materia: materiaId,
            profesor: req.user.id
        });

        await material.save();
        res.json({ message: 'Material subido con éxito', material });

    } catch (err) {
        console.error("ERROR AL SUBIR:", err); // Esto saldrá en tu terminal de VS Code
        res.status(500).json({ error: 'Error interno al guardar el material' });
    }
});

// Obtener materiales
router.get('/material', auth, async (req, res) => {
    try {
        const Material = require('../models/Material');
        const { materiaId } = req.query;
        const materiales = await Material.find({ materia: materiaId }).sort({ createdAt: -1 });
        res.json({ materiales });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener materiales' });
    }
});

// Eliminar material
router.delete('/material/:id', auth, async (req, res) => {
    try {
        const Material = require('../models/Material');
        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// Obtener entregas de una tarea
router.get('/tarea/:id/entregas', auth, async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        const Materia = require('../models/Materia');

        const tarea = await Tarea.findById(req.params.id)
            .populate('entregas.alumno', 'nombre email');

        const materia = await Materia.findById(tarea.materia)
            .populate('alumnos', 'nombre email');

        const alumnosQueEntregaron = tarea.entregas.map(e => e.alumno._id.toString());
        const sinEntregar = materia.alumnos.filter(a => !alumnosQueEntregaron.includes(a._id.toString()));

        res.json({ tarea, entregas: tarea.entregas, sinEntregar });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener entregas' });
    }
});

// Calificar entrega
router.post('/calificar-entrega/:id', auth, async (req, res) => {
    try {
        const Tarea = require('../models/Tarea');
        const { alumnoId, calificacion, feedback } = req.body;

        const tarea = await Tarea.findById(req.params.id);
        const entrega = tarea.entregas.find(e => e.alumno.toString() === alumnoId);

        if (!entrega) return res.status(404).json({ error: 'Entrega no encontrada' });

        entrega.calificacion = calificacion;
        entrega.feedback = feedback;
        await tarea.save();

        res.json({ message: 'Calificación guardada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al calificar' });
    }
});

module.exports = router;