const express = require('express');

const documentosPublicosController = require('../controllers/documentos_publicos.controller');
const path = require('path');
const fs = require('fs');
const router = express.Router();


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


// Configurar Express para servir archivos estáticos desde la carpeta 'publicos'
router.use('/uploads/publicos', express.static(path.join(__dirname, '../uploads/publicos')));

// Definir una ruta en tu API para acceder a los archivos en la carpeta 'publicos'
router.get('/uploads/publicos/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    // Puedes hacer cualquier validación adicional aquí, como comprobar si el archivo existe antes de enviarlo
    const filePath = path.join(__dirname, '../uploads/publicos', fileName);
    
    // Envía el archivo como respuesta
    res.sendFile(filePath);
});

export default router;
