import { pool } from "./User.js";
import mysql from 'mysql2/promise';



async function Cart(product_id, quantity, subtotal) {
    console.log('addToCart function called!');
    
    const connection = await pool.getConnection();
    try {
        await connection.query(
            `INSERT INTO orderdetails (product_id, quantity, subtotal) VALUES ( ?, ?, ?)`,
            [product_id, quantity, subtotal]
        );
        console.log('Product added to cart successfully.');
    } catch (error) {
        console.error('Error executing addToCart query:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function addCustomer(first_name, last_name, email, address, phone) {
    console.log('addCustomer function called!');
    
    const connection = await pool.getConnection();
    try {
        // Логіка додавання інформації про покупця (Customers)
        await connection.query(
            `INSERT INTO customers (first_name, last_name, email, address, phone) VALUES ('${first_name}', '${last_name}', '${email}', '${address}', '${phone}')`
        );
        console.log('Customer added successfully.');
    } catch (error) {
        console.error('Error executing addCustomer query:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function addOrder(customer_id) {
    console.log('addOrder function called!');
    
    const connection = await pool.getConnection();
    try {
        // Логіка додавання інформації про замовлення (Orders)
        await connection.query(
            `INSERT INTO orders (customer_id, order_date) VALUES (?, NOW())`,
            [customer_id]
        );
        console.log('Order added successfully.');
    } catch (error) {
        console.error('Error executing addOrder query:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

export { Cart, addCustomer, addOrder, pool };
