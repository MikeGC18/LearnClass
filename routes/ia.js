const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/generar-preguntas', auth, async (req, res) => {
    try {
        const { tema, num } = req.body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{
                    role: 'user',
                    content: `Genera ${num} preguntas tipo test sobre "${tema}". 
                    Responde SOLO con un JSON válido sin markdown, con este formato exacto:
                    [{"texto":"pregunta aqui","opciones":["A","B","C","D"],"correcta":0}]
                    El campo "correcta" es el índice (0,1,2,3) de la opción correcta.`
                }],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        const data = await response.json();
        console.log('Groq response:', JSON.stringify(data)); // ← añade esto
        const texto = data.choices[0].message.content;
        const preguntas = JSON.parse(texto);
        res.json({ preguntas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al generar preguntas' });
    }
});

module.exports = router;