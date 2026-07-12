import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  const { host, port, user, password, database } = config.db;

  console.log(`Connecting to database: ${database} on ${host}:${port}...`);

  let connection;
  try {
    connection = await mysql.createConnection({ host, port, user, password, database });
    console.log('Successfully connected to the database.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Remove CREATE DATABASE / USE statements — run directly in the configured database
    schemaSql = schemaSql
      .replace(/CREATE DATABASE IF NOT EXISTS \w+;/gi, '')
      .replace(/USE \w+;/gi, '');

    const queries = schemaSql
      .split(';')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    console.log('Executing schema.sql...');
    for (const query of queries) {
      console.log(`Running: ${query.substring(0, 60).replace(/\s+/g, ' ')}...`);
      await connection.query(query);
    }

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
