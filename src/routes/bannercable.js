const fs = require('fs');
const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.
const multer = require('multer');

/// Crear la carpeta 'uploads/bannercable' si no existe
const uploadDir = path.join(__dirname, '../views/uploads/bannercable');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de multer para guardar las imágenes en la carpeta 'uploads/bannercable'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir una marca de tiempo al nombre del archivo
    }
});

const upload = multer({ storage: storage });


// Ruta GET para obtener datos de los banners en formato JSON
router.get('/bannercable/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'sucursal'
   db.query('SELECT * FROM banners WHERE tipoBanner = 1 ', (err, result) => {
       if (err) {
             // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
           return res.status(500).json({ error: 'Error al obtener las sucursales' });
       }
       // Si la consulta es exitosa, envía los resultados como un JSON
       res.json(result); // Envía los datos como JSON
   });
});

// Ruta GET para renderizar una página HTML con información de los banners
router.get('/bannercable', (req, res) => {
    // Envía el archivo HTML 'bannercable.html' ubicado en la carpeta 'views/pages/bannercable'
  res.sendFile(path.join(__dirname, '../views/pages/bannercable', 'bannercable.html'));
});


// Ruta GET para obtener datos de un banner específico en formato JSON
router.get('/bannercable/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM banners WHERE idBanner = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el banner' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Banner no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para rendirizar una página HTML para ver detalles los banner
router.get('/bannercable/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/bannercable', 'detalles.html'));
});

// Ruta GET para crear un nuevo banner de servicio de cable
router.get('/bannercable/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/bannercable', 'crear.html'));
});

// Ruta POST para guardar un nuevo banner de servicio de cable
router.post('/bannercable/crear', upload.single('archivo'), (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { ruta, status, create_user, create_as } = req.body;
    const archivo = req.file ? req.file.filename : null; // Obtener el nombre del archivo subido
    const query = 'INSERT INTO banners (ruta, archivo, status, create_user, create_as) VALUES (?, ?, ?, ?, ?)';
    const values = [ruta, archivo, status, create_user, create_as];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear el banner de servicio de cable:', err);
            return res.status(500).json({ error: 'Error al crear el banner de servicio de cable' });
        }
        res.json({ message: 'Banner de servicio de cable creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar banner de servicio de cable
router.get('/bannercable/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/bannercable', 'editar.html'));
});

// Ruta POST para actualizar un banner de servicio de cable
router.post('/bannercable/editar/:id', upload.single('archivo'), (req, res) => {
    const { id } = req.params;
    const { ruta, status, create_user, create_as } = req.body;
    const archivo = req.file ? req.file.filename : req.body.existingArchivo; // Usar el nuevo archivo si se sube, de lo contrario usar el existente
    const query = 'UPDATE banners SET ruta = ?, archivo = ?, status = ?, create_user = ?, create_as = ? WHERE idBannerServicioCable = ?';
    const values = [ruta, archivo, status, create_user, create_as, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el banner de servicio de cable' });
        }
        res.json({ message: 'Banner de servicio de cable actualizado exitosamente' });
    });
});

// Ruta POST para activar un banner de servicio de cable
router.post('/bannercable/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE banners SET status = 1 WHERE idBannerServicioCable = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner de servicio de cable' });
        }
        res.json({ success: true, message: 'Banner de servicio de cable activado correctamente' });
    });
});

// Ruta POST para desactivar un banner de servicio de cable
router.post('/bannercable/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE banners SET status = 0 WHERE idBannerServicioCable = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar el banner de servicio de cable' });
        }
        res.json({ success: true, message: 'Banner de servicio de cable desactivado correctamente' });
    });
});

module.exports = router;