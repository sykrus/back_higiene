import { Router } from "express";
const formatosController = require('../controllers/formatos.controller');
const path = require('path');

const router = Router();


router.post('/subir-archivo', formatosController.subirArchivo);
router.get('/listado', formatosController.listarDocumentos);
router.get('/:id', formatosController.getFormatosById);
router.delete('/:id', formatosController.deleteFormatos);

router.put('/actualizar-archivo/:id', formatosController.actualizarArchivo);

// Configura una ruta para acceder a los archivos como una API
router.get('/archivos/:nombreArchivo', (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const rutaArchivo = path.join(__dirname, '..', 'uploads/formatos', nombreArchivo); // Utiliza '..', 'uploads' para subir un nivel y entrar en la carpeta 'uploads'

  
    // Envía el archivo como respuesta
    res.sendFile(rutaArchivo);
  });


export default router;