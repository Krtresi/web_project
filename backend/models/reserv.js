import { pool } from "./User.js";
import mysql from 'mysql2/promise';




async function Reservation(day, hour, name, phone_number, persons) {
    console.log(day);
      const connection = await pool.getConnection();
    try {
        await connection.query(
          `INSERT INTO reservations (day, hour, name, phone_number, persons) VALUES ('${day}','${hour}','${name}','${phone_number}','${persons}')`
            
        );
    } catch (error) {
        throw error;
        
    }finally {
        connection.release();
    }
} 

export { Reservation };