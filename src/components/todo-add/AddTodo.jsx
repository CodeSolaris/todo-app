import { useState, useRef } from "react";
import { TodoTextInput } from "./TodoTextInput";
import { DeadlineSelector } from "./DeadlineSelector";
import { MicrophoneButton } from "./MicrophoneButton";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";
import { useTodo } from "../../hooks/useTodo";

export const AddTodo = () => {
  const { handleAddTodo: onAddTodo } = useTodo();
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);

  const baseTextRef = useRef("");

  const handleTranscript = ({ final, interim }) => {
    const voice = [final, interim].filter(Boolean).join(" ");
    setText(
      baseTextRef.current ? `${baseTextRef.current} ${voice}`.trim() : voice
    );
  };

  const handleStop = (finalText) => {
    baseTextRef.current = baseTextRef.current
      ? `${baseTextRef.current} ${finalText}`.trim()
      : finalText;

    setText(baseTextRef.current);
  };

  const { isListening, isSupported, startListening, stopListening } =
    useVoiceRecognition({
      onTranscript: handleTranscript,
      onStop: handleStop,
    });

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      baseTextRef.current = text;
      startListening();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddTodo(text, deadline);
    setText("");
    baseTextRef.current = "";
    setDeadline("");
    setShowDeadlineInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-3 items-start ml-2">
        {isSupported && (
          <MicrophoneButton
            isListening={isListening}
            onToggle={handleVoiceToggle}
          />
        )}

        <div className="flex-1">
          <TodoTextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isListening}
          />
          <DeadlineSelector
            deadline={deadline}
            setDeadline={setDeadline}
            showDeadlineInput={showDeadlineInput}
            setShowDeadlineInput={setShowDeadlineInput}
          />
        </div>
      </div>
    </form>
  );
};
