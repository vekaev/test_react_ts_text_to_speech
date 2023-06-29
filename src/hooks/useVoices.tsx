import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ttsService } from "../services/TextToSpeech.service";

import { SpeechVoice } from "../types";

const defaultVoices: SpeechVoice[] = [ttsService.DEFAULT_VOICE];

export const useVoices = () => {
  const [isAscending, setIsAscending] = useState(true);
  const { data = defaultVoices } = useQuery<SpeechVoice[]>({
    queryKey: ["audioVoices"],
    queryFn: ttsService.getVoices,
    staleTime: Infinity,
  });

  const sortedVoices = useMemo(() => {
    return isAscending
      ? data.toSorted((a, b) => a.name.localeCompare(b.name))
      : data.toSorted((a, b) => b.name.localeCompare(a.name));
  }, [data, isAscending]);

  return {
    voices: data,
    isAscending,
    sortedVoices,
    toggleSort: () => setIsAscending((prev) => !prev),
  };
};
