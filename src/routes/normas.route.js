import { Router } from "express";
const normasController = require('../controllers/normas.controller');

const router = Router();


//router.get("/:id", EstatusController.getEstatu);


// Obtener todos los registros de estatus
router.get('/', normasController.getAllNormas);
router.get('/activos', normasController.getAllNormasActivos);

router.get('/:id', normasController.getNormasById);

// Crear un nuevo registro de Normas
router.post('/', normasController.createNormas);

// Actualizar un registro de Normas existente
router.put('/:id', normasController.updateNormas);

// Borrar un registro de Normas
router.delete('/:id', normasController.deleteNormas);


export default router;
