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
    db.query('SELECT * FROM tipodepaquete WHERE idTipoPaquete= ?', [id], (err, result) => {
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

// Ruta para editar un tipo de paquete
router.post('/tipodepaquete/editar', (req, res) => {
    const { idTipoPaquete, nombreTipoPaquete, status } = req.body;
    console.log('Datos recibidos:', req.body); // Añadir para depuración

    const query = `UPDATE tipodepaquete SET nombreTipoPaquete = ?, status = ? WHERE idTipoPaquete = ?`;
    const values = [nombreTipoPaquete, status, idTipoPaquete];
    console.log('Query:', query); // Añadir para depuración
    console.log('Values:', values); // Añadir para depuración

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el tipo de paquete:', err); // Añadir para depuración
            return res.status(500).json({ error: 'Error al actualizar el tipo de paquete' });
        }
        res.json({ message: 'Tipo de paquete actualizado correctamente' });
    });
});

// Ruta POST para activar un tipo de paquete
router.post('/tipodepaquete/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tipodepaquete SET status = 1 WHERE idTipoPaquete = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de paquete' });
        }
        res.json({ success: true, message: 'Tipo de paquete activado correctamente' });
    });
});

// Ruta POST para desactivar un tipo de paquete
router.post('/tipodepaquete/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tipodepaquete SET status = 0 WHERE idTipoPaquete = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar el tipo de paquete' });
        }
        res.json({ success: true, message: 'Tipo de paquete desactivado correctamente' });
    });
});

// Ruta GET para servir una página HTML con información de los tipos de paquetes
router.get('/fullConnected', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/tipopaquetes', 'fullConnected.html'));
});

// Ruta GET para obtener datos de todas las tipo de paquetes en formato JSON
router.get('/fullConnected/data', (req, res) => {
    db.query(`SELECT t1.idSucursal, t1.status, t2.sucursalName
                FROM tarifario  as t1
                LEFT JOIN sucursal as t2 on t1.idSucursal = t2.idSucursal
                WHERE idTipoPaquete = 1  
                ORDER BY sucursalName ASC`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta POST para activar un tipo de paquete
router.post('/fullConnected/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE `tarifario` SET status = 1 WHERE idSucursal = ? AND idTipoPaquete = 1;', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el tipo de paquete' });
        }
        res.json({ success: true, message: 'Tipo de paquete activado correctamente' });
    });
});

// Ruta POST para desactivar un tipo de paquete
router.post('/fullConnected/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE `tarifario` SET status = 0 WHERE idSucursal = ? AND idTipoPaquete = 1;', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar el tipo de paquete' });
        }
        res.json({ success: true, message: 'Tipo de paquete desactivado correctamente' });
    });
});



module.exports = router;