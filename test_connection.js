require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('--- Database Connection Test ---');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT || '(default 3306)');
  console.log('Database URL:', process.env.DATABASE_URL || '(none)');
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Connecting...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'clinic_erp',
      connectTimeout: 10000 // 10 seconds
    });

    console.log('✅ Success! Database connected.');
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('Query test (1+1):', rows[0].solution);

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed!');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);

    if (err.code === 'ETIMEDOUT') {
      console.log('\n--- Troubleshooting ETIMEDOUT ---');
      console.log('1. Check if your database host is accessible from this server.');
      console.log('2. If you are using Render/Railway, ensure you are NOT using "localhost".');
      console.log('3. Verify that your database provider allows external connections.');
      console.log('4. Check if a firewall or security group (like AWS SG) is blocking port 3306.');
    }

    process.exit(1);
  }
}

testConnection();
