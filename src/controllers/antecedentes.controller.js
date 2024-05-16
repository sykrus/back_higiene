const db = require('../database/db');

// Obtener todos los registros de antecendetes 
exports.getAllAntecedentesMaestra = (req, res) => {
  db.query(`SELECT antecedentes_maestra.id, antecedentes_maestra.codigo, asociado_revision, fecha_vigencia_ant, fecha_revision_ant,
  codigo_formulario ,fecha_formulario , titulo_lista_general, titulo_lista_unidad, titulo_lista_norma, revision
   FROM public.antecedentes_maestra
    
        `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de antecendetes .' });
    }
    res.json(results.rows);
  });
};




// Crear un nuevo registro de antecendetes 
exports.createAntecedentesMaestra = (req, res) => {
  const { codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario ,fecha_formulario , titulo_lista_general, titulo_lista_unidad, titulo_lista_norma, revision } = req.body;
  const sql = 'INSERT INTO public.antecedentes_maestra  (codigo, asociado_revision, fecha_vigencia_ant, fecha_revision_ant, codigo_formulario ,fecha_formulario , titulo_lista_general, titulo_lista_unidad, titulo_lista_norma, revision) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
  db.query(sql, [codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario ,fecha_formulario , titulo_lista_general, titulo_lista_unidad, titulo_lista_norma, revision], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear un nuevo registro de antecendetes .' });
    }
    res.json({ message: 'Registro de antecendetes  creado con éxito.'});
  });
};

// Actualizar un registro de antecendetes  existente
exports.updateAntecedentesMaestra = (req, res) => {
  const { id } = req.params;
  const { codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario ,fecha_formulario , titulo_lista_general, titulo_lista_unidad, titulo_lista_norma, revision } = req.body;
  const sql = 'UPDATE public.antecedentes_maestra  SET codigo =$1, asociado_revision=$2, fecha_vigencia_ant =$3, fecha_revision_ant =$4, codigo_formulario =$5, fecha_formulario =$6, titulo_lista_general =$7, titulo_lista_unidad =$8, titulo_lista_norma =$9, revision=$10  WHERE id=$11';
  db.query(sql, [codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant,codigo_formulario ,fecha_formulario , titulo_lista_general, titulo_lista_unidad, titulo_lista_norma,revision, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar el registro de antecendetes .' });
    }
    res.json({ message: 'Registro de antecendetes  actualizado con éxito.' });
  });
};



exports.getAntecedentesMaestraById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.antecedentes_maestra  WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'antecendetes  no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
  }
};

exports.getAntecedentesMaestraReportesById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.antecedentes_maestra';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'antecendetes  no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
  }
};


////AQUI TERMINA ANTECEDENTES DE LISTA MAESTRA //





////AQUI EMPIEZA ANTECEDENTES DE CONTROLADOS //


// Obtener todos los registros de antecendetes 
exports.getAllAntecedentesControlados= (req, res) => {
    db.query(`SELECT  antecedentes_controlados.id, antecedentes_controlados.nro_registro, asociado,revision, fecha_vigencia_ant,fecha_revision_ant, fecha_formulario, codigo_formulario
    FROM public.antecedentes_controlados
    ORDER BY id DESC
 
    
    `, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener los registros de antecendetes .' });
      }
      res.json(results.rows);
    });
  };
  
  // Crear un nuevo registro de antecendetes 
    exports.createAntecedentesControlados= (req, res) => {
    const { nro_registro , asociado, revision  ,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario, fecha_formulario } = req.body;
    const sql = 'INSERT INTO public.antecedentes_controlados   (nro_registro , asociado , revision, fecha_vigencia_ant, fecha_revision_ant, codigo_formulario, fecha_formulario   ) VALUES ($1, $2, $3, $4,$5, $6, $7)';
    db.query(sql, [nro_registro , asociado , revision,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario, fecha_formulario ], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al crear un nuevo registro de antecendetes .' });
      }
      res.json({ message: 'Registro de antecendetes  creado con éxito.'});
    });
  };
  
  // Actualizar un registro de antecendetes  existente
 
  exports.updateAntecedentesControlados= (req, res) => {
    const { id } = req.params;
    const { nro_registro , asociado , revision,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario, fecha_formulario } = req.body;
    const sql = 'UPDATE public.antecedentes_controlados   SET nro_registro  =$1, asociado =$2, revision=$3, fecha_vigencia_ant =$4, fecha_revision_ant =$5, codigo_formulario =$6, fecha_formulario =$7  WHERE id=$8';
    db.query(sql, [nro_registro , asociado, revision ,fecha_vigencia_ant,fecha_revision_ant, codigo_formulario, fecha_formulario, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al actualizar el registro de antecendetes .' });
      }
      res.json({ message: 'Registro de antecendetes  actualizado con éxito.' });
    });
  };
  
  
  
  exports.getAntecedentesControladosById = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM public.antecedentes_controlados   WHERE id = $1 ORDER BY id ASC LIMIT 1 ';
  
    try {
      const { rows } = await db.query(sql, [id]);
      if (rows.length === 0) {
        res.status(404).json({ message: 'antecendetes  no encontrado.' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
    }
  };



  exports.getAntecedentesControladosReportesById = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM public.antecedentes_controlados';
  
    try {
      const { rows } = await db.query(sql);
      if (rows.length === 0) {
        res.status(404).json({ message: 'antecendetes  no encontrado.' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
    }
  };


  exports.UltimoIdAntecedenteControlados = (req, res) => {
    db.query(`SELECT *
    FROM public.antecedentes_controlados
    ORDER BY id DESC
    LIMIT 1;
      
          `, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener los registros de antecendetes Controlados .' });
      }
      res.json(results.rows);
    });
  };