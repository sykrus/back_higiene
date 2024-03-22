const pool = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  // Obtenemos las credenciales del usuario desde el cuerpo de la solicitud
  const { usuario, password } = req.body;

  try {
    // Consultamos la base de datos para buscar al usuario por su nombre de usuario y estado true
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND estado = 1', [usuario]);

    // Si no se encuentra ningún usuario con el nombre de usuario proporcionado o el estado no es true, devolvemos un error 401
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado o inactivo' });
    }

    // Obtenemos la información del usuario
    const user = result.rows[0];

    // Comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Si la contraseña no coincide, devolvemos un error 401
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si las credenciales son correctas, generamos un token JWT
    const token = jwt.sign({ userId: user.id, username: user.usuario }, 'tu_secreto_secreto', {
      expiresIn: '1h', // Cambia el tiempo de expiración según tus necesidades
    });

    // Enviamos el token como respuesta junto con los datos del usuario
    res.json({ message: 'Inicio de sesión exitoso', token, user });
  } catch (error) {
    // En caso de error en la base de datos u otro error, manejamos la excepción
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};




// Controlador para obtener los datos del usuario
const getUserData = async (req, res) => {
  const userId = req.user.userId; // Obtenemos el ID del usuario desde la solicitud (de la verificación del token)

  // Consulta la base de datos para obtener los datos del usuario
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);

  // Verifica si se encontró al usuario
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const user = result.rows[0];
  res.json({ user });
};




module.exports = { login, getUserData };
