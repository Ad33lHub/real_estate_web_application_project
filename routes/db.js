require('dotenv').config({ path: 'test.env' });
const sql = require('mssql/msnodesqlv8');

const config = {
  server: process.env.DB_SERVER || 'ADEEL',
  database: process.env.DB_NAME || 'DreamHomeDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    encrypt: false,
    trustServerCertificate: true
  }
};




let pool;
async function connectToDb() {
  try {
    if (pool) return pool; 
     pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

module.exports = { sql, config, connectToDb };
// connectToDb();



