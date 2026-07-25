// This class acts as a physical gatekeeper.
// It is impossible to have two instances of "player" here.
class VibeManager {
  constructor() {
    this.player = null;
    this._currentTrack = null; // 🛡️ Guard: track what's already playing
  }

  play(trackPath) {
    // 🛡️ If this exact track is already playing, do nothing
    if (this._currentTrack === trackPath && this.player && !this.player.paused) {
      return;
    }

    // 1. Kill the old one definitively.
    //    Detach our error handler FIRST — emptying src fires a spurious
    //    SRC_NOT_SUPPORTED on the old element that isn't a real failure.
    if (this.player) {
      this.player.onerror = null;
      this.player.pause();
      this.player.removeAttribute('src');
      this.player.load();
      this.player = null;
    }

    // 2. Start the new one
    this._currentTrack = trackPath;
    const el = new Audio();
    el.volume = 0.3;
    el.loop = true;
    el.preload = 'auto';
    this.player = el;

    // 3. Global reference just for the "currentAudio" logic if needed elsewhere
    window['currentAudio'] = el;

    // Surface the real reason a track fails to load/decode (not just autoplay).
    // Guard on `el === this.player` so a torn-down element never logs.
    const MEDIA_ERR = { 1: 'ABORTED', 2: 'NETWORK', 3: 'DECODE', 4: 'SRC_NOT_SUPPORTED' };
    el.onerror = () => {
      if (el !== this.player) return; // stale element being replaced — ignore
      const e = el.error;
      console.error(
        `[VibeManager] media error on ${trackPath}: ${MEDIA_ERR[e?.code] || e?.code}` +
        ` (networkState=${el.networkState}, readyState=${el.readyState}, currentSrc=${el.currentSrc})`,
        e
      );
    };

    // Set src explicitly and load, then play. Keeps the request tied to the
    // user gesture while giving us a clean, observable load lifecycle.
    el.src = trackPath;
    el.play().catch((err) => {
      if (el !== this.player) return; // superseded by a newer selection — ignore
      // NotAllowedError = real autoplay block; anything else = load/decode/network failure
      console.error(`[VibeManager] play() rejected for ${trackPath}: ${err.name} — ${err.message}`);
    });
  }

  stop() {
    if (this.player) {
      this.player.pause();
      this.player.src = "";
      this.player = null;
      this._currentTrack = null;
    }
  }
}

// Export a single instance (The Singleton)
export const vibeManager = new VibeManager();