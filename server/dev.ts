import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = Number(process.env.API_PORT || 3002);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

type Handler = (req: any, res: any) => any | Promise<any>;

async function loadHandler(path: string): Promise<Handler> {
  const mod = await import(path);
  const handler: any = (mod && (mod.default ?? mod)) as any;
  if (typeof handler !== 'function') {
    throw new Error(`Invalid handler export for ${path}`);
  }
  return handler as Handler;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mount(route: string, relativeModulePath: string) {
  app.all(route, async (req, res) => {
    try {
      const absPath = path.resolve(__dirname, relativeModulePath);
      const fileUrl = pathToFileURL(absPath).href;
      const handler = await loadHandler(fileUrl);
      await handler(req, res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error in route ${route}:`, err instanceof Error ? err.stack : err);
      res.status(500).send('Internal Server Error');
    }
  });
}

// Mount routes
mount('/api/organizations', '../api/organizations.ts');
mount('/api/strategies', '../api/strategies.ts');
mount('/api/strategy-metadata', '../api/strategy-metadata.ts');
mount('/api/ai-prompts', '../api/ai-prompts.ts');
mount('/api/health', '../api/health.ts');

// Simple ping for sanity
app.get('/api/_ping', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API dev server listening on http://localhost:${PORT}`);
});
