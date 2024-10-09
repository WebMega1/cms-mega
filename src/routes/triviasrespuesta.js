const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');

// Ruta GET para obtener datos de todas las tipo de canales en formato JSON
router.get('/triviasrespuestas/data', (req, res) => {
    db.query('SELECT * FROM vista_trivias_respuestas', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta GET para servir una página HTML con información de los tipos de canales
router.get('/triviasrespuestas', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/triviasrespuestas', 'respuestasvista.html'));
});





module.exports = router;