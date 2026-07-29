"use client";

import { useEffect, useRef } from "react";
import { lerp, ticker } from "@/lib/motion/ticker";

/**
 * The portrait, disturbed by the cursor.
 *
 * The one motivated reason this exists: the site's line is "I build the systems
 * behind the screens", and this is the only picture of the person. Passing the
 * cursor over it breaks the figure into the print structure underneath and lets
 * it resolve back — the claim, stated on the image, rather than written again.
 *
 * Deliberately not a particle system and deliberately not Three.js. One quad,
 * one texture, one fragment shader, no dependency: the cost is a few kilobytes
 * of source on a layer that already exists. The `next/image` underneath stays
 * the LCP element and the whole thing is skipped on coarse pointers, narrow
 * screens, and anywhere WebGL will not start — so the fallback is simply the
 * portrait as it is today.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uStrength;
uniform float uTime;
uniform vec3 uAccent;
varying vec2 vUv;

void main() {
  vec2 px = vUv * uRes;
  float d = distance(px, uPointer);
  float radius = min(uRes.x, uRes.y) * 0.30;
  float fall = 1.0 - smoothstep(0.0, radius, d);
  fall = pow(fall, 1.7) * uStrength;

  // The disturbed area quantises into cells: it stops being a photograph and
  // becomes the grid it was always printed on. This half follows the cursor
  // everywhere, right down to the last row — it moves nothing, so it cannot
  // open a gap.
  float cell = mix(1.0, 15.0, fall);
  vec2 snapped = (floor(px / cell) * cell + cell * 0.5) / uRes;
  vec2 uv = mix(vUv, snapped, fall * 0.88);

  // Only the displacement is held off the floor, and only in the last few
  // rows. Fading the whole effect out down there made the disturbance sit
  // visibly above and beside the cursor; this way the effect stays centred on
  // the pointer and just stops shifting pixels where a shift would lift the
  // figure off the bottom edge and show daylight under it.
  float floored = smoothstep(0.0, 24.0 / uRes.y, 1.0 - vUv.y);

  // Cells drift away from the cursor, breathing rather than exploding. The
  // very centre is calmer than the ring around it, so the point being looked
  // at stays legible instead of smearing.
  float ring = mix(0.55, 1.0, smoothstep(0.0, radius * 0.30, d));
  vec2 dir = normalize(px - uPointer + vec2(0.0001));
  float breath = 0.5 + 0.5 * sin(uTime * 1.3 + d * 0.018);
  vec2 push = dir * fall * ring * floored * (2.5 + 6.5 * breath) / uRes;

  // Channel split, the way a plate slips on press.
  float split = fall * 0.006;
  vec4 g = texture2D(uTex, uv + push);
  float r = texture2D(uTex, uv + push + vec2(split, 0.0)).r;
  float b = texture2D(uTex, uv + push - vec2(split, 0.0)).b;

  vec3 col = vec3(r, g.g, b);
  col = mix(col, mix(col, uAccent * g.a, 0.26), fall);
  gl_FragColor = vec4(col, g.a);
}`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) === true
    ? shader
    : null;
}

export function PortraitField({ src }: { src: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const image = el?.parentElement?.querySelector("img");
    if (!el || !image) return;

    // A cursor effect has nothing to say to a finger, and the shader is not
    // worth its frame cost on a phone. A reader who has asked for less motion
    // gets the plain portrait: this one is continuous and pointer-driven, so
    // unlike the site's one-shot entrance it genuinely is the kind of motion
    // that setting is about. All checked once, not watched.
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      !window.matchMedia("(min-width: 1024px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const gl = el.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vert || !frag) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex = gl.getUniformLocation(program, "uTex");
    const uRes = gl.getUniformLocation(program, "uRes");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uStrength = gl.getUniformLocation(program, "uStrength");
    const uTime = gl.getUniformLocation(program, "uTime");
    gl.uniform3f(
      gl.getUniformLocation(program, "uAccent"),
      0x2b / 255,
      0x4e / 255,
      0xcc / 255,
    );

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    // The portrait is not a power of two, so no mipmaps and clamped edges —
    // sampling past the frame lands on transparent pixels, which is what the
    // displacement wants anyway.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uTex, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const pointer = { x: -9999, y: -9999 };
    const strength = { current: 0, target: 0 };
    let ready = false;
    let stop: (() => void) | null = null;

    const size = () => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      el.width = Math.max(1, Math.round(box.width * dpr));
      el.height = Math.max(1, Math.round(box.height * dpr));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
    };

    const onPointer = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      pointer.x = (event.clientX - box.left) * dpr;
      pointer.y = (event.clientY - box.top) * dpr;
      // Only what is over the figure counts, with a margin so it eases in at
      // the edges rather than switching on.
      const inside =
        event.clientX > box.left - 100 &&
        event.clientX < box.right + 100 &&
        event.clientY > box.top - 100 &&
        event.clientY < box.bottom + 100;
      strength.target = inside ? 1 : 0;
    };

    const draw = (now: number) => {
      if (!ready) return;
      // The portrait blurs into background texture across the hero's pin, so
      // the effect retires with it. Read, never subscribed to: a scroll
      // listener would run off the frame budget this loop already owns.
      const past = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      strength.current = lerp(
        strength.current,
        strength.target * (1 - past),
        0.08,
      );
      if (strength.current < 0.001 && strength.target === 0) {
        strength.current = 0;
      }
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uStrength, strength.current);
      gl.uniform1f(uTime, now / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const texel = new window.Image();
    texel.decoding = "async";
    texel.src = src;
    void texel
      .decode()
      .then(async () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          texel,
        );
        size();
        ready = true;
        // Draw once up front: the canvas fades in on the next frame, and a
        // background tab can hold the first tick back indefinitely.
        draw(performance.now());
        stop = ticker.add(draw);
        window.addEventListener("pointermove", onPointer, { passive: true });

        // Hand over only once the entrance has finished playing on the real
        // image: swapping mid-animation would cut the hero's opening move.
        await Promise.allSettled(
          image.getAnimations().map((animation) => animation.finished),
        );
        el.dataset.ready = "true";
        image.dataset.replaced = "true";
      })
      .catch(() => {
        /* No texture, no effect — the image underneath is already correct. */
      });

    const observer = new ResizeObserver(() => {
      if (ready) size();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      stop?.();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      delete image.dataset.replaced;
    };
  }, [src]);

  return <canvas ref={canvas} data-portrait-field aria-hidden="true" />;
}
