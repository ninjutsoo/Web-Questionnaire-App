import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

function SpeechReader({ text }) {
  const [status, setStatus] = useState('');

  const speakText = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setStatus('Speech synthesis is not supported in this browser.');
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
        setStatus('');
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setStatus('Unable to play speech. Your browser may have blocked audio.');
      }
    };

    loadAndSpeak();
  };

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      <Tooltip title="Hear this question read aloud">
        <button
          type="button"
          onClick={speakText}
          style={{
            background: '#fff',
            border: '2px solid var(--rme-review)',
            borderRadius: 8,
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--rme-review)',
            fontSize: 16,
            fontWeight: 700,
            minHeight: 44,
            minWidth: 96,
            whiteSpace: 'nowrap'
          }}
          aria-label="Listen to this question"
        >
          <SoundOutlined style={{ fontSize: 18 }} aria-hidden="true" />
          <span>Listen</span>
        </button>
      </Tooltip>
      {status && (
        <span role="status" style={{ fontSize: 14, color: 'var(--rme-alert)' }}>
          {status}
        </span>
      )}
    </span>
  );
}

export default SpeechReader; 
