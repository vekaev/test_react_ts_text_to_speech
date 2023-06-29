import { useCallback, useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

import { message, Button, Input, Slider, Alert, Form } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useAudio } from "./hooks/useAudio";
import { VoiceSelect } from "./components/VoiceSelect";
import { ttsService } from "./services/TextToSpeech.service";
import {
  AUDIO_FORM_MIN_MAX,
  FormSchemaType,
  formSchema,
} from "./utils/validators/audio.validation";
import { SpeechVoice } from "./types";

const defaultValues: FormSchemaType = {
  rate: 1,
  text: "",
  pitch: 0,
  voice: ttsService.DEFAULT_VOICE,
};

function App() {
  const textId = useId();
  const rateId = useId();
  const pitchId = useId();
  const voicesId = useId();

  const [isPlaying, audio] = useAudio();
  const [messageApi] = message.useMessage();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchemaType>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async ({
    text,
    ...config
  }) => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    try {
      audio.src = (await ttsService.getAudio(text, config)).src;

      audio.play();
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleSelect = useCallback(
    (voice: SpeechVoice) => {
      setValue("voice", voice, { shouldValidate: false });
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='text'
        control={control}
        render={({ field }) => (
          <Form.Item label='Text' htmlFor={textId}>
            <Input.TextArea
              {...field}
              showCount
              id={textId}
              disabled={isPlaying}
              aria-label='Enter text to speak'
              placeholder='Enter text to speak'
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={AUDIO_FORM_MIN_MAX.text.max}
              status={errors.text ? "error" : undefined}
              aria-invalid={errors.text ? "true" : "false"}
            />
          </Form.Item>
        )}
      />
      <Controller
        name='voice'
        control={control}
        render={({ field: { value } }) => (
          <Form.Item label='Voice' htmlFor={voicesId}>
            <VoiceSelect
              id={voicesId}
              value={value.name}
              disabled={isPlaying}
              onChange={handleSelect}
              defaultValue={value.name}
            />
          </Form.Item>
        )}
      />
      <Controller
        name='rate'
        control={control}
        render={({ field }) => (
          <Form.Item label='Rate' htmlFor={rateId}>
            <Slider
              {...field}
              id={rateId}
              included={false}
              disabled={isPlaying}
              {...AUDIO_FORM_MIN_MAX.rate}
              marks={{ 0.5: "0.5x", 1: "1x", 1.5: "1.5x", 2: "2x" }}
            />
          </Form.Item>
        )}
      />
      <Controller
        name='pitch'
        control={control}
        render={({ field }) => (
          <Form.Item label='Pitch' htmlFor={pitchId}>
            <Slider
              {...field}
              id={pitchId}
              included={false}
              disabled={isPlaying}
              {...AUDIO_FORM_MIN_MAX.pitch}
              marks={{ 0: "0", 2: "2", 4: "4", 6: "6", 8: "8", 10: "10" }}
            />
          </Form.Item>
        )}
      />
      <Button
        htmlType='submit'
        loading={isSubmitting}
        aria-label='Play or stop the audio'
        style={{ width: "100%", marginBottom: 12 }}
      >
        {isPlaying ? "Stop" : "Play"}
      </Button>
      <ErrorMessage
        name='text'
        errors={errors}
        render={({ message }) => (
          <Alert message={message} type='error' showIcon />
        )}
      />
    </form>
  );
}

export default App;
