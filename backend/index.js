import express from 'express';
import * as UserModel from './models/User.js';
import { createUser, getUser, pool } from './models/User.js';
import mysql from 'mysql2/promise';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import AuthController from './authorization/authController.js';
import { Reservation } from './models/reserv.js';
import multer from 'multer';
import { Cart, addCustomer } from './models/customers.js';


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const PORT = 8000;

const app = express();
app.use(bodyParser.raw({ type: 'text/plain' }));

const upload = multer(); // Створюємо екземпляр multer
//app.use(upload.array()); // Використовуємо multer для обробки multipart/form-data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Internal Server Error: ${err.message}`);
});

app.use(session({
  secret: 'yweuyruiqyuwqiry432h', // Оберіть секретний ключ для підпису сесії
  resave: false,
  saveUninitialized: false,
}));


const rootDirectory = "C:/Users/Julia/Desktop/backend.kursova";

app.use('/kursov', express.static(path.join(rootDirectory, 'kursov')));

app.use(express.static('kursov'));

// Отримання головної сторінки
app.get(['/main', '/'], (req, res) => {
  res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'main.html'));
});


// Отримання сторінки магазину
app.get(['/our-store', '/our-store.html'], (req, res) => {
    res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'our-store.html'));
});


app.get('/our-store', (req, res) => {
  db.query('SELECT product_id, name, price FROM products', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


app.get(['/registration', '/register.html'], (req, res) => {
    res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'register.html'));
});

app.get(['/login', '/login.html'], (req, res) => {
    res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'login.html'));
});

app.get('/backend/index.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
res.sendFile(path.join(rootDirectory, '/backend/kursov/script.js'));
});


app.get(['/form', '/form.html'], (req, res) => {
    res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'form.html'));
});


app.get('/', (req, res) => {
    res.status(200).json('The server is running...');
});


app.get(['/reservation', '/reservation.html'], (req, res) => {
  res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'reservation.html'));
});


app.get(['/form', '/form.html'], (req, res) => {
  res.sendFile(path.join(rootDirectory, 'backend', 'kursov', 'form.html'));
});


app.post('/our-store', async (req, res) => {
  const { product_id, quantity, subtotal } = req.body;
  try {
    const cart = await Cart(product_id, quantity, subtotal);
  } catch (error) {
    console.error('Something went wrong', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.post('/form', async (req, res) => {
  const { first_name, last_name, email, address, phone } = req.body;

  console.log(first_name);

  try {
    const form = await addCustomer(first_name, last_name, email, address, phone);
res.setHeader('Content-Type', 'application/json');
    // Assuming addCustomer returns an object, you can directly send it as JSON
    res.json(form);
  } catch (error) {
    console.error('Error processing form:', error);

    // Send an error response
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
    console.log(password);
  try {
    const login = await getUser(username, password);
    res.json(login);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



// Use multer for parsing form data
app.post('/registration', async (req, res) => {
  const { username, email, password } =req.body;
  console.log(username);
  console.log(email);
  console.log(password);
  try {
    const result = await createUser(username, email, password);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/reservation', async (req, res) => {
  try {
      const { phone_number, day, hour, name, persons } = JSON.parse(req.body);

      console.log(phone_number);
      console.log(day);
      console.log(hour);
      console.log(name);
      console.log(persons);

        console.log(persons);
        console.log(day);
        await Reservation(day, hour, name, phone_number, persons);
        res.send('Reservation successful!');
    } catch (error) {
        console.error('Error during reservation:', error);
        res.status(500).send('Internal Server Error');
    }
});




async function startApp() {
  try {
    console.log('Connected to the database');
  } catch (e) {
    console.error('Error connecting to the database:', e);
  }
}

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});

startApp();
