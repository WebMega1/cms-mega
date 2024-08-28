const bcrypt = require('bcryptjs'); // Importa el módulo bcryptjs, que se utiliza para encriptar y comparar contraseñas de forma segura.

const helpers = {}; // Crea un objeto vacío 'helpers' donde se almacenarán las funciones auxiliares (helpers).

// Función para encriptar contraseñas
helpers.encryptPassword = async (password) => {

  // Genera un salt con un factor de costo de 10, que es un valor utilizado para proteger contra ataques de fuerza bruta.
  const salt = await bcrypt.genSalt(10);
  // Encripta la contraseña utilizando el salt generado y devuelve el hash resultante.
  const hash = await bcrypt.hash(password, salt);
  return hash; // Devuelve la contraseña encriptada (hash).
};

// Función para comparar contraseñas
helpers.matchPassword = async (password, savedPassword) => {
  try {
     // Compara la contraseña proporcionada por el usuario con la contraseña encriptada almacenada en la base de datos.
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e) // Si ocurre un error durante la comparación, se registra en la consola.
  }
};

// Exporta el objeto 'helpers' para que las funciones puedan ser utilizadas en otros archivos del proyecto.
module.exports = helpers;