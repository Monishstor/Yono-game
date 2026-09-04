import express from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
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

  // Autonomous AI SEO & Indexing Agent Routes
  app.get('/api/seo/agent-report', (req, res) => {
    try {
      const reportPath = path.join(process.cwd(), 'public', 'seo-audit-report.json');
      if (fs.existsSync(reportPath)) {
        const raw = fs.readFileSync(reportPath, 'utf-8');
        res.json(JSON.parse(raw));
      } else {
        res.status(404).json({ error: 'No audit report found. Please trigger an audit first.' });
      }
    } catch (error: any) {
      console.error('Error reading SEO audit report:', error);
      res.status(500).json({ error: error.message || 'Error reading report' });
    }
  });

  app.post('/api/seo/agent-audit', (req, res) => {
    try {
      console.log('Triggering autonomous AI SEO agent audit via Python...');
      const pythonScript = path.join(process.cwd(), 'seo_agent.py');
      exec(`python3 "${pythonScript}" --fix --audit`, { timeout: 35000, maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Python SEO agent execution error:', error, stderr);
        }
        const reportPath = path.join(process.cwd(), 'public', 'seo-audit-report.json');
        if (fs.existsSync(reportPath)) {
          try {
            const raw = fs.readFileSync(reportPath, 'utf-8');
            return res.json({ success: true, report: JSON.parse(raw), stdout });
          } catch (readErr: any) {
            return res.status(500).json({ error: 'Failed to parse generated report', details: readErr.message });
          }
        }
        return res.json({ success: !error, output: stdout, error: error?.message });
      });
    } catch (err: any) {
      console.error('Error in agent-audit endpoint:', err);
      res.status(500).json({ error: err.message || 'Audit execution error' });
    }
  });

  // Direct clean /slug route handler for static pre-rendered SEO pages
  app.get('/:slug([a-zA-Z0-9_-]+-apk-download)', (req, res, next) => {
    const slug = req.params.slug;
    const publicPath = path.join(process.cwd(), 'public', slug, 'index.html');
    if (fs.existsSync(publicPath)) {
      return res.sendFile(publicPath);
    }
    const distPath = path.join(process.cwd(), 'dist', slug, 'index.html');
    if (fs.existsSync(distPath)) {
      return res.sendFile(distPath);
    }
    next();
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
      const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
      if (cleanPath) {
        const directHtmlPath = path.join(distPath, cleanPath, 'index.html');
        if (fs.existsSync(directHtmlPath)) {
          return res.sendFile(directHtmlPath);
        }
        const appHtmlPath = path.join(distPath, 'app', cleanPath, 'index.html');
        if (fs.existsSync(appHtmlPath)) {
          return res.sendFile(appHtmlPath);
        }
      }
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
