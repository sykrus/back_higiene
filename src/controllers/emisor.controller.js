const db = require('../database/db');

// Obtener todos los registros de Emisores
exports.getAllEmisores = (req, res) => {
  db.query('SELECT * FROM public.emisores', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Emisores.' });
    }
    res.json(results.rows);
  });
};


exports.getAllEmisoresEstatus = (req, res) => {
  db.query('SELECT * FROM public.emisores  WHERE estado = 1', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Emisores.' });
    }
    res.json(results.rows);
  });
};


// Crear un nuevo registro de Emisores
exports.createEmisores = (req, res) => {
  const { nombre_emisor, estado } = req.body;
  const sql = 'INSERT INTO public.emisores (nombre_emisor, estado) VALUES ($1, $2)';
  db.query(sql, [nombre_emisor, estado], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear un nuevo registro de Emisores.' });
    }
    res.json({ message: 'Registro de Emisores creado con éxito.'});
  });
};

// Actualizar un registro de Emisores existente
exports.updateEmisores = (req, res) => {
  const { id } = req.params;
  const { nombre_emisor, estado } = req.body;
  const sql = 'UPDATE public.emisores SET nombre_emisor=$1, estado=$2 WHERE id=$3';
  db.query(sql, [nombre_emisor, estado, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar el registro de Emisores.' });
    }
    res.json({ message: 'Registro de Emisores actualizado con éxito.' });
  });
};

// Borrar un registro de Emisores
exports.deleteEmisores = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM public.emisores WHERE id=$1';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al borrar el registro de Emisores.' });
    }
    res.json({ message: 'Registro de Emisores eliminado con éxito.' });
  });
};


exports.getEmisoresById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.emisores WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Emisores no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el Emisores por ID.' });
  }
};