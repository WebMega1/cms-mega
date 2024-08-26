const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../dbconnection');
const helpers = require('./helpers');
const { Result } = require('express-validator');

passport.use('local.registro', new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{

    const { email } = req.body;
    let newUser = {
    username,
    email,
    password
};
newUser.password = await helpers.encryptPassword(password);
try {
  const result = await db.query('INSERT INTO users SET ?', [newUser]);
  console.log('Insert Result:', result);  // Depuración

  if (!result.insertId) {
      console.error('No insertId returned from database');
      return done(new Error('Failed to retrieve insertId'));
  }

  newUser.idUser = result.insertId;  // Aquí se obtiene el insertId
  return done(null, newUser);
} catch (error) {
  console.error('Error inserting user:', error);
  return done(error);
}
}));


passport.serializeUser((user, done) => {
  if (!user.idUser) {
      return done(new Error('Cannot serialize user: idUser is missing'));
  }
  done(null, user.idUser);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await db.query('SELECT * FROM users WHERE idUser = ?', [id]);
    done(null, rows[0]);  // Devuelve el usuario completo a partir del ID
} catch (error) {
    done(error);
}
});