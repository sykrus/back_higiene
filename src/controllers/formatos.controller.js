const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Configurar Multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'uploads/formatos'; // Nombre de la carpeta donde se guardarán los archivos
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
      const {  nombre_documento, descripcion_documento, user_id, tipo_formato_id } = req.body;

      // Valida que los campos tengan valores definidos o establece null si son undefined
      const rutaDocumento = path.join('uploads/formatos/', nombreDocumento); // Ruta del archivo guardado en el sistema de archivos
      const fecha_registro = new Date(); // Fecha de registro automática

      // Prepara la consulta SQL con parámetros
      const insertQuery = `
        INSERT INTO formatos
        (nombre_documento, descripcion_documento, tipo_formato_id, ruta_documento, fecha_registro )
        VALUES ($1, $2, $3, $4, $5)
      `;


      try {
        // Ejecuta la consulta SQL con los parámetros definidos
        const result = await db.query(insertQuery, [
       
          nombreDocumento || null,
          descripcion_documento || null,
          tipo_formato_id || 1,
          rutaDocumento || null,
          fecha_registro,
          
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





//ACTUALIZAR FORMATOS //
const actualizarArchivo = async (req, res) => {
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

      const { id } = req.params; // Obtener el parámetro ID de la URL

      // Extrae los valores de los campos del formulario
      const { nombre_documento, descripcion_documento, tipo_formato_id } = req.body;

      // Valida que los campos tengan valores definidos o establece null si son undefined
      const rutaDocumento = path.join('uploads/formatos/', archivo.originalname.replace(/ /g, '_'));
      const fecha_registro = new Date();

      // Prepara la consulta SQL con parámetros
      const updateQuery = `
        UPDATE formatos
        SET nombre_documento = $1, descripcion_documento = $2, tipo_formato_id = $3, ruta_documento = $4, fecha_registro = $5
        WHERE id = $6
      `;

      try {
        // Ejecuta la consulta SQL con los parámetros definidos
        const result = await db.query(updateQuery, [
          nombre_documento || null,
          descripcion_documento || null,
          tipo_formato_id || 1,
          rutaDocumento || null,
          fecha_registro,
          id,
        ]);

        res.status(200).json({ mensaje: 'Archivo actualizado correctamente', documento: result.rows[0] });
      } catch (error) {
        console.error('Error al actualizar en la base de datos:', error);
        return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
      }
    });
  } catch (error) {
    console.error('Error en la actualización del archivo:', error);
    return res.status(500).json({ error: 'Error en la actualización del archivo' });
  }
};








// Obtener la lista de documentos
const listarDocumentos = async (req, res) => {
  try {
    // Consulta SQL para obtener la lista de documentos
    const consulta = `
      SELECT formatos.id, descripcion_documento, fecha_registro, nombre_documento, tipo_formato 
      FROM formatos
      LEFT JOIN tipo_formatos ON tipo_formato_id = tipo_formatos.id
      `

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


const getFormatosById = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * 
  FROM public.formatos 
  WHERE id = $1`;

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Formatos no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el Formatos por ID.' });
  }
};


const deleteFormatos = async (req, res) => {
  const { id } = req.params; // Obtén el ID del documento controlado que deseas eliminar desde los parámetros de la URL

  try {
    const query = `DELETE FROM public.formatos  WHERE id = $1`;
    await db.query(query, [id]);
    res.json({ message: 'Formato  eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el Formato' });
  }
};


module.exports = { subirArchivo, listarDocumentos, actualizarArchivo, getFormatosById, deleteFormatos };