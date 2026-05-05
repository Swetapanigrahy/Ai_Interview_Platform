import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function Interview() {
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState("");   // 🔥 real-time speaking
  const [finalText, setFinalText] = useState(""); // 🔥 final answer

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    // 🔥 IMPORTANT SETTINGS
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // 🎯 RESULT HANDLER (REAL-TIME FIX)
    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // 🔥 SHOW LIVE TEXT IMMEDIATELY
      setLiveText(interim);

      // 🔥 SAVE FINAL TEXT
      if (finalTranscript) {
        setFinalText((prev) => prev + finalTranscript);
      }
    };

    // 🔥 AUTO RESTART (MOBILE FIX)
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // 🎤 START LISTENING
  const startListening = async () => {
    try {
      // 🔥 Fix mobile permission delay
      await navigator.mediaDevices.getUserMedia({ audio: true });

      setIsListening(true);
      recognitionRef.current.start();
    } catch (err) {
      console.error("Mic permission error:", err);
    }
  };

  // 🛑 STOP LISTENING
  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">AI Interview</h2>

      {/* 🎤 BUTTON */}
      <div className="mb-4">
        {!isListening ? (
          <button
            onClick={startListening}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start Speaking
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        )}
      </div>

      {/* 📝 OUTPUT */}
      <div className="border p-4 rounded bg-gray-50 min-h-[120px]">
        <p className="text-black">
          {finalText}
          <span className="text-gray-400">{liveText}</span>
        </p>
      </div>
    </div>
  );
}
