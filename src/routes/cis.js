const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.

// Ruta GET para obtener datos de todas las sucursales en formato JSON
router.get('/cis/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'cis'
    db.query('SELECT * FROM cis', (err, result) => {
        if (err) {
            // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
            return res.status(500).json({ error: 'Error al obtener las sucursales' });
        }
        // Si la consulta es exitosa, envía los resultados como un JSON
        res.json(result); // Envía los datos como JSON
    });
});

// Ruta GET para servir una página HTML con información de las ubicaciones
router.get('/cis', (req, res) => {
    // Envía el archivo HTML 'cis.html' ubicado en la carpeta 'views/pages/cis'
    res.sendFile(path.join(__dirname, '../views/pages/cis', 'cis.html'));
});

// Ruta GET para obtener datos de una sucursal específica en formato JSON
router.get('/cis/ver/data', (req, res) => {
    const id = req.query.id;
    db.query('SELECT * FROM cis WHERE idSucursal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la sucursal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json(result[0]);
    });
});

router.get('/cis/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/cis', 'detalle.html'));
});

// Ruta GET para servir la página HTML de edición de ubicación
router.get('/cis/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/cis', 'editar.html'));
});


// Ruta POST para actualizar los datos de una sucursal
router.post('/cis/editar', (req, res) => {
    const { idSucursal, nombre, sucursal, ciudad, estado, direccion, colonia, horario, telefono, latitud, longitud, activo, discapacidad } = req.body;
    db.query(
        'UPDATE cis SET nombre = ?, sucursal = ?, ciudad = ?, estado = ?, direccion = ?, colonia = ?, horario = ?, telefono = ?, latitud = ?, longitud = ?, activo = ?, discapacidad = ? WHERE idSucursal = ?',
        [nombre, sucursal, ciudad, estado, direccion, colonia, horario, telefono, latitud, longitud, activo, discapacidad, idSucursal],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el CIS' });
            }
            res.json({ message: 'CIS actualizado correctamente' });
        }
    );
});

// Ruta DELETE para eliminar una sucursal
router.delete('/cis/borrar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE cis SET  activo = 0 WHERE idSucursal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al borrar la sucursal' });
        }
        res.json({ message: 'Sucursal borrada correctamente' });
    });
});
module.exports = router;