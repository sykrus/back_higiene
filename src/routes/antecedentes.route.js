import { Router } from "express";
const antecedentesController = require('../controllers/antecedentes.controller');

const router = Router();


//router.get("/:id", EstatusController.getEstatu);


//ROUTER DE ANTECEDENTES DE LISTA MAESTRA //
router.get('/maestra', antecedentesController.getAllAntecedentesMaestra);



router.get('/maestra/:id', antecedentesController.getAntecedentesMaestraById);

router.get('/maestra/unidad/:id', antecedentesController.getAntecedentesMaestraReportesById);

// Crear un nuevo registro de Normas
router.post('/maestra', antecedentesController.createAntecedentesMaestra);

// Actualizar un registro de Normas existente
router.put('/maestra/:id', antecedentesController.updateAntecedentesMaestra);

//TERMINA ROUTER DE ANTECEDENTES DE LISTA MAESTRA //



//ROUTER DE ANTECEDENTES DE LISTA CONTROLADOS //
router.get('/controlados', antecedentesController.getAllAntecedentesControlados);

router.get('/controlados/ultimoid', antecedentesController.UltimoIdAntecedenteControlados);
router.get('/controlados/:id', antecedentesController.getAntecedentesControladosById);

router.get('/controlados/documento', antecedentesController.getAntecedentesControladosReportesById);

// Crear un nuevo registro de Normas
router.post('/controlados', antecedentesController.createAntecedentesControlados);

// Actualizar un registro de Normas existente
router.put('/controlados/:id', antecedentesController.updateAntecedentesControlados);

//TERMINA ROUTER DE ANTECEDENTES DE LISTA MAESTRA //



export default router;
