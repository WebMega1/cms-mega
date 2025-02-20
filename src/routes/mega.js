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
  db.query('SELECT * FROM bannerhome WHERE status = 1 ', (err, result) => {
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


// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/trivias/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(`SELECT t1.*, t2.ruta AS rutaPrincipal , t2.archivo AS archivoPrincipal, t3.ruta AS rutaMovil, t3.archivo AS archivoMovil 
                FROM triviasconfig as t1
                LEFT JOIN banners as t2 on t1.idBannerPrincipal = t2.idBanner
                LEFT JOIN banners as t3 on t1.idBannerMovil = t3.idBanner
                 WHERE t1.status = 1`, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de footer' });
      }
      res.json(result);
  });
});

// Ruta GET para obtener datos de una trivia específica y sus preguntas en formato JSON
router.get('/api/trivias/data', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.query;
  db.query(`SELECT t1.*, t2.ruta AS rutaPrincipal , t2.archivo AS archivoPrincipal, t3.ruta AS rutaMovil, t3.archivo AS archivoMovil 
            FROM triviasconfig as t1
            LEFT JOIN banners as t2 on t1.idBannerPrincipal = t2.idBanner
            LEFT JOIN banners as t3 on t1.idBannerMovil = t3.idBanner
            WHERE t1.urlEndPoint = ? AND t1.status = 1
  `, [id], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener la trivia' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Trivia no encontrada' });
      }
      res.json(result[0]); // Asegúrate de enviar solo el primer resultado
  });
});


// Ruta GET para obtener datos de una trivia específica y sus preguntas en formato JSON
router.get('/api/triviaspreguntas/data', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.query;
  db.query(`SELECT * FROM triviaspreguntas WHERE idtriviaConfig = ?`, [id], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener las preguntas trivia' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Preguntas de la trivia no encontrada' });
      }
      res.json(result); 
  });
});

// Ruta GET para obtener los datos de la vista tarifario
router.get('/api/canales/:idSucursal', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { idSucursal } = req.params;
  const query = `SELECT *, COUNT(*) as validacion
                  FROM view_alineacioncanales WHERE idSucursal = ?
                  GROUP BY selectorCanal `;

  db.query(query, [idSucursal], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos de canales' });
      }
      res.json(results);
  });
});

// Ruta GET para obtener los datos de configuracion card streaming
router.get('/api/streaming/:idStreaming', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { idStreaming } = req.params;
  const query = `SELECT * FROM paquetesstreaming WHERE idStreaming = ? ; `;

  db.query(query, [idStreaming], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los datos de la API streaming' });
      }
      res.json(results);
  });
});

// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/fullConnected/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(`SELECT t1.idSucursal, t1.status, t2.sucursalName
                FROM tarifario  as t1
                LEFT JOIN sucursal as t2 on t1.idSucursal = t2.idSucursal
                WHERE idTipoPaquete = 1  and t1.status = 1
                ORDER BY sucursalName ASC;`, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de footer' });
      }
      res.json(result);
  });
});


// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/cardStreaming/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(`SELECT * FROM cardsstreaming WHERE status = 1;`, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de footer' });
      }
      res.json(result);
  });
});

// Ruta GET para obtener datos de todas las Regiones en formato JSON
router.get('/api/tv/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(`SELECT * FROM xviewsucursal;`, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener banner de footer' });
      }
      res.json(result);
  });
});

/*router.get('/mega/tarifario', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/mega', 'tarifario.html'));
});*/
module.exports = router;
