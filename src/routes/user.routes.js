import { Router } from "express";
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/register', userController.register);
router.get('/listado', userController.getAllUsuarios);
router.put('/actualizar/:id', userController.updateUser);
router.get('/:id', userController.getUsuariosById);

export default router;
