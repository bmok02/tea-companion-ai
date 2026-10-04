"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Generative zen ambience, synthesised live with the Web Audio API — no audio
// files (the repo ships none, by design), so nothing to license or download.
// A soft D-major-pentatonic bed: a low drone that slowly swells, a pad that
// drifts through a four-chord loop, sparse plucked phrases that wander up and
// down the scale (with rests), and an occasional singing bowl, all through a
// hall reverb and a darkened echo so it sits behind the ritual, not on top.
//
// Browsers only allow sound after a tap, so it only ever starts from the
// button. `ducked` dips it while the companion is speaking.

// Master gain at full slider; the companion's voice dips it to a quarter.
const MAX_LEVEL = 0.8;
const DUCK_FACTOR = 0.28;
const VOLUME_KEY = "teaCompanion.music.volume";
// D pentatonic (D E F# A B), two octaves above middle-ish range
const PLUCK_HZ = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880];
const BOWL_HZ = [146.83, 220, 293.66];
// Pad loop: D sus2 → B minor → A sus2 → F# minor, each held ~16s with a 6s
// crossfade so one chord is always melting into the next.
const CHORDS = [
  [146.83, 220, 329.63],
  [123.47, 185, 293.66],
  [110, 164.81, 246.94],
  [185, 220, 329.63],
];
const CHORD_SECONDS = 16;
const CHORD_FADE = 6;

export function useAmbient(ducked: boolean) {
  const [playing, setPlaying] = useState(false);
  // 0–1 slider position; remembered across visits (read after mount so the
  // first render matches the server's).
  const [volume, setVolumeState] = useState(0.6);
  const volumeRef = useRef(0.6);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const busRef = useRef<AudioNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const padTimerRef = useRef<number | null>(null);
  const chordRef = useRef(0);
  const noteRef = useRef(3);
  const nodesRef = useRef<{ stop: () => void }[]>([]);
  const duckedRef = useRef(ducked);
  const playingRef = useRef(false);

  const level = () =>
    volumeRef.current * MAX_LEVEL * (duckedRef.current ? DUCK_FACTOR : 1);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = parseFloat(localStorage.getItem(VOLUME_KEY) ?? "");
      if (saved >= 0 && saved <= 1) {
        volumeRef.current = saved;
        setVolumeState(saved);
      }
    } catch {
      // Storage unavailable — the default stands.
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const rampTo = useCallback((seconds: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const g = master.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(level(), ctx.currentTime + seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      volumeRef.current = v;
      setVolumeState(v);
      try {
        localStorage.setItem(VOLUME_KEY, String(v));
      } catch {
        // Preference just won't persist.
      }
      if (playingRef.current) rampTo(0.08);
    },
    [rampTo]
  );

  // One chord of the pad: soft sine/triangle pairs, slightly detuned, swelling
  // in and out through a lowpass so it never gets bright.
  const playChord = useCallback(() => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return;

    const run = () => {
      const now = ctx.currentTime;
      const chord = CHORDS[chordRef.current++ % CHORDS.length];
      const end = now + CHORD_SECONDS + CHORD_FADE;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.06, now + CHORD_FADE);
      g.gain.linearRampToValueAtTime(0.0001, end);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 750;
      g.connect(lp).connect(bus);

      let last: OscillatorNode | null = null;
      chord.forEach((hz) => {
        [
          { type: "sine" as const, cents: -4, gain: 0.5 },
          { type: "triangle" as const, cents: 4, gain: 0.22 },
        ].forEach(({ type, cents, gain }) => {
          const o = ctx.createOscillator();
          const og = ctx.createGain();
          o.type = type;
          o.frequency.value = hz;
          o.detune.value = cents;
          og.gain.value = gain;
          o.connect(og).connect(g);
          o.start(now);
          o.stop(end + 0.1);
          last = o;
        });
      });
      (last as OscillatorNode | null)?.addEventListener("ended", () => {
        g.disconnect();
        lp.disconnect();
      });

      padTimerRef.current = window.setTimeout(run, CHORD_SECONDS * 1000);
    };
    run();
  }, []);

  // A soft struck note: fundamental plus inharmonic-leaning partials whose
  // upper voices die away first, placed somewhere in the stereo field.
  const pluck = useCallback((hz: number, when: number, peak: number) => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return;
    const decay = 4.8;
    const out = ctx.createGain();
    out.gain.value = 1;
    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.random() - 0.5) * 1.1;
    out.connect(pan).connect(bus);

    const partials = [
      { mult: 1, gain: 1, dec: decay },
      { mult: 2.005, gain: 0.28, dec: decay * 0.55 },
      { mult: 3.01, gain: 0.09, dec: decay * 0.3 },
    ];
    let first: OscillatorNode | null = null;
    partials.forEach(({ mult, gain, dec }) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(peak * gain, when + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.012 + dec);
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = hz * mult;
      o.connect(g).connect(out);
      o.start(when);
      o.stop(when + 0.012 + dec + 0.2);
      if (!first) first = o;
    });
    (first as OscillatorNode | null)?.addEventListener("ended", () => {
      out.disconnect();
      pan.disconnect();
    });
  }, []);

  // Singing bowl: a slow bloom of a fundamental, a beating twin, and the
  // stretched partials a real bowl rings with.
  const bowl = useCallback((hz: number) => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return;
    const now = ctx.currentTime;
    const attack = 2.4;
    const decay = 11;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(0.2, now + attack);
    out.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.random() - 0.5) * 0.6;
    out.connect(pan).connect(bus);

    let first: OscillatorNode | null = null;
    [
      { mult: 1, gain: 1 },
      { mult: 1.004, gain: 0.8 }, // beats against the fundamental
      { mult: 2.76, gain: 0.16 },
      { mult: 5.4, gain: 0.04 },
    ].forEach(({ mult, gain }) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = "sine";
      o.frequency.value = hz * mult;
      og.gain.value = gain * 0.55;
      o.connect(og).connect(out);
      o.start(now);
      o.stop(now + attack + decay + 0.2);
      if (!first) first = o;
    });
    (first as OscillatorNode | null)?.addEventListener("ended", () => {
      out.disconnect();
      pan.disconnect();
    });
  }, []);

  const schedule = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !busRef.current) return;

    const tick = () => {
      if (Math.random() < 0.14) {
        bowl(BOWL_HZ[Math.floor(Math.random() * BOWL_HZ.length)]);
      } else if (Math.random() > 0.22) {
        // A short phrase: wander a step or two along the scale, pulled gently
        // back toward the middle so it never runs off either end.
        const phrase = Math.random() < 0.35 ? 2 + Math.floor(Math.random() * 2) : 1;
        let when = ctx.currentTime;
        for (let i = 0; i < phrase; i++) {
          const pull = noteRef.current > 6 ? -1 : noteRef.current < 2 ? 1 : 0;
          const step = Math.floor(Math.random() * 5) - 2 + pull;
          noteRef.current = Math.max(0, Math.min(PLUCK_HZ.length - 1, noteRef.current + step));
          pluck(PLUCK_HZ[noteRef.current], when, i === 0 ? 0.16 : 0.12);
          when += 0.45 + Math.random() * 0.5;
        }
      }
      // else: a rest — silence is part of the music

      timerRef.current = window.setTimeout(tick, 2600 + Math.random() * 5200);
    };
    tick();
  }, [bowl, pluck]);

  const start = useCallback(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    ctx.resume();

    if (!masterRef.current) {
      const master = ctx.createGain();
      master.gain.value = 0.0001;
      const tone = ctx.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.value = 2400;
      // Echo: a delay fed back on itself, darkened each pass
      const echo = ctx.createDelay(1.5);
      echo.delayTime.value = 0.62;
      const fb = ctx.createGain();
      fb.gain.value = 0.34;
      const echoTone = ctx.createBiquadFilter();
      echoTone.type = "lowpass";
      echoTone.frequency.value = 1400;
      const bus = ctx.createGain();
      bus.gain.value = 1;
      bus.connect(tone);
      const echoSend = ctx.createGain();
      echoSend.gain.value = 0.5;
      bus.connect(echoSend).connect(echo);
      echo.connect(echoTone).connect(fb).connect(echo);
      echoTone.connect(tone);
      // Hall reverb: a generated, fast-fading noise impulse
      const len = Math.floor(ctx.sampleRate * 4.5);
      const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = impulse.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      const verb = ctx.createConvolver();
      verb.buffer = impulse;
      const verbSend = ctx.createGain();
      verbSend.gain.value = 0.55;
      const verbTone = ctx.createBiquadFilter();
      verbTone.type = "lowpass";
      verbTone.frequency.value = 2000;
      bus.connect(verbSend).connect(verb).connect(verbTone).connect(tone);
      tone.connect(master).connect(ctx.destination);
      masterRef.current = master;
      busRef.current = bus;

      // Drone: D2 and A2, slightly detuned, breathing slowly
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.05;
      const lfo = ctx.createOscillator();
      const lfoDepth = ctx.createGain();
      lfo.frequency.value = 0.07;
      lfoDepth.gain.value = 0.03;
      lfo.connect(lfoDepth).connect(droneGain.gain);
      lfo.start();
      const drone = [73.42, 73.9, 110.1].map((f) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        o.connect(droneGain);
        o.start();
        return o;
      });
      droneGain.connect(bus);
      nodesRef.current.push({
        stop: () => {
          drone.forEach((o) => o.stop());
          lfo.stop();
        },
      });
    }

    playingRef.current = true;
    rampTo(2);
    setPlaying(true);
    if (padTimerRef.current === null) playChord();
    if (timerRef.current === null) schedule();
  }, [schedule, playChord, rampTo]);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    playingRef.current = false;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (padTimerRef.current !== null) {
      clearTimeout(padTimerRef.current);
      padTimerRef.current = null;
    }
    setPlaying(false);
    if (!ctx || !master) return;
    // A definite fade to silence, then suspend the whole audio context: that
    // halts every oscillator and echo tail at once, so nothing keeps playing.
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 0.7);
    window.setTimeout(() => {
      if (!playingRef.current) ctx.suspend();
    }, 800);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  // Dip under the companion's voice, swell back after
  useEffect(() => {
    duckedRef.current = ducked;
    if (playing) rampTo(0.5);
  }, [ducked, playing, rampTo]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (padTimerRef.current !== null) clearTimeout(padTimerRef.current);
      nodesRef.current.forEach((n) => n.stop());
      ctxRef.current?.close();
    },
    []
  );

  return { playing, toggle, volume, setVolume };
}
