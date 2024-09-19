const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const csvParser = require('csv-parser');
const db = require('../dbconnection');

// Crear la carpeta 'csv' si no existe
const uploadDir = path.join(__dirname, '../views/csv');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de multer para guardar los archivos CSV en la carpeta 'csv'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir una marca de tiempo al nombre del archivo
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            return cb(new Error('Solo se permiten archivos CSV'));
        }
        cb(null, true);
    }
});

// Ruta GET para renderizar una página HTML con un formulario para subir un archivo CSV
router.get('/cargartarifario', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/cargartarifario', 'cargartarifario.html'));
});

// Ruta POST para subir un archivo CSV y procesarlo
router.post('/subir-csv', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const tableName = 'tarifario';

    // Borrar los datos de la tabla sin eliminar la estructura
    db.query(`TRUNCATE TABLE ${tableName}`, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al truncar la tabla' });
        }

        // Leer y procesar el archivo CSV
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // Insertar los datos en la tabla
                const insertQuery = `INSERT INTO ${tableName} (idsucursal, idtipodepaquete, idserviciocable, fibraoptica, velocidadinternet, telefonia, preciopromopaquete, precionormalpaquete, simetria, velocidadpromo, tiempodevelocidapromo, tarifapromocional, status, created_at) VALUES ?`;
                const values = results.map(row => [
                    row.idsucursal,
                    row.idtipodepaquete,
                    row.idserviciocable,
                    row.fibraoptica,
                    row.velocidadinternet,
                    row.telefonia,
                    row.preciopromopaquete,
                    row.precionormalpaquete,
                    row.simetria,
                    row.velocidadpromo,
                    row.tiempodevelocidapromo,
                    row.tarifapromocional,
                    row.status,
                    row.created_at
                ]);

                db.query(insertQuery, [values], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error al insertar los datos en la tabla' });
                    }
                    res.json({ message: 'Archivo subido y procesado exitosamente' });
                });
            });
    });
});

module.exports = router;