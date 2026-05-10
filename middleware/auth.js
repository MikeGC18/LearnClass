const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado' });
    }

    try {
        const verificado = jwt.verify(token, process.env.SESSION_SECRET || 'secret_key');
        req.user = verificado;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido' });
    }
};

module.exports = auth;