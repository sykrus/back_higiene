import { Router } from "express";
const documentosControladosController = require('../controllers/documentos_controlados.controller');
const router = Router();
// Rutas para documentos controlados
router.post('/', documentosControladosController.createDocumentoControlado);
router.get('/', documentosControladosController.getAllDocumentosControlados);
router.put('/:id', documentosControladosController.updateDocumentoControlado); // Ruta para actualizar por ID
router.get('/:id', documentosControladosController.getDocumentoControladoById); // Ruta para obtener por ID
router.get('/documentos/:id', documentosControladosController.getControladosPorDocumentoId); // Ruta para obtener por ID
router.get('/reporte/:id', documentosControladosController.getControladosReportesPorDocumentoId); // Ruta para obtener por ID
router.delete('/documentos/:id', documentosControladosController.deleteDocumentoControlado);

module.exports = router;