const fs = require('fs');
const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.
const multer = require('multer');

/// Crear la carpeta 'uploads' si no existe
const uploadDir = path.join(__dirname, '../views/uploads/banners');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de multer para guardar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir una marca de tiempo al nombre del archivo
    }
});

const upload = multer({ storage: storage });

//apartir de aqui pondemos todas las api del back

//api para trael las secciones configurables 
router.get('/configuracion/data', (req, res) => {
    db.query(`SELECT seccion 
                FROM configsecciones 
                GROUP BY seccion;`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las secciones configurables' });
        }
        res.json(result); 
    });
});

module.exports = router; // Exporta el router para que pueda ser utilizado por la aplicación principal.