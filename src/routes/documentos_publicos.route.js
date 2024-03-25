import { Router } from "express";
const documentosPublicosController = require('../controllers/documentos_publicos.controller');
const path = require('path');
const fs = require('fs');
const router = Router();


router.post('/subir-archivo', documentosPublicosController.subirArchivo);
router.get('/listado', documentosPublicosController.listarDocumentos);
router.get('/listado/publico', documentosPublicosController.listarDocumentosPublico);
router.delete('/:id', documentosPublicosController.deleteDocumentoPublico);

// Configura una ruta para acceder a los archivos como una API
router.get('/archivos/:nombreArchivo', (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const rutaArchivo = path.join(__dirname, '..', 'uploads/publicos', nombreArchivo);

    // Verificar si el archivo existe
    if (fs.existsSync(rutaArchivo)) {
        // Envía el archivo como respuesta
        res.sendFile(rutaArchivo);
    } else {
        // Si el archivo no existe, enviar un mensaje de error
        res.status(404).send('El archivo solicitado no existe');
    }
});

export default router;
