// Crawls the built SPA with a headless browser and writes a static HTML
// snapshot per route into dist/. Search engine crawlers and social-link
// unfurlers that don't execute JS (or give up early) see real content
// instead of an empty <div id="root"></div> shell.
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;
const ROUTES = ['/', '/about', '/projects', '/mini-apps', '/contact'];
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// On Windows, `vite preview` is spawned through a shell (npx.cmd), so
// server.kill() only kills that shell wrapper and leaves the real vite
// process (and its listening port) orphaned. Kill the whole process tree.
function killServer(server) {
  if (process.platform === 'win32' && server.pid) {
    try {
      execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f']);
    } catch {
      // already dead
    }
  } else {
    server.kill();
  }
}

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        await fetch(url);
        return resolve();
      } catch {
        // not up yet
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error('Preview server did not start in time'));
      }
      setTimeout(check, 300);
    };
    check();
  });
}

async function main() {
  console.log('Starting preview server...');
  const server = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  );

  try {
    await waitForServer(BASE_URL);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Block cross-origin and heavy media requests so the crawl is fast and
    // never blocks on third-party embeds (Apple Music) or large videos.
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      const type = req.resourceType();
      const isSameOrigin = url.startsWith(BASE_URL);
      if (type === 'media' || type === 'font' || !isSameOrigin) {
        req.abort();
      } else {
        req.continue();
      }
    });

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      console.log(`Prerendering ${url}`);
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForSelector('#root', { timeout: 10000 });
        await new Promise((r) => setTimeout(r, 800));

        const html = await page.content();

        const outDir =
          route === '/' ? DIST_DIR : path.join(DIST_DIR, route.slice(1));
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
      } catch (err) {
        console.error(`Failed to prerender ${url}:`, err.message);
      }
    }

    await browser.close();
    console.log('Prerendering complete.');
  } finally {
    killServer(server);
  }
}

main().catch((err) => {
  // Never fail the deploy over this: vite build already produced a working
  // SPA in dist/ before this script ran. Worst case on a prerender failure
  // (e.g. missing Chromium deps on the CI image) is that dist/ ships without
  // the extra static snapshots, same as before this script existed.
  console.error('Prerendering failed, shipping the base SPA build instead:', err);
  process.exit(0);
});
