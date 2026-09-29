import { useEffect, useState } from "react";

// Keeps the screen on while `active` — a phone that dims and locks halfway
// through a steep hides the countdown and, on some browsers, throttles it.
// The browser drops the lock on its own whenever the tab is hidden, so it is
// re-requested when the tab comes back. Returns whether a lock is actually
// held right now (false where the Screen Wake Lock API is unsupported or the
// request was refused), so the UI only claims what is true.
export function useWakeLock(active: boolean): boolean {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    async function acquire() {
      if (document.visibilityState !== "visible") return;
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          lock.release().catch(() => {});
          return;
        }
        sentinel = lock;
        lock.addEventListener("release", () => {
          if (sentinel === lock) sentinel = null;
          setHeld(false);
        });
        setHeld(true);
      } catch {
        setHeld(false);
      }
    }

    function onVisibility() {
      if (document.visibilityState === "visible" && !sentinel) acquire();
    }

    acquire();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      sentinel?.release().catch(() => {});
      sentinel = null;
    };
  }, [active]);

  return active && held;
}
