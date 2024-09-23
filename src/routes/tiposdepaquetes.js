const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');
const e = require('connect-flash');


// Ruta GET para obtener datos de todas las tipo de paquetes en formato JSON
router.get('/tipodepaquete/data', (req, res) => {
    db.query('SELECT * FROM tipodepaquete', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta GET para servir una página HTML con información de los tipos de paquetes
router.get('/tipodepaquete', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tipopaquetes', 'tiposdepaquetes.html'));
});

// Ruta GET para obtener datos de un tipo de paquetes específico en formato JSON
router.get('/tipodepaquete/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM tipodepaquete WHERE idtipodepaquete= ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el tipo de canal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Tipo de canal no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para servir una página HTML con el detalle de un tipo de paquetes
router.get('/tipodepaquete/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tipopaquetes', 'detalle.html'));
});

// Ruta GET para crear un nuevo tipo de paquetes
router.get('/tipodepaquete/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tipopaquetes', 'crear.html'));
});

// Ruta POST para guardar un nuevo tipo de paquetes
router.post('/tipodepaquete/crear', (req, res) => {
    const { nombretipodepaquete, status, created_at } = req.body;
    const query = 'INSERT INTO tipodepaquete (nombretipodepaquete, status, created_at) VALUES (?, ?, ?)';
    const values = [nombretipodepaquete, status, created_at];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el tipo de paquete' });
        }
        res.json({ message: 'Tipo de paquete creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar de un tipo de canal
router.get('/tipodepaquete/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tipopaquetes', 'editar.html'));
});

// Ruta POST para actualizar un tipo de paquete
router.post('/tipodepaquete/editar', (req, res) => {
    const { idtipodepaquete, nombretipodepaquete, status } = req.body;
    db.query(
        'UPDATE tipodepaquete SET nombretipodepaquete = ?, status = ? WHERE idtipodepaquete = ?',
        [nombretipodepaquete, status, idtipodepaquete],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el tipo de paquete' });
            }
            res.json({ message: 'Tipo de paquete actualizado correctamente' });
        }
    );
});

// Ruta POST para activar un tipo de paquete
router.post('/tipodepaquete/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tipodepaquete SET status = 1 WHERE idtipodepaquete = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de paquete' });
        }
        res.json({ success: true, message: 'Tipo de paquete activado correctamente' });
    });
});

// Ruta POST para desactivar un tipo de paquete
router.post('/tipodepaquete/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tipodepaquete SET status = 0 WHERE idtipodepaquete = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar el tipo de paquete' });
        }
        res.json({ success: true, message: 'Tipo de paquete desactivado correctamente' });
    });
});

module.exports = router;