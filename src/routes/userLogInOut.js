const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');


router.get('/logOut', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/users', 'createUsersForm.html'));
  });

  router.post('/logOut', passport.authenticate('local.registro',{
    successRedirect:'/index',
    failureRedirect:'/logIn',
    failureFlash:true
  }));

  router.get('/logIn', (req, res) =>{
    res.sendFile(path.join(__dirname, '../views/pages/', 'logIn.html'));
  });

  router.post('/logIn', (req, res, next) =>{
    passport.authenticate('local.login',{
      successRedirect:'/index',
      failureRedirect:'/logIn',
      failureFlash:true
    })(req, res, next);
  });
  
  module.exports = router;