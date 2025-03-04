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


// Ruta GET para obtener datos de todas los canales en formato JSON
router.get('/banners/data', (req, res) => {
    db.query('SELECT * FROM view_banners', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener Banners' });
        }
        res.json(result); // Envía los datos como JSON
    });
});

// Ruta GET para renderizar una página HTML con información de los canales
router.get('/banners', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'banners.html'));
});

// Ruta GET para obtener datos de un tipo de canal específico en formato JSON
router.get('/banners/ver/data', (req, res) => {
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
router.get('/banners/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'detalles.html'));
});

// Ruta GET para crear un nuevo canal
router.get('/banners/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'crear.html'));
});

// Ruta POST para guardar un nuevo canal
router.post('/banners/crear', (req, res) => {
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
router.get('/banners/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'editar.html'));
});


// Ruta POST para actualizar un canal
router.post('/banners/editar/:id', upload.single('image'), (req, res) => {
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


// Ruta POST para activar un canal
router.post('/banners/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE banners SET status = 1 WHERE idBanner = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner activado correctamente' });
    });
});

// Ruta POST para desactivar un canal
router.post('/banners/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE banners SET status = 0 WHERE idBanner = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner desactivado correctamente' });
    });
});

// Ruta GET para obtener datos de tipo de banner
router.get('/banners/tipoBanner/', (req, res) => {
    db.query('SELECT * FROM tipobanner', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener tipo de banner' });
        }
        res.json(result); // Envía los datos como JSON
    });
});

// Ruta GET para renderizar una página HTML con información de los canales
router.get('/bannerHome', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'bannersHome.html'));
});

// Ruta GET para obtener datos de todas los canales en formato JSON
router.get('/bannersHome/data', (req, res) => {
    db.query(`SELECT * FROM bannerhome;`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener Banners' });
        }
        res.json(result); // Envía los datos como JSON
    });
});

// Ruta GET para rendirizar una página HTML con el detalle del canal
router.get('/bannerHome/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'detallesBannerHome.html'));
});

// Ruta GET para obtener datos de un tipo de canal específico en formato JSON
router.get('/bannerHome/ver/data', (req, res) => {
    const { id } = req.query;
    db.query(`SELECT * FROM bannerhome WHERE idBannerHome = ?`, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el banner' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Banner no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para servir la página HTML de editar de un canal
router.get('/bannerHome/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'bannerHomeEditar.html'));
});

// Ruta POST para actualizar 
router.post('/bannerHome/editar/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, status, code, active } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage; // Usar la nueva imagen si se sube, de lo contrario usar la existente
    const query = 'UPDATE bannerhome SET name = ?, image = ?, type = ?, status = ?, code = ?, active = ? WHERE idChannels = ?';
    const values = [name, image, type, status, code, active, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el banner' });
        }
        res.json({ message: 'Banner actualizado exitosamente' });
    });
});

// Ruta POST para activar un canal
router.post('/bannerHome/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE bannerhome SET status = 1 WHERE idBannerHome = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner activado correctamente' });
    });
});

// Ruta POST para desactivar un canal
router.post('/bannerHome/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE bannerhome SET status = 0 WHERE idBannerHome = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner desactivado correctamente' });
    });
});

// Ruta GET para renderizar una página HTML con información de los canales
router.get('/bannerStreaming', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'bannerStreaming.html'));
});

// Ruta GET para obtener datos de todas los canales en formato JSON
router.get('/bannerStreaming/data', (req, res) => {
    db.query(`SELECT * FROM cardsstreaming`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener Banners streaming' });
        }
        res.json(result);
    });
});

// Ruta GET para rendirizar una página HTML con el detalle del canal
router.get('/bannerStreaming/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'detallesStreaming.html'));
});


// Ruta GET para obtener datos de un tipo de canal específico en formato JSON
router.get('/bannerStreaming/ver/data', (req, res) => {
    const { id } = req.query;
    db.query(`SELECT * FROM cardsstreaming WHERE idCardStreaming = ?`, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el card de streaming' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Card no encontrado' });
        }
        res.json(result[0]);
    });
});


// Ruta GET para obtener datos de todas los canales en formato JSON
router.get('/bannerStreaming/permisos', (req, res) => {
    const { objetoName, idObjeto } = req.query;
    const query = 'SELECT * FROM permisosucursal WHERE objetoName = ? AND idObjeto = ?';
    const values = [objetoName, idObjeto];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener permisos' });
        }
        res.json(result);
    });
});

// Ruta GET para servir la página HTML de editar de un canal
router.get('/bannerStreaming/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'bannerStreamingEditar.html'));
});

// Ruta POST para actualizar 
router.post('/bannerStreaming/editar/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, status, code, active } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage; // Usar la nueva imagen si se sube, de lo contrario usar la existente
    const query = 'UPDATE bannerhome SET name = ?, image = ?, type = ?, status = ?, code = ?, active = ? WHERE idChannels = ?';
    const values = [name, image, type, status, code, active, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el banner' });
        }
        res.json({ message: 'Banner actualizado exitosamente' });
    });
});

// Ruta POST para activar un canal
router.post('/bannerStreaming/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE cardsstreaming SET status = 1 WHERE idCardStreaming = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner activado correctamente' });
    });
});

