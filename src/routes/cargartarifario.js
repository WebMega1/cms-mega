const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../dbconnection');

// Crear la carpeta 'uploads' si no existe
const uploadDir = path.join(__dirname, '../views/uploads/tarifario');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de multer para guardar los archivos en la carpeta 'uploads'
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
        if (ext !== '.csv' && ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Solo se permiten archivos CSV y Excel'));
        }
        cb(null, true);
    }
});

// Campos de la tabla 'tarifario'
const camposTarifario = [
    'idSucursal', 'idTipoPaquete', 'idServicioCable', 'fibraOptica', 'velocidadInternet', 
    'telefonia', 'precioPromoPaquete', 'precioNormalPaquete', 'tarifaPromocional', 'simetria', 
    'velocidadPromo', 'tiempoVelocidaPromo', 'status', 'created_at'
];

// Ruta GET para renderizar una página HTML con un formulario para subir un archivo
router.get('/cargartarifario', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/cargartarifario', 'cargartarifario.html'));
});

// Ruta POST para subir un archivo y procesarlo
router.post('/subir-archivo', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    console.log('Archivo subido:', req.file);

    const filePath = path.join(uploadDir, req.file.filename);

    const ext = path.extname(filePath);
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
        // Leer y procesar el archivo Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const results = xlsx.utils.sheet_to_json(worksheet);
        console.log('Datos leídos del archivo Excel:', results);
        const filteredData = filterData(results);
        console.log('Datos filtrados:', filteredData);
        // Eliminar todos los registros de la tabla, incluyendo el ID autoincremental
        db.query('DELETE FROM tarifario', (err) => {
            if (err) {
                console.error('Error al eliminar los datos de la tabla:', err);
                return res.status(500).json({ error: 'Error al eliminar los datos de la tabla' });
            }
            db.query('ALTER TABLE tarifario AUTO_INCREMENT = 1', (err) => {
                if (err) {
                    console.error('Error al reiniciar el ID autoincremental:', err);
                    return res.status(500).json({ error: 'Error al reiniciar el ID autoincremental' });
                }
                // Insertar los datos leídos del archivo Excel en la tabla
                insertData(filteredData, res);
            });
        });
    } else {
        return res.status(400).json({ error: 'Formato de archivo no soportado' });
    }
});

function filterData(data) {
    return data.map(row => {
        const filteredRow = {};
        camposTarifario.forEach(campo => {
            if (row.hasOwnProperty(campo)) {
                filteredRow[campo] = row[campo];
            } else {
                filteredRow[campo] = null; // Asignar null si el campo no existe en el archivo
            }
        });
        return filteredRow;
    });
}

function insertData(results, res) {
    console.log('Datos a insertar en la base de datos:', results);

    // Convertir valores "Sí" y "No" a 1 y 0 respectivamente
    const convertToInt = (value) => {
        if (value === 'Sí' || value === 'si' || value === 'sí') return 1;
        if (value === 'No' || value === 'no') return 0;
        return value;
    };

    // Insertar los datos en la tabla
    const insertQuery = `INSERT INTO tarifario (idSucursal, idTipoPaquete, idServicioCable, fibraOptica, velocidadInternet, telefonia, precioPromoPaquete, precioNormalPaquete, tarifaPromocional, simetria, velocidadPromo, tiempoVelocidaPromo, status, created_at) VALUES ?`;
    const values = results.map(row => [
        row.idSucursal,
        row.idTipoPaquete,
        row.idServicioCable,
        convertToInt(row.fibraOptica),
        row.velocidadInternet,
        convertToInt(row.telefonia),
        row.precioPromoPaquete,
        row.precioNormalPaquete,
        row.tarifaPromocional,
        convertToInt(row.simetria),
        row.velocidadPromo,
        row.tiempoVelocidaPromo,
        convertToInt(row.status),
        row.created_at
    ]);

    console.log('Valores a insertar en la base de datos:', values);

    db.query(insertQuery, [values], (err) => {
        if (err) {
            console.error('Error al insertar los datos en la tabla:', err);
            return res.status(500).json({ error: 'Error al insertar los datos en la tabla' });
        }
        console.log('Datos insertados correctamente en la base de datos');
        res.json({ message: 'Archivo subido y procesado exitosamente' });
    });
}

module.exports = router;