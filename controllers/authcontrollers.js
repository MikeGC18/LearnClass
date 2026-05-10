const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Memoria temporal para PINs
let codigosTemporales = {};

// Configurar Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// REGISTRO Y ENVÍO DE PIN
exports.register = async (req, res) => {
    try {
        const { name, username, email, password, role , institucion} = req.body;

        const existeUsuario = await Usuario.findOne({ $or: [{ email }, { nombreUsuario: username }] });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email o usuario ya existen' });
        }

        const nuevoUsuario = new Usuario({
            nombre: name,
            nombreUsuario: username,
            institucion: institucion,
            email,
            password: password,
            role: role || 'student',
            verificado: false
        });

        await nuevoUsuario.save();

        const pin = Math.floor(100000 + Math.random() * 900000);
        codigosTemporales[email] = pin;

        await transporter.sendMail({
            from: `"LearnClass" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Tu Código de Verificación - LearnClass',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">🎓 LearnClass</h2>
                    <p>Hola <strong>${name}</strong>, gracias por registrarte.</p>
                    <p>Tu PIN de verificación es:</p>
                    <h1 style="letter-spacing: 8px; color: #4f46e5;">${pin}</h1>
                    <p style="color: #888; font-size: 12px;">Este PIN expira cuando reinicies el servidor.</p>
                </div>
            `
        });

        console.log(`📧 PIN enviado a ${email}`);
        res.status(201).json({ message: 'Usuario creado. PIN enviado.', email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// VERIFICAR EL PIN
exports.verificarPin = async (req, res) => {
    const { email, pinIngresado } = req.body;

    if (codigosTemporales[email] && codigosTemporales[email] == pinIngresado) {
        const usuario = await Usuario.findOneAndUpdate(
            { email },
            { verificado: true },
            { new: true }
        );
        delete codigosTemporales[email];

        // Generar token igual que en login
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.role, email: usuario.email },
            process.env.SESSION_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Cuenta verificada correctamente',
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role
            }
        });
    } else {
        res.status(400).json({ success: false, error: 'PIN incorrecto o expirado' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email }).select('+password');

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!usuario.verificado) {
            return res.status(403).json({ error: 'Por favor, verifica tu cuenta con el PIN' });
        }

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.role, email: usuario.email },
            process.env.SESSION_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el login' });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    res.json({ message: 'Logout exitoso' });
};

// PERFIL
exports.me = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ user: usuario });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

exports.getRol = async (req, res) => {
    try {
        const { email } = req.query;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(404).json({ error: 'No encontrado' });
        res.json({ role: usuario.role });
    } catch (err) {
        res.status(500).json({ error: 'Error' });
    }
};

exports.reenviarPin = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) return res.status(404).json({ error: 'Email no encontrado' });
        if (usuario.verificado) return res.status(400).json({ error: 'La cuenta ya está verificada' });

        const pin = Math.floor(100000 + Math.random() * 900000);
        codigosTemporales[email] = pin;

        await transporter.sendMail({
            from: `"LearnClass" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Tu nuevo PIN - LearnClass',
            html: `<h2>LearnClass</h2><p>Tu nuevo PIN es: <strong>${pin}</strong></p>`
        });

        res.json({ message: 'PIN reenviado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al reenviar el PIN' });
    }
};