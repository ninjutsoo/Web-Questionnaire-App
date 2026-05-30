import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, Input, Space, Typography, Row, Col, Button, Alert, Tooltip } from 'antd';
import { AudioOutlined, CheckOutlined, InfoCircleOutlined, QrcodeOutlined } from '@ant-design/icons';
import SpeechReader from '../../components/SpeechReader';
import MedicationScanner from '../../components/MedicationScanner';
import { getSectionMeta } from '../../constants/rmeDesign';

const { Title, Text } = Typography;
const { TextArea } = Input;

const VOICE_IDLE_STOP_MS = 12000;

const LIKERT_LABELS = {
  happiness: { min: 'Not at all happy', max: 'Very happy' },
  memory: { min: 'Not worried', max: 'Very worried' },
  sleep: { min: 'Very poor sleep', max: 'Excellent sleep' }
};

const DEFAULT_LIKERT_LABELS = { min: 'Low', max: 'High' };

const LIKERT_BUTTON_OPTIONS = {
  happiness: [
    { value: 1, label: 'Not at all happy' },
    { value: 3, label: 'A little happy' },
    { value: 5, label: 'Neutral' },
    { value: 8, label: 'Happy' },
    { value: 10, label: 'Very happy' }
  ],
  memory: [
    { value: 1, label: 'Not worried' },
    { value: 3, label: 'A little worried' },
    { value: 5, label: 'Somewhat worried' },
    { value: 8, label: 'Worried' },
    { value: 10, label: 'Very worried' }
  ],
  sleep: [
    { value: 1, label: 'Very poor sleep' },
    { value: 3, label: 'Poor sleep' },
    { value: 5, label: 'Okay sleep' },
    { value: 8, label: 'Good sleep' },
    { value: 10, label: 'Excellent sleep' }
  ]
};

const MEDICATION_CATEGORIES = [
  'Blood Pressure',
  'Diabetes',
  'Heart',
  'Pain',
  'Dementia Medication',
  'Mental Health',
  'Other'
];

const normalizeLikertValue = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  if (value > 10) {
    const scaled = (value / 100) * 9 + 1;
    return Math.min(10, Math.max(1, Math.round(scaled)));
  }
  if (value < 1) return 1;
  return Math.min(10, Math.round(value));
};

const normalizeSliderResponses = (source, sectionQuestions) => {
  const normalized = { ...source };
  Object.entries(sectionQuestions).forEach(([questionKey, question]) => {
    if (question?.type !== 'slider') return;
    const adjusted = normalizeLikertValue(source?.[questionKey]);
    if (typeof adjusted === 'number') {
      normalized[questionKey] = adjusted;
    } else {
      delete normalized[questionKey];
    }
  });
  return normalized;
};

function ChoiceButtonGroup({ label, options = [], selected, multiple = false, color, onChange }) {
  const selectedValues = multiple ? selected || [] : selected ? [selected] : [];

  const toggle = (value) => {
    if (!multiple) {
      onChange(value);
      return;
    }
    const next = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(next);
  };

  return (
    <div role="group" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        const isSelected = selectedValues.includes(value);
        return (
          <button
            key={value}
            type="button"
            className={`rme-chip ${isSelected ? 'rme-chip-selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => toggle(value)}
            style={{
              borderColor: isSelected ? color : 'var(--rme-border)',
              color: isSelected ? color : 'var(--rme-text)',
              background: isSelected ? '#fff' : '#fff',
              flex: '1 1 180px'
            }}
          >
            {isSelected && <CheckOutlined aria-hidden="true" style={{ marginRight: 8 }} />}
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
}

const FourMSection = forwardRef(({ section, questionnaire, responses, onLocalChange, focusQuestionKey, onFocusHandled }, ref) => {
  const [localResponses, setLocalResponses] = useState(responses || {});
  const [isListening, setIsListening] = useState({});
  const [recognition, setRecognition] = useState(null);
  const [voiceMessage, setVoiceMessage] = useState('');
  const idleStopTimerRef = useRef(null);
  const activeVoiceTargetRef = useRef(null);
  const questionRefs = useRef({});
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannerTargetQuestion, setScannerTargetQuestion] = useState('q1');

  const config = getSectionMeta(section);

  useEffect(() => {
    const sectionQuestions = questionnaire?.sections?.[section]?.questions || {};
    const normalized = normalizeSliderResponses(responses || {}, sectionQuestions);
    setLocalResponses(normalized);
  }, [responses, section, questionnaire]);

  useImperativeHandle(ref, () => ({
    getCurrentData: () => localResponses
  }));

  useEffect(() => {
    if (!focusQuestionKey || !questionRefs.current[focusQuestionKey]) return;
    const target = questionRefs.current[focusQuestionKey];
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
    if (onFocusHandled) onFocusHandled();
  }, [focusQuestionKey, onFocusHandled]);

  const questions = questionnaire?.sections?.[section]?.questions || {};
  const sortedQuestionEntries = Object.entries(questions).sort(([keyA], [keyB]) => {
    if (section === 'mind') {
      const sliderOrder = ['happiness', 'memory', 'sleep'];
      const indexA = sliderOrder.indexOf(keyA);
      const indexB = sliderOrder.indexOf(keyB);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
    }

    if (section === 'mobility') {
      if (keyA === 'mobilityType') return -1;
      if (keyB === 'mobilityType') return 1;
    }

    const numA = keyA.match(/\d+/)?.[0];
    const numB = keyB.match(/\d+/)?.[0];
    if (numA && numB) return parseInt(numA, 10) - parseInt(numB, 10);
    return keyA.localeCompare(keyB);
  });

  const updateLocalResponses = (producer) => {
    setLocalResponses((prev) => {
      const next = typeof producer === 'function' ? producer(prev) : producer;
      return next;
    });
    if (onLocalChange) onLocalChange();
  };

  const handleSliderChange = (questionKey, value) => {
    updateLocalResponses((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleTagChange = (questionKey, selectedTags) => {
    updateLocalResponses((prev) => ({
      ...prev,
      [questionKey]: {
        ...(prev[questionKey] || {}),
        tags: selectedTags
      }
    }));
  };

  const handleTextChange = (questionKey, text) => {
    updateLocalResponses((prev) => ({
      ...prev,
      [questionKey]: {
        ...(prev[questionKey] || {}),
        text
      }
    }));
  };

  const handleMobilityTypeChange = (questionKey, value) => {
    updateLocalResponses((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleMedicationEntryChange = (index, field, value) => {
    updateLocalResponses((prev) => {
      const entries = [...(prev.medicationEntries || [])];
      entries[index] = { ...(entries[index] || {}), [field]: value };
      return { ...prev, medicationEntries: entries };
    });
  };

  const addMedicationEntry = () => {
    updateLocalResponses((prev) => ({
      ...prev,
      medicationEntries: [
        ...(prev.medicationEntries || []),
        { category: '', name: '', dose: '', frequency: '', notes: '' }
      ]
    }));
  };

  const removeMedicationEntry = (index) => {
    updateLocalResponses((prev) => ({
      ...prev,
      medicationEntries: (prev.medicationEntries || []).filter((_, entryIndex) => entryIndex !== index)
    }));
  };

  const appendDictationText = (targetKey, cleaned) => {
    if (targetKey.startsWith('medicationEntries.')) {
      const [, rawIndex, field] = targetKey.split('.');
      const index = Number(rawIndex);
      updateLocalResponses((prev) => {
        const entries = [...(prev.medicationEntries || [])];
        const current = entries[index]?.[field] || '';
        entries[index] = {
          ...(entries[index] || {}),
          [field]: current ? `${current} ${cleaned}` : cleaned
        };
        return { ...prev, medicationEntries: entries };
      });
      return;
    }

    updateLocalResponses((prev) => {
      const currentText = prev[targetKey]?.text || '';
      return {
        ...prev,
        [targetKey]: {
          ...(prev[targetKey] || {}),
          text: currentText ? `${currentText} ${cleaned}` : cleaned
        }
      };
    });
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    } else {
      setVoiceMessage('Voice input is not supported in this browser. You can still type your answer.');
    }
  }, []);

  const stopListening = () => {
    if (!recognition) return;
    if (idleStopTimerRef.current) {
      clearTimeout(idleStopTimerRef.current);
      idleStopTimerRef.current = null;
    }
    try {
      recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const startListening = (targetKey) => {
    if (!recognition) {
      setVoiceMessage('Voice input is not supported in this browser. You can still type your answer.');
      return;
    }

    if (isListening[targetKey]) {
      stopListening();
      return;
    }

    activeVoiceTargetRef.current = targetKey;
    setVoiceMessage('Recording. Speak now.');
    setIsListening({ [targetKey]: true });

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (!res?.isFinal) continue;
        const text = res?.[0]?.transcript ?? '';
        if (text) finalTranscript += text;
      }

      const cleaned = finalTranscript.trim();
      if (cleaned) {
        appendDictationText(activeVoiceTargetRef.current || targetKey, cleaned);
      }

      if (idleStopTimerRef.current) clearTimeout(idleStopTimerRef.current);
      idleStopTimerRef.current = setTimeout(stopListening, VOICE_IDLE_STOP_MS);
    };

    recognition.onerror = (event) => {
      if (idleStopTimerRef.current) {
        clearTimeout(idleStopTimerRef.current);
        idleStopTimerRef.current = null;
      }
      setIsListening({});
      const message =
        event.error === 'not-allowed'
          ? 'Microphone permission is needed for dictation. You can enable it in your browser settings.'
          : 'Voice input stopped. You can try Dictate again or type your answer.';
      setVoiceMessage(message);
    };

    recognition.onend = () => {
      if (idleStopTimerRef.current) {
        clearTimeout(idleStopTimerRef.current);
        idleStopTimerRef.current = null;
      }
      setIsListening({});
      activeVoiceTargetRef.current = null;
      setVoiceMessage('Voice input stopped. Your dictated text has been kept.');
    };

    if (idleStopTimerRef.current) {
      clearTimeout(idleStopTimerRef.current);
      idleStopTimerRef.current = null;
    }

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening({});
      setVoiceMessage('Voice input could not start. Check microphone permission and try again.');
    }
  };

  const DictateButton = ({ targetKey, context }) => {
    const recording = Boolean(isListening[targetKey]);
    return (
      <Button
        icon={<AudioOutlined />}
        onClick={() => startListening(targetKey)}
        className={recording ? 'rme-button-danger' : 'rme-button-secondary'}
        aria-label={`${recording ? 'Stop dictation for' : 'Dictate answer for'} ${context}`}
        style={{
          borderColor: recording ? 'var(--rme-alert)' : config.color,
          color: recording ? '#fff' : config.color,
          background: recording ? 'var(--rme-alert)' : '#fff',
          minHeight: 44,
          fontWeight: 700
        }}
      >
        {recording ? 'Tap to Stop' : 'Dictate'}
      </Button>
    );
  };

  const handleMedicationScanned = (scannedValue) => {
    let displayText = '';
    if (typeof scannedValue === 'object' && scannedValue !== null) {
      const { brandName, genericName, manufacturer, dosageForm, strength, upc, ndc } = scannedValue;
      displayText = [
        brandName && `Brand: ${brandName}`,
        genericName && `Generic: ${genericName}`,
        manufacturer && `Manufacturer: ${manufacturer}`,
        dosageForm && `Form: ${dosageForm}`,
        strength && `Strength: ${strength}`,
        ndc && `NDC: ${ndc}`,
        upc && `UPC: ${upc}`
      ].filter(Boolean).join(' | ');
      if (!displayText) displayText = JSON.stringify(scannedValue, null, 2);
    } else {
      displayText = scannedValue;
    }
    const targetQuestion = scannerTargetQuestion || 'q1';
    const currentText = localResponses[targetQuestion]?.text || '';
    handleTextChange(targetQuestion, currentText ? `${currentText}\n${displayText}` : displayText);
  };

  const questionTitle = (question, index) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <SpeechReader text={question.text} />
      <span style={{ flex: '1 1 260px', fontSize: 18, lineHeight: 1.45, color: 'var(--rme-text)' }}>
        {`${index + 1}. ${question.text}`}
      </span>
    </div>
  );

  const cardProps = (questionKey, question, index) => ({
    key: questionKey,
    className: 'rme-question-card',
    ref: (node) => {
      if (node) questionRefs.current[questionKey] = node;
    },
    tabIndex: -1,
    style: {
      marginBottom: 16,
      border: `2px solid ${config.border}`,
      borderRadius: 8,
      width: '100%'
    },
    title: questionTitle(question, index)
  });

  const renderMedicationEntries = () => {
    if (section !== 'medication') return null;
    const entries = localResponses.medicationEntries || [];

    return (
      <Card
        ref={(node) => {
          if (node) questionRefs.current.medicationEntries = node;
        }}
        tabIndex={-1}
        style={{ marginBottom: 18, border: `3px solid ${config.color}`, borderRadius: 8 }}
        title={<span style={{ fontSize: 20, color: config.color }}>Medication Details</span>}
      >
        <Text style={{ display: 'block', fontSize: 16, marginBottom: 14 }}>
          Add medications by category first. Exact name, dose, frequency, and notes are optional.
        </Text>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {entries.map((entry, index) => (
            <div
              key={`med-entry-${index}`}
              style={{
                border: '2px solid #d8dee6',
                borderRadius: 8,
                padding: 14,
                background: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <Text strong style={{ fontSize: 18 }}>Medication {index + 1}</Text>
                <Button danger onClick={() => removeMedicationEntry(index)} style={{ minHeight: 44 }}>
                  Remove Medication
                </Button>
              </div>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 8 }}>Category</Text>
                  <ChoiceButtonGroup
                    label={`Medication ${index + 1} category`}
                    options={MEDICATION_CATEGORIES}
                    selected={entry.category}
                    color={config.color}
                    onChange={(value) => handleMedicationEntryChange(index, 'category', value)}
                  />
                </div>
                {['name', 'dose', 'frequency', 'notes'].map((field) => {
                  const label = {
                    name: 'Medication name (optional)',
                    dose: 'Dose (optional)',
                    frequency: 'Frequency (optional)',
                    notes: 'Notes or concerns (optional)'
                  }[field];
                  return (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                        {label}
                      </label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Input
                          size="large"
                          value={entry[field] || ''}
                          onChange={(event) => handleMedicationEntryChange(index, field, event.target.value)}
                          style={{ flex: '1 1 260px', fontSize: 16, minHeight: 44 }}
                        />
                        <DictateButton
                          targetKey={`medicationEntries.${index}.${field}`}
                          context={`medication ${index + 1} ${field}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </Space>
            </div>
          ))}
          <Button
            type="default"
            onClick={addMedicationEntry}
            className="rme-button-secondary"
            style={{ borderColor: config.color, color: config.color, minHeight: 48, fontSize: 16, fontWeight: 700 }}
          >
            Add Medication
          </Button>
        </Space>
      </Card>
    );
  };

  const renderQuestion = (questionKey, question, index) => {
    if (question.type === 'slider') {
      const labels = LIKERT_LABELS[questionKey] || {
        min: question.scaleMinLabel || DEFAULT_LIKERT_LABELS.min,
        max: question.scaleMaxLabel || DEFAULT_LIKERT_LABELS.max
      };
      const rawValue = localResponses[questionKey];
      const hasValue = typeof rawValue === 'number';
      const displayValue = hasValue ? normalizeLikertValue(rawValue) : 5;
      const buttonOptions = LIKERT_BUTTON_OPTIONS[questionKey] || [
        { value: 1, label: labels.min },
        { value: 5, label: question.neutralLabel || 'Neutral' },
        { value: 10, label: labels.max }
      ];

      return (
        <Card {...cardProps(questionKey, question, index)}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={18}>
              <ChoiceButtonGroup
                label={question.text}
                options={buttonOptions}
                selected={hasValue ? displayValue : undefined}
                color={config.color}
                onChange={(value) => handleSliderChange(questionKey, value)}
              />
            </Col>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: hasValue ? config.color : '#4a5568' }}>
                {hasValue ? `${displayValue}/10` : 'Not answered yet'}
              </div>
            </Col>
          </Row>
        </Card>
      );
    }

    if (question.type === 'mobility_type') {
      const selectedType = localResponses[questionKey];
      const tips = question.tips?.[selectedType];

      return (
        <Card {...cardProps(questionKey, question, index)}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <ChoiceButtonGroup
              label="Select your mobility type"
              options={question.options || []}
              selected={selectedType}
              color={config.color}
              onChange={(value) => handleMobilityTypeChange(questionKey, value)}
            />
            {tips && (
              <Alert
                message={
                  <span style={{ fontWeight: 700, color: config.color }}>
                    <InfoCircleOutlined aria-hidden="true" /> {tips.title}
                  </span>
                }
                description={
                  <div style={{ fontSize: 16, lineHeight: 1.5 }}>
                    <p style={{ marginTop: 8 }}>{tips.content}</p>
                    <p style={{ marginBottom: 0, color: config.color, fontWeight: 600 }}>{tips.details}</p>
                  </div>
                }
                type="info"
                showIcon={false}
                style={{ border: `2px solid ${config.border}`, backgroundColor: config.bg }}
              />
            )}
          </Space>
        </Card>
      );
    }

    if (question.type === 'tag_text') {
      return (
        <Card {...cardProps(questionKey, question, index)}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: 16, marginBottom: 8, display: 'block' }}>
                Select what applies:
              </Text>
              <ChoiceButtonGroup
                label={question.text}
                options={question.tags || []}
                selected={localResponses[questionKey]?.tags || []}
                multiple
                color={config.color}
                onChange={(values) => handleTagChange(questionKey, values)}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 10, flexWrap: 'wrap' }}>
                <Text strong style={{ fontSize: 16 }}>Additional details:</Text>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {section === 'medication' && (questionKey === 'q1' || questionKey === 'q2') && (
                    <Tooltip title="Scan medication barcode or QR code">
                      <Button
                        icon={<QrcodeOutlined />}
                        onClick={() => {
                          setScannerTargetQuestion(questionKey);
                          setScannerVisible(true);
                        }}
                        style={{ borderColor: config.color, color: config.color, minHeight: 44, fontWeight: 700 }}
                      >
                        Scan
                      </Button>
                    </Tooltip>
                  )}
                  <DictateButton targetKey={questionKey} context={question.text} />
                </div>
              </div>
              <TextArea
                size="large"
                rows={3}
                placeholder="Add any additional thoughts..."
                value={localResponses[questionKey]?.text || ''}
                onChange={(event) => handleTextChange(questionKey, event.target.value)}
                style={{ fontSize: 16, width: '100%' }}
              />
            </div>
          </Space>
        </Card>
      );
    }

    return null;
  };

  return (
    <div style={{ padding: '16px 8px 96px', maxWidth: '100%', margin: 0 }}>
      <section
        style={{
          marginBottom: 18,
          backgroundColor: config.bg,
          padding: '16px',
          borderRadius: 8,
          border: `2px solid ${config.border}`
        }}
      >
        <Title level={2} style={{ color: config.color, marginBottom: 8, fontSize: 28, lineHeight: 1.25 }}>
          {config.label}
        </Title>
        <Text style={{ fontSize: 17, color: 'var(--rme-text)', lineHeight: 1.5 }}>
          {config.description}
        </Text>
      </section>

      {voiceMessage && (
        <Alert
          message={voiceMessage}
          type={voiceMessage.includes('not supported') || voiceMessage.includes('permission') ? 'warning' : 'info'}
          showIcon
          style={{ marginBottom: 16, fontSize: 16 }}
          role="status"
        />
      )}

      {renderMedicationEntries()}

      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {sortedQuestionEntries.map(([questionKey, question], index) =>
          renderQuestion(questionKey, question, index)
        )}
      </Space>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          backgroundColor: config.bg,
          borderRadius: 8,
          border: `2px solid ${config.border}`
        }}
      >
        <Text style={{ fontSize: 16, color: 'var(--rme-text)', lineHeight: 1.5 }}>
          Share with your doctor: bring this information to medical visits. Tap Save when you want to keep your latest responses.
        </Text>
      </div>

      <MedicationScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onMedScanned={handleMedicationScanned}
      />
    </div>
  );
});

export default FourMSection;
