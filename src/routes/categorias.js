const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const db = require('../dbconnection'); // Importa el archivo de conexión a la base de datos MySQL.
 
// Ruta GET para obtener datos de todas las categorias en formato JSON
router.get('/categorias/data', (req, res) => {
    // Realiza una consulta SQL para obtener todos los registros de la tabla 'categorias'
   db.query('SELECT * FROM mega_tipocanales', (err, result) => {
       if (err) {
             // Si ocurre un error en la consulta, devuelve un error 500 con un mensaje JSON
           return res.status(500).json({ error: 'Error al obtener las sucursales' });
       }
       // Si la consulta es exitosa, envía los resultados como un JSON
       res.json(result); // Envía los datos como JSON
   });
});

// Ruta GET para servir una página HTML con información de las categorias
router.get('/categorias', (req, res) => {
    // Envía el archivo HTML 'ubicaciones.html' ubicado en la carpeta 'views/pages/categorias'
  res.sendFile(path.join(__dirname, '../views/pages/categorias', 'categorias.html'));
});

// Ruta GET para obtener datos de una Categorias específica en formato JSON
router.get('/categorias/ver/data', (req, res) => {
    const id = req.query.id;
    db.query('SELECT * FROM mega_tipocanales WHERE id_tipocanal= ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la sucursal' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json(result[0]);
    });
});

router.get('/categorias/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/categorias', 'detalle.html'));
});

// Ruta GET para servir la página HTML de edición de categorias
router.get('/categorias/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/categorias', 'editar.html'));
});

router.post('/categorias/editar', (req, res) => {
    const { id_tipocanal, nombre, premier, prioridad, visible } = req.body;
    db.query(
        'UPDATE mega_tipocanales SET nombre = ?, premier = ?, prioridad = ?, visible = ? WHERE id_tipocanal = ?',
        [nombre, premier, prioridad, visible, id_tipocanal],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar la categoría' });
            }
            res.json({ message: 'Categoría actualizada correctamente' });
        }
    );
});

// Ruta para cambiar el campo visible de una categoría
router.put('/categorias/borrar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE mega_tipocanales SET visible = 0 WHERE id_tipocanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el campo visible de la categoría' });
        }
        res.json({ message: 'Campo visible de la categoría actualizado correctamente' });
    });
});

// Ruta PUT para restaurar una regiones
router.put('/categorias/restaurar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE mega_tipocanales SET status= 1 WHERE id_tipocanal = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al restaurar la categoria' });
        }
        res.json({ message: 'Categoria restaurada correctamente' });
    });
});

module.exports = router;

