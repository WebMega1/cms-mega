const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.

// Ruta GET para obtener datos de todas las cis en formato JSON
router.get('/cis/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'cis'
    db.query(`SELECT t1.*, t2.sucursalName 
                FROM cis as t1 
                LEFT JOIN sucursal as t2 on t1.idSucursal = t2.idSucursal;`, (err, result) => {
        if (err) {
            // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
            return res.status(500).json({ error: 'Error al obtener las sucursales' });
        }
        // Si la consulta es exitosa, envía los resultados como un JSON
        res.json(result); // Envía los datos como JSON
    });
});

// Ruta GET para obtener datos de todas las cis en formato JSON
router.get('/cis/sucursales', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'cis'
    db.query('SELECT idSucursal, sucursalName FROM `sucursal` WHERE status = 1 ORDER BY sucursalName ASC;', (err, result) => {
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
    db.query('SELECT t1.*, t2.sucursalName FROM `cis` as t1 LEFT JOIN sucursal as t2 on t1.idSucursal = t2.idSucursal WHERE idCis = ?', [id], (err, result) => {
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

// Ruta GET para servir la página HTML de creación de ubicación
router.get('/cis/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/cis', 'crear.html'));
});

// Ruta POST para insertar una nueva sucursal en la base de datos
router.post('/cis/crear', (req, res) => {
    const { cisName, idSucursal, ciudad, estado, direccion, colonia, horario, telefono,
        latitud, longitud, discapacidad, status, create_at, create_user
    } = req.body;

    // Construir la consulta y los valores
    const query = 'INSERT INTO cis (cisName, idSucursal, ciudad, estado, direccion, colonia, horario, telefono, latitud, longitud, discapacidad, status, create_at, create_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [cisName, idSucursal, ciudad, estado, direccion, colonia, horario, telefono, latitud, longitud, discapacidad, status, create_at, create_user];

    // Imprimir la consulta y los valores en la consola
    console.log('Query:', query);
    console.log('Values:', values);

    // Ejecutar la consulta
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error al crear el CIS' });
        }
        res.json({ message: 'CIS creado correctamente' });
    });
});

// Ruta GET para servir la página HTML de edición de ubicación
router.get('/cis/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/cis', 'editar.html'));
});


// Ruta POST para actualizar los datos de una sucursal
router.post('/cis/editar', (req, res) => {
    const { idCis, cisName, idSucursal, ciudad, estado, direccion, colonia, horario, telefono, latitud, longitud, status, discapacidad } = req.body;
    db.query(
        'UPDATE cis SET cisName = ?, idSucursal = ?, ciudad = ?, estado = ?, direccion = ?, colonia = ?, horario = ?, telefono = ?, latitud = ?, longitud = ?, status = ?, discapacidad = ? WHERE idCis = ?',
        [cisName, idSucursal, ciudad, estado, direccion, colonia, horario, telefono, latitud, longitud, status, discapacidad, idCis],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el CIS:', err);
                return res.status(500).json({ error: 'Error al actualizar el CIS' });
            }
            res.json({ message: 'CIS actualizado correctamente' });
        }
    );
});

// Ruta DELETE para eliminar una cis
router.put('/cis/borrar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE cis SET  status = 0 WHERE idCis = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al borrar la sucursal' });
        }
        res.json({ message: 'Sucursal borrada correctamente' });
    });
});

// Ruta PUT para restaurar una cis
router.put('/cis/restaurar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE cis SET status= 1 WHERE idCis = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al restaurar la cis' });
        }
        res.json({ message: 'Cis restaurada correctamente' });
    });
});

module.exports = router;