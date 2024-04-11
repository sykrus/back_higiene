import { Router } from "express";
const documentosController = require('../controllers/documentos.controller');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = Router();


router.post('/subir-archivo', documentosController.subirArchivo);
router.get('/listado', documentosController.listarDocumentos);
router.get('/listado/combo', documentosController.listarDocumentosCombo);
router.get('/listado/publicos', documentosController.listarDocumentosPublicos);
router.get('/listado/fecha/revision', documentosController.listarDocumentosFechaRevision);
router.get('/reportes/general', documentosController.getDocumentoReporteGeneral);
router.get('/reportes/general/publico', documentosController.getDocumentoReporteGeneralPublico);
router.get('/reportes/obsoletos', documentosController.getDocumentoReporteObsoletos);
router.get('/reportes/vencidos', documentosController.getDocumentoReporteVencidos);
// Ruta para obtener documentos vencidos filtrando por organigrama_id
router.get('/reportes/vencidos/:organigramaId', documentosController.getDocumentoReporteVencidosPorOrganigrama);
// Obtener un tipo de documento por su ID
router.get('/:id', documentosController.getDocumentoById);
router.get('/reporte/:id', documentosController.getDocumentoByIdReporte);
router.get('/reporte/organigrama/:id', documentosController.getDocumentoByIdReporteOrganigrama);
router.get('/reporte/organigrama/:id/:datosNormas', documentosController.getDocumentoByIdReporteOrganigramaNormas);
router.get('/codigo/:tipoDocumentoId/:organigramaId', documentosController.CapturarCodigoDocumento);


router.get('/obtener/documentos/organigrama/:organigrama_id', async (req, res) => {
  try {
      const organigrama_id = req.params.organigrama_id;

      const resultado = await documentosController.obtenerDocumentosPorOrganigrama(organigrama_id);

      res.json(resultado);
  } catch (error) {
      console.error('Error en la ruta obtenerDocumentosPorOrganigrama:', error);
      res.status(500).json({ error: 'Error al obtener documentos.' });
  }
});









// Actualizar un tipo de documento existente
router.put('/:id', documentosController.updateDocumento);




// Configura una ruta para acceder a los archivos como una API
router.get('/archivos/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
  const directorio = path.join(__dirname, '..', 'uploads/documentos');

  fs.readdir(directorio, (err, archivos) => {
      if (err) {
          // Si hay un error al leer el directorio, envía un mensaje de error
          return res.status(500).send('Error al leer el directorio');
      }

      // Busca un archivo que coincida con el nombreArchivo, ignorando mayúsculas/minúsculas
      const archivoEncontrado = archivos.find(archivo => 
          archivo.toLowerCase() === nombreArchivo.toLowerCase());

      if (archivoEncontrado) {
          // Si encuentra un archivo que coincide, envía ese archivo
          const rutaArchivo = path.join(directorio, archivoEncontrado);
          res.sendFile(rutaArchivo);
      } else {
          // Si no encuentra un archivo que coincida, envía un mensaje de error
          res.status(404).send('El archivo solicitado no existe');
      }
  });
});



  // Actualizar un tipo de documento existente

  router.put('/actualizar-archivo/:id', documentosController.actualizarArchivo);



// ... Otras rutas ...








export default router;
