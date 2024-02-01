const pool = require('../database/db');

// Obtener todos los movimientos
exports.getAllMovimientos = (req, res) => {
    pool.query('SELECT * FROM movimientos', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener los movimientos.' });
      }
      res.json(results.rows);
    });
  };
  
  // Crear un nuevo movimiento
  exports.createMovimiento = (req, res) => {
    const { documento_id, estatu_id, fecha_registro } = req.body;
    const sql = 'INSERT INTO public.movimientos (documento_id, estatu_id, fecha_registro) VALUES ($1, $2, $3)';
    pool.query(sql, [documento_id, estatu_id, fecha_registro], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al crear un nuevo movimiento.' });
      }
      res.json({ message: 'Movimiento creado con éxito.' });
    });
  };
  
  // Actualizar un movimiento existente
  exports.updateMovimiento = (req, res) => {
    const { id } = req.params;
    const { documento_id, estatu_id, fecha_registro } = req.body;
    const sql = 'UPDATE movimientos SET documento_id=$1, estatu_id=$2, fecha_registro=$3 WHERE id=$4';
    pool.query(sql, [documento_id, estatu_id, fecha_registro, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al actualizar el movimiento.' });
      }
      res.json({ message: 'Movimiento actualizado con éxito.' });
    });
  };
  
  // Borrar un movimiento
  exports.deleteMovimiento = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM movimientos WHERE id=$1';
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al borrar el movimiento.' });
      }
      res.json({ message: 'Movimiento eliminado con éxito.' });
    });
  };
  
  // Obtener un movimiento por ID

  exports.getMovimientosPorDocumentoId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const { rows } = await pool.query(`SELECT  movimientos.id, documento_id, movimientos.estatu_id, codigo_documento, nombre_estatus, descripcion_documento, movimientos.fecha_registro  
        FROM  movimientos 
        LEFT JOIN documentos ON documento_id = documentos.id
        LEFT JOIN estatus ON estatu_id = estatus.id
        WHERE documento_id = $1`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron movimientos para el documento_id proporcionado.' });
      }
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los movimientos.' });
    }
  };
 
  
  
  
  



    
