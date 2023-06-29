import { useEffect, useRef, useState } from "react";

export const useAudio = (audio = new Audio()) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(Object.freeze(audio));

  useEffect(() => {
    const play = () => setIsPlaying(true);
    const stop = () => setIsPlaying(false);

    audioRef.current.addEventListener("play", play);
    audioRef.current.addEventListener("ended", stop);
    audioRef.current.addEventListener("error", stop);
    audioRef.current.addEventListener("pause", stop);

    return () => {
      audioRef.current.removeEventListener("play", play);
      audioRef.current.removeEventListener("ended", stop);
      audioRef.current.removeEventListener("error", stop);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioRef.current.removeEventListener("pause", stop);
    };
  }, []);

  return [isPlaying, audioRef.current] as const;
};
