const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');

// Ruta GET para obtener datos de todas las tipo de canales en formato JSON
router.get('/trivias/data', (req, res) => {
    db.query('SELECT * FROM trivia_quiz', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta GET para servir una página HTML con información de los tipos de canales
router.get('/trivias', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'trivias.html'));
});

// Ruta GET para obtener datos de una trivia específica en formato JSON
router.get('/trivias/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM trivia_quiz WHERE id_quiz = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la trivia' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Trivia no encontrada' });
        }
        res.json(result[0]);
    });
});

router.get('/trivias/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'detalles.html'));
});

// Ruta GET para servir la página HTML de creación de ubicación
router.get('/trivias/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'crear.html'));
});

// Ruta POST para insertar una nueva trivia en la base de datos
router.post('/trivias/crear', (req, res) => {
    const {
        title, detail, url, imagen, imagen_m, imagen2, terms, bg_color, bg_color2,
        date_start, date_end, hidden, visa, ciudad_array, bol_email
    } = req.body;

    db.query(
        'INSERT INTO trivia_quiz (title, detail, url, imagen, imagen_m, imagen2, terms, bg_color, bg_color2, date_start, date_end, hidden, visa, ciudad_array, bol_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, detail, url, imagen, imagen_m, imagen2, terms, bg_color, bg_color2, date_start, date_end, hidden, visa, ciudad_array, bol_email],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al crear la trivia' });
            }
            res.json({ message: 'Trivia creada correctamente' });
        }
    );
});

// Ruta GET para servir la página HTML de editar de un tipo de canal
router.get('/trivias/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'editar.html'));
});

// Ruta POST para actualizar los datos de una trivia
router.post('/trivias/editar', (req, res) => {
    const {
        id_quiz, title, detail, url, imagen, imagen_m, imagen2, terms, bg_color, bg_color2,
        date_start, date_end, hidden, visa, ciudad_array, bol_email
    } = req.body;

    db.query(
        'UPDATE trivia_quiz SET title = ?, detail = ?, url = ?, imagen = ?, imagen_m = ?, imagen2 = ?, terms = ?, bg_color = ?, bg_color2 = ?, date_start = ?, date_end = ?, hidden = ?, visa = ?, ciudad_array = ?, bol_email = ? WHERE id_quiz = ?',
        [title, detail, url, imagen, imagen_m, imagen2, terms, bg_color, bg_color2, date_start, date_end, hidden, visa, ciudad_array, bol_email, id_quiz],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar la trivia:', err);
                return res.status(500).json({ error: 'Error al actualizar la trivia' });
            }
            res.json({ message: 'Trivia actualizada correctamente' });
        }
    );
});
module.exports = router;