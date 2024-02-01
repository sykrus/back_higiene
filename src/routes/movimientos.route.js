const express = require('express');
const MovimientosController = require('../controllers/movimientos.controller')

const router = express.Router();


router.get('/', MovimientosController.getAllMovimientos);
router.post('/', MovimientosController.createMovimiento);
router.put('/:id', MovimientosController.updateMovimiento);
router.delete('/:id', MovimientosController.deleteMovimiento);
router.get('/:id', MovimientosController.getMovimientosPorDocumentoId);

module.exports = router;
