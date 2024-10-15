const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');

// Ruta GET para obtener datos de todas las tipo de canales en formato JSON
router.get('/tiposcanales/data', (req, res) => {
    db.query('SELECT * FROM tipocanales', (err, result) => {
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
    db.query('SELECT * FROM tipocanales WHERE idTipoCanal = ?', [id], (err, result) => {
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
    const { tipoCanal, premier, prioridad, visible, create_user, create_at } = req.body;
    const query = 'INSERT INTO tipocanales (tipoCanal, premier, prioridad, status, create_user, create_at) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [tipoCanal, premier, prioridad, visible, create_user, create_at];

    // Imprimir la consulta y los valores en la consola
    console.log('Query:', query);
    console.log('Values:', values);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
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
    const { idTipoCanal, tipoCanal, premier, prioridad, visible } = req.body;

    // Construir la consulta y los valores
    const query = 'UPDATE tipocanales SET tipoCanal = ?, premier = ?, prioridad = ?, status = ? WHERE idTipoCanal = ?';
    const values = [tipoCanal, premier, prioridad, visible, idTipoCanal];

    // Imprimir la consulta y los valores en la consola
    console.log('Query:', query);
    console.log('Values:', values);

    // Ejecutar la consulta
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error al actualizar el tipo de canal' });
        }
        res.json({ message: 'Tipo de canal actualizado correctamente' });
    });
});

// Ruta POST para activar un tipo de canal
router.post('/tiposcanales/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tipocanales SET status = 1 WHERE idTipoCanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de canal' });
        }
        res.json({ success: true, message: 'Tipo de canal activado correctamente' });
    });
});

// Ruta POST para desactivar un tipo de canal
router.post('/tiposcanales/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tipocanales SET status = 0 WHERE idTipoCanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de canal' });
        }
        res.json({ success: true, message: 'Tipo de canal desactivado correctamente' });
    });
});


module.exports = router;