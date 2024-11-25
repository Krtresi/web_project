import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'PISHOWnahui24',
  database: 'coffeeshop'
});

async function createUser(username, email, password, roles) {
  
  const connection = await pool.getConnection();
  try {
  
await connection.query(
    `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`
    
);
    console.log(`Користувач успішно зареєстрований`);
    return { success: true };
  } catch (error) {
    console.error('Помилка при виконанні запиту:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function getUser(username, password) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM users WHERE username = '${username}'AND password = '${password}'`
    );

    if (rows.length > 0) {
      // Якщо користувач існує
      console.log('Вхід підтверджено');
      const user = rows[0];
      return { success: true, user };
    } else {
      // Користувача не знайдено
      console.log('Невірний логін або пароль');
      return { success: false, message: 'Невірний логін або пароль' };
    }
  } catch (e) {
    console.error('Помилка при вході: ', e.message);
    throw e;
  } finally {
    connection.release();
  }
}

export { createUser, getUser, pool };





