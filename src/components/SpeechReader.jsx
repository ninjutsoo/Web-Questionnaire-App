import React from 'react';
import { SoundOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

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
    <Tooltip title="Click to hear this question read aloud">
      <button
        onClick={speakText}
        style={{
          marginLeft: 4,
          background: 'rgba(24, 144, 255, 0.1)',
          border: '1px solid rgba(24, 144, 255, 0.2)',
          borderRadius: 6,
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          color: '#1890ff',
          fontSize: 10,
          fontWeight: 600,
          transition: 'all 0.2s ease',
          minWidth: 48,
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(24, 144, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.2)';
        }}
        aria-label="Read question aloud"
      >
        <SoundOutlined style={{ fontSize: 16 }} />
        <span style={{ lineHeight: 1, whiteSpace: 'nowrap' }}>Listen</span>
      </button>
    </Tooltip>
  );
}

export default SpeechReader; 