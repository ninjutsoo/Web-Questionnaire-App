import React from 'react';
import { SoundOutlined } from '@ant-design/icons';

function SpeechReader({ text }) {
  const speakText = () => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // slower for elder users
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    // Optional: choose a specific voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") || v.lang === "en-US");
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speakText}
      style={{
        marginLeft: 8,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        height: 24,
        width: 24,
        color: '#1890ff'
      }}
      aria-label="Read question aloud"
      title="Read question aloud"
    >
      <SoundOutlined style={{ fontSize: 20, color: '#1890ff' }} />
    </button>
  );
}

export default SpeechReader; 