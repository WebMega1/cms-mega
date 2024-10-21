// Importa y configura las dependencias necesarias
const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js
const morgan = require('morgan'); // Importa el módulo Morgan, que es un middleware para registrar las solicitudes HTTP en la consola.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.
const bodyParser = require('body-parser'); // Importa Body-Parser, un middleware para analizar cuerpos de solicitudes HTTP (URL-encoded y JSON)
const session = require ('express-session'); // Importa el módulo para manejar sesiones de usuario en Express.
const validator = require ('express-validator'); // Importa el módulo para validar y sanitizar datos de entrada del usuario.
const passport = require ('passport'); // Importa Passport, que es un middleware para la autenticación de usuarios.
const flash = require('connect-flash'); // Importa Connect-Flash, que es un middleware para mostrar mensajes flash (notificaciones temporales).
const MySQLStore = require('express-mysql-session')(session); // Importa el módulo para almacenar sesiones en una base de datos MySQL usando el módulo de sesiones de Express.

// Inicializa la aplicación Express
const app = express();




require('./lib/authentication'); // Carga y ejecuta la configuración de autenticación desde un archivo externo.

//conexion con el archivo de la base de datos
const dbConfig = require('./dbConfig');



// Configuración de la aplicación
app.set('port', process.env.PORT || 4000);

// Configuración de EJS como motor de plantillas
// no se esta utilizando, pero se tienen por si en un futuro de necesita
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views'))); // Establece la carpeta 'views' como la carpeta de archivos estáticos, permitiendo que los archivos en esta carpeta se sirvan directamente.
// Configurar la carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));// Carpeta para recursos staticos reusables

app.use('/uploads', express.static(path.join(__dirname, 'views/uploads'))); // Configurar la carpeta 'uploads' como estática es la carpeta de imagenes

///Middlewares
app.use(morgan('dev')); // Usa Morgan en modo 'dev' para registrar las solicitudes HTTP entrantes en la consola con información detallada.
app.use(bodyParser.urlencoded({ extended: true })); // Usa Body-Parser para analizar datos URL-encoded (como los enviados por formularios)
app.use(express.json()); // Usa un middleware para analizar cuerpos de solicitudes con formato JSON.

app.use(session({
  secret: 'Megamysqlnode',   // Define la clave secreta que se utiliza para firmar la cookie de la sesión.
  resave: false,             // Indica que la sesión no debe ser guardada si no ha habido cambios en ella.
  saveUninitialized: false,  // Indica que no se deben guardar sesiones que no han sido inicializadas.
  store: new MySQLStore(dbConfig.database) // Almacena las sesiones en una base de datos MySQL usando la configuración especificada.
}));
app.use(flash()); // Usa Connect-Flash para permitir el uso de mensajes flash, que se pueden mostrar después de redirecciones.
app.use(passport.initialize()); // Inicializa Passport, preparándolo para manejar autenticación.
app.use(passport.session()); // Usa Passport para gestionar sesiones de autenticación de usuario.
//app.use(validator()); // Este middleware ha sido comentado; sería utilizado para validar y sanitizar datos en solicitudes, pero no está en uso actualmente.

////Variable Globales
app.use((req, res, next) => {
  app.locals.message = req.flash('message'); // Asigna a la variable global 'message' los mensajes flash de tipo 'message'.
  app.locals.success = req.flash('success'); // Asigna a la variable global 'success' los mensajes flash de tipo 'success'.
  app.locals.user = req.user; // Asigna a la variable global 'user' la información del usuario autenticado, si existe.
  next(); // Llama a 'next' para continuar con el siguiente middleware.
});


//rutas 
const routesIndex = require('./routes/index'); // Importa las rutas para la página principal desde un archivo externo.
const routesUsers = require('./routes/userLogInOut'); // Importa las rutas para el inicio y cierre de sesión de usuarios.
const routesUbic = require('./routes/ubicaciones');  // Importa las rutas para gestionar Sucursales.
const routesCis = require('./routes/cis');  // Importa las rutas para gestionar cis.
const routesRegi = require('./routes/regiones'); // Importa las rutas para gestionar Regiones.
const routesTipoCanales = require('./routes/tipocanales');  // Importa las rutas para gestionar Categorias.
const routesCanales = require('./routes/canales');  // Importa las rutas para gestionar Canales.
const routesMega = require('./routes/mega');  // Importa las rutas para gestionar Categorias.
const routesCargarTarifario = require('./routes/cargartarifario');  // Importa para cargar tarifario
const routesTipoPaquetes = require('./routes/tiposdepaquetes');  // Importa para cargar tarifario
const routesServicioCable = require('./routes/tiposdeservicocable');  // Importa para cargar tarifario
const routesBannerCable = require('./routes/bannercable');  // Importa para cargar Banner de cable
const routesBannerPaquetes = require('./routes/bannerpaquetes');  // Importa para cargar Banner de tipo de paquetes
const routesTrivias = require('./routes/trivias');  // Importa para cargar Banner de tipo de paquetes
const routesTriviasRespuestas = require('./routes/triviasrespuesta');  // Importa para cargar Banner de tipo de paquetes

const routesBanners = require('./routes/banners');  // Importa para cargar banners



// Monta las rutas en la aplicación
app.use(routesIndex); // Monta las rutas principales en la aplicación.
app.use(routesUsers); // Monta las rutas de usuarios en la aplicación.
app.use(routesUbic); // Monta las rutas de ubicaciones en la aplicación.
app.use(routesCis); // Monta las rutas de cis en la aplicación.
app.use(routesRegi);// Monta las rutas de Regiones en la aplicación.
app.use(routesTipoCanales);// Monta las rutas de Tipos De Canales en la aplicación.
app.use(routesCanales);// Monta las rutas de Tipos De Canales en la aplicación.
app.use(routesMega);// Monta las rutas de Mega en la aplicación.
app.use(routesCargarTarifario);// Monta las rutas para cargar archivo csv.
app.use(routesTipoPaquetes);// Monta las rutas para tipos de paquetes.
app.use(routesServicioCable);// Monta las rutas para tipos de servicios de cable.
app.use(routesBannerCable);// Monta las rutas para tipos de Banner de cable.
app.use(routesBannerPaquetes);// Monta las rutas para tipos de Banner de cable.
app.use(routesTrivias);// Monta las rutas para tipos de Banner de cable.
app.use(routesTriviasRespuestas);// Monta las rutas para tipos de Banner de cable.

app.use(routesBanners);// Monta las rutas para tipos de Banner de cable.



// Iniciamos el servidor 
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port')); // Muestra en la consola el puerto en el que el servidor está escuchando.
  });

  module.exports = app; // Exporta la aplicación para que pueda ser utilizada en otros archivos.git 