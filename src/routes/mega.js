const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.


// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/sucursales', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query('SELECT * FROM `selectsucursal`', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener las sucursales' });
      }
      res.json(result);
  });
});

// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/mega/data', (req, res) => {
  db.query('SELECT * FROM `selectsucursal`', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener las sucursales' });
      }
      res.json(result);
  });
});

// Ruta GET para servir la página HTML principal
router.get('/mega', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/mega', 'index.html'));
});
// Ruta GET para servir la página HTML principal
router.get('/mega/paquetes-tv', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/mega', 'paquetes-tv.html'));
});

// Ruta GET para obtener los datos de la vista tarifario
router.get('/api/tarifario/:idSucursal', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { idSucursal } = req.params;
  const query = 'SELECT * FROM vistatarifario WHERE idSucursal = ? AND tipoPaquete = 3';

  db.query(query, [idSucursal], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos del tarifario' });
      }
      res.json(results);
  });
});

// Ruta GET para obtener los datos de la vista tarifario
router.get('/api/doblePack/:idSucursal', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { idSucursal } = req.params;
  const query = 'SELECT * FROM vistatarifario WHERE idSucursal = ? AND tipoPaquete = 2';

  db.query(query, [idSucursal], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos tarifario' });
      }
      res.json(results);
  });
});

// Ruta GET para obtener los datos de la vista tarifario
router.get('/api/triplePack/:idSucursal', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { idSucursal } = req.params;
  const query = 'SELECT * FROM vistatarifario WHERE idSucursal = ? AND tipoPaquete = 3';

  db.query(query, [idSucursal], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos del tarifario' });
      }
      res.json(results);
  });
});

// Ruta para API con los banners activos, abierta para todos
router.get('/api/bannerHero/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query('SELECT * FROM `view_bannerherohome` ', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banners de home' });
      }
      res.json(result);
  });
});

// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/bannerStreaming/', (req, res) => {
  db.query('SELECT * FROM `view_bannerstreaminghome` ', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de streaming' });
      }
      res.json(result);
  });
});

// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/bannerServices/', (req, res) => {
  db.query('SELECT * FROM `view_bannerservices` ', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de streaming' });
      }
      res.json(result);
  });
});


// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/bannerFooter/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query('SELECT * FROM `banners` WHERE tipoBanner = 5 AND status = 1 ', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de footer' });
      }
      res.json(result);
  });
});

// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/bannerPromoExtrasCard/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query('SELECT * FROM `banners` WHERE tipoBanner = 3 AND status = 1', (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de footer' });
      }
      res.json(result);
  });
});


// Ruta GET para obtener los datos de los canales por sucursal
router.get('/api/configuraciones/home/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { idSucursal } = req.params;
  const query = `SELECT * FROM configsecciones WHERE seccion = 'HOME';`;

  db.query(query, [idSucursal], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos del tarifario' });
      }
      res.json(results);
  });
});



/*router.get('/mega/tarifario', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/mega', 'tarifario.html'));
});*/
module.exports = router;
