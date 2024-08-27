// Npm que necesita el proyecto 
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require ('express-session');
const validator = require ('express-validator');
const passport = require ('passport');
const flash = require('connect-flash')
const MySQLStore = require('express-mysql-session')(session);





// llamamos express
const app = express();
require('./lib/authentication')

//conexion con el archivo de la base de datos
const dbConfig = require('./dbConfig');



//funciones de los npm 
app.set('port', process.env.PORT || 4000);
// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));


///Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'Megamysqlnode',   
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(dbConfig.database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());

////Variable Globales
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});


//rutas 
const routesIndex = require('./routes/index');
const routesUsers = require('./routes/userLogInOut');
const routesUbic = require('./routes/ubicaciones');
app.use(routesIndex);
app.use(routesUsers);
app.use(routesUbic);


// Iniciamos el servidor 
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });

  module.exports = app;