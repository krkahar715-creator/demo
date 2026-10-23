import mysql from 'mysql2/promise';
import 'dotenv/config';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'login_app',
};

let pool;

async function createDatabaseIfNeeded() {
  const initialConnection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  try {
    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await initialConnection.query(`USE \`${dbConfig.database}\``);
    await initialConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    await initialConnection.end();
  }
}

export async function connectDatabase() {
  if (!pool) {
    await createDatabaseIfNeeded();
    pool = mysql.createPool(dbConfig);
  }

  await pool.query('SELECT 1');
  return pool;
}
