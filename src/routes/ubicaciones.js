const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/ubicaciones',(req, res) =>{
    res.sendFile(path.join(__dirname, '../views/pages/ubicaciones', 'ubicaciones.html'))
  })
  
module.exports = router;
  
  
  
