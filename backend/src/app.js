import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { config } from './config/config.js';
import { setupHelmet, apiLimiter, setupCompression } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production-ready static path configuration (relative to backend/src)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const hasFrontendBuild = fs.existsSync(frontendDistPath);

// Security & performance configurations
app.use(setupHelmet());

// Setup CORS configuration
app.use(cors({
  origin: config.clientUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(setupCompression());
app.use(express.json());

// Apply rate limiter to API routes
app.use('/api', apiLimiter);

// Serve frontend static build if compiled
if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
}

// Bind API routes
app.use('/api', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);

// Fallback index.html router for SPA frontend
if (hasFrontendBuild) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 Route handler
app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

// Centralized error handler
app.use(errorHandler);

export default app;
