const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');



router.get('/ubicaciones/data', (req, res) => {
    db.query('SELECT * FROM sucursal', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las sucursales' });
        }
        res.json(result); // Envía los datos como JSON
    });
});

router.get('/ubicaciones', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/ubicaciones', 'ubicaciones.html'));
});

module.exports = router;
  
  
