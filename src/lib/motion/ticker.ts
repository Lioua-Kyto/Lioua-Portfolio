/**
 * Linear interpolation toward a target — the primitive behind every
 * continuous value on the site (cursor followers, parallax, HUD numbers).
 */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/** Callback invoked once per animation frame with the rAF timestamp and delta ms. */
export type TickerCallback = (now: number, delta: number) => void;

/**
 * The single shared rAF loop (brief §2.3): every animated continuous value
 * subscribes here instead of creating its own loop. The loop only runs while
 * at least one subscriber is registered.
 */
export class Ticker {
  private readonly callbacks = new Set<TickerCallback>();
  private frame = 0;
  private running = false;
  private last: number | null = null;

  /** Register a per-frame callback; returns its unsubscribe function. */
  add(callback: TickerCallback): () => void {
    this.callbacks.add(callback);
    if (!this.running) this.start();
    return () => {
      this.remove(callback);
    };
  }

  /** Remove a callback; stops the loop when no subscribers remain. */
  remove(callback: TickerCallback): void {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0 && this.running) this.stop();
  }

  private start(): void {
    this.running = true;
    this.last = null;
    this.frame = requestAnimationFrame(this.loop);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private readonly loop = (now: number): void => {
    const delta = this.last === null ? 0 : now - this.last;
    this.last = now;
    for (const callback of this.callbacks) callback(now, delta);
    if (this.running) this.frame = requestAnimationFrame(this.loop);
  };
}

/** App-wide ticker instance — subscribe via effects in client components only. */
export const ticker = new Ticker();
