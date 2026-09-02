import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getAllApps, upsertApp, getSiteSettings, updateSiteSettings } from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Search Console HTML verification endpoint
  app.get('/google335fb29481cc8d5a.html', (req, res) => {
    res.type('text/html').send('google-site-verification: google335fb29481cc8d5a.html');
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Cloud SQL API Routes for App Catalog
  app.get('/api/db/apps', async (req, res) => {
    try {
      const records = await getAllApps();
      res.json(records);
    } catch (error: any) {
      console.error('Error fetching apps from Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Database query error' });
    }
  });

  app.post('/api/db/apps', async (req, res) => {
    try {
      const appData = req.body;
      const saved = await upsertApp(appData);
      res.json({ success: true, app: saved });
    } catch (error: any) {
      console.error('Error saving app to Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Database save error' });
    }
  });

  // Cloud SQL API Routes for Site Settings
  app.get('/api/db/settings', async (req, res) => {
    try {
      const settings = await getSiteSettings();
      res.json(settings);
    } catch (error: any) {
      console.error('Error fetching settings from Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Database query error' });
    }
  });

  app.post('/api/db/settings', async (req, res) => {
    try {
      const newSettings = req.body;
      const saved = await updateSiteSettings(newSettings);
      res.json({ success: true, settings: saved });
    } catch (error: any) {
      console.error('Error updating settings in Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Database save error' });
    }
  });

  // Vite middleware for development / static serving for production
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
      const appQuery = (req.query.app || req.query.game || req.query.apk) as string | undefined;
      if (appQuery && typeof appQuery === 'string') {
        const appHtmlPath = path.join(distPath, 'app', appQuery, 'index.html');
        if (fs.existsSync(appHtmlPath)) {
          return res.sendFile(appHtmlPath);
        }
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
