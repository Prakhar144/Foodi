import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  const databaseUrlValue = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  const databaseUrl = databaseUrlValue ? new URL(databaseUrlValue) : null;

  let connectionConfig;
  if (databaseUrl) {
    connectionConfig = {
      host: databaseUrl.hostname,
      port: Number(databaseUrl.port || 3306),
      user: decodeURIComponent(databaseUrl.username || 'root'),
      password: decodeURIComponent(databaseUrl.password || ''),
      database: databaseUrl.pathname.replace(/^\//, '') || 'railway',
    };
  } else {
    connectionConfig = {
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'cravingdash',
    };
  }

  console.log(`Connecting to database: ${connectionConfig.database} on ${connectionConfig.host}:${connectionConfig.port}...`);

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('Successfully connected to the database.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Remove any CREATE DATABASE or USE statements so we run directly in the connected/configured database
    schemaSql = schemaSql
      .replace(/CREATE DATABASE IF NOT EXISTS \w+;/gi, '')
      .replace(/USE \w+;/gi, '');

    console.log('Executing schema.sql...');
    // Execute statements one by one by splitting on ';'
    const queries = schemaSql
      .split(';')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    for (const query of queries) {
      console.log(`Running query: ${query.substring(0, 60).replace(/\s+/g, ' ')}...`);
      await connection.query(query);
    }

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
