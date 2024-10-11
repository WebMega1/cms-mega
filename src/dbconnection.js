const mysql = require('mysql'); // Importa el módulo MySQL para trabajar con bases de datos MySQL en Node.js.
const dbConfig = require('./dbConfig'); // Importa la configuración de la base de datos desde el archivo de configuración.
const util = require('util'); // Importa el módulo Util para trabajar con utilidades, como la promisificación de funciones.

const db = mysql.createConnection(dbConfig.database); // Crea una conexión a la base de datos utilizando la configuración importada.


db.connect(err => {
  if (err) throw err; // Si ocurre un error al conectar, lanza un error.
  console.log('Connenction Data Base Succces   '); // Si la conexión es exitosa, muestra un mensaje en la consola.
});

db.query = util.promisify(db.query); // Promisifica la función de consulta SQL para permitir el uso de promesas y async/await.
db.beginTransaction = util.promisify(db.beginTransaction);
db.commit = util.promisify(db.commit);
db.rollback = util.promisify(db.rollback);

module.exports = db; // Exporta la conexión a la base de datos para que pueda ser utilizada en otros archivos.