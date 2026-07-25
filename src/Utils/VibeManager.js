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

    // 1. Kill the old one definitively
    if (this.player) {
      this.player.pause();
      this.player.src = "";
      this.player.load();
      this.player = null;
    }

    // 2. Start the new one
    this._currentTrack = trackPath;
    this.player = new Audio(trackPath);
    this.player.volume = 0.3;
    this.player.loop = true;

    // 3. Global reference just for the "currentAudio" logic if needed elsewhere
    window['currentAudio'] = this.player;

    // Surface the real reason a track fails to load/decode (not just autoplay)
    const MEDIA_ERR = { 1: 'ABORTED', 2: 'NETWORK', 3: 'DECODE', 4: 'SRC_NOT_SUPPORTED' };
    this.player.addEventListener('error', () => {
      const code = this.player?.error?.code;
      console.error(`[VibeManager] media error on ${trackPath}: ${MEDIA_ERR[code] || code}`, this.player?.error);
    });

    this.player.play().catch((err) => {
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