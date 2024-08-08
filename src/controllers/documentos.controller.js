const pool = require('../database/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');
const moment = require('moment'); // Requiere moment


// Configurar Multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'uploads/documentos'; // Nombre de la carpeta donde se guardarán los archivos
    const fullPath = path.join(__dirname, '..', uploadDir);

    // Crear la carpeta si no existe
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    callback(null, fullPath);
  },
  filename: (req, file, callback) => {
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

      const nombreDocumento = archivo.originalname.replace(/ /g, '_');
      const { organigrama_id, tipo_documento_id, estatus_id, nombre_documento,
         descripcion_documento, codigo_documento, 
         elaborado_por, revisado_por, aprobado_por, 
         fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision,
         modelo_documento,numero_revision,
         usuario_id, datos_normas, observacion, documento_asociado  } = req.body;

      const rutaDocumento = path.join('uploads/documentos', nombreDocumento);
      const fecha_registro = new Date();


      const codigoExistenteQuery = `
      SELECT COUNT(*) as count FROM documentos WHERE codigo_documento = $1
    `;
 

      try {

        const codigoExistenteResult = await db.query(codigoExistenteQuery, [codigo_documento]);
        const codigoExistente = codigoExistenteResult.rows[0].count > 0;

        if (codigoExistente) {
          return res.status(401).json({ mensaje: 'Ya existe un documento con el mismo código' });
        }


        const insertQuery = `
        INSERT INTO documentos 
        (organigrama_id, tipo_documento_id, estatus_id, nombre_documento,descripcion_documento, codigo_documento, 
          elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, modelo_documento,numero_revision,    
        ruta_documento, usuario_id, datos_normas ,observacion, documento_asociado,  fecha_registro) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22 )
        RETURNING id
      `;

        const result = await pool.query(insertQuery, [
          organigrama_id || null,
          tipo_documento_id || null,
          estatus_id || null,
          nombreDocumento || null,
          descripcion_documento || null,
          codigo_documento || null,
          elaborado_por || null,
          revisado_por || null,
          aprobado_por || null,
          fecha_vigencia || null,
          fecha_elaboracion || null,
          fecha_revision || null,
          fecha_aprobacion || null,
          fecha_proxima_revision || null,
          modelo_documento || null,
          numero_revision || null,
          rutaDocumento || null,
          usuario_id || null,
          datos_normas  || null,
          observacion  || null,
          documento_asociado || null,
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

      const nombreDocumento = archivo.originalname.replace(/ /g, '_');
      const { organigrama_id, tipo_documento_id, estatus_id, descripcion_documento, elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, modelo_documento, numero_revision, usuario_id, datos_normas, observacion, documento_asociado  } = req.body;
      
      const rutaDocumento = path.join('uploads', nombreDocumento);
      const fecha_registro = new Date();
      const documento_id = req.params.id; // Suponiendo que tienes el ID del documento a actualizar en los parámetros de la ruta.

      const updateQuery = `
        UPDATE documentos 
        SET
       
          estatus_id = $1,
          nombre_documento = $2,
          descripcion_documento = $3,
          elaborado_por = $4,
          revisado_por = $5,
          aprobado_por = $6,
          fecha_vigencia = $7,
          fecha_elaboracion = $8,
          fecha_revision = $9,
          fecha_aprobacion = $10,
          fecha_proxima_revision = $11,
          modelo_documento = $12,
          numero_revision = $13,
          ruta_documento = $14,
          usuario_id = $15,
          datos_normas = $16,
          observacion  = $17,
          documento_asociado  = $18,
          fecha_registro = $19
        WHERE id = $20
        RETURNING id
      `;
//ACTUALIZAR
      try {
        const result = await pool.query(updateQuery, [
        
          estatus_id,
          nombreDocumento,
          descripcion_documento,
          elaborado_por,
          revisado_por,
          aprobado_por,
          fecha_vigencia,
          fecha_elaboracion,
          fecha_revision,
          fecha_aprobacion,
          fecha_proxima_revision,
          modelo_documento,
          numero_revision,
          rutaDocumento,
          usuario_id,
          datos_normas,
          observacion,
          documento_asociado,
          fecha_registro,
          documento_id
        ]);

        res.status(200).json({ mensaje: 'Archivo actualizado y registro actualizado correctamente', documento: result.rows[0] });
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




// Actualizar un  documento existente
const updateDocumento = async (req, res) => {
  const { id } = req.params;
  const { organigrama_id, tipo_documento_id, estatus_id, descripcion_documento, elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, modelo_documento, numero_revision, usuario_id, datos_normas, observacion, documento_asociado  } = req.body;
  const sql = `
  UPDATE documentos 
  SET
     estatus_id = $1,
     descripcion_documento = $2,
    elaborado_por = $3,
    revisado_por = $4,
    aprobado_por = $5,
    fecha_vigencia = $6,
    fecha_elaboracion = $7,
    fecha_revision = $8,
    fecha_aprobacion = $9,
    fecha_proxima_revision = $10,
    modelo_documento = $11,
    numero_revision = $12,
    usuario_id = $13,
    datos_normas  = $14,
    observacion = $15,
    documento_asociado = $16
    WHERE id = $17
  RETURNING id
`;

  try {
    const { rowCount } = await db.query(sql, [
      estatus_id,
      descripcion_documento,
      elaborado_por,
      revisado_por,
      aprobado_por,
      fecha_vigencia,
      fecha_elaboracion,
      fecha_revision,
      fecha_aprobacion,
      fecha_proxima_revision,
      modelo_documento,
      numero_revision,
      usuario_id,
      datos_normas,
      observacion,
      documento_asociado,
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









const listarDocumentosFechaRevision = async (req, res) => {
  // Realiza la consulta a la base de datos sin pasar ningún parámetro
  db.query(`SELECT tipo_documento, organigrama.descripcion AS descripcion_organigrama, ARRAY_AGG(
    json_build_object(
      'id', documentos.id,
      'descripcion_organigrama', organigrama.descripcion,
      'nombre_estatus', nombre_estatus,
      'nombre_documento', nombre_documento,
      'codigo_documento', codigo_documento,
      'descripcion_documento', descripcion_documento,
      'elaborado_por', elaborado_por,
      'revisado_por', revisado_por,
      'aprobado_por', aprobado_por,
      'fecha_vigencia', fecha_vigencia,
      'fecha_elaboracion', fecha_elaboracion,
      'fecha_revision', fecha_revision,
      'fecha_aprobacion', fecha_aprobacion,
      'fecha_proxima_revision', fecha_proxima_revision,
      'modelo_documento', modelo_documento,
      'numero_revision', numero_revision,
      'documento_asociado', documento_asociado,
      'fecha_registro', documentos.fecha_registro,
      'organigrama_descripcion', organigrama.descripcion,
      'organigrama_codigo', organigrama.codigo,
      'datos_normas', datos_normas
    )
  ) AS documentos_agrupados
FROM documentos
LEFT JOIN organigrama ON organigrama_id = organigrama.id
LEFT JOIN estatus ON estatus_id = estatus.id
LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
WHERE 
    fecha_proxima_revision >= CURRENT_DATE AND 
    fecha_proxima_revision <= CURRENT_DATE + INTERVAL '2 months'
GROUP BY organigrama.descripcion, tipo_documento
ORDER BY organigrama.descripcion, tipo_documento;`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};




const listarDocumentos = async (req, res) => {
  const rutaProyecto = __dirname;
  try {
    const consulta = `
      SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
      elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
      modelo_documento,numero_revision, observacion, documento_asociado, 
      documentos.fecha_registro, organigrama.descripcion, organigrama.codigo
      FROM documentos
      LEFT JOIN organigrama ON organigrama_id = organigrama.id
      LEFT JOIN estatus ON estatus_id = estatus.id
      LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
      ORDER BY documentos.id DESC
    `;

    const resultados = await pool.query(consulta);

    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${rutaProyecto}/${documento.ruta_documento}`,
      fecha_vigencia: moment(documento.fecha_vigencia).format('YYYY-MM-DD'),
      fecha_elaboracion: moment(documento.fecha_elaboracion).format('YYYY-MM-DD'),
      fecha_revision: moment(documento.fecha_revision).format('YYYY-MM-DD'),
      fecha_aprobacion: moment(documento.fecha_aprobacion).format('YYYY-MM-DD'),
      fecha_registro: moment(documento.fecha_registro).format('YYYY-MM-DD'),
      fecha_proxima_revision: moment(documento.fecha_proxima_revision).format('YYYY-MM-DD'),
      
    }));

    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};

const listarDocumentosCombo = async (req, res) => {
  const rutaProyecto = __dirname;
  try {
    const consulta = `
      SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
      elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
      modelo_documento,numero_revision, observacion, documento_asociado, 
      documentos.fecha_registro, organigrama.descripcion, organigrama.codigo
      FROM documentos
      LEFT JOIN organigrama ON organigrama_id = organigrama.id
      LEFT JOIN estatus ON estatus_id = estatus.id
      LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
      WHERE documentos.estatus_id = 3
      ORDER BY documentos.id DESC
    `;

    const resultados = await pool.query(consulta);

    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${rutaProyecto}/${documento.ruta_documento}`,
    }));

    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};


const listarDocumentosPublicos = async (req, res) => {
  const rutaProyecto = __dirname;
  try {
    const consulta = `
      SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
      elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
      modelo_documento,numero_revision, observacion, documento_asociado, 
      documentos.fecha_registro, organigrama.descripcion, organigrama.codigo
      FROM documentos
      LEFT JOIN organigrama ON organigrama_id = organigrama.id
      LEFT JOIN estatus ON estatus_id = estatus.id
      LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
      WHERE modelo_documento = 'publico'
      ORDER BY documentos.id DESC
    `;

    const resultados = await pool.query(consulta);

    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${rutaProyecto}/${documento.ruta_documento}`,
    }));

    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};



const getDocumentoById = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * 
  FROM public.documentos 
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


const CapturarCodigoDocumento = async (req, res) => {
  const { tipoDocumentoId, organigramaId } = req.params;

  const sql = `SELECT id, codigo_documento
               FROM public.documentos 
               WHERE tipo_documento_id = $1 AND organigrama_id = $2
               ORDER BY id DESC
               `;
  try {
    const { rows } = await db.query(sql, [tipoDocumentoId, organigramaId]);

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








const getDocumentoReporteGeneral = async (req, res) => {
  db.query(`SELECT tipo_documento, organigrama.descripcion AS descripcion_organigrama, ARRAY_AGG(
    json_build_object(
      'id', documentos.id,
      'descripcion_organigrama', organigrama.descripcion,
      'nombre_estatus', nombre_estatus,
      'nombre_documento', nombre_documento,
      'codigo_documento', codigo_documento,
      'descripcion_documento', descripcion_documento,
      'elaborado_por', elaborado_por,
      'revisado_por', revisado_por,
      'aprobado_por', aprobado_por,
      'fecha_vigencia', fecha_vigencia,
      'fecha_elaboracion', fecha_elaboracion,
      'fecha_revision', fecha_revision,
      'fecha_aprobacion', fecha_aprobacion,
      'fecha_proxima_revision', fecha_proxima_revision,
      'modelo_documento', modelo_documento,
      'numero_revision', numero_revision,
      'documento_asociado', documento_asociado,
      'fecha_registro', documentos.fecha_registro,
      'organigrama_descripcion', organigrama.descripcion,
      'organigrama_codigo', organigrama.codigo,
      'datos_normas', datos_normas

    ) ORDER BY codigo_documento ASC
  ) AS documentos_agrupados
FROM documentos
LEFT JOIN organigrama ON organigrama_id = organigrama.id
LEFT JOIN estatus ON estatus_id = estatus.id
LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
WHERE documentos.estatus_id = 3
GROUP BY organigrama.descripcion, tipo_documento
ORDER BY organigrama.descripcion, tipo_documento;
`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};



const getDocumentoReporteGeneralPublico = async (req, res) => {
  db.query(`
    SELECT 
      tipo_documento, 
      organigrama.descripcion AS descripcion_organigrama, 
      ARRAY_AGG(
        json_build_object(
          'id', documentos.id,
          'descripcion_organigrama', organigrama.descripcion,
          'nombre_estatus', nombre_estatus,
          'nombre_documento', nombre_documento,
          'codigo_documento', codigo_documento,
          'descripcion_documento', descripcion_documento,
          'elaborado_por', elaborado_por,
          'revisado_por', revisado_por,
          'aprobado_por', aprobado_por,
          'fecha_vigencia', fecha_vigencia,
          'fecha_elaboracion', fecha_elaboracion,
          'fecha_revision', fecha_revision,
          'fecha_aprobacion', fecha_aprobacion,
          'fecha_proxima_revision', fecha_proxima_revision,
          'modelo_documento', modelo_documento,
          'numero_revision', numero_revision,
          'documento_asociado', documento_asociado,
          'fecha_registro', documentos.fecha_registro,
          'organigrama_descripcion', organigrama.descripcion,
          'organigrama_codigo', organigrama.codigo,
          'datos_normas', datos_normas
        ) 
        ORDER BY codigo_documento ASC
      ) AS documentos_agrupados
    FROM 
      documentos
    LEFT JOIN 
      organigrama ON organigrama_id = organigrama.id
    LEFT JOIN 
      estatus ON estatus_id = estatus.id
    LEFT JOIN 
      tipo_documentos ON tipo_documento_id = tipo_documentos.id
    WHERE 
      documentos.estatus_id = 3 AND
      documentos.fecha_proxima_revision > CURRENT_DATE  -- Filtrar por fecha_proxima_revision mayor a la fecha actual
    GROUP BY 
      organigrama.descripcion, tipo_documento
    ORDER BY 
      organigrama.descripcion, tipo_documento;
  `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};


const getDocumentoByIdReporteOrganigrama = async (req, res) => {
  const { id } = req.params; // Obtén el valor de id desde req.params
  db.query(`SELECT tipo_documento, organigrama.descripcion AS descripcion_organigrama, ARRAY_AGG(
    json_build_object(
      'id', documentos.id,
      'descripcion_organigrama', organigrama.descripcion,
      'nombre_estatus', nombre_estatus,
      'nombre_documento', nombre_documento,
      'codigo_documento', codigo_documento,
      'descripcion_documento', descripcion_documento,
      'elaborado_por', elaborado_por,
      'revisado_por', revisado_por,
      'aprobado_por', aprobado_por,
      'fecha_vigencia', fecha_vigencia,
      'fecha_elaboracion', fecha_elaboracion,
      'fecha_revision', fecha_revision,
      'fecha_aprobacion', fecha_aprobacion,
      'fecha_proxima_revision', fecha_proxima_revision,
      'modelo_documento', modelo_documento,
      'numero_revision', numero_revision,
      'documento_asociado', documento_asociado,
      'fecha_registro', documentos.fecha_registro,
      'organigrama_descripcion', organigrama.descripcion,
      'organigrama_codigo', organigrama.codigo,
      'datos_normas', datos_normas

    ) ORDER BY codigo_documento ASC
  ) AS documentos_agrupados
FROM documentos
LEFT JOIN organigrama ON organigrama_id = organigrama.id
LEFT JOIN estatus ON estatus_id = estatus.id
LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
WHERE organigrama_id = $1 AND documentos.estatus_id = 3  
GROUP BY organigrama.descripcion, tipo_documento
ORDER BY organigrama.descripcion, tipo_documento;
`, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};



const getDocumentoByIdReporte = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
  elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
  modelo_documento,numero_revision, documento_asociado,
  documentos.fecha_registro, organigrama.descripcion, organigrama.codigo, datos_normas 
  FROM documentos
  LEFT JOIN organigrama ON organigrama_id = organigrama.id
  LEFT JOIN estatus ON estatus_id = estatus.id
  LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
  WHERE documentos.id = $1`;

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Documento no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el Documento por ID1.' });
  }
};


const getDocumentoReporteObsoletos = async (req, res) => {
  const fechaHoy = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato 'YYYY-MM-DD'
  db.query(`SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento, descripcion_documento, 
  elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
  modelo_documento, numero_revision, documento_asociado,
  documentos.fecha_registro, organigrama.descripcion as organigrama_descripcion, organigrama.codigo, datos_normas 
FROM documentos
LEFT JOIN organigrama ON organigrama_id = organigrama.id
LEFT JOIN estatus ON estatus_id = estatus.id
LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
WHERE fecha_vigencia > '${fechaHoy}' `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }
    res.json(results.rows);
  });
};


//REPORTE POR ORGANIGRAMA



const getDocumentoByIdReporteOrganigramaNormas = async (req, res) => {
  const { datosNormas } = req.params; // Obtén el valor de id desde req.params
  db.query(`SELECT tipo_documento, organigrama.descripcion AS descripcion_organigrama, ARRAY_AGG(
    json_build_object(
      'id', documentos.id,
      'descripcion_organigrama', organigrama.descripcion,
      'nombre_estatus', nombre_estatus,
      'nombre_documento', nombre_documento,
      'codigo_documento', codigo_documento,
      'descripcion_documento', descripcion_documento,
      'elaborado_por', elaborado_por,
      'revisado_por', revisado_por,
      'aprobado_por', aprobado_por,
      'fecha_vigencia', fecha_vigencia,
      'fecha_elaboracion', fecha_elaboracion,
      'fecha_revision', fecha_revision,
      'fecha_aprobacion', fecha_aprobacion,
      'fecha_proxima_revision', fecha_proxima_revision,
      'modelo_documento', modelo_documento,
      'numero_revision', numero_revision,
      'documento_asociado', documento_asociado,
      'fecha_registro', documentos.fecha_registro,
      'organigrama_descripcion', organigrama.descripcion,
      'organigrama_codigo', organigrama.codigo,
      'datos_normas', datos_normas
    ) ORDER BY codigo_documento ASC
  ) AS documentos_agrupados
FROM documentos
LEFT JOIN organigrama ON organigrama_id = organigrama.id
LEFT JOIN estatus ON estatus_id = estatus.id
LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
WHERE datos_normas ILIKE $1  AND documentos.estatus_id = 3 
GROUP BY organigrama.descripcion, tipo_documento
ORDER BY organigrama.descripcion, tipo_documento;
`, [`%${datosNormas}%`], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};

const getDocumentoReporteVencidos = async (req, res) => {
  const fechaHoy = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato 'YYYY-MM-DD'

  db.query(`SELECT tipo_documento, organigrama.descripcion AS descripcion_organigrama, ARRAY_AGG(
    json_build_object(
      'id', documentos.id,
      'descripcion_organigrama', organigrama.descripcion,
      'nombre_estatus', nombre_estatus,
      'nombre_documento', nombre_documento,
      'codigo_documento', codigo_documento,
      'descripcion_documento', descripcion_documento,
      'elaborado_por', elaborado_por,
      'revisado_por', revisado_por,
      'aprobado_por', aprobado_por,
      'fecha_vigencia', fecha_vigencia,
      'fecha_elaboracion', fecha_elaboracion,
      'fecha_revision', fecha_revision,
      'fecha_aprobacion', fecha_aprobacion,
      'fecha_proxima_revision', fecha_proxima_revision,
      'modelo_documento', modelo_documento,
      'numero_revision', numero_revision,
      'documento_asociado', documento_asociado,
      'fecha_registro', documentos.fecha_registro,
      'organigrama_descripcion', organigrama.descripcion,
      'organigrama_codigo', organigrama.codigo,
      'datos_normas', datos_normas
    ) ORDER BY codigo_documento ASC
  ) AS documentos_agrupados
FROM documentos
LEFT JOIN organigrama ON organigrama_id = organigrama.id
LEFT JOIN estatus ON estatus_id = estatus.id
LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id

GROUP BY organigrama.descripcion, tipo_documento
ORDER BY organigrama.descripcion, tipo_documento;
`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};

const getDocumentoReporteVencidosPorOrganigrama = async (req, res) => {
  const organigramaId = req.params.organigramaId; // Asumiendo que recibes el organigramaId como parámetro en la URL
  const fechaHoy = new Date().toISOString().split('T')[0];
  
  db.query(`
    SELECT 
      tipo_documento, 
      organigrama.descripcion AS descripcion_organigrama, 
      ARRAY_AGG(
        json_build_object(
          'id', documentos.id,
          'descripcion_organigrama', organigrama.descripcion,
          'nombre_estatus', nombre_estatus,
          'nombre_documento', nombre_documento,
          'codigo_documento', codigo_documento,
          'descripcion_documento', descripcion_documento,
          'elaborado_por', elaborado_por,
          'revisado_por', revisado_por,
          'aprobado_por', aprobado_por,
          'fecha_vigencia', fecha_vigencia,
          'fecha_elaboracion', fecha_elaboracion,
          'fecha_revision', fecha_revision,
          'fecha_aprobacion', fecha_aprobacion,
          'fecha_proxima_revision', fecha_proxima_revision,
          'modelo_documento', modelo_documento,
          'numero_revision', numero_revision,
          'documento_asociado', documento_asociado,
          'fecha_registro', documentos.fecha_registro,
          'organigrama_descripcion', organigrama.descripcion,
          'organigrama_codigo', organigrama.codigo,
          'datos_normas', datos_normas
        ) 
        ORDER BY codigo_documento ASC
      ) AS documentos_agrupados
    FROM 
      documentos
    LEFT JOIN 
      organigrama ON organigrama_id = organigrama.id
    LEFT JOIN 
      estatus ON estatus_id = estatus.id
    LEFT JOIN 
      tipo_documentos ON tipo_documento_id = tipo_documentos.id
    WHERE 
      fecha_proxima_revision < '${fechaHoy}' AND 
      organigrama_id = ${organigramaId}
    GROUP BY 
      organigrama.descripcion, tipo_documento
    ORDER BY 
      organigrama.descripcion, tipo_documento;
  `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }

    // Calcular el total de documentos agrupados
    let totalDocumentos = 0;
    results.rows.forEach(row => {
      totalDocumentos += row.documentos_agrupados.length;
    });

    // Agregar el total al resultado
    const response = {
      total_documentos: totalDocumentos,
      documentos: results.rows
    };

    res.json(response);
  });
};

async function obtenerDocumentosPorOrganigrama(organigrama_id) {
  try {
    // Obtener todos los tipos de documentos
    const tiposDocumentosQuery = `
      SELECT *
      FROM tipo_documentos
    `;
    const tiposDocumentosResult = await db.query(tiposDocumentosQuery);

    // Obtener los últimos documentos para cada tipo_documento y organigrama_id
    const documentosQuery = `
      SELECT id, codigo_documento, tipo_documento, organigrama_id
      FROM (
        SELECT
          d.id,
          d.codigo_documento,
          td.tipo_documento,
          d.organigrama_id,
          ROW_NUMBER() OVER (PARTITION BY td.tipo_documento ORDER BY d.id DESC) AS rn
        FROM public.documentos d
        LEFT JOIN tipo_documentos td ON d.tipo_documento_id = td.id
        WHERE d.organigrama_id = $1
      ) AS subquery
      WHERE rn = 1
    `;
    const documentosResult = await db.query(documentosQuery, [organigrama_id]);

    // Mapear los documentos existentes
    const documentos = documentosResult.rows.map(doc => {
      // Extraer el número del final de codigo_documento
      const codigoDocumentoArray = doc.codigo_documento.split('-');
      const ultimoNumero = codigoDocumentoArray.pop();
      
      // Convertir el último número a entero y sumarle 1
      const nuevoUltimoNumero = parseInt(ultimoNumero) + 1;
      
      // Construir el nuevo código de documento
      const nuevoCodigoDocumento = codigoDocumentoArray.join('-') + '-' + nuevoUltimoNumero.toString().padStart(3, '0');
      
      return {
        id: doc.id,
        codigo_documento: nuevoCodigoDocumento,
        tipo_documento: doc.tipo_documento,
        organigrama_id: doc.organigrama_id
      };
    });

  // Consulta para obtener la información del organigrama
  const organigramaQuery = `
  SELECT codigo as codigo_hijo, padre as organigrama_id_padre 
  FROM organigrama 
  WHERE id = $1
`;
const organigramaResult = await db.query(organigramaQuery, [organigrama_id]);

// Obtener los resultados del organigrama
const { codigo_hijo, organigrama_id_padre } = organigramaResult.rows[0];

// Consulta para obtener el codigo del padre del organigrama
const organigramaPadreQuery = `
  SELECT codigo as codigo_padre
  FROM organigrama 
  WHERE id = $1
`;
const organigramaPadreResult = await db.query(organigramaPadreQuery, [organigrama_id_padre]);

// Obtener el codigo del padre del organigrama
const { codigo_padre } = organigramaPadreResult.rows[0];

// Identificar los tipos de documentos que no tienen un documento asociado
const tiposSinDocumento = tiposDocumentosResult.rows.filter(tipo => !documentos.find(doc => doc.tipo_documento === tipo.id));

organigrama_id = parseInt(organigrama_id);

// Mapear los tipos de documentos sin documento asociado a nuevos documentos
const nuevosDocumentos = tiposSinDocumento.map(tipo => {
  return {
    codigo_documento: `${tipo.siglas_codigo}-${codigo_padre}${codigo_hijo}-001`,
    tipo_documento: tipo.tipo_documento,
    organigrama_id,
    codigo_hijo,
    organigrama_id_padre,
    codigo_padre
  };
});

// Combinar los documentos existentes y los nuevos documentos creados
const resultado = {
  documentos: [...documentos, ...nuevosDocumentos]
};


    return resultado;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw new Error('Error al obtener documentos.');
  }
}



module.exports = { subirArchivo, listarDocumentos, updateDocumento, getDocumentoReporteGeneral, getDocumentoById, actualizarArchivo, getDocumentoByIdReporte, 
  getDocumentoByIdReporteOrganigrama, getDocumentoByIdReporteOrganigramaNormas, CapturarCodigoDocumento, getDocumentoReporteObsoletos, listarDocumentosFechaRevision, listarDocumentosPublicos, 
  getDocumentoReporteVencidos, getDocumentoReporteVencidosPorOrganigrama, obtenerDocumentosPorOrganigrama, listarDocumentosCombo, getDocumentoReporteGeneralPublico
};
