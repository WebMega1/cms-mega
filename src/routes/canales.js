const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.
const multer = require('multer');

// Configuración de multer para guardar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir una marca de tiempo al nombre del archivo
    }
});

const upload = multer({ storage: storage });


// Ruta GET para obtener datos de todas los canales en formato JSON
router.get('/canales/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'sucursal'
   db.query('SELECT * FROM channels', (err, result) => {
       if (err) {
             // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
           return res.status(500).json({ error: 'Error al obtener las sucursales' });
       }
       // Si la consulta es exitosa, envía los resultados como un JSON
       res.json(result); // Envía los datos como JSON
   });
});

// Ruta GET para renderizar una página HTML con información de los canales
router.get('/canales', (req, res) => {
    // Envía el archivo HTML 'canales.html' ubicado en la carpeta 'views/pages/canales'
  res.sendFile(path.join(__dirname, '../views/pages/canales', 'canales.html'));
});


// Ruta GET para obtener datos de un canal  específica en formato JSON
router.get('/canales/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM channels WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el  canal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Canal no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para rendirizar una página HTML con el detalle del canal
router.get('/canales/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/canales', 'detalles.html'));
});

// Ruta GET para crear un nuevo canal
router.get('/canales/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/canales', 'crear.html'));
});

// Ruta POST para guardar un nuevo canal
router.post('/canales/crear', (req, res) => {
    const { id, name, type, status, code, active, create_user, create_at } = req.body;
    const image = req.file ? req.file.filename : null; // Obtener el nombre del archivo subido
    const query = 'INSERT INTO channels (id, name, image, type, status, code, active, create_user, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, name, image, type, status, code, active, create_user, create_at];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el canal' });
        }
        res.json({ message: 'Canal creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar de un canal
router.get('/canales/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/canales', 'editar.html'));
});


// Ruta POST para actualizar un canal
router.post('/canales/editar/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, status, code, active } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage; // Usar la nueva imagen si se sube, de lo contrario usar la existente
    const query = 'UPDATE channels SET name = ?, image = ?, type = ?, status = ?, code = ?, active = ? WHERE id = ?';
    const values = [name, image, type, status, code, active, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el canal' });
        }
        res.json({ message: 'Canal actualizado exitosamente' });
    });
});


// Ruta POST para activar un canal
router.post('/canales/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE channels SET active = 1 WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el  canal' });
        }
        res.json({ success: true, message: 'Canal activado correctamente' });
    });
});

// Ruta POST para desactivar un canal
router.post('/canales/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE channels SET active = 0 WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el  canal' });
        }
        res.json({ success: true, message: 'Canal desactivado correctamente' });
    });
});

module.exports = router; // Exporta el router para que pueda ser utilizado por la aplicación principal.