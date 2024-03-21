const db = require('../database/db');

// Controlador para obtener todos los documentos controlados
const getAllDocumentosControlados = async (req, res) => {
    try {
      const query = `SELECT MAX(documentos_controlados.id) as id,
      documentos.id as id_documento,
      MAX(descripcion_documento) as descripcion_documento,
      codigo_documento
      FROM documentos_controlados
      LEFT JOIN documentos ON documento_id = documentos.id
      LEFT JOIN organigrama ON documentos_controlados.organigrama_id = organigrama.id
      GROUP BY documentos.id, codigo_documento
      `
      ;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los documentos controlados' });
    }
  };


  const getControladosPorDocumentoId = async (req, res) => {
    const { id } = req.params;
      try {
      const { rows } = await db.query(`SELECT  documentos_controlados.id, documentos.id as id_documento,  descripcion_documento, codigo_documento, fecha_revision, numero_revision, 
        organigrama.codigo, organigrama.descripcion, documentos_controlados.observacion
        FROM  documentos_controlados 
        LEFT JOIN documentos ON documento_id = documentos.id
        LEFT JOIN organigrama ON documentos_controlados.organigrama_id = organigrama.id
        WHERE documento_id = $1`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos controlados para el documento_id proporcionado.' });
      }
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los documentos controlados.' });
    }
  };


  const getControladosReportesPorDocumentoId = async (req, res) => {
    const { id } = req.params;
      try {
      const { rows } = await db.query(`SELECT  documentos_controlados.id, documentos.codigo_documento, descripcion_documento, numero_revision, 
      codigo_documento,  organigrama.codigo, organigrama.descripcion, documentos.observacion, documentos.documento_asociado
        FROM  documentos_controlados
        LEFT JOIN documentos ON documento_id = documentos.id
        LEFT JOIN organigrama ON documentos_controlados.organigrama_id = organigrama.id
        WHERE documento_id = $1
        ORDER BY documentos_controlados.id
`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos controlados para el documento_id proporcionado.' });
      }
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los documentos controlados.' });
    }
  };







  const createDocumentoControlado = async (req, res) => {
    try {
      const { organigrama_id,  documento_id, observacion  } = req.body;
  
        // Verificar si los valores ya existen en la tabla
        const checkQuery = 'SELECT * FROM documentos_controlados WHERE documento_id = $1 AND organigrama_id = $2';
        const checkResult = await db.query(checkQuery, [documento_id, organigrama_id]);
  
        if (checkResult.rows.length > 0) {
            // Si ya existe, enviar una respuesta indicando el error
            return res.status(400).json({ error: 'Los valores ya existen en la tabla, no se permiten duplicados.' });
        }
  
        // Si no existen, realizar la inserción
        const insertQuery = 'INSERT INTO documentos_controlados (documento_id, organigrama_id, observacion ) VALUES ($1, $2, $3 ) RETURNING *';
        const result = await db.query(insertQuery, [documento_id, organigrama_id, observacion]);
  
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el documento controlado' });
    }
  };




// Controlador para crear un nuevo documento controlado



// Controlador para actualizar un documento controlado por su ID
const updateDocumentoControlado = async (req, res) => {
    try {
      const { id } = req.params;
      const { organigrama_id,  documento_id, observacion  } = req.body;
  
      const query = 'UPDATE documentos_controlados SET organigrama_id = $1, documento_id = $2, observacion = $3 WHERE id = $4 RETURNING *';
  
      const result = await db.query(query, [organigrama_id, documento_id, observacion, id]);
  
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Documento controlado no encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el documento controlado' });
    }
  };
  
  // Controlador para obtener un documento controlado por su ID
  const getDocumentoControladoById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM documentos_controlados WHERE id = $1';
      const result = await db.query(query, [id]);
  
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Documento controlado no encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el documento controlado' });
    }
  };


  const deleteDocumentoControlado = async (req, res) => {
    const { id } = req.params; // Obtén el ID del documento controlado que deseas eliminar desde los parámetros de la URL
  
    try {
      const query = `DELETE FROM documentos_controlados WHERE id = $1`;
      await db.query(query, [id]);
      res.json({ message: 'Documento controlado eliminado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el documento controlado' });
    }
  };



  const createMultipleDocumentosControlados = async (req, res) => {
    try {
        const { documento_id } = req.params;
        const { observacion } = req.body;

        // Validar que documento_id no sea una cadena vacía o nulo
        if (!documento_id) {
            return res.status(400).json({ error: 'El documento_id no puede estar vacío.' });
        }

        // Convertir documento_id a un entero
        const documento_id_as_integer = parseInt(documento_id, 10);

        // Validar que documento_id_as_integer sea un número válido
        if (isNaN(documento_id_as_integer)) {
            return res.status(400).json({ error: 'El documento_id debe ser un número válido.' });
        }

        // Obtener todos los organigramas de la tabla organigrama
        const organigramasQuery = 'SELECT organigrama_id FROM organigrama';
        const organigramasResult = await db.query(organigramasQuery);

        // Verificar si los valores ya existen en la tabla para cada organigrama
        const checkQuery = 'SELECT * FROM documentos_controlados WHERE documento_id = $1 AND organigrama_id = $2';

        // Realizar las inserciones en un bucle para cada organigrama
        for (const row of organigramasResult.rows) {
            const organigrama_id = row.organigrama_id;

            const checkResult = await db.query(checkQuery, [documento_id_as_integer, organigrama_id]);

            if (checkResult.rows.length === 0) {
                // Si no existe, realizar la inserción
                const insertQuery = 'INSERT INTO documentos_controlados (documento_id, organigrama_id, observacion) VALUES ($1, $2, $3) RETURNING *';
                await db.query(insertQuery, [documento_id_as_integer, organigrama_id, observacion]);
            }
        }

        res.status(201).json({ message: 'Inserciones exitosas en todos los organigramas.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear los documentos controlados' });
    }
};

  module.exports = {
    createDocumentoControlado,
    getAllDocumentosControlados,
    updateDocumentoControlado, // Agrega el controlador de actualización
    getDocumentoControladoById, // Agrega el controlador para obtener por ID
    getControladosPorDocumentoId,
    getControladosReportesPorDocumentoId,
    deleteDocumentoControlado,
    createMultipleDocumentosControlados 

  };
