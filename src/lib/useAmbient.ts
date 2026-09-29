"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Generative zen ambience, synthesised live with the Web Audio API — no audio
// files (the repo ships none, by design), so nothing to license or download.
// A soft D-major-pentatonic bed: a low drone that slowly swells, sparse plucked
// notes with long tails, and an occasional singing-bowl tone, all through a
// darkened echo so it sits behind the ritual rather than on top of it.
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

  const schedule = useCallback(() => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return;

    const now = ctx.currentTime;
    const bowl = Math.random() < 0.18;
    const hz = bowl
      ? BOWL_HZ[Math.floor(Math.random() * BOWL_HZ.length)]
      : PLUCK_HZ[Math.floor(Math.random() * PLUCK_HZ.length)];
    const attack = bowl ? 1.4 : 0.012;
    const decay = bowl ? 9 : 4.5;
    const peak = bowl ? 0.22 : 0.16;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
    g.connect(bus);

    // Fundamental plus a quiet upper partial gives a struck, wooden-bell tone
    const oscs = [
      { type: "sine" as const, mult: 1, gain: 1 },
      { type: "triangle" as const, mult: 2.005, gain: 0.25 },
    ].map(({ type, mult, gain }) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = type;
      o.frequency.value = hz * mult;
      og.gain.value = gain;
      o.connect(og).connect(g);
      o.start(now);
      o.stop(now + attack + decay + 0.2);
      return o;
    });
    oscs[0].onended = () => g.disconnect();

    timerRef.current = window.setTimeout(schedule, 2200 + Math.random() * 4800);
  }, []);

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
      fb.gain.value = 0.42;
      const echoTone = ctx.createBiquadFilter();
      echoTone.type = "lowpass";
      echoTone.frequency.value = 1400;
      const bus = ctx.createGain();
      bus.gain.value = 1;
      bus.connect(tone);
      bus.connect(echo);
      echo.connect(echoTone).connect(fb).connect(echo);
      echoTone.connect(tone);
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
    if (timerRef.current === null) schedule();
  }, [schedule, rampTo]);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    playingRef.current = false;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
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
      nodesRef.current.forEach((n) => n.stop());
      ctxRef.current?.close();
    },
    []
  );

  return { playing, toggle, volume, setVolume };
}
