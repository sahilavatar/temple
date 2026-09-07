/**
 * Sound Engine - strictly configured for NO OTHER AUDIO.
 * Per user instruction: "use this for the Hunuman Chalisa: https://www.youtube.com/watch?v=AETFvQonfV8 , no other audio"
 * All synthetic bells, conch, tanpura, and percussion are completely silenced so only the YouTube Chalisa plays.
 */

class TempleSoundEngine {
  private isMuted: boolean = false;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  // All synthesis methods are silent no-ops so only the YouTube audio plays
  public playTempleBell(_pitchMultiplier = 1.0) {}
  public playShankha() {}
  public playFlowerOfferingSound() {}
  public playAartiBells() {}
  public toggleTanpura(): boolean {
    return false;
  }
}

export const soundEngine = new TempleSoundEngine();
