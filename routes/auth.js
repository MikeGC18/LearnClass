const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authcontrollers');
const auth = require('../middleware/auth');

// Rutas públicas
router.post('/registro', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/verificar-pin', authCtrl.verificarPin);

// Rutas protegidas
router.post('/logout', auth, authCtrl.logout);
router.get('/me', auth, authCtrl.me);
router.get('/rol', authCtrl.getRol);
router.post('/reenviar-pin', authCtrl.reenviarPin);

module.exports = router;