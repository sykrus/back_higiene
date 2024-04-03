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
    const directorio = path.join(__dirname, '..', 'uploads/publicos');

    fs.readdir(directorio, (err, archivos) => {
        if (err) {
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
