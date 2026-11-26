#!/usr/bin/env python3
"""
Export the About page intro reel ("Who is the 8BitGinger?") as an MP4.

The reel on the site rebuilds itself from the site's data every time the page
loads: new projects, photos, artists, or script edits in
src/components/IntroReel.jsx show up automatically. Run this script whenever you
want a fresh *video file* of it, for YouTube, socials, or anywhere else.

What it does:
  1. Builds the site (vite build) and serves it locally (vite preview).
  2. Plays the reel in a headless browser and records the frames
     (scripts/record-intro-reel.mjs, using the Puppeteer already in the project).
  3. Recreates the sound effects from the reel's own cue list. Headless browsers
     have no audio output, so the recording itself is silent.
  4. Combines picture and sound into an H.264/AAC MP4 with ffmpeg.

Needs: Python 3.9+, Node.js with this project's npm packages installed, and
ffmpeg on your PATH. No pip packages.

Examples (run from the project folder):
  python scripts/render_intro_reel.py                     # jazz theme, 16:9 1920x1080
  python scripts/render_intro_reel.py --theme rock --format portrait
  python scripts/render_intro_reel.py --theme all --format both
  python scripts/render_intro_reel.py --skip-build --no-sound

Output goes to exports/intro-reel-<theme>-<format>.mp4.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import random
import shutil
import struct
import subprocess
import sys
import tempfile
import time
import urllib.request
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECORDER = ROOT / "scripts" / "record-intro-reel.mjs"
THEMES = ["jazz", "rock", "pop", "rap", "country", "lofi"]
IS_WINDOWS = os.name == "nt"

# Layout size the reel is rendered at (CSS pixels) and how much to zoom it.
# Landscape uses the site's desktop layout; portrait uses its 4:5 phone layout.
FORMATS = {
    "landscape": {"stage": (1280, 720), "zoom": 1.5},   # -> 1920x1080
    "portrait": {"stage": (432, 540), "zoom": 2.5},     # -> 1080x1350
}

SAMPLE_RATE = 48000
MASTER_VOLUME = 0.6


# ─────────────────────────────────────────────────────────────────────────────
# Sound effects: a Python port of src/Utils/introSfx.js. If you change a sound
# there, change it here too.
# ─────────────────────────────────────────────────────────────────────────────
class Mixer:
    def __init__(self, seconds: float):
        self.buf = [0.0] * int(seconds * SAMPLE_RATE)
        self.rng = random.Random(8)

    @staticmethod
    def _envelope(x: float, attack: float, peak: float, decay: float) -> float:
        """Exponential attack/decay, like the Web Audio gain ramps."""
        floor = 0.0001
        if x < 0:
            return 0.0
        if x < attack:
            return floor * (peak / floor) ** (x / attack)
        if x < attack + decay:
            return peak * (floor / peak) ** ((x - attack) / decay)
        return 0.0

    def tone(self, kind, f_from, f_to, start, duration, peak, attack=0.005):
        phase = 0.0
        first = int(start * SAMPLE_RATE)
        for n in range(int((attack + duration + 0.05) * SAMPLE_RATE)):
            i = first + n
            if i >= len(self.buf):
                break
            x = n / SAMPLE_RATE
            if f_to:
                freq = f_from * (f_to / f_from) ** min(x / duration, 1.0)
            else:
                freq = f_from
            phase += 2 * math.pi * freq / SAMPLE_RATE
            s = math.sin(phase)
            if kind == "square":
                s = 1.0 if s >= 0 else -1.0
            self.buf[i] += s * self._envelope(x, attack, peak, duration) * MASTER_VOLUME

    def hiss(self, start, duration, kind, f_from, f_to, peak, attack=0.01, q=1.0):
        """White noise through a sweeping biquad filter."""
        b0 = b1 = b2 = a1 = a2 = 0.0
        x1 = x2 = y1 = y2 = 0.0
        first = int(start * SAMPLE_RATE)
        span = attack + duration
        q = q if kind == "bandpass" else 0.707
        for n in range(int((span + 0.05) * SAMPLE_RATE)):
            i = first + n
            if i >= len(self.buf):
                break
            x = n / SAMPLE_RATE
            if n % 32 == 0:  # update the filter every 32 samples
                freq = f_from * (f_to / f_from) ** min(x / span, 1.0)
                w = 2 * math.pi * min(freq, SAMPLE_RATE * 0.45) / SAMPLE_RATE
                alpha = math.sin(w) / (2 * q)
                cos_w = math.cos(w)
                if kind == "lowpass":
                    b0, b1, b2 = (1 - cos_w) / 2, 1 - cos_w, (1 - cos_w) / 2
                elif kind == "highpass":
                    b0, b1, b2 = (1 + cos_w) / 2, -(1 + cos_w), (1 + cos_w) / 2
                else:  # bandpass, constant 0 dB peak
                    b0, b1, b2 = alpha, 0.0, -alpha
                a0 = 1 + alpha
                b0, b1, b2 = b0 / a0, b1 / a0, b2 / a0
                a1, a2 = -2 * cos_w / a0, (1 - alpha) / a0
            sample = self.rng.uniform(-1, 1)
            y = b0 * sample + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
            x2, x1, y2, y1 = x1, sample, y1, y
            self.buf[i] += y * self._envelope(x, attack, peak, duration) * MASTER_VOLUME

    # One method per sound name used in the reel's cue list.
    def tick(self, t):
        self.tone("square", 1800, None, t, 0.025, 0.025)

    def blip(self, t):
        self.tone("square", 660, 990, t, 0.07, 0.03)

    def pop(self, t):
        self.tone("sine", 420, 840, t, 0.09, 0.12)

    def shutter(self, t):
        self.hiss(t, 0.04, "highpass", 3000, 3000, 0.1)
        self.hiss(t + 0.06, 0.03, "highpass", 4000, 4000, 0.06)

    def whoosh(self, t):
        self.hiss(t, 0.45, "bandpass", 350, 2600, 0.16, 0.18, 0.8)

    def rise(self, t):
        self.hiss(t, 0.15, "bandpass", 200, 3200, 0.07, 0.8, 1.2)

    def boom(self, t):
        self.tone("sine", 140, 38, t, 0.7, 0.45)
        self.hiss(t, 0.15, "lowpass", 900, 200, 0.15)

    def glitch(self, t):
        for offset, freq in zip((0, 0.045, 0.1, 0.13), (320, 1180, 540, 920)):
            self.tone("square", freq, None, t + offset, 0.03, 0.03)
        self.hiss(t, 0.18, "highpass", 1500, 1500, 0.06)

    def bell(self, t):
        self.tone("sine", 1046, None, t, 0.9, 0.05, 0.01)
        self.tone("sine", 2093, None, t, 0.5, 0.015, 0.01)

    def chime(self, t):
        for i, freq in enumerate((1047, 1319, 1568, 2093)):
            self.tone("square", freq, None, t + i * 0.075, 0.1, 0.03)

    def write(self, path: Path):
        with wave.open(str(path), "wb") as out:
            out.setnchannels(1)
            out.setsampwidth(2)
            out.setframerate(SAMPLE_RATE)
            out.writeframes(
                b"".join(struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767)) for s in self.buf)
            )


def build_sound_track(cues, total_ms, path: Path):
    mixer = Mixer(total_ms / 1000 + 1.5)
    for cue in cues:
        play = getattr(mixer, cue["name"], None)
        if play is None:
            print(f"  ! no Python version of sound '{cue['name']}', skipping it")
            continue
        play(cue["t"] / 1000 + 0.01)  # the site adds the same 10 ms
    mixer.write(path)


# ─────────────────────────────────────────────────────────────────────────────
# Build, serve, record, encode
# ─────────────────────────────────────────────────────────────────────────────
def run(cmd, **kwargs):
    return subprocess.run(cmd, cwd=ROOT, shell=IS_WINDOWS, check=True, **kwargs)


def require(tool):
    if shutil.which(tool) is None:
        sys.exit(f"'{tool}' was not found on your PATH. Install it and try again.")


def start_server(port: int) -> subprocess.Popen:
    server = subprocess.Popen(
        ["npx", "vite", "preview", "--port", str(port), "--strictPort"],
        cwd=ROOT,
        shell=IS_WINDOWS,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    url = f"http://localhost:{port}/"
    for _ in range(60):
        if server.poll() is not None:
            sys.exit(f"The preview server stopped. Is port {port} already in use? Try --port.")
        try:
            urllib.request.urlopen(url, timeout=2)
            return server
        except OSError:
            time.sleep(0.5)
    stop_server(server)
    sys.exit("The preview server did not start in time.")


def stop_server(server: subprocess.Popen):
    if server.poll() is not None:
        return
    if IS_WINDOWS:
        # npx runs through a shell on Windows, so end the whole process tree.
        subprocess.run(["taskkill", "/pid", str(server.pid), "/t", "/f"], capture_output=True)
    else:
        server.terminate()


def render(theme, fmt, args, port, work: Path) -> Path:
    spec = FORMATS[fmt]
    stage_w, stage_h = spec["stage"]
    zoom = spec["zoom"]
    out_w, out_h = round(stage_w * zoom), round(stage_h * zoom)
    raw = work / f"{theme}-{fmt}-raw.mp4"

    print(f"> Rendering {theme} / {fmt} ({out_w}x{out_h}) frame by frame. This takes a few minutes...")
    result = run(
        ["node", str(RECORDER), f"http://localhost:{port}/about", theme, str(raw),
         str(stage_w), str(stage_h), str(zoom), str(args.fps)],
        stdout=subprocess.PIPE,  # progress still prints (stderr)
        text=True,
    )
    info = json.loads(result.stdout.strip().splitlines()[-1])
    seconds = info["totalMs"] / 1000 + 0.3

    out = Path(args.out) / f"intro-reel-{theme}-{fmt}.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)

    # The frames are already final, so the video stream is copied as-is.
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(raw)]
    if not args.no_sound:
        print("  Generating sound effects...")
        sfx = work / f"{theme}-{fmt}-sfx.wav"
        build_sound_track(info["cues"], info["totalMs"], sfx)
        cmd += ["-i", str(sfx), "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k"]
    else:
        cmd += ["-an"]
    cmd += ["-t", f"{seconds:.3f}", "-c:v", "copy", "-movflags", "+faststart", str(out)]
    print("  Saving...")
    run(cmd)
    print(f"  Saved {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out}")
    return out


def main():
    parser = argparse.ArgumentParser(description="Export the About page intro reel as an MP4.")
    parser.add_argument("--theme", default="jazz",
                        help=f"one of {', '.join(THEMES)}, a comma list, or 'all' (default: jazz)")
    parser.add_argument("--format", default="landscape", choices=["landscape", "portrait", "both"],
                        help="landscape 1920x1080, portrait 1080x1350, or both")
    parser.add_argument("--fps", type=int, default=30, help="frames per second (default: 30)")
    parser.add_argument("--out", default=str(ROOT / "exports"), help="output folder (default: exports/)")
    parser.add_argument("--port", type=int, default=4190, help="local port for the preview server")
    parser.add_argument("--skip-build", action="store_true", help="reuse the existing dist/ build")
    parser.add_argument("--no-sound", action="store_true", help="export without sound effects")
    args = parser.parse_args()

    themes = THEMES if args.theme == "all" else [t.strip() for t in args.theme.split(",")]
    unknown = [t for t in themes if t not in THEMES]
    if unknown:
        parser.error(f"unknown theme(s): {', '.join(unknown)}")
    formats = list(FORMATS) if args.format == "both" else [args.format]

    for tool in ("node", "npx", "ffmpeg"):
        require(tool)
    if not (ROOT / "node_modules" / "puppeteer").exists():
        sys.exit("Project packages are missing. Run 'npm install' first.")

    if not args.skip_build:
        print("> Building the site...")
        # vite build directly: 'npm run build' also prerenders pages, which isn't needed here.
        run(["npx", "vite", "build"], stdout=subprocess.DEVNULL)
    elif not (ROOT / "dist" / "index.html").exists():
        sys.exit("No dist/ build found. Run without --skip-build.")

    server = start_server(args.port)
    saved = []
    try:
        with tempfile.TemporaryDirectory() as tmp:
            for theme in themes:
                for fmt in formats:
                    saved.append(render(theme, fmt, args, args.port, Path(tmp)))
    except subprocess.CalledProcessError as err:
        detail = (err.stderr or "").strip() if isinstance(err.stderr, str) else ""
        sys.exit(f"A step failed: {' '.join(map(str, err.cmd))}\n{detail}")
    finally:
        stop_server(server)

    print(f"\nDone. {len(saved)} video(s) in {Path(args.out)}")


if __name__ == "__main__":
    main()
