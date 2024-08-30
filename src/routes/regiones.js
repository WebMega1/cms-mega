const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.



// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/regiones/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'sucursal'
   db.query('SELECT * FROM regiones', (err, result) => {
       if (err) {
             // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
           return res.status(500).json({ error: 'Error al obtener las sucursales' });
       }
       // Si la consulta es exitosa, envía los resultados como un JSON
       res.json(result); // Envía los datos como JSON
   });
});

// Ruta GET para servir una página HTML con información de las ubicaciones
router.get('/regiones', (req, res) => {
    // Envía el archivo HTML 'ubicaciones.html' ubicado en la carpeta 'views/pages/ubicaciones'
  res.sendFile(path.join(__dirname, '../views/pages/regiones', 'regiones.html'));
});

// Ruta GET para obtener datos de una sucursal específica en formato JSON
router.get('/regiones/ver/data', (req, res) => {
    const id = req.query.id;
    db.query('SELECT * FROM regiones WHERE id_region = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la sucursal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json(result[0]);
    });
});
router.get('/regiones/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/regiones', 'detalle.html'));
});

// Ruta GET para servir la página HTML de edición de ubicación
router.get('/regiones/editar', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/regiones', 'editar.html'));
});

// Ruta POST para actualizar los datos de una sucursal
router.post('/regiones/editar', (req, res) => {
    const { id_region, region, status } = req.body;
    db.query(
        'UPDATE regiones SET region = ?, status = ? WHERE id_region = ?',
        [region, status, id_region],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar la región' });
            }
            res.json({ message: 'Región actualizada correctamente' });
        }
    );
});

// Ruta DELETE para eliminar una sucursal
router.delete('/regiones/borrar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE regiones SET  status = 0 WHERE id_region = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al borrar la sucursal' });
        }
        res.json({ message: 'Sucursal borrada correctamente' });
    });
});

module.exports = router;
