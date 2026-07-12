import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 5000;

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
