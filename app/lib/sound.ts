// UI sounds (Web Audio). Interface sounds are synthesised, muffled "felt" taps; typing uses real
// keystroke samples. Browsers only allow audio after a user gesture, so the
// context is created/resumed on the first pointerdown or keydown; sounds
// requested before that are silently skipped.

export type SoundName =
  | "hover" | "row" | "pop" | "click" | "step" | "open" | "close" | "success" | "error" | "toggle"
  | "key" | "space" | "return" | "backspace";

const STORAGE_KEY = "sound";
// Keystrokes sliced from "typing on laptop keyboard" (Pixabay, free licence):
// 10 typical-strength clips of 105 ms, natural dynamics kept — 0-7 regular
// keys, 8-9 slightly heavier ones (space / enter).
const TYPING_URL = "/sounds/typing.wav";
const CLIP = 0.105;

// Audio state lives on globalThis so it survives dev hot-reloads of this module
// (a reloaded module would otherwise stay silent until a full page refresh).
type AudioState = {
  ctx: AudioContext | null;
  master: GainNode | null;
  noise: AudioBuffer | null;
  typing: AudioBuffer | null;
  typingLoading: boolean;
};
const store = globalThis as unknown as { __uiSound?: AudioState };
const audio: AudioState = (store.__uiSound ??= {
  ctx: null,
  master: null,
  noise: null,
  typing: null,
  typingLoading: false,
});

let enabled = true;
let loaded = false;
const listeners = new Set<() => void>();
const lastPlayed: Partial<Record<SoundName, number>> = {};

function loadPreference() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    enabled = localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {}
}

export function isSoundEnabled() {
  loadPreference();
  return enabled;
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {}
  listeners.forEach((l) => l());
  if (next) play("toggle");
}

/** Creates (once) and resumes the context. Only works after a user gesture. */
function ensureContext() {
  if (typeof window === "undefined") return null;
  if (!audio.ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
    const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    Object.assign(audio, { ctx, master, noise });
  }
  if (audio.ctx!.state === "suspended") void audio.ctx!.resume();
  return audio.ctx;
}

/** Fetches and decodes the keystroke samples (called when the form opens). */
export function preloadTyping() {
  if (audio.typing || audio.typingLoading || typeof window === "undefined") return;
  audio.typingLoading = true;
  fetch(TYPING_URL)
    .then((r) => r.arrayBuffer())
    // Decoding doesn't need a running context, so an offline one is fine
    .then((buf) => (audio.ctx ?? new OfflineAudioContext(1, 1, 44100)).decodeAudioData(buf))
    .then((decoded) => {
      audio.typing = decoded;
    })
    .catch(() => {})
    .finally(() => {
      audio.typingLoading = false;
    });
}

/** Call once on the client: unlocks audio on the first user gesture. */
export function initSound() {
  loadPreference();
  const unlock = () => ensureContext();
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
  return () => {
    window.removeEventListener("pointerdown", unlock, { capture: true });
    window.removeEventListener("keydown", unlock, { capture: true });
  };
}

