import { Router } from "express";
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', authController.login);


// Ruta protegida para obtener los datos del usuario
router.get('/user', verifyToken, authController.getUserData);

// Función de middleware para verificar el token JWT
function verifyToken(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_secreto_secreto');
    req.user = decoded; // Almacena los datos del usuario en la solicitud
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token no válido' });
  }
}


export default router;
