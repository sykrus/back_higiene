import { Router } from "express";
const documentosController = require('../controllers/documentos.controller');
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = Router();


router.post('/subir-archivo', documentosController.subirArchivo);
router.get('/listado', documentosController.listarDocumentos);
router.get('/listado/combo', documentosController.listarDocumentosCombo);
router.get('/listado/publicos', documentosController.listarDocumentosPublicos);
router.get('/listado/fecha/revision', documentosController.listarDocumentosFechaRevision);
router.get('/reportes/general', documentosController.getDocumentoReporteGeneral);
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
    const rutaArchivo = path.join(__dirname, '..', 'uploads', nombreArchivo); // Utiliza '..', 'uploads' para subir un nivel y entrar en la carpeta 'uploads'
 
    // Envía el archivo como respuesta
    res.sendFile(rutaArchivo);
  });




  // Actualizar un tipo de documento existente

  router.put('/actualizar-archivo/:id', documentosController.actualizarArchivo);



// ... Otras rutas ...








export default router;
