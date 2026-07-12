import mysql from 'mysql2/promise';

const createDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;

  if (databaseUrl) {
    return {
      host: databaseUrl.hostname,
      port: Number(databaseUrl.port || 3306),
      user: decodeURIComponent(databaseUrl.username || 'root'),
      password: decodeURIComponent(databaseUrl.password || ''),
      database: databaseUrl.pathname.replace(/^\//, '') || 'railway',
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'cravingdash',
  };
};

export const dbConfig = createDatabaseConfig();

export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});
