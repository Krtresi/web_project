
import express from 'express';
import { createUser, getUser, pool } from '../models/User.js';
import { validationResult } from 'express-validator';

const app = express();

class AuthController {
  async registration(req, res) {
    try {
      
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ message: 'Помилка при реєстрації', errors: errorMessages });
        }

        const { username, email, password } = req.body;
        const candidate = await createUser(username, email, password);

        if (candidate && candidate.success) {
            return res.status(400).json({ message: `Користувач ${username} вже існує` });
        }

        const roles = 'user';
        await createUser(username, email, password, roles);

        req.session.user = { username, email }; // Збереження інформації про користувача у сесії

        res.json({ message: `Користувач ${username} успішно зареєстрований`, user: req.session.user });

    } catch (error) {
        console.error('Помилка при реєстрації:', error);
        res.status(400).json({ message: 'Помилка при реєстрації', error: error.message });
    }
}

  

 // authController.js
async login(req, res) {
  try {
    const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ message: 'Помилка при вході', errors: errorMessages });
      }

      const { username, password } = req.body;
    const result = await getUser(username, password);
    req.session.user = { username }; // Збереження інформації про користувача у сесії

      if (result.success) {
        return res.json({ message: 'Вхід успішний' });
      } else {
        return res.status(401).json({ message: 'Невірний логін або пароль' });
      }
    }
   catch (e) {
    console.error('Помилка при вході: ', e.message);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
}


  async getUsers(req, res) {
    try {
      // Логіка отримання користувачів з бази даних
      res.json({ message: 'Отримано список користувачів' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }
}

export default new AuthController();
