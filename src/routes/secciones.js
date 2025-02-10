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

// Ruta GET para renderizar una página HTML con información de la configuracion de secciones
router.get('/secciones', (req, res) => {
    // Envía el archivo HTML 'canales.html' ubicado en la carpeta 'views/pages/canales'
  res.sendFile(path.join(__dirname, '../views/pages/secciones', 'secciones.html'));
});

//api para traer las secciones configurables 
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

//api para listar las secciones a validar segun el selector de secciones
router.get('/configuracion/data/:selectValue', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { selectValue } = req.params;
  const query = `SELECT * FROM configsecciones WHERE seccion = ?;`;

  db.query(query, [selectValue], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos de secciones' });
      }
      res.json(results);
  });
});

// Ruta POST para activar una seccion
router.post('/secciones/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query(`UPDATE configsecciones SET status = '1' WHERE idConfigSecciones = ?;`, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar la seccion' });
        }
        res.json({ success: true, message: 'Seccion activada correctamente' });
    });
});

// Ruta POST para desactivar una seccion
router.post('/secciones/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query(`UPDATE configsecciones SET status = '0' WHERE idConfigSecciones = ?;`, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar la seccion' });
        }
        res.json({ success: true, message: 'Seccion desactivado correctamente' });
    });
});

// Ruta POST para actualizar fechas
router.post('/configuracion/updateDate/:id', (req, res) => {
    const { id } = req.params;
    const { fhInicio, fhFin } = req.body;
    const updates = {};
    if (fhInicio) updates.fhInicio = fhInicio;
    if (fhFin) updates.fhFin = fhFin;

    db.query(`UPDATE configsecciones SET ? WHERE idConfigSecciones = ?;`, [updates, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar las fechas' });
        }
        res.json({ success: true, message: 'Fechas actualizadas correctamente' });
    });
});






// Ruta GET para obtener datos de un tipo de canal específico en formato JSON
router.get('/secciones/ver/data', (req, res) => {
    const { id } = req.query;
    db.query('SELECT * FROM view_banners WHERE idBanner = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el banner' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Banner no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para rendirizar una página HTML con el detalle del canal
router.get('/secciones/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'detalles.html'));
});

// Ruta GET para crear un nuevo canal
router.get('/secciones/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'crear.html'));
});

// Ruta POST para guardar un nuevo canal
router.post('/secciones/crear', (req, res) => {
    const { id, name, type, status, code, active, create_user, create_at } = req.body;
    const image = req.file ? req.file.filename : null; // Obtener el nombre del archivo subido
    const query = 'INSERT INTO channels (idChannels, name, image, type, status, code, active, create_user, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, name, image, type, status, code, active, create_user, create_at];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el canal' });
        }
        res.json({ message: 'Canal creado exitosamente' });
    });
});

// Ruta GET para servir la página HTML de editar de un canal
router.get('/secciones/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'editar.html'));
});


// Ruta POST para actualizar un canal
router.post('/secciones/editar/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, status, code, active } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage; // Usar la nueva imagen si se sube, de lo contrario usar la existente
    const query = 'UPDATE channels SET name = ?, image = ?, type = ?, status = ?, code = ?, active = ? WHERE idChannels = ?';
    const values = [name, image, type, status, code, active, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el banner' });
        }
        res.json({ message: 'Banner actualizado exitosamente' });
    });
});




module.exports = router; // Exporta el router para que pueda ser utilizado por la aplicación principal.