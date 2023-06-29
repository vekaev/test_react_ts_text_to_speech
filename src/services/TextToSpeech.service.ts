import axios from "axios";
import { GetAudioConfig, ITextToSpeechService, SpeechVoice } from "../types";

const googleCloudAxios = axios.create({
  baseURL: "https://texttospeech.googleapis.com/v1",
  params: {
    key:
      import.meta.env.GOOGLE_API_KEY ||
      "AIzaSyDw2BCPmsUFl7fi0ABgqVKxC8P4fnu-Voc",
  },
});

export class GoogleCloudTextToSpeechService implements ITextToSpeechService {
  DEFAULT_VOICE: SpeechVoice = {
    lang: "es-US",
    name: "es-US-Standard-A",
  };

  async getVoices(): Promise<SpeechVoice[]> {
    return googleCloudAxios
      .get<{ voices: { name: string; languageCodes: string[] }[] }>(`/voices`)
      .then(({ data }) =>
        data.voices.map((voice) => ({
          name: voice.name,
          lang: voice.languageCodes[0],
        }))
      );
  }

  audioCache: Record<string, HTMLAudioElement> = {};

  async getAudio(
    text: string,
    config?: GetAudioConfig
  ): Promise<HTMLAudioElement> {
    const key = JSON.stringify({ text, ...config });

    if (!this.audioCache[key]) {
      const { data } = await googleCloudAxios.post<{ audioContent: string }>(
        "/text:synthesize",
        {
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: config?.rate || 1,
            pitch: config?.pitch || 0,
          },
          input: {
            text,
          },
          voice: {
            name: config?.voice?.name || this.DEFAULT_VOICE.name,
            languageCode: config?.voice?.lang || this.DEFAULT_VOICE.lang,
          },
        }
      );

      this.audioCache[key] = new Audio(
        `data:audio/mp3;base64,${data.audioContent}`
      );
    }

    return this.audioCache[key];
  }
}

export class BrowserTextToSpeechService implements ITextToSpeechService {
  DEFAULT_VOICE = {
    lang: "en-US",
    name: "Samantha",
  };

  getVoices = () =>
    new Promise<SpeechVoice[]>((resolve) => {
      let voices = speechSynthesis.getVoices();

      if (voices.length) return resolve(voices);

      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    });

  async getAudio(
    text: string
    // config?: GetAudioConfig
  ): Promise<HTMLAudioElement> {
    const utterance = new SpeechSynthesisUtterance(text);
    // utterance.voice = config?.voice || this.DEFAULT_VOICE;
    // utterance.pitch = config?.pitch || 1;
    // utterance.rate = config?.rate || 1;

    // return utterance.output;

    const audio = new Audio();
    audio.src = utterance.text;

    return audio;
  }
}

export const ttsService = new GoogleCloudTextToSpeechService();
