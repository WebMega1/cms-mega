const express = require('express');
const morgan = require('morgan');
const path = require('path');

// llamamos express
const app = express();

//conexion con el archivo de la base de datos
const bd  = require('./dbconnection');



//funciones de los npm 
app.set('port', process.env.PORT || 4000);
app.use(express.static(path.join(__dirname, 'views')));

//rutas 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


///Middlewares
app.use(morgan('dev'));

// Iniciamos el servidor 
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });

  