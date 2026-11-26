// Renders the About page intro reel to a silent video, one frame at a time.
// Run by scripts/render_intro_reel.py, which builds and serves the site, adds
// the sound effects, and writes the final MP4. Prints one JSON line of results.
//
// Usage: node scripts/record-intro-reel.mjs <url> <theme> <out.mp4> <stageWidth> <stageHeight> <zoom> <fps>
//
// The reel is laid out at stageWidth × stageHeight CSS pixels, exactly as on
// the site, then zoomed to fill the output frame (stage size × zoom).
//
// Why frame by frame: a live screen recording drifts, which would knock the
// sound effects out of sync. Here every CSS animation and video is paused and
// set to the exact time of each frame before the screenshot is taken.
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const [url, theme, outFile, stageWidth, stageHeight, zoom, fpsArg] = process.argv.slice(2);
const fps = Number(fpsArg);
const outWidth = Math.round(Number(stageWidth) * Number(zoom));
const outHeight = Math.round(Number(stageHeight) * Number(zoom));

const browser = await puppeteer.launch({ headless: true, args: ['--hide-scrollbars'] });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: outWidth, height: outHeight });
  // 'load', not network idle: the page's looping videos never go idle.
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });

  await page.evaluate((t) => {
    window.dispatchEvent(new CustomEvent('theme-switch', { detail: { theme: t } }));
    window.currentAudio?.pause();
  }, theme);

  await page.addStyleTag({
    content: `
      html, body { overflow: hidden !important; }
      .reel {
        position: fixed !important; top: 0 !important; left: 0 !important; z-index: 2147483647 !important;
        width: ${stageWidth}px !important; zoom: ${zoom};
        border: 0 !important; border-radius: 0 !important; box-shadow: none !important;
      }
      .reel__stage {
        width: ${stageWidth}px !important; height: ${stageHeight}px !important;
        aspect-ratio: auto !important; cursor: none !important;
      }
      .reel__controls, .reel__end { display: none !important; }
    `,
  });
  await page.waitForSelector('.reel__poster');
  await page.evaluate(() => document.fonts.ready);

  const timeline = await page.evaluate(() => {
    const reel = window.__INTRO_REEL__;
    if (!reel) return null;
    reel.begin();
    return { cues: reel.cues, totalMs: reel.totalMs };
  });
  if (!timeline) throw new Error('The page did not expose window.__INTRO_REEL__');

  // Set up the page-side frame stepper.
  await page.evaluate(() => {
    const born = new WeakMap(); // animation or video -> reel time it appeared
    const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    window.__renderFrame = async (ms) => {
      window.__INTRO_REEL__.setTime(ms);
      await nextFrame(); // let React draw the new time

      const stage = document.querySelector('.reel__stage');
      await Promise.all(
        [...stage.querySelectorAll('img')].map((img) => (img.complete ? null : img.decode().catch(() => {})))
      );

      for (const anim of document.getAnimations()) {
        if (!born.has(anim)) born.set(anim, ms);
        anim.pause();
        anim.currentTime = ms - born.get(anim);
      }

      await Promise.all(
        [...stage.querySelectorAll('video')].map((video) => {
          if (!born.has(video)) born.set(video, ms);
          video.pause();
          if (video.readyState < 1) {
            return new Promise((r) => {
              video.addEventListener('loadedmetadata', r, { once: true });
              setTimeout(r, 3000);
            }).then(() => seek(video, ms));
          }
          return seek(video, ms);
        })
      );

      function seek(video, now) {
        const duration = video.duration || 1;
        const target = ((now - born.get(video)) / 1000) % duration;
        if (Math.abs(video.currentTime - target) < 0.001) return null;
        return new Promise((r) => {
          video.addEventListener('seeked', r, { once: true });
          setTimeout(r, 2000);
          video.currentTime = target;
        });
      }

      await nextFrame();
    };
  });

  const ffmpeg = spawn(
    'ffmpeg',
    [
      '-y', '-v', 'error',
      '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
      outFile,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  );
  const ffmpegDone = new Promise((resolve, reject) => {
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });

  const frames = Math.ceil((timeline.totalMs / 1000) * fps) + Math.round(fps * 0.3);
  for (let f = 0; f < frames; f += 1) {
    const ms = Math.min((f * 1000) / fps, timeline.totalMs);
    await page.evaluate((t) => window.__renderFrame(t), ms);
    const jpeg = await page.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
    if (!ffmpeg.stdin.write(jpeg)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
    if (f % (fps * 5) === 0) process.stderr.write(`  frame ${f}/${frames}\n`);
  }
  ffmpeg.stdin.end();
  await ffmpegDone;

  console.log(JSON.stringify({ file: outFile, frames, playOffset: 0, ...timeline }));
} finally {
  await browser.close();
}
