const express = require('express');
const router = express.Router();
const materiaCtrl = require('../controllers/materiaController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/crear-tarea', auth, upload.single('archivo'), materiaCtrl.crearTarea);
router.get('/tareaalumno/:codigoClase', auth, materiaCtrl.getTareasAlumno);

module.exports = router;