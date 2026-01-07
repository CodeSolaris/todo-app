import { useState, useCallback, useRef, useEffect } from "react";

const checkSpeechRecognitionSupport = () => "webkitSpeechRecognition" in window;

export const useVoiceRecognition = ({ onTranscript, onStop }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(checkSpeechRecognitionSupport);

  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const isListeningRef = useRef(false);
  const sessionFinalRef = useRef("");

  // Refs for callbacks to avoid re-initializing effect
  const onTranscriptRef = useRef(onTranscript);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onStopRef.current = onStop;
  }, [onTranscript, onStop]);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ru-RU";

    const stopInternal = () => {
      if (!isListeningRef.current) return;

      isListeningRef.current = false;
      setIsListening(false);
      recognition.stop();

      onStopRef.current?.(sessionFinalRef.current.trim());
    };

    recognition.onresult = (event) => {
      if (!isListeningRef.current) return;

      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();

        if (result.isFinal) {
          sessionFinalRef.current += text + " ";
        } else {
          interim += text + " ";
        }
      }

      onTranscriptRef.current?.({
        final: sessionFinalRef.current.trim(),
        interim: interim.trim(),
      });

      if (sessionFinalRef.current || interim) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(stopInternal, 5000);
      }
    };

    recognition.onerror = () => stopInternal();
    recognition.onend = () => {};

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(silenceTimeoutRef.current);
      recognition.stop();
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    clearTimeout(silenceTimeoutRef.current);
    sessionFinalRef.current = "";

    isListeningRef.current = true;
    setIsListening(true);

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }, []);

  const stopListening = useCallback(() => {
    clearTimeout(silenceTimeoutRef.current);
    if (!isListeningRef.current) return;

    isListeningRef.current = false;
    setIsListening(false);
    recognitionRef.current?.stop();

    onStopRef.current?.(sessionFinalRef.current.trim());
  }, []);

  return { isListening, isSupported, startListening, stopListening };
};
