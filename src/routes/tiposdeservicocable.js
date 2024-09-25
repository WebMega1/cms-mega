const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');


// Ruta GET para obtener datos de todas los tipo de servicios de cable  en formato JSON
router.get('/servicioscable/data', (req, res) => {
    db.query('SELECT * FROM serviciocable', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta GET para renderizar la página HTML de información de los tipos de servicios de cable  
router.get('/servicioscable', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/serviciosdecable', 'serviciosdecable.html'));
});

// Ruta GET para obtener datos de un tipo de servicio de cable  específico en formato JSON
router.get('/servicioscable/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM serviciocable WHERE idServicioCable = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el tipo de canal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Tipo de canal no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para servir una página HTML con el detalle de un tipo de servicios de cable
router.get('/servicioscable/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/serviciosdecable', 'detalle.html'));
});

// Ruta GET para crear un nuevo tipo de servicio de cable
router.get('/servicioscable/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/serviciosdecable', 'crear.html'));
});

// Ruta POST para guardar un nuevo servicio de cable
router.post('/servicioscable/crear', (req, res) => {
    const { nameServicioCable, status, create_user, create_at } = req.body;
    const query = 'INSERT INTO serviciocable (nameServicioCable, status, create_user, create_at) VALUES (?, ?, ?, ?)';
    const values = [nameServicioCable, status, create_user, create_at];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el servicio de cable' });
        }
        res.json({ message: 'Servicio de cable creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar de un tipo de canal
router.get('/servicioscable/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/serviciosdecable', 'editar.html'));
});

// Ruta POST para actualizar un servicio de cable
router.post('/servicioscable/editar', (req, res) => {
    const { idServicioCable, nameServicioCable, status } = req.body;
    db.query(
        'UPDATE serviciocable SET nameServicioCable = ?, status = ? WHERE idServicioCable = ?',
        [nameServicioCable, status, idServicioCable],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el servicio de cable' });
            }
            res.json({ message: 'Servicio de cable actualizado correctamente' });
        }
    );
});

// Ruta POST para activar un servicio de cable
router.post('/servicioscable/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE serviciocable SET status = 1 WHERE idServicioCable = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el servicio de cable' });
        }
        res.json({ success: true, message: 'Servicio de cable activado correctamente' });
    });
});

// Ruta POST para desactivar un servicio de cable
router.post('/servicioscable/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE serviciocable SET status = 0 WHERE idServicioCable = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar el servicio de cable' });
        }
        res.json({ success: true, message: 'Servicio de cable desactivado correctamente' });
    });
});

module.exports = router;