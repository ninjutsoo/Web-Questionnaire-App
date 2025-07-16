import React from 'react';
import { SoundOutlined } from '@ant-design/icons';

function SpeechReader({ text }) {
  const speakText = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }
    // Stop any currently playing speech
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // slower for elder users
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    // Helper to pick the best voice
    const pickBestVoice = (voices) => {
      // Prefer Google, Microsoft, Apple, Neural, Natural, en-US
      const preferred =
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Apple') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.toLowerCase().includes('neural') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.toLowerCase().includes('natural') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en'));
      return preferred || voices[0];
    };

    // Ensure voices are loaded (may be async on some browsers)
    const loadAndSpeak = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) {
        // Try again after a short delay
        setTimeout(loadAndSpeak, 100);
        return;
      }
      utterance.voice = pickBestVoice(voices);
      try {
        synth.speak(utterance);
      } catch (err) {
        alert('Unable to play speech. Your browser may have blocked audio or does not support speech synthesis.');
      }
    };

    loadAndSpeak();
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