// filepath: c:\Users\safir\OneDrive\Documents\School stuff\Spring 2025\Software engnerring 2\my-auth-app\src\dbTest.js
import pool from './db.js';

const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Database connected successfully:', rows);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

testConnection();