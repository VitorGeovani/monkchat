import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', UserController.getAllUsers);
router.put('/:id', UserController.updateUser);
// Nova rota para redefinição de senha
router.post('/reset-password', UserController.resetPassword);

export default router;