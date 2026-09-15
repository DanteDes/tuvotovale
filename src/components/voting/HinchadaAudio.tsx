"use client";

import { useEffect, useRef, useState } from "react";

import { OperationFailedError } from "@/lib/errors";

interface HinchadaAudioProps {
  slug: string;
}

const HINCHADA_SOUNDS: Record<string, string> = {
  boca: "/sounds/hinchada-boca.mp3",
  river: "/sounds/hinchada-river.mp3",
};

const BUTTON_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  boca: { bg: "#003f8a", text: "#FFD700", border: "#FFD700" },
  river: { bg: "#CC0000", text: "#ffffff", border: "#CC0000" },
};
const DEFAULT_BTN = { bg: "#FFD700", text: "#0a0f1e", border: "#FFD700" };

/**
 * The browser's autoplay policy rejects `play()` with a `NotAllowedError` until the user has
 * interacted with the page. That is this component's normal path, not a failure — `unlocked`
 * exists to model it. Anything else is a genuine playback fault and is surfaced rather than
 * swallowed.
 */
function playHinchada(audio: HTMLAudioElement) {
  audio.play().catch((cause: unknown) => {
    if (cause instanceof DOMException && cause.name === "NotAllowedError") return;
    throw new OperationFailedError("No se pudo reproducir el audio de la hinchada.");
  });
}

export default function HinchadaAudio({ slug }: HinchadaAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  // Cargar/cambiar audio cuando cambia el slug
  useEffect(() => {
    const src = HINCHADA_SOUNDS[slug];
    if (!src) return;

    audioRef.current?.pause();
    const audio = new Audio(src);
    audio.volume = 0.4;
    audioRef.current = audio;

    if (unlocked && !muted) playHinchada(audio);

    return () => {
      audio.pause();
    };
  }, [slug, unlocked, muted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cualquier click en la página desbloquea el audio
  useEffect(() => {
    if (unlocked) return;
    function unlock() {
      setUnlocked(true);
      if (audioRef.current) playHinchada(audioRef.current);
    }
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [unlocked]);

  // Mute / unmute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !unlocked) return;
    if (muted) {
      audio.pause();
    } else {
      playHinchada(audio);
    }
  }, [muted, unlocked]);

  function handleMuteToggle(e: React.MouseEvent) {
    e.stopPropagation(); // no dispara el unlock global dos veces
    if (!unlocked) {
      setUnlocked(true);
      if (audioRef.current) playHinchada(audioRef.current);
      return;
    }
    setMuted((prev) => !prev);
  }

  const s = BUTTON_STYLES[slug] ?? DEFAULT_BTN;
  const label = !unlocked ? "▶  Escuchar hinchada" : muted ? "🔇  Sin sonido" : "🔊  Con sonido";

  return (
    <button
      type="button"
      onClick={handleMuteToggle}
      className="mt-4 cursor-pointer rounded-full border-2 px-5 py-2 font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:scale-105"
      style={{
        backgroundColor: s.bg,
        color: s.text,
        borderColor: s.border,
        fontFamily: "var(--font-oswald), Oswald, sans-serif",
      }}
    >
      {label}
    </button>
  );
}
