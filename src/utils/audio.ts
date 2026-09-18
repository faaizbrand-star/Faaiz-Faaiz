/**
 * Lightweight browser-native Web Audio API sound effects for chat activity notifications.
 * Synthesizes pure sine-wave chimes with zero external audio assets required.
 */
class ChatSoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx && AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Play synthesized chat notification pings.
   * @param type 'receive' for incoming AI response chime, 'send' for user message send, 'toggle' for mute toggle feedback
   */
  playPing(type: 'receive' | 'send' | 'toggle' = 'receive'): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'receive') {
        // Crisp dual-tone incoming message ping (587Hz -> 880Hz / D5 -> A5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

        osc.start(now);
        osc.stop(now + 0.27);
      } else if (type === 'send') {
        // Soft click/blip when user sends a message (440Hz -> 330Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.05);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'toggle') {
        // Quick gentle ping when sound is unmuted
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.05);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (err) {
      // Audio might be suppressed by browser autoplay policy before gesture
      console.debug('Chat audio ping suppressed:', err);
    }
  }
}

export const chatSound = new ChatSoundEngine();
