import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, Select, Input, Space, Typography, Row, Col, Button, Alert, Tooltip } from 'antd';
import { HeartOutlined, CarOutlined, MedicineBoxOutlined, StarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { AudioOutlined, QrcodeOutlined } from '@ant-design/icons';
import SpeechReader from '../../components/SpeechReader';
import MedicationScanner from '../../components/MedicationScanner';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Section configuration
const SECTION_CONFIG = {
  mind: {
    title: "🧠 Mentation",
    description: "Monitor your mental well-being by making note of changes in sleep, memory, mood, or stress.",
    icon: HeartOutlined,
    color: '#722ed1',
    backgroundColor: '#f9f0ff',
    borderColor: '#d3adf7',
    tipText: "Share With Your Doctor: Bring this information to every medical visit. Tracking your changes in one place helps your healthcare team provide you with 4M care. Don't forget to tap Save to save your responses.",
    tipColor: '#722ed1'
  },
  mobility: {
    title: "🚶‍♀️ Mobility",
    description: "Track how you are moving day to day. Log falls, changes in balance or strength, exercises you do, and any challenges with walking or movement.",
    icon: CarOutlined,
    color: '#fa541c',
    backgroundColor: '#fff2e8',
    borderColor: '#ffbb96',
    tipText: "Share With Your Doctor: Bring this information to every medical visit. Tracking your changes in one place helps your healthcare team provide you with 4M care. Don't forget to tap Save to save your mobility information.",
    tipColor: '#d46b08'
  },
  medication: {
    title: "💊 Medication",
    description: "Record all medications you take including prescriptions and over-the-counter medicines. Add notes if you notice side effects, questions, or concerns.",
    icon: MedicineBoxOutlined,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
    tipText: "Share With Your Doctor: Bring this information to every medical visit. Tracking your changes in one place helps your healthcare team provide you with 4M care. Don't forget to tap Save to save your medication information.",
    tipColor: '#096dd9'
  },
  matters: {
    title: "⭐ What Matters",
    description: "Keep track of what is important to you. Update your goals, concerns, and daily needs as they change.",
    icon: StarOutlined,
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    tipText: "Share With Your Doctor: Bring this information to every medical visit. Tracking your changes in one place helps your healthcare team provide you with 4M care. Don't forget to tap Save to save your preferences.",
    tipColor: '#389e0d'
  }
};

// Likert label helpers for slider questions
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

const normalizeLikertValue = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  if (value > 10) {
    const scaled = (value / 100) * 9 + 1; // map 0-100 legacy values into 1-10
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

const FourMSection = forwardRef(({ section, questionnaire, responses, onLocalChange }, ref) => {
  const [localResponses, setLocalResponses] = useState(responses || {});
  const [isListening, setIsListening] = useState({});
  const [recognition, setRecognition] = useState(null);
  const idleStopTimerRef = useRef(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  const config = SECTION_CONFIG[section];

  useEffect(() => {
    const sectionQuestions = questionnaire?.sections?.[section]?.questions || {};
    const normalized = normalizeSliderResponses(responses || {}, sectionQuestions);
    setLocalResponses(normalized);
  }, [responses, section, questionnaire]);

  // Expose getCurrentData method to parent
  useImperativeHandle(ref, () => ({
    getCurrentData: () => localResponses
  }));

  // Get questions from questionnaire structure and ensure consistent ordering
  const questions = questionnaire?.sections?.[section]?.questions || {};
  const sortedQuestionEntries = Object.entries(questions).sort(([keyA], [keyB]) => {
    // Custom order for mind section: sliders first, then text questions
    if (section === 'mind') {
      const sliderOrder = ['happiness', 'memory', 'sleep'];
      const indexA = sliderOrder.indexOf(keyA);
      const indexB = sliderOrder.indexOf(keyB);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
    }
    
    // Custom order for mobility section: mobilityType first, then other questions
    if (section === 'mobility') {
      if (keyA === 'mobilityType') return -1;
      if (keyB === 'mobilityType') return 1;
    }
    
    // For all sections, handle numeric sorting for q1, q2, q3, etc.
    const numA = keyA.match(/\d+/)?.[0];
    const numB = keyB.match(/\d+/)?.[0];
    
    if (numA && numB) {
      return parseInt(numA) - parseInt(numB);
    }
    
    // Fallback to alphabetical sorting
    return keyA.localeCompare(keyB);
  });

  const handleSliderChange = (questionKey, value) => {
    const updated = {
      ...localResponses,
      [questionKey]: value
    };
    setLocalResponses(updated);
    if (onLocalChange) onLocalChange();
  };

  const handleTagChange = (questionKey, selectedTags) => {
    const updated = {
      ...localResponses,
      [questionKey]: {
        ...localResponses[questionKey],
        tags: selectedTags
      }
    };
    setLocalResponses(updated);
    if (onLocalChange) onLocalChange();
  };

  const handleTextChange = (questionKey, text) => {
    const updated = {
      ...localResponses,
      [questionKey]: {
        ...localResponses[questionKey],
        text: text
      }
    };
    setLocalResponses(updated);
    if (onLocalChange) onLocalChange();
  };

  const handleMobilityTypeChange = (questionKey, value) => {
    const updated = {
      ...localResponses,
      [questionKey]: value
    };
    setLocalResponses(updated);
    if (onLocalChange) onLocalChange();
  };

  const handleMedicationScanned = (scannedValue) => {
    // If scannedValue is an object, format it nicely
    let displayText = '';
    if (typeof scannedValue === 'object' && scannedValue !== null) {
      // Show key fields if present
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
    const currentText = localResponses.q1?.text || '';
    const newText = currentText ? `${currentText}\n${displayText}` : displayText;
    handleTextChange('q1', newText);
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      // Keep listening through short pauses so it doesn't stop mid-utterance.
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = (questionKey) => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    const IDLE_STOP_MS = 4000;

    setIsListening(prev => ({ ...prev, [questionKey]: true }));

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (!res?.isFinal) continue;
        const text = res?.[0]?.transcript ?? '';
        if (text) finalTranscript += text;
      }

      const cleaned = finalTranscript.trim();
      if (!cleaned) return;

      // Use functional update to avoid stale `localResponses` when we get
      // multiple recognition result chunks.
      setLocalResponses((prev) => {
        const currentText = prev[questionKey]?.text || '';
        const newText = currentText ? `${currentText} ${cleaned}` : cleaned;
        return {
          ...prev,
          [questionKey]: {
            ...(prev[questionKey] || {}),
            text: newText
          }
        };
      });

      if (onLocalChange) onLocalChange();

      if (idleStopTimerRef.current) clearTimeout(idleStopTimerRef.current);
      idleStopTimerRef.current = setTimeout(() => {
        try {
          recognition.stop();
        } catch (e) {
          console.error('Error stopping speech recognition after idle:', e);
        }
      }, IDLE_STOP_MS);
    };

    recognition.onerror = () => {
      if (idleStopTimerRef.current) {
        clearTimeout(idleStopTimerRef.current);
        idleStopTimerRef.current = null;
      }
      setIsListening(prev => ({ ...prev, [questionKey]: false }));
    };

    recognition.onend = () => {
      if (idleStopTimerRef.current) {
        clearTimeout(idleStopTimerRef.current);
        idleStopTimerRef.current = null;
      }
      setIsListening(prev => ({ ...prev, [questionKey]: false }));
    };

    if (idleStopTimerRef.current) {
      clearTimeout(idleStopTimerRef.current);
      idleStopTimerRef.current = null;
    }
    recognition.start();
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
        <Card 
          key={questionKey}
          style={{ 
            marginBottom: '15px',
            border: `2px solid ${config.borderColor}`,
            borderRadius: '12px',
            width: '100%'
          }}
          title={
            <div style={{ 
              fontSize: 'clamp(14px, 3vw, 16px)', 
              fontWeight: '600', 
              color: '#333',
              lineHeight: '1.4',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <config.icon style={{ marginRight: '8px', color: config.color }} />
              <span>{`${index + 1}. ${question.text}`}</span>
              <SpeechReader text={question.text} />
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={18}>
              <div style={{ padding: '10px 10px 10px 10px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 'clamp(11px, 2.5vw, 13px)', 
                  color: '#666',
                  marginBottom: '8px',
                  fontWeight: 500
                }}>
                  <span>{labels.min}</span>
                  <span style={{ textAlign: 'center', color: '#999' }}>
                    {question.neutralLabel || 'Neutral'}
                  </span>
                  <span>{labels.max}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {buttonOptions.map((option) => {
                    const isActive = displayValue === option.value;
                    return (
                      <Button
                        key={`${questionKey}-${option.value}`}
                        type={isActive ? 'primary' : 'default'}
                        onClick={() => handleSliderChange(questionKey, option.value)}
                        style={{
                          minHeight: 42,
                          whiteSpace: 'normal',
                          borderColor: isActive ? config.color : undefined,
                          backgroundColor: isActive ? config.color : '#fff'
                        }}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ 
                textAlign: 'center', 
                fontSize: 'clamp(16px, 4vw, 18px)', 
                fontWeight: 'bold', 
                color: hasValue ? config.color : '#bfbfbf',
                padding: '5px 0'
              }}>
                {hasValue ? `${displayValue}/10` : 'Not set yet'}
              </div>
            </Col>
          </Row>
        </Card>
      );
    } else if (question.type === 'mobility_type') {
      const selectedType = localResponses[questionKey];
      const tips = question.tips?.[selectedType];

      return (
        <Card 
          key={questionKey}
          style={{ 
            marginBottom: '15px',
            border: `2px solid ${config.borderColor}`,
            borderRadius: '12px',
            width: '100%'
          }}
          title={
            <div style={{ 
              fontSize: 'clamp(14px, 3vw, 16px)', 
              fontWeight: '600', 
              color: '#333',
              lineHeight: '1.4',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <config.icon style={{ marginRight: '8px', color: config.color }} />
              <span>{`${index + 1}. ${question.text}`}</span>
              <SpeechReader text={question.text} />
            </div>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                Select your mobility type:
              </Text>
              <Select
                size="large"
                placeholder="Choose how you get around..."
                value={selectedType}
                onChange={(value) => handleMobilityTypeChange(questionKey, value)}
                style={{ width: '100%' }}
                options={question.options?.map(option => ({ label: option, value: option })) || []}
              />
            </div>
            {tips && (
              <Alert
                message={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InfoCircleOutlined style={{ color: config.color }} />
                    <span style={{ fontWeight: 'bold' }}>{tips.title}</span>
                  </div>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    <Text style={{ fontSize: 'clamp(13px, 3vw, 15px)', lineHeight: '1.4' }}>
                      {tips.content}
                    </Text>
                    <div style={{ marginTop: 8, padding: 8, backgroundColor: config.backgroundColor, borderRadius: 4 }}>
                      <Text style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: config.color, fontStyle: 'italic' }}>
                        💡 {tips.details}
                      </Text>
                    </div>
                  </div>
                }
                type="info"
                showIcon={false}
                style={{ 
                  border: `1px solid ${config.borderColor}`,
                  backgroundColor: config.backgroundColor
                }}
              />
            )}
          </Space>
        </Card>
      );
    } else if (question.type === 'tag_text') {
      return (
        <Card 
          key={questionKey}
          style={{ 
            marginBottom: '15px',
            border: `2px solid ${config.borderColor}`,
            borderRadius: '12px',
            width: '100%'
          }}
          title={
            <div style={{ 
              fontSize: 'clamp(14px, 3vw, 16px)', 
              fontWeight: '600', 
              color: '#333',
              lineHeight: '1.4',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <config.icon style={{ marginRight: '8px', color: config.color }} />
              <span>{`${index + 1}. ${question.text}`}</span>
              <SpeechReader text={question.text} />
            </div>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                Select what applies:
              </Text>
              <Select
                mode="multiple"
                size="large"
                placeholder="Choose options..."
                value={localResponses[questionKey]?.tags || []}
                onChange={(values) => handleTagChange(questionKey, values)}
                style={{ width: '100%' }}
                options={question.tags?.map(tag => ({ label: tag, value: tag })) || []}
                maxTagCount="responsive"
              />
            </div>
            
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '8px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <Text strong style={{ 
                  fontSize: 'clamp(14px, 3vw, 16px)'
                }}>
                  Additional details:
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* QR Scanner button - only show for medication section, first question */}
                  {section === 'medication' && questionKey === 'q1' && (
                    <Tooltip title="Scan medication barcode or QR code">
                      <Button
                        icon={<QrcodeOutlined />}
                        onClick={() => setScannerVisible(true)}
                        style={{
                          padding: '8px 16px',
                          height: 'auto',
                          backgroundColor: config.color,
                          borderColor: config.color,
                          color: 'white',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        Scan
                      </Button>
                    </Tooltip>
                  )}
                  {recognition && (
                    <Tooltip title={isListening[questionKey] ? "Recording... Tap to stop" : "Tap to speak your answer"}>
                      <Button
                        icon={<AudioOutlined />}
                        onClick={() => startListening(questionKey)}
                        loading={isListening[questionKey]}
                        style={{
                          padding: '8px 16px',
                          height: 'auto',
                          backgroundColor: isListening[questionKey] ? '#ff4d4f' : config.color,
                          borderColor: isListening[questionKey] ? '#ff4d4f' : config.color,
                          color: 'white',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {isListening[questionKey] ? 'Recording...' : 'Voice Input'}
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
              <TextArea
                size="large"
                rows={3}
                placeholder="Add any additional thoughts..."
                value={localResponses[questionKey]?.text || ''}
                onChange={(e) => handleTextChange(questionKey, e.target.value)}
                style={{ 
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  width: '100%'
                }}
              />
            </div>
          </Space>
        </Card>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '2vw', maxWidth: '100vw', margin: 0 }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '16px',
        backgroundColor: config.backgroundColor,
        padding: '10px 4vw',
        borderRadius: '10px',
        color: config.color,
        marginLeft: '-2vw',
        marginRight: '-2vw',
      }}>
        <Title level={2} style={{ 
          color: config.color, 
          marginBottom: '6px',
          fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
          lineHeight: '1.3'
        }}>
          {config.title}
        </Title>
        <Text style={{ 
          fontSize: 'clamp(13px, 3vw, 15px)', 
          color: config.color,
          lineHeight: '1.4'
        }}>
          {config.description}
        </Text>
      </div>

      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {sortedQuestionEntries.map(([questionKey, question], index) => 
          renderQuestion(questionKey, question, index)
        )}
      </Space>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '16px', 
        padding: '10px 4vw',
        backgroundColor: config.backgroundColor,
        borderRadius: '8px',
        border: `1px solid ${config.borderColor}`,
        marginLeft: '-2vw',
        marginRight: '-2vw',
      }}>
        <Text style={{ 
          fontSize: 'clamp(13px, 3vw, 15px)', 
          color: config.tipColor,
          lineHeight: '1.4'
        }}>
          {config.tipText}
        </Text>
      </div>

      {/* QR Scanner Modal */}
      <MedicationScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onMedScanned={handleMedicationScanned}
      />
    </div>
  );
});

export default FourMSection; 
