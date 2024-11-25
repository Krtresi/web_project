// authRouter.js
import express from 'express';
const router = express.Router();
import controller from './authController.js'; // Перевірте правильність шляху
import { check } from 'express-validator';
import { validationResult } from 'express-validator';


router.post('/registration', [
    check('username', "Це поле не може бути пустим").notEmpty(),
    check('password', "Пароль має мати більше 4 символів і менше 10").isLength({ min: 4, max: 10 }),
], controller.registration);


router.post('/login', controller.login);
router.get('/users', controller.getUsers);

export default router;

