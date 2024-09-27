const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.



// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/mega/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'sucursal'
   db.query('SELECT * FROM `selectsucursal` ', (err, result) => {
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

// Ruta GET para obtener datos de una sucursal específica en formato JSON
router.get('/mega/tarifario/data', (req, res) => {
  const id = req.query.id;
  db.query('SELECT * FROM `vistatarifario` WHERE idSucursal = ?', [id], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener tarifario' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Tarifario no encontrada' });
      }
      res.json(result[0]);
  });
});
/*router.get('/mega/tarifario', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/mega', 'tarifario.html'));
});*/
module.exports = router;
