const mysql = require('mysql');
const dbConfig = require('./dbConfig');
const util = require('util');

const db = mysql.createConnection(dbConfig.database);

db.connect(err => {
  if (err) throw err;
  console.log('Connenction Data Base Succces   ');
});

db.query = util.promisify(db.query);

module.exports = db; 