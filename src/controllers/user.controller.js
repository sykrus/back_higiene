const pool = require('../database/db');
const bcrypt = require('bcrypt');

// Registro de usuario
const register = async (req, res) => {
  const { cedula, nombres, apellidos, usuario, password, rol_id, estado } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO usuarios (cedula, nombres, apellidos, usuario, password, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [cedula, nombres, apellidos, usuario, hashedPassword, rol_id, estado]
    );

    res.json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



// Actualización de usuario
const updateUser = async (req, res) => {
  const { cedula, nombres, apellidos, usuario, password, rol_id, estado } = req.body;
  const userId = req.params.id; // Supongo que obtienes el ID del usuario desde la ruta, ajusta esto según tu enrutamiento.

  try {
    // Verifica si el usuario desea actualizar la contraseña
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateQuery = `
      UPDATE usuarios
      SET cedula = $1, nombres = $2, apellidos = $3, usuario = $4, password = $5, rol_id = $6, estado = $7
      WHERE id = $8
    `;

    await pool.query(updateQuery, [cedula, nombres, apellidos, usuario, hashedPassword, rol_id, estado, userId]);

    res.json({ message: 'Actualización exitosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const getAllUsuarios = (req, res) => {
  pool.query(`SELECT usuarios.id, cedula, nombres, apellidos, usuario, password, rol_id, usuarios.estado
   FROM public.usuarios
   LEFT JOIN roles ON rol_id= roles.id
   `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de usuarios.' });
    }
    res.json(results.rows);
  });
};

const getUsuariosById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.usuarios WHERE id = $1';

  try {
    const { rows } = await pool.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'usuarios no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuarios por ID.' });
  }
};



module.exports = { register, updateUser, getAllUsuarios, getUsuariosById };