// Ruta POST para desactivar un canal
router.post('/bannerStreaming/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE cardsstreaming SET status = 0 WHERE idCardStreaming = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner desactivado correctamente' });
    });
});


router.post('/api/permisosucursal', (req, res) => {
    const { objetoName, idObjeto, idSucursal } = req.body;
    const query = 'INSERT INTO permisosucursal (objetoName, idObjeto, idSucursal) VALUES (?, ?, ?)';
    const values = [objetoName, idObjeto, idSucursal];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar permiso:', err);
            return res.status(500).json({ error: 'Error al insertar permiso' });
        }
        res.json({ message: 'Permiso agregado correctamente' });
    });
});
router.delete('/api/permisosucursal/:idObjeto/:idSucursal', (req, res) => {
    const { idObjeto, idSucursal } = req.params;
    const query = 'DELETE FROM permisosucursal WHERE idObjeto = ? AND idSucursal = ?';
    const values = [idObjeto, idSucursal];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al eliminar permiso:', err);
            return res.status(500).json({ error: 'Error al eliminar permiso' });
        }
        res.json({ message: 'Permiso eliminado correctamente' });
    });
});
///////////////////////////////////////////////
// Crear la carpeta 'uploads/bannerHero' si no existe
const uploadDirBH = path.join(__dirname, '../views/uploads/bannerHero');
if (!fs.existsSync(uploadDirBH)) {
    fs.mkdirSync(uploadDirBH, { recursive: true });
}

// Configuración de multer para guardar las imágenes en la carpeta 'uploads/bannerHero'
const storageBH = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirBH);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir una marca de tiempo al nombre del archivo
    }
});

const uploadBH = multer({ storage: storageBH });

// Ruta GET para crear un nuevo banner
router.get('/bannerHome/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'crearBannerHome.html'));
});

// Ruta POST para crear un nuevo bannerHome
router.post('/bannerHome/crear', uploadBH.fields([{ name: 'background' }, { name: 'imagenBanner' }, { name: 'imagenMobile' }]), (req, res) => {
    const { title, linkButton, textButton, fhInicio, fhFin, status } = req.body;
    const background = req.files['background'][0].filename;
    const imagenBanner = req.files['imagenBanner'][0].filename;
    const imagenMobile = req.files['imagenMobile'][0].filename;
    const ruta = 'uploads/bannerHero/';

    const query = 'INSERT INTO bannerhome (ruta, background, title, linkButton, textButton, imagenBanner, imagenMobile, status, fhInicio, fhFin, create_user, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())';
    const values = [ruta, background, title, linkButton, textButton, imagenBanner, imagenMobile, status, fhInicio, fhFin, 1];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear el banner:', err);
            return res.status(500).json({ success: false, error: 'Error al crear el banner' });
        }
        res.json({ success: true, message: 'Banner creado correctamente', idBannerHome: result.insertId });
    });
});
//////////banners de Avisos///////////////
// Ruta GET para renderizar una página HTML con información de los canales
router.get('/bannerAvisos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'bannerAvisos.html'));
});

// Ruta GET para obtener datos de todas los canales en formato JSON
router.get('/bannerAvisos/data', (req, res) => {
    db.query(`SELECT * FROM banners WHERE tipoBanner = 5;`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener Banners Avisos' });
        }
        res.json(result);
    });
});

// Ruta GET para rendirizar una página HTML con el detalle del canal
router.get('/bannerAvisos/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'detallesBannerAvisos.html'));
});


// Ruta GET para obtener datos de un tipo de canal específico en formato JSON
router.get('/bannerAvisos/ver/data', (req, res) => {
    const { id } = req.query;
    db.query(`SELECT * FROM banners WHERE tipoBanner = 5 AND idBanner = ?`, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener banners' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Banner no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta GET para obtener datos de todas los permisos en formato JSON
router.get('/bannerAvisos/permisos', (req, res) => {
    const { objetoName, idObjeto } = req.query;
    const query = 'SELECT * FROM permisosucursal WHERE objetoName = ? AND idObjeto = ?';
    const values = [objetoName, idObjeto];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener permisos' });
        }
        res.json(result);
    });
});

// Ruta POST para activar un canal
router.post('/bannerAvisos/activar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE banners SET status = 1 WHERE idBanner = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner activado correctamente' });
    });
});

// Ruta POST para desactivar un canal
router.post('/bannerAvisos/desactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE banners SET status = 0 WHERE idBanner = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar el banner' });
        }
        res.json({ success: true, message: 'Banner desactivado correctamente' });
    });
});

// Ruta GET para servir la página HTML de editar de un canal
router.get('/bannerAvisos/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/banners', 'bannerAvisosEditar.html'));
});

// Ruta POST para actualizar 
router.post('/bannerAvisos/editar/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, status, code, active } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage; // Usar la nueva imagen si se sube, de lo contrario usar la existente
    const query = 'UPDATE bannerhome SET name = ?, image = ?, type = ?, status = ?, code = ?, active = ? WHERE idChannels = ?';
    const values = [name, image, type, status, code, active, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el banner' });
        }
        res.json({ message: 'Banner actualizado exitosamente' });
    });
});


module.exports = router; // Exporta el router para que pueda ser utilizado por la aplicación principal.