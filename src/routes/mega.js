const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.



// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/mega/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'sucursal'
   db.query('SELECT * FROM sucursal WHERE status = 1; ', (err, result) => {
       if (err) {
             // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
           return res.status(500).json({ error: 'Error al obtener las sucursales' });
       }
       // Si la consulta es exitosa, envía los resultados como un JSON
       res.json(result); // Envía los datos como JSON
   });
});

// Ruta GET para servir una página HTML con información de las categorias
router.get('/mega', (req, res) => {
    // Envía el archivo HTML 'ubicaciones.html' ubicado en la carpeta 'views/pages/categorias'
  res.sendFile(path.join(__dirname, '../views/pages/mega', 'index.html'));
});

module.exports = router;
