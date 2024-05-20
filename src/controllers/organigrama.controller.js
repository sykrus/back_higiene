const db = require('../database/db');

// Obtener todos los registros
exports.getAllOrganigrama = (req, res) => {
  db.query('SELECT * FROM organigrama ORDER BY descripcion ASC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de organigrama.' });
    }
    res.json(results.rows);
  });
};


exports.getAllOrganigramaActivos = (req, res) => {
  db.query('SELECT * FROM organigrama WHERE estado = true ORDER BY descripcion ASC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de organigrama.' });
    }
    res.json(results.rows);
  });
};




// Obtener todos los registros especificos
exports.getAllOrganigramaPadre = (req, res) => {
  db.query(`SELECT o.id,  o.codigo, o.descripcion, p.descripcion AS descripcion_padre, o.estado
            FROM organigrama AS o
            LEFT JOIN organigrama AS p ON o.padre = p.id
            ORDER BY O.descripcion ASC

            `
  , (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de organigrama.' });
    }
    res.json(results.rows);
  });
};

// Obtener documentos por organigrama
exports.getDocumentosOrganigrama = async (req, res) => {
  const organigramaId = req.query.organigrama_id;

  const sql = `
    SELECT documentos.*
    FROM documentos
    INNER JOIN organigrama ON documentos.organigrama_id = organigrama.id
    WHERE organigrama.id = $1;
  `;

  try {
    const { rows } = await db.query(sql, [organigramaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error al obtener los documentos' });
  }
};














// Crear un nuevo registro
exports.createOrganigrama = async (req, res) => {
  const { codigo, descripcion, padre, estado } = req.body;
  const sqlCheck = 'SELECT * FROM organigrama WHERE codigo = $1 OR descripcion = $2';

  try {
    const { rowCount, rows } = await db.query(sqlCheck, [codigo, descripcion]);

    if (rowCount > 0) {
      // Registro duplicado encontrado, devuelve un código 409 (Conflict)
      res.status(409).json({ message: 'Registro duplicado: Ya existe un registro similar en la base de datos.' });
    } else {
      // No existe un registro similar, procede con la inserción
      const sqlInsert = 'INSERT INTO organigrama (codigo, descripcion, padre, estado) VALUES ($1, $2, $3, $4)';
      const { rowCount } = await db.query(sqlInsert, [codigo, descripcion, padre, estado]);

      if (rowCount === 1) {
        // Registro creado con éxito, devuelve un código 201 (Created)
        res.status(201).json({ message: 'Registro de organigrama creado con éxito.' });
      } else {
        // Error en la inserción, devuelve un código 500 (Internal Server Error)
        res.status(501).json({ message: 'Error al crear un nuevo registro de organigrama.' });
      }
    }
  } catch (error) {
    // Error de servidor, devuelve un código 500 (Internal Server Error)
    console.error(error);
    res.status(500).json({ message: 'Error Parametros invalidos. Revisar el Formulario' });
  }
};

exports.getOrganigramaById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM organigrama WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Organigrama no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el organigrama por ID.' });
  }
};


// Actualizar un registro existente
exports.updateOrganigrama = async (req, res) => {
  const { id } = req.params;
  const { codigo, descripcion, padre, estado } = req.body;
  const sql = 'UPDATE organigrama SET codigo = $1, descripcion = $2, padre = $3, estado = $4 WHERE id = $5';

  try {
    const { rowCount } = await db.query(sql, [codigo, descripcion, padre, estado, id]);
    if (rowCount === 1) {
      res.json({ message: 'Registro de organigrama actualizado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al actualizar el registro de organigrama.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el registro de organigrama.' });
  }
};

// Borrar un registro
exports.deleteOrganigrama = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM organigrama WHERE id = $1';

  try {
    const { rowCount } = await db.query(sql, [id]);
    if (rowCount === 1) {
      res.json({ message: 'Registro de organigrama eliminado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al borrar el registro de organigrama.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al borrar el registro de organigrama.' });
  }
};