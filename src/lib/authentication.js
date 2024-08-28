const passport = require ('passport'); // Importa el módulo Passport, que es un middleware para la autenticación de usuarios.
const LocalStrategy = require('passport-local').Strategy; // Importa la estrategia de autenticación local de Passport.

const db = require('../dbconnection'); // Importa la conexión a la base de datos desde un archivo externo.
const helpers = require('./helpers'); // Importa funciones auxiliares (helpers) como el manejo de contraseñas.
const { Result } = require('express-validator'); // Importa el objeto Result de express-validator para manejar validaciones.

// Configuración de la estrategia de inicio de sesión (login) usando Passport y la estrategia local
passport.use('local.login', new LocalStrategy({
    usernameField:'email', // Campo que se utilizará como nombre de usuario (en este caso, el email).
    passwordField:'password', // Campo que se utilizará como contraseña.
    passReqToCallback: true // Permite pasar la solicitud completa (req) a la función de callback.
},async(req, email, password, done) => {
   
  try {
    // Consulta el usuario en la base de datos usando el email
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    // Si el usuario existe
    if (user) {
      // Compara la contraseña proporcionada con la contraseña almacenada
      const validPassword = await helpers.matchPassword(password, user.password);
      
      if (validPassword) {
        // Autenticación exitosa, pasa el usuario y un mensaje de éxito
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
        // Contraseña incorrecta
        done(null, false, req.flash('message', 'Contraseña incorrecta'));
      }
    } else {
      // Usuario no encontrado
      return done(null, false, req.flash('message', 'Email no encontrado'));
    }
  } catch (error) {
    // Manejo de errores
    return done(error);
  }
}));
 
// Configuración de la estrategia de registro (registro) usando Passport y la estrategia local
passport.use('local.registro', new LocalStrategy({
    usernameField: 'userName', // Campo que se utilizará como nombre de usuario.
    passwordField: 'password', // Campo que se utilizará como contraseña.
    passReqToCallback: true    // Permite pasar la solicitud completa (req) a la función de callback.
}, async (req, username, password, done) =>{

    const { email } = req.body; // Extrae el email del cuerpo de la solicitud.
    let newUser = {
    username,
    email,
    password
};
newUser.password = await helpers.encryptPassword(password); // Encripta la contraseña antes de almacenarla.
try {
    // Inserta el nuevo usuario en la base de datos
  const result = await db.query('INSERT INTO users SET ?', [newUser]);
  console.log('Insert Result:', result);  // Mensaje de depuración para mostrar el resultado de la inserción

  if (!result.insertId) {
      console.error('No insertId returned from database');// Si no se obtiene un ID de inserción, muestra un error.
      return done(new Error('Failed to retrieve insertId'));
  }

  newUser.idUser = result.insertId;  // Asigna el ID insertado al nuevo usuario
  return done(null, newUser); // Autenticación exitosa, devuelve el nuevo usuario
} catch (error) {
  console.error('Error inserting user:', error); // Manejo de errores en caso de fallo durante la inserción
  return done(error);
}
}));

// Serialización del usuario: Define cómo se almacenará el usuario en la sesión
passport.serializeUser((user, done) => {
  if (!user.idUser) {
      return done(new Error('Cannot serialize user: idUser is missing')); // Manejo de errores si falta el ID del usuario
  }
  done(null, user.idUser); // Almacena el ID del usuario en la sesión
});

// Deserialización del usuario: Define cómo se recupera el usuario de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    // Busca al usuario en la base de datos por su ID
    const rows = await db.query('SELECT * FROM users WHERE idUser = ?', [id]);
    done(null, rows[0]);  // Devuelve el usuario completo a partir del ID
} catch (error) {
    done(error); // Manejo de errores en caso de fallo durante la consulta
}
});