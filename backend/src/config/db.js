import mysql from 'mysql2/promise';
import { config } from './config.js';

export const dbConfig = config.db;

export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});
