const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');





router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages', 'index.html'));
  });
  

 router.get('/RegistroUsuarios', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/users', 'createUsersForm.html'));
  });

  router.post('/RegistroUsuarios', passport.authenticate('local.registro',{
    successRedirect:'/index',
    failureFlash:'/RegistroUsuarios',
    failureFlash:true
  }));
  
  module.exports = router;
