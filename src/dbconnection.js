const mysql = require('mysql');
const dbConfig = require('./dbConfig');

const bd = mysql.createConnection(dbConfig);

bd.connect(err => {
  if (err) throw err;
  console.log('Connenction Data Base Succces   ');
});

module.exports = bd;