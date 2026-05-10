const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/LearnClass')
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/materias', require('./routes/materias'));
app.use('/tareas', require('./routes/tareas'));

// Servir vistas EJS
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.get('/verificar', (req, res) => {
    res.render('verificar');
});

app.get('/bienvenida', (req, res) => 
    res.render('bienvenida'));

app.get('/dashboard-profesor', (req, res) => 
    res.render('dashboardprofesor'));

app.get('/dashboardalumno', (req, res) => {
    res.render('dashboardalumno');
});

app.get('/bienvenidaprofesor', (req, res) => 
    res.render('bienvenidaprofesor'));

app.get('/dashboardprofesor', (req, res) => 
    res.render('dashboardprofesor'));

app.get('/creartarea', (req, res) => 
    res.render('creartarea'));

app.get('/tarea/:id', (req, res) => 
    res.render('tarea'));

app.get('/tarea-alumno/:id', (req, res) => 
    res.render('tareaalumno'));

app.get('/gestionar-alumnos', (req, res) => 
    res.render('gestionaralumnos'));

app.get('/crearmateria', (req, res) => 
    res.render('crearmateria'));

app.get('/subir-material', (req, res) =>
    res.render('subirmaterial'));

app.get('/mis-asignaturas', (req, res) => 
    res.render('misasignaturas'));

const anunciosRouter = require('./routes/anuncios');
app.use('/anuncios', anunciosRouter);

app.get('/asignatura/:id', (req, res) => res.render('asignatura'));
app.get('/publicar-anuncio', (req, res) => res.render('publicaranuncio'));
app.get('/mensajes', (req, res) => res.render('mensajes'));
app.get('/entregas/:id', (req, res) => res.render('entregas'));

app.use('/uploads', express.static('uploads'));
const testsRouter = require('./routes/tests');
app.use('/tests', testsRouter);
app.get('/crear-test', (req, res) => res.render('creartest'));
const iaRouter = require('./routes/ia');
app.use('/ia', iaRouter);

app.get('/hacer-test/:id', (req, res) => res.render('hacertest'));

app.get('/calificaciones', (req, res) => {
    res.render('calificaciones');
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;