const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
  });
  
  router.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'sign-in.html'));
  });

  
  
  module.exports = router;
