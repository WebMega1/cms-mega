// Configuración de las rutas para la autenticación de usuarios
const express = require('express'); // Importa el módulo Express, que es un framework para crear aplicaciones web en Node.js.
const passport = require('passport'); // Importa Passport, que es un middleware para la autenticación de usuarios.
const router = express.Router(); // Crea una instancia de Router, que permite definir rutas en un módulo separado.
const path = require('path'); // Importa el módulo Path, que proporciona utilidades para trabajar con rutas de archivos y directorios.


router.get('/logOut', (req, res) => {
   // Define una ruta GET para '/logOut' que envía un formulario HTML para crear un usuario.
    res.sendFile(path.join(__dirname, '../views/pages/users', 'createUsersForm.html'));
  });

  router.post('/logOut', passport.authenticate('local.registro',{
      // Define una ruta POST para '/logOut' que utiliza Passport para autenticar al usuario al registrarse.
    successRedirect:'/index', // Redirige al usuario a la página principal en caso de éxito.
    failureRedirect:'/logIn', // Redirige al usuario a la página de inicio de sesión en caso de fallo.
    failureFlash:true // Muestra un mensaje flash en caso de error.
  }));

  router.get('/logIn', (req, res) =>{
    // Define una ruta GET para '/logIn' que envía el archivo HTML para la página de inicio de sesión.
    res.sendFile(path.join(__dirname, '../views/pages/', 'logIn.html'));
  });

  router.post('/logIn', (req, res, next) =>{
     // Define una ruta POST para '/logIn' que utiliza Passport para autenticar al usuario al iniciar sesión.
    passport.authenticate('local.login',{
      successRedirect:'/index', // Redirige al usuario a la página principal en caso de éxito.
      failureRedirect:'/logIn', // Redirige al usuario a la página de inicio de sesión en caso de fallo.
      failureFlash:true  // Muestra un mensaje flash en caso de error.
    })(req, res, next); // Ejecuta la autenticación pasando las funciones de solicitud, respuesta y el siguiente middleware.
  });
  
  module.exports = router; // Exporta el router para que pueda ser utilizado en otros archivos.
