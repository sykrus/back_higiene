const db = require('../database/db');

// Obtener todos los registros de normas
exports.getAllNormas = (req, res) => {
  db.query('SELECT * FROM public.normas', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de normas.' });
    }
    res.json(results.rows);
  });
};

exports.getAllNormasActivos = (req, res) => {
  db.query('SELECT * FROM public.normas WHERE estado = true', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de normas.' });
    }
    res.json(results.rows);
  });
};

// Crear un nuevo registro de normas
exports.createNormas = (req, res) => {
  const { nombre_normas, estado } = req.body;
  const sql = 'INSERT INTO public.normas (nombre_normas, estado) VALUES ($1, $2)';
  db.query(sql, [nombre_normas, estado], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear un nuevo registro de normas.' });
    }
    res.json({ message: 'Registro de normas creado con éxito.'});
  });
};

// Actualizar un registro de normas existente
exports.updateNormas = (req, res) => {
  const { id } = req.params;
  const { nombre_normas, estado } = req.body;
  const sql = 'UPDATE public.normas SET nombre_normas=$1, estado=$2 WHERE id=$3';
  db.query(sql, [nombre_normas, estado, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar el registro de normas.' });
    }
    res.json({ message: 'Registro de normas actualizado con éxito.' });
  });
};

// Borrar un registro de normas
exports.deleteNormas = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM public.normas WHERE id=$1';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al borrar el registro de normas.' });
    }
    res.json({ message: 'Registro de normas eliminado con éxito.' });
  });
};


exports.getNormasById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.normas WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'normas no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el normas por ID.' });
  }
};