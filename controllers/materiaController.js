const Materia = require('../models/Materia');
const Tarea = require('../models/Tarea');
const Usuario = require('../models/Usuario');

// Crear materia
exports.crearMateria = async (req, res) => {
    try {
        const { nombre, codigoClase, descripcion } = req.body;
        const profesorId = req.user.id; // viene del JWT

        const existeMateria = await Materia.findOne({ codigoClase });
        if (existeMateria) {
            return res.status(400).json({ error: 'El código de clase ya existe' });
        }

        const nuevaMateria = new Materia({
            nombre,
            codigoClase,
            descripcion,
            profesor: profesorId,
            alumnos: []
        });

        await nuevaMateria.save();
        res.status(201).json({ message: 'Materia creada exitosamente', materia: nuevaMateria });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear materia' });
    }
};

// Obtener alumnos del profesor autenticado
exports.getAlumnos = async (req, res) => {
    try {
        const profesorId = req.user.id;
        const { materiaId } = req.query;

        const filtro = { profesor: profesorId };
        if (materiaId) filtro._id = materiaId;

        const materias = await Materia.find(filtro)
            .populate('alumnos', 'nombre nombreUsuario email institucion');

        const alumnosMap = new Map();
        materias.forEach(m => {
            m.alumnos.forEach(a => alumnosMap.set(a._id.toString(), a));
        });

        res.json({ alumnos: Array.from(alumnosMap.values()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
};

// Obtener materias del profesor autenticado
exports.getMisMaterias = async (req, res) => {
    try {
        const profesorId = req.user.id;
        const materias = await Materia.find({ profesor: profesorId })
            .populate('alumnos', 'nombre email');
        res.json({ materias });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener materias' });
    }
};

// Unirse a una materia
exports.unirseMateria = async (req, res) => {
    try {
        const { codigoClase } = req.body;
        const alumnoId = req.user.id; // viene del JWT

        const materia = await Materia.findOne({ codigoClase });
        if (!materia) {
            return res.status(404).json({ error: 'Código de clase incorrecto' });
        }

        // Verificar si ya está matriculado
        if (materia.alumnos.includes(alumnoId)) {
            return res.status(400).json({ error: 'Ya estás matriculado en esta materia' });
        }

        materia.alumnos.push(alumnoId);
        await materia.save();

        res.json({ message: 'Te uniste a la materia exitosamente', materia });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al unirse a la materia' });
    }
};

// Crear tarea
exports.crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion, materiaCodigo, fechaEntrega } = req.body;
        const profesorId = req.user.id;

        const materia = await Materia.findOne({ codigoClase: materiaCodigo });
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }

        const nuevaTarea = new Tarea({
            titulo,
            descripcion,
            materia: materia._id,
            profesor: profesorId,
            archivo: req.file ? req.file.path : null,
            fechaEntrega
        });

        await nuevaTarea.save();
        res.status(201).json({ message: 'Tarea creada exitosamente', tarea: nuevaTarea });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};

// Obtener tareas de una materia (para alumnos)
exports.getTareasAlumno = async (req, res) => {
    try {
        const alumnoId = req.user.id;

        // Buscar materias donde está el alumno
        const materias = await Materia.find({ alumnos: alumnoId });
        const materiaIds = materias.map(m => m._id);

        const tareas = await Tarea.find({ materia: { $in: materiaIds } })
            .populate('materia', 'nombre codigoClase')
            .populate('profesor', 'nombre email')
            .sort({ fechaEntrega: 1 });

        res.json({ tareas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};