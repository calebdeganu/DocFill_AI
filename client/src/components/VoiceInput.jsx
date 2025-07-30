import { useState, useRef } from 'react';

function VoiceInput({ setFields }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Your browser does not support voice input.');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Transcript:', transcript);

        if (transcript.includes('name')) {
          const name = transcript.match(/name (.*)/)?.[1] || '';
          setFields((prev) =>
            prev.map((field) =>
              field.label.toLowerCase().includes('name') ? { ...field, value: name } : field
            )
          );
        } else if (transcript.includes('date')) {
          const date = transcript.match(/date (.*)/)?.[1] || '';
          setFields((prev) =>
            prev.map((field) =>
              field.label.toLowerCase().includes('date') ? { ...field, value: date } : field
            )
          );
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Voice input failed. Please try again.');
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }

    recognitionRef.current.start();
    setIsRecording(true);
  };

  return (
    <div className="mt-4">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={`px-4 py-2 rounded-lg ${
          isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isRecording ? 'Recording...' : 'Start Voice Input'}
      </button>
    </div>
  );
}

export default VoiceInput;
