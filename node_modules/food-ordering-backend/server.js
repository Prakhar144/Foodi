import 'dotenv/config';
import app from './src/app.js';
import { pool } from './src/config/db.js';
import { config } from './src/config/config.js';

const PORT = config.port;

const logDatabaseError = (error) => {
  console.error('MySQL connection failed:', {
    message: error.message,
    code: error.code,
    errno: error.errno,
    sqlState: error.sqlState,
  });
};

pool.getConnection()
  .then((connection) => {
    connection.release();
    console.log('MySQL connection verified.');
  })
  .catch(logDatabaseError);

app.listen(PORT, '0.0.0.0', () => console.log(`Backend server running at http://localhost:${PORT}`));
