// This class acts as a physical gatekeeper. 
// It is impossible to have two instances of "player" here.
class VibeManager {
  constructor() {
    this.player = null;
  }

  play(trackPath) {
    // 1. Kill the old one definitively
    if (this.player) {
      this.player.pause();
      this.player.src = "";
      this.player.load();
      this.player = null;
    }

    // 2. Start the new one
    this.player = new Audio(trackPath);
    this.player.volume = 0.3;
    this.player.loop = true;
    
    // 3. Global reference just for the "currentAudio" logic if needed elsewhere
    window['currentAudio'] = this.player;

    this.player.play().catch(() => {
      console.log("Waiting for user interaction to play audio...");
    });
  }

  stop() {
    if (this.player) {
      this.player.pause();
      this.player.src = "";
      this.player = null;
    }
  }
}

// Export a single instance (The Singleton)
export const vibeManager = new VibeManager();