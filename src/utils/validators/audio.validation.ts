import { z } from "zod";

export const AUDIO_FORM_MIN_MAX = {
  text: {
    max: 255,
  },
  pitch: {
    min: 0,
    max: 10,
  },
  rate: {
    min: 0.5,
    max: 2,
  },
};

export const formSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Text is required")
    .max(
      AUDIO_FORM_MIN_MAX.text.max,
      `Max length is ${AUDIO_FORM_MIN_MAX.text.max} characters`
    )
    .regex(
      /^[a-zA-Z@~`!@#$%^&*()_=+\\\\';:"\\/?>.<,-\s]+$/i,
      "Only english characters are allowed"
    ),
  pitch: z
    .number()
    .min(AUDIO_FORM_MIN_MAX.pitch.min)
    .max(AUDIO_FORM_MIN_MAX.pitch.max),
  rate: z
    .number()
    .min(AUDIO_FORM_MIN_MAX.rate.min)
    .max(AUDIO_FORM_MIN_MAX.rate.max),
  voice: z.object({
    name: z.string(),
    lang: z.string(),
  }),
});

export type FormSchemaType = z.infer<typeof formSchema>;