function tone(
  freq: number,
  { type = "sine", start = 0, dur = 0.12, gain = 0.1, to, attack = 0.004 }:
  { type?: OscillatorType; start?: number; dur?: number; gain?: number; to?: number; attack?: number } = {},
) {
  const { ctx, master } = audio;
  if (!ctx || !master) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// Short filtered-noise transient: reads as a physical "tap" (key, switch)
// rather than a synth note.
function tap(freq: number, { dur = 0.03, gain = 0.1, q = 1.2, start = 0, type = "bandpass" as BiquadFilterType } = {}) {
  const { ctx, master, noise } = audio;
  if (!ctx || !master || !noise) return;
  const t = ctx.currentTime + start;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = 0.9 + Math.random() * 0.2; // tiny variation, never identical
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  // Filtering white noise throws most of its energy away (narrow band = quieter),
  // so compensate: `gain` then means roughly the same loudness at any freq/Q.
  const nyquist = ctx.sampleRate / 2;
  const bandwidth = type === "bandpass" ? freq / q : freq;
  const makeup = Math.min(Math.sqrt(nyquist / bandwidth), 12);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain * makeup, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

// Low-passed noise tap: a soft, felt-like knock with no bright click on top
// (no loudness make-up here, unlike tap(): these are meant to stay quiet)
function muffled(cutoff: number, { dur = 0.015, gain = 0.1, start = 0 } = {}) {
  const { ctx, master, noise } = audio;
  if (!ctx || !master || !noise) return;
  const t = ctx.currentTime + start;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = 0.7;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

// Soft air movement, low-passed so it stays in the background
function air(from: number, to: number, dur: number, gain: number) {
  const { ctx, master, noise } = audio;
  if (!ctx || !master || !noise) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.5;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.05);
}

// One recorded keystroke from the sprite. Returns false until samples are loaded.
function sample(clip: number, { gain = 0.5, rate = 1 } = {}) {
  const { ctx, master, typing } = audio;
  if (!ctx || !master || !typing) return false;
  const src = ctx.createBufferSource();
  src.buffer = typing;
  src.playbackRate.value = rate;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g).connect(master);
  src.start(ctx.currentTime, clip * CLIP, CLIP);
  return true;
}

// Minimum gap per sound, so fast mouse moves never turn into a buzz
const THROTTLE: Partial<Record<SoundName, number>> = { hover: 70, row: 90, pop: 120, click: 40, step: 120, key: 25, space: 25, backspace: 25 };

export function play(name: SoundName) {
  loadPreference();
  if (!enabled) return;
  // After any user gesture the context can be (re)created here, so sounds keep
  // working even if the unlock listener belonged to an older module instance.
  // A context still resuming queues the sound, so the first click is audible too.
  const active = typeof navigator !== "undefined" && navigator.userActivation?.hasBeenActive;
  const ctx = active ? ensureContext() : audio.ctx;
  if (!ctx || ctx.state === "closed") return;
  const now = performance.now();
  const gap = THROTTLE[name] ?? 0;
  if (now - (lastPlayed[name] ?? -Infinity) < gap) return;
  lastPlayed[name] = now;

  // Felt palette: muffled, low-passed taps (no bright transients, no melodic
  // notes) so the UI sounds soft and physical. UI feedback, not music.
  switch (name) {
    case "hover": // barely-there felt tap
      muffled(1400, { dur: 0.014, gain: 0.05 });
      break;
    case "row": // slightly fuller for the project list
      muffled(1100, { dur: 0.018, gain: 0.07 });
      break;
    case "pop": // soft swell as the cursor grows into a preview
      tone(300, { dur: 0.09, gain: 0.05, to: 460, attack: 0.01 });
      muffled(1200, { dur: 0.016, gain: 0.05 });
      break;
    case "click": // muffled press with a little low body
      muffled(900, { dur: 0.022, gain: 0.16 });
      tone(140, { dur: 0.05, gain: 0.06 });
      break;
    case "toggle": // two soft presses
      muffled(1000, { dur: 0.02, gain: 0.13 });
      muffled(800, { dur: 0.02, gain: 0.1, start: 0.05 });
      break;
    case "step": // quiet detent
      muffled(1000, { dur: 0.02, gain: 0.09 });
      break;
    case "open":
      air(600, 3200, 0.55, 0.05);
      break;
    case "close":
      air(3000, 500, 0.45, 0.04);
      break;
    case "success": // single soft confirmation tone
      tone(880, { dur: 0.5, gain: 0.05, attack: 0.02 });
      tone(1320, { start: 0.06, dur: 0.45, gain: 0.03, attack: 0.02 });
      break;
    // Typing: real laptop keystrokes (random clip + slight pitch drift so fast
    // typing never sounds looped). Synth fallback while the samples load.
    case "key":
      if (!sample(Math.floor(Math.random() * 8), { gain: 0.22, rate: 0.97 + Math.random() * 0.06 })) tap(1900, { dur: 0.016, gain: 0.12 });
      break;
    case "backspace":
      if (!sample(Math.floor(Math.random() * 8), { gain: 0.18, rate: 1.06 })) tap(2300, { dur: 0.012, gain: 0.1 });
      break;
    case "space":
      if (!sample(8, { gain: 0.22, rate: 0.98 + Math.random() * 0.04 })) tap(1400, { dur: 0.02, gain: 0.12 });
      break;
    case "return":
      if (!sample(9, { gain: 0.24 })) tap(1200, { dur: 0.022, gain: 0.14 });
      break;
    case "error": // low, soft, not alarming
      tone(180, { dur: 0.18, gain: 0.05, attack: 0.01 });
      muffled(700, { dur: 0.03, gain: 0.1 });
      break;
  }
}
