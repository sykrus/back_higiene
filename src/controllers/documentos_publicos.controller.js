const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Configurar Multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'uploads/publicos'; // Nombre de la carpeta donde se guardarán los archivos
    const fullPath = path.join(__dirname, '..', uploadDir);

    // Crear la carpeta si no existe
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    callback(null, fullPath);
  },
  filename: (req, file, callback) => {
    // callback(null, Date.now() + '-' + file.originalname); //Para guardar el archivo con fecha + nombre_archivo
    callback(null, file.originalname.replace(/ /g, '_'));
  },
});

// Configurar Multer para permitir cualquier tipo de archivo
const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, true);
  },
}).single('archivo'); // Usar 'archivo' como el nombre del campo del formulario

const subirArchivo = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }

      const archivo = req.file;
      if (!archivo) {
        console.error('No se ha proporcionado un archivo válido');
        return res.status(400).json({ error: 'No se ha proporcionado un archivo válido' });
      }

      // Extrae el nombre original del archivo
      const nombreDocumento = archivo.originalname.replace(/ /g, '_');

      // Extrae los valores de los campos del formulario
      const { estatus_id, nombre_documento, descripcion_documento, codigo_documento, emisor_id, clave_accesso, observacion, usuario_id, numero, tipo_documento } = req.body;

      // Valida que los campos tengan valores definidos o establece null si son undefined
      const rutaDocumento = path.join('uploads/publicos', nombreDocumento); // Ruta del archivo guardado en el sistema de archivos
      const fecha_registro = new Date(); // Fecha de registro automática

      // Verifica si el código de documento ya existe en la base de datos
      const codigoExistenteQuery = `
        SELECT COUNT(*) as count FROM documentos_publicos WHERE codigo_documento = $1
      `;

      try {
        const codigoExistenteResult = await db.query(codigoExistenteQuery, [codigo_documento]);
        const codigoExistente = codigoExistenteResult.rows[0].count > 0;

        if (codigoExistente) {
          return res.status(401).json({ mensaje: 'Ya existe un documento con el mismo código' });
        }

        // Prepara la consulta SQL con parámetros
        const insertQuery = `
          INSERT INTO documentos_publicos
          (estatus_id, nombre_documento, descripcion_documento, codigo_documento, emisor_id, clave_accesso, observacion, ruta_documento, fecha_registro, numero, tipo_documento)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        // Ejecuta la consulta SQL con los parámetros definidos
        const result = await db.query(insertQuery, [
          estatus_id || null,
          nombreDocumento || null,
          descripcion_documento || null,
          codigo_documento || null,
          emisor_id || null,
          clave_accesso || null,
          observacion || null,
          rutaDocumento || null,
          fecha_registro,
          numero || null,
          tipo_documento || 'digital'
        ]);

        res.status(200).json({ mensaje: 'Archivo subido y registrado correctamente', documento: result.rows[0] });
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        return res.status(500).json({ error: 'Error al guardar en la base de datos' });
      }
    });
  } catch (error) {
    console.error('Error en la subida del archivo:', error);
    return res.status(500).json({ error: 'Error en la subida del archivo' });
  }
};


// Obtener la lista de documentos
const listarDocumentos = async (req, res) => {
  try {
    // Consulta SQL para obtener la lista de documentos
    const consulta = `
      SELECT dp.id, dp.descripcion_documento, dp.codigo_documento , dp.numero,
      dp.nombre_documento, dp.fecha_registro, dp.ruta_documento, nombre_emisor, dp.observacion, dp.clave_accesso, dp.tipo_documento
      FROM documentos_publicos dp
      LEFT JOIN emisores ON emisor_id = emisores.id
      ORDER BY dp.codigo_documento
     
    `;

    // Ejecuta la consulta SQL
    const resultados = await db.query(consulta);

    // Agrega la ruta completa de acceso a cada archivo
    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${__dirname}/../${documento.ruta_documento}`, // Ruta dinámica
    }));

    // Retorna la lista de documentos con las rutas de acceso
    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};



