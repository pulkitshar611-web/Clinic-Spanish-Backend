require('dotenv').config();
const mysql = require('mysql2');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

console.log(`[DB] Attempting to connect to: ${dbConfig.host} (${dbConfig.database})`);

const pool = mysql.createPool(dbConfig);

// Test pool connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('[DB] CRITICAL: Database connection failed!');
        console.error(`[DB] Error Code: ${err.code}`);
        console.error(`[DB] Error Message: ${err.message}`);
        if (err.code === 'ETIMEDOUT') {
            console.error('[DB] Hint: Connection timed out. Check if your DB host is reachable and firewall allows port 3306.');
        }
    } else {
        console.log('[DB] SUCCESS: Connected to database pool.');
        connection.release();
    }
});

const promisePool = pool.promise();

module.exports = promisePool;
