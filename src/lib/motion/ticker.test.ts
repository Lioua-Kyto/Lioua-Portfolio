import { afterEach, describe, expect, it, vi } from "vitest";
import { lerp, Ticker } from "./ticker";

describe("lerp", () => {
  it("moves current toward target by the given factor", () => {
    expect(lerp(0, 100, 0.1)).toBe(10);
    expect(lerp(50, 100, 0.5)).toBe(75);
  });

  it("is identity at factor 0 and reaches target at factor 1", () => {
    expect(lerp(42, 100, 0)).toBe(42);
    expect(lerp(42, 100, 1)).toBe(100);
  });

  it("converges under repeated application", () => {
    let value = 0;
    for (let i = 0; i < 200; i++) value = lerp(value, 1, 0.15);
    expect(value).toBeCloseTo(1, 5);
  });
});

describe("Ticker", () => {
  // Manual rAF harness: frames fire only when we flush.
  let queue = new Map<number, FrameRequestCallback>();
  let nextId = 1;

  const flush = (now: number) => {
    const pending = queue;
    queue = new Map();
    for (const callback of pending.values()) callback(now);
  };

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = nextId++;
    queue.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    queue.delete(id);
  });

  afterEach(() => {
    queue = new Map();
  });

  it("starts on first subscriber and delivers now + delta", () => {
    const ticker = new Ticker();
    const frames: Array<[number, number]> = [];
    ticker.add((now, delta) => frames.push([now, delta]));

    flush(1000);
    flush(1016);

    expect(frames).toEqual([
      [1000, 0],
      [1016, 16],
    ]);
  });

  it("stops scheduling frames when the last subscriber unsubscribes", () => {
    const ticker = new Ticker();
    const callback = vi.fn();
    const unsubscribe = ticker.add(callback);

    flush(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(queue.size).toBe(1);

    unsubscribe();
    expect(queue.size).toBe(0);
  });

  it("supports multiple subscribers on one loop", () => {
    const ticker = new Ticker();
    const first = vi.fn();
    const second = vi.fn();
    ticker.add(first);
    ticker.add(second);

    expect(queue.size).toBe(1);
    flush(500);
    expect(first).toHaveBeenCalledWith(500, 0);
    expect(second).toHaveBeenCalledWith(500, 0);
  });
});
