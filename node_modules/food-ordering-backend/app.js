import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const hasFrontendBuild = fs.existsSync(frontendDistPath);

app.use(cors());
app.use(express.json());

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
}

app.use('/api', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);

if (hasFrontendBuild) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

export default app;