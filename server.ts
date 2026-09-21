// ==========================================================
// Express + Vite Full-Stack Server
// ==========================================================

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './server/routes/authRoutes.js';
import { profileRouter } from './server/routes/profileRoutes.js';
import { resumeRouter } from './server/routes/resumeRoutes.js';
import { analysisRouter } from './server/routes/analysisRoutes.js';
import { careerRouter } from './server/routes/careerRoutes.js';
import { portfolioRouter } from './server/routes/portfolioRoutes.js';
import { adminRouter } from './server/routes/adminRoutes.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON & URL-encoded body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AI Resume Builder & Smart ATS Analyzer',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/resumes', resumeRouter);
  app.use('/api/analyses', analysisRouter);
  app.use('/api/analyze', analysisRouter); // Support both paths
  app.use('/api/career', careerRouter);
  app.use('/api/portfolio', portfolioRouter);
  app.use('/api/admin', adminRouter);

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