const listarDocumentosPublico = async (req, res) => {
  try {
    // Consulta SQL para obtener la lista de documentos
    const consulta = `
      SELECT dp.id, dp.descripcion_documento, dp.codigo_documento , dp.numero, 
      dp.nombre_documento, dp.fecha_registro, dp.ruta_documento, nombre_emisor, dp.observacion, dp.clave_accesso, dp.tipo_documento
      FROM documentos_publicos dp
      LEFT JOIN emisores ON emisor_id = emisores.id
      ORDER BY dp.codigo_documento ASC
     
    `;

    // Ejecuta la consulta SQL
    const resultados = await db.query(consulta);

    // Agrega la ruta completa de acceso a cada archivo
    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${__dirname}/../${documento.ruta_documento}`, // Ruta dinámica
    }));

    // Retorna la lista de documentos con las rutas de acceso
    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};


const deleteDocumentoPublico = async (req, res) => {
  const { id } = req.params; // Obtén el ID del documento controlado que deseas eliminar desde los parámetros de la URL

  try {
    const query = `DELETE FROM documentos_publicos WHERE id = $1`;
    await db.query(query, [id]);
    res.json({ message: 'Documento  eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el documento' });
  }
};

const actualizarDocumentosExternos = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }

      const archivo = req.file;
      if (!archivo) {
        console.error('No se ha proporcionado un archivo válido');
        return res.status(400).json({ error: 'No se ha proporcionado un archivo válido' });
      }

      // Extrae el nombre original del archivo
      const nombreDocumento = archivo.originalname.replace(/ /g, '_');

      // Extrae los valores de los campos del formulario
      const { estatus_id, nombre_documento, descripcion_documento, codigo_documento, emisor_id, clave_accesso, observacion, usuario_id, numero, tipo_documento } = req.body;

      // Define la ruta del archivo guardado en el sistema de archivos
      const rutaDocumento = path.join('uploads/publicos', nombreDocumento);

      // ID del documento a actualizar, extraído de los parámetros de la ruta
      const { id } = req.params;

      // Prepara la consulta SQL para actualizar los campos
      const updateQuery = `
        UPDATE documentos_publicos
        SET estatus_id = $1, nombre_documento = $2, descripcion_documento = $3, codigo_documento = $4, emisor_id = $5, clave_accesso = $6, observacion = $7, ruta_documento = $8, numero = $9, tipo_documento = $10
        WHERE id = $11
      `;

      // Ejecuta la consulta SQL con los parámetros definidos
      await db.query(updateQuery, [
        estatus_id || null,
        nombreDocumento || null,
        descripcion_documento || null,
        codigo_documento || null,
        emisor_id || null,
        clave_accesso || null,
        observacion || null,
        rutaDocumento || null,
        numero || null,
        tipo_documento || 'digital',
        id  // ID del documento a actualizar
      ]);

      res.status(200).json({ mensaje: 'Documento actualizado correctamente' });
    });
  } catch (error) {
    console.error('Error en la actualización del documento:', error);
    return res.status(500).json({ error: 'Error en la actualización del documento' });
  }
};


const actualizarInformacionDocumentoExterno = async (req, res) => {
  const { id } = req.params;
  const { estatus_id, nombre_documento, descripcion_documento, codigo_documento, emisor_id, clave_accesso, observacion,  ruta_documento, numero, tipo_documento } = req.body;  
  const sql = `
  UPDATE documentos_publicos 
  SET
    estatus_id = $1,
    nombre_documento = $2,
    descripcion_documento = $3,
    codigo_documento = $4,
    emisor_id = $5,
    clave_accesso = $6,
    observacion = $7,
    ruta_documento = $8,
    numero = $9,
    tipo_documento = $10
  WHERE id = $11

  RETURNING id
`;

  try {
    const { rowCount } = await db.query(sql, [
      estatus_id,
      nombre_documento,
      descripcion_documento,
      codigo_documento,
      emisor_id,
      clave_accesso,
      observacion,
      ruta_documento,
      numero,
      tipo_documento,
      id
    
    ]);
    if (rowCount === 1) {
      res.json({ message: 'Estatus Actualizado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al actualizar el documento.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el documento.' });
  }
};

const getDocumentoById = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * 
  FROM public.documentos_publicos 
  WHERE id = $1`;

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Documento no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el Documento por ID.' });
  }
};





module.exports = { subirArchivo, listarDocumentos, deleteDocumentoPublico, listarDocumentosPublico, actualizarDocumentosExternos, actualizarInformacionDocumentoExterno, getDocumentoById };