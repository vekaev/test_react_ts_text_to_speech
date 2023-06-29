export interface SpeechVoice {
  name: string;
  lang: string;
}

export interface GetAudioConfig {
  pitch?: number;
  rate?: number;
  voice?: SpeechVoice;
}

export interface ITextToSpeechService {
  getVoices: () => Promise<SpeechVoice[]>;
  getAudio: (
    text: string,
    config?: GetAudioConfig
  ) => Promise<HTMLAudioElement>;
  DEFAULT_VOICE: SpeechVoice;
}
