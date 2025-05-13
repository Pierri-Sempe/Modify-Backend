// /backend/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',       // o la IP/host de tu servidor de MySQL
  user: 'root',      // por ejemplo: 'root'
  password: 'SQLSakuya2025',
  database: 'moodify_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
