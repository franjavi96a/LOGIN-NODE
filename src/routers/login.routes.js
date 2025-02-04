import { Router } from 'express';
import { metodos as loginController } from '../controllers/login.controller.js';

const router = Router();
router.get('/prueba',loginController.prueba)

// Rutas para renderizar las vistas
router.get('/login', loginController.renderLogin);
router.get('/register', loginController.renderRegister);
router.get('/dashboard', loginController.renderDashboard);

// Rutas para manejar los formularios
router.post('/register', loginController.register);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);

export default router;
