import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 5000;

pool.getConnection()
  .then((connection) => {
    connection.release();
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend server running at http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Unable to connect to MySQL. Check your .env values and run database/schema.sql first.', error.message);
    process.exit(1);
  });
