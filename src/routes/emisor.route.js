import { Router } from "express";
const emisorController = require('../controllers/emisor.controller');

const router = Router();


//router.get("/:id", EstatusController.getEstatu);


// Obtener todos los registros de estatus
router.get('/', emisorController.getAllEmisores);
router.get('/estatus', emisorController.getAllEmisoresEstatus);

router.get('/:id', emisorController.getEmisoresById);

// Crear un nuevo registro de Emisores
router.post('/', emisorController.createEmisores);

// Actualizar un registro de Emisores existente
router.put('/:id', emisorController.updateEmisores);

// Borrar un registro de Emisores
router.delete('/:id', emisorController.deleteEmisores);


export default router;
