const fs = require('fs');
const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.
const multer = require('multer');

/// Crear la carpeta 'uploads/bannercable' si no existe
const uploadDir = path.join(__dirname, '../views/uploads/bannerpaquetes');
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

// Ruta GET para obtener datos de todas los banners en formato JSON
router.get('/bannerpaquetes/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'sucursal'
   db.query('SELECT * FROM bannertipopaquete', (err, result) => {
       if (err) {
             // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
           return res.status(500).json({ error: 'Error al obtener las sucursales' });
       }
       // Si la consulta es exitosa, envía los resultados como un JSON
       res.json(result); // Envía los datos como JSON
   });
});

// Ruta GET para renderizar una página HTML con información de los canales
router.get('/bannerpaquetes', (req, res) => {
    // Envía el archivo HTML 'bannerspaquetes.html' ubicado en la carpeta 'views/pages/bannerpaquetes'
  res.sendFile(path.join(__dirname, '../views/pages/bannerpaquetes', 'bannerpaquetes.html'));
});


// Ruta GET para obtener datos de un banner específico en formato JSON
router.get('/bannerpaquetes/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM bannertipopaquete WHERE idBannerTipoPaquete = ?', [id], (err, result) => {
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
router.get('/bannerpaquetes/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/bannerpaquetes', 'detalles.html'));
});

// Ruta GET para crear un nuevo banner de paquete
router.get('/bannerpaquetes/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/bannerpaquetes', 'crear.html'));
});

// Ruta POST para guardar un nuevo banner de paquete
router.post('/bannerpaquetes/crear', upload.single('archivos'), (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { ruta, status, create_user, create_at } = req.body;
    const archivos = req.file ? req.file.filename : null; // Obtener el nombre del archivo subido
    const query = 'INSERT INTO bannertipopaquete (ruta, archivos, status, create_user, create_at) VALUES (?, ?, ?, ?, ?)';
    const values = [ruta, archivos, status, create_user, create_at];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear el banner de paquete:', err);
            return res.status(500).json({ error: 'Error al crear el banner de paquete' });
        }
        res.json({ message: 'Banner de paquete creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar banner de paquete
router.get('/bannerpaquetes/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/bannerpaquetes', 'editar.html'));
});

// Ruta POST para actualizar un banner de paquete
router.post('/bannerpaquetes/editar/:id', upload.single('archivos'), (req, res) => {
    const { id } = req.params;
    const { ruta, status, create_user, create_at } = req.body;
    const archivos = req.file ? req.file.filename : req.body.existingArchivos; // Usar el nuevo archivo si se sube, de lo contrario usar el existente
    const query = 'UPDATE bannertipopaquete SET ruta = ?, archivos = ?, status = ?, create_user = ?, create_at = ? WHERE idBannerTipoPaquete = ?';
    const values = [ruta, archivos, status, create_user, create_at, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el banner de paquete' });
        }
        res.json({ message: 'Banner de paquete actualizado exitosamente' });
    });
});

// Ruta POST para activar un banner de paquete
router.post('/bannerpaquetes/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE bannertipopaquete SET status = 1 WHERE idBannerTipoPaquete = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner de paquete' });
        }
        res.json({ success: true, message: 'Banner de paquete activado correctamente' });
    });
});

// Ruta POST para desactivar un banner de paquete
router.post('/bannerpaquetes/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE bannertipopaquete SET status = 0 WHERE idBannerTipoPaquete = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar el banner de paquete' });
        }
        res.json({ success: true, message: 'Banner de paquete desactivado correctamente' });
    });
});


module.exports = router;