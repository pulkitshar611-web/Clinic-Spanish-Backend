require('dotenv').config();
const mysql = require('mysql2');

// prefer a full DATABASE_URL if provided by the platform (Railway, Heroku, etc.)
// mysql2 accepts a connection URI string directly.
let dbConfig;
if (process.env.DATABASE_URL) {
    dbConfig = process.env.DATABASE_URL;
    if (process.env.NODE_ENV !== 'production') {
        console.log('[DB] Using DATABASE_URL from environment');
    }
} else {
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // custom port (Railway provides one)
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

    // helpful debug output when running in environments like Railway
    if (process.env.NODE_ENV !== 'production') {
        console.log('[DB] Config:', {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            database: dbConfig.database
        });
    }
}

console.log(`[DB] Attempting to connect to: ${dbConfig.host} (${dbConfig.database})`);

const pool = mysql.createPool(dbConfig);

// Test pool connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('[DB] CRITICAL: Database connection failed!');
        console.error(`[DB] Error Code: ${err.code}`);
        console.error(`[DB] Error Message: ${err.message}`);
        if (typeof dbConfig === 'string') {
            console.error(`[DB] Tried connection url: ${dbConfig}`);
        } else {
            console.error(`[DB] Tried host=${dbConfig.host} port=${dbConfig.port}`);
        }
        if (err.code === 'ETIMEDOUT') {
            console.error('[DB] Hint: Connection timed out. Check if your DB host is reachable and firewall allows the configured port.');
            console.error('[DB]       On Railway ensure the database is attached, the proxy host/port are correct, and that your environment variables match the Railway dashboard values.');
        }
    } else {
        console.log('[DB] SUCCESS: Connected to database pool.');
        connection.release();
    }
});

const promisePool = pool.promise();

module.exports = promisePool;
