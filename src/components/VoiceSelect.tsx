import { memo, useMemo } from "react";
import { Button, Select, SelectProps } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";

import { useVoices } from "../hooks/useVoices";

import { SpeechVoice } from "../types";

export const VoiceSelect = memo(
  ({
    onChange,
    ...props
  }: Omit<SelectProps, "onChange"> & {
    onChange: (voice: SpeechVoice) => void;
  }) => {
    const { voices, sortedVoices, isAscending, toggleSort } = useVoices();

    const handleSelect = useMemo(() => {
      const voicesDir = voices.reduce((acc, voice) => {
        acc[voice.name] = voice;

        return acc;
      }, {} as Record<string, SpeechVoice>);

      return (value: string) => {
        onChange(voicesDir[value]);
      };
    }, [voices, onChange]);

    return (
      <Select
        {...props}
        onChange={handleSelect}
        defaultActiveFirstOption
        style={{ width: "100%" }}
        disabled={voices.length <= 1 || props.disabled}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Button
              onClick={toggleSort}
              icon={
                isAscending ? (
                  <SortAscendingOutlined />
                ) : (
                  <SortDescendingOutlined />
                )
              }
              style={{ marginTop: 10, width: "100%" }}
            >
              Sort
            </Button>
          </div>
        )}
      >
        {sortedVoices.map((voice, index) => (
          <Select.Option key={voice.name + index} value={voice.name}>
            {voice.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
