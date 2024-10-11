const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../dbconnection');

// Ruta GET para obtener datos de todas las tipo de canales en formato JSON
router.get('/trivias/data', (req, res) => {
    db.query('SELECT * FROM trivias', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los tipos de canales' });
        }
        res.json(result);
    });
});

// Ruta GET para servir una página HTML con información de los tipos de canales
router.get('/trivias', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'trivias.html'));
});

// Ruta GET para obtener datos de una trivia específica y sus preguntas en formato JSON
router.get('/trivias/ver/data', (req, res) => {
    const { id } = req.query;
    db.query(`
        SELECT 
            url, cuerpo, bannerCabecera, bannerMovil, bannerLogoMarca, colorFooter, colorHeader,
            terminosycondiciones, fechaInicio, fechaFin, email, visa, trivia_status, pregunta,
            tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, pistasDeRespuesta,
            requerido, especial, pregunta_status, prioridad, trivia_id
        FROM vista_completa_trivias_preguntas
        WHERE trivia_id = ?
    `, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la trivia' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Trivia no encontrada' });
        }
        res.json(result);
    });
});

router.get('/trivias/ver', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'detalles.html'));
});

// Ruta GET para servir la página HTML de creación de ubicación
router.get('/trivias/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'crear.html'));
});

// Ruta POST para insertar una nueva trivia en la base de datos
router.post('/trivias/crear', async (req, res) => {
    const {
        url, cuerpo, bannerCabecera, bannerMovil, bannerLogoMarca, colorFooter, colorHeader,
        terminosycondiciones, fechaInicio, fechaFin, email, visa, trivia_status, preguntas
    } = req.body;

    try {
        await db.beginTransaction();

        // Insertar en la tabla trivias
        const triviaResult = await db.query(
            `INSERT INTO trivias (
                url, cuerpo, bannerCabecera, bannerMovil, bannerLogoMarca, colorFooter, colorHeader,
                terminosycondiciones, fechaInicio, fechaFin, email, visa, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                url, cuerpo, bannerCabecera, bannerMovil, bannerLogoMarca, colorFooter, colorHeader,
                terminosycondiciones, fechaInicio, fechaFin, email, visa, trivia_status
            ]
        );

        const trivia_id = triviaResult.insertId;

        // Insertar en la tabla preguntas
        for (const pregunta of preguntas) {
            const {
                pregunta_texto, tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta,
                pistasDeRespuesta, requerido, especial, pregunta_status, prioridad
            } = pregunta;

            await db.query(
                `INSERT INTO preguntas (
                    pregunta, tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta,
                    pistasDeRespuesta, requerido, especial, status, prioridad, trivia_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    pregunta_texto, tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta,
                    pistasDeRespuesta, requerido, especial, pregunta_status, prioridad, trivia_id
                ]
            );
        }

        await db.commit();
        res.json({ message: 'Trivia creada correctamente' });
    } catch (err) {
        await db.rollback();
        res.status(500).json({ error: 'Error al crear la trivia' });
    }
});

// Ruta GET para servir la página HTML de editar de un tipo de canal
router.get('/trivias/editar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/trivias', 'editar.html'));
});

// Ruta GET para obtener datos de una trivia específica y sus preguntas en formato JSON
router.get('/trivias/editar/data', (req, res) => {
    const { id } = req.query;
    db.query(`
        SELECT * FROM vista_completa_trivias_preguntas
        WHERE trivia_id = ?
    `, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la trivia' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Trivia no encontrada' });
        }

        const trivia = {
            trivia_id: results[0].trivia_id,
            url: results[0].url,
            cuerpo: results[0].cuerpo,
            bannerCabecera: results[0].bannerCabecera,
            bannerMovil: results[0].bannerMovil,
            bannerLogoMarca: results[0].bannerLogoMarca,
            colorFooter: results[0].colorFooter,
            colorHeader: results[0].colorHeader,
            terminosycondiciones: results[0].terminosycondiciones,
            fechaInicio: results[0].fechaInicio,
            fechaFin: results[0].fechaFin,
            email: results[0].email,
            visa: results[0].visa,
            trivia_status: results[0].trivia_status,
            preguntas: results.map(row => ({
                id: row.id,
                pregunta: row.pregunta,
                tipopregunta: row.tipopregunta,
                opcionA: row.opcionA,
                opcionB: row.opcionB,
                opcionC: row.opcionC,
                opcionD: row.opcionD,
                respuestaCorrecta: row.respuestaCorrecta,
                pistasDeRespuesta: row.pistasDeRespuesta,
                requerido: row.requerido,
                especial: row.especial,
                status: row.status,
                prioridad: row.prioridad
            }))
        };

        res.json(trivia);
    });
});



// Ruta POST para insertar una nueva pregunta en la tabla preguntas
router.post('/preguntas/editar', (req, res) => {
    const { trivia_id, pregunta, tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, pistasDeRespuesta, requerido, especial, status, prioridad } = req.body;
    db.query(
        `INSERT INTO preguntas (trivia_id, pregunta, tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, pistasDeRespuesta, requerido, especial, status, prioridad) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [trivia_id, pregunta, tipopregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, pistasDeRespuesta, requerido, especial, status, prioridad],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar la pregunta' });
            }
            res.json({ message: 'Pregunta insertada correctamente' });
        }
    );
});

// Ruta PUT para desactivar una trivia
router.put('/trivias/borrar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE trivias SET status = 0 WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al desactivar la trivia' });
        }
        res.json({ message: 'Trivia desactivada correctamente' });
    });
});

// Ruta PUT para activar una trivia
router.put('/trivias/restaurar/:id', (req, res) => {
    const id = req.params.id;
    db.query('UPDATE trivias SET status = 1 WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al activar la trivia' });
        }
        res.json({ message: 'Trivia activada correctamente' });
    });
});

module.exports = router;