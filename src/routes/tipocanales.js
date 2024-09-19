const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');

// Ruta GET para obtener datos de todas las tipo de canales en formato JSON
router.get('/tiposcanales/data', (req, res) => {
    db.query('SELECT * FROM mega_tipocanales', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta GET para servir una página HTML con información de los tipos de canales
router.get('/tiposcanales', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tiposcanales', 'tiposcanales.html'));
});

// Ruta GET para obtener datos de un tipo de canal específico en formato JSON
router.get('/tiposcanales/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM mega_tipocanales WHERE id_tipocanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el tipo de canal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Tipo de canal no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para servir una página HTML con el detalle de un tipo de canal
router.get('/tiposcanales/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tiposcanales', 'detalle.html'));
});

// Ruta GET para crear un nuevo tipo de canal
router.get('/tiposcanales/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tiposcanales', 'crear.html'));
});

// Ruta POST para guardar un nuevo tipo de canal
router.post('/tiposcanales/crear', (req, res) => {
    const { nombre, premier, prioridad, visible, create_user, create_at } = req.body;
    const query = 'INSERT INTO mega_tipocanales (nombre, premier, prioridad, visible, create_user, create_at) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nombre, premier, prioridad, visible, create_user, create_at];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el tipo de canal' });
        }
        res.json({ message: 'Tipo de canal creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar de un tipo de canal
router.get('/tiposcanales/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tiposcanales', 'editar.html'));
});

// Ruta POST para actualizar un tipo de canal
router.post('/tiposcanales/editar', (req, res) => {
    const { id_tipocanal, nombre, premier, prioridad, visible } = req.body;
    db.query(
        'UPDATE mega_tipocanales SET nombre = ?, premier = ?, prioridad = ?, visible = ? WHERE id_tipocanal = ?',
        [nombre, premier, prioridad, visible, id_tipocanal],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el tipo de canal' });
            }
            res.json({ message: 'Tipo de canal actualizado correctamente' });
        }
    );
});

// Ruta POST para activar un tipo de canal
router.post('/tiposcanales/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE mega_tipocanales SET visible = 1 WHERE id_tipocanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de canal' });
        }
        res.json({ success: true, message: 'Tipo de canal activado correctamente' });
    });
});

// Ruta POST para desactivar un tipo de canal
router.post('/tiposcanales/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE mega_tipocanales SET visible = 0 WHERE id_tipocanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de canal' });
        }
        res.json({ success: true, message: 'Tipo de canal desactivado correctamente' });
    });
});


module.exports = router;