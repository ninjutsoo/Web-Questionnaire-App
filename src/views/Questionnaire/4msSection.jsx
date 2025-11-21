import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Select, Input, Space, Typography, Slider, Row, Col, Button, Alert, Checkbox } from 'antd';
import { HeartOutlined, CarOutlined, MedicineBoxOutlined, StarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { AudioOutlined, QrcodeOutlined } from '@ant-design/icons';
import SpeechReader from '../../components/SpeechReader';
import MedicationScanner from '../../components/MedicationScanner';
import { message } from 'antd';
import axios from 'axios';
import { getApiEndpoint } from '../../services/apiClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Section configuration
const SECTION_CONFIG = {
  mind: {
    title: "🧠 Your Mental Well-being",
    description: "Tell us about your thoughts, feelings, and mental health. We want to understand how you're doing emotionally.",
    icon: HeartOutlined,
    color: '#722ed1',
    backgroundColor: '#f9f0ff',
    borderColor: '#d3adf7',
    tipText: "Taking care of your mental health is just as important as physical health. Don't forget to click 'Submit' to save your responses.",
    tipColor: '#722ed1'
  },
  mobility: {
    title: "🚶‍♀️ How You Move Around and Stay Active",
    description: "Tell us about your mobility and movement. We want to help you stay active and independent.",
    icon: CarOutlined,
    color: '#fa541c',
    backgroundColor: '#fff2e8',
    borderColor: '#ffbb96',
    tipText: "Staying active helps maintain your independence and improves your overall health. Don't forget to click 'Submit' to save your mobility information.",
    tipColor: '#d46b08'
  },
  medication: {
    title: "💊 Your Medications and Health Management",
    description: "Tell us about your medications and how you manage your health. We want to ensure you're taking care of yourself properly.",
    icon: MedicineBoxOutlined,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
    tipText: "Proper medication management is crucial for your health. Don't forget to click 'Submit' to save your medication information.",
    tipColor: '#096dd9'
  },
  matters: {
    title: "⭐ What Matters Most to You",
    description: "Tell us about your priorities and what's important in your life. We want to understand your goals and preferences.",
    icon: StarOutlined,
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    tipText: "Understanding what matters to you helps us provide better care. Don't forget to click 'Submit' to save your preferences.",
    tipColor: '#389e0d'
  }
};

const FourMSection = forwardRef(({ section, questionnaire, responses, userProfile, onLocalChange }, ref) => {
  const [localResponses, setLocalResponses] = useState(responses || {});
  const [isListening, setIsListening] = useState({});
  const [recognition, setRecognition] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  const config = SECTION_CONFIG[section];

  useEffect(() => {
    const updatedResponses = responses || {};
    // Pre-populate caregiverEmail from userProfile if not already set
    if (section === 'mobility' && userProfile?.caregiverEmail && !updatedResponses.caregiverEmail) {
      updatedResponses.caregiverEmail = userProfile.caregiverEmail;
    }
    setLocalResponses(updatedResponses);
  }, [responses, userProfile, section]);

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
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = (questionKey) => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(prev => ({ ...prev, [questionKey]: true }));

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const currentText = localResponses[questionKey]?.text || '';
      const newText = currentText ? `${currentText} ${transcript}` : transcript;
      handleTextChange(questionKey, newText);
      setIsListening(prev => ({ ...prev, [questionKey]: false }));
    };

    recognition.onerror = () => {
      setIsListening(prev => ({ ...prev, [questionKey]: false }));
    };

    recognition.onend = () => {
      setIsListening(prev => ({ ...prev, [questionKey]: false }));
    };

    recognition.start();
  };

  const renderQuestion = (questionKey, question, index) => {
    if (question.type === 'slider') {
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
              <div style={{ padding: '10px 0' }}>
                <Slider
                  min={question.min || 0}
                  max={question.max || 100}
                  value={localResponses[questionKey] || 50}
                  onChange={(value) => handleSliderChange(questionKey, value)}
                  tooltip={{ formatter: (value) => `${value}%` }}
                  trackStyle={{ backgroundColor: config.color, height: 6 }}
                  handleStyle={{ borderColor: config.color, borderWidth: 2, height: 20, width: 20 }}
                  railStyle={{ height: 6 }}
                />
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ 
                textAlign: 'center', 
                fontSize: 'clamp(16px, 4vw, 18px)', 
                fontWeight: 'bold', 
                color: config.color,
                padding: '5px 0'
              }}>
                {localResponses[questionKey] || 50}%
              </div>
            </Col>
          </Row>
        </Card>
      );
    } else if (question.type === 'mobility_type') {
      const selectedType = localResponses[questionKey];
      const tips = question.tips?.[selectedType];
      const caregiverEmail = localResponses.caregiverEmail || '';
      const [sending, setSending] = useState(false);

      const handleSendCaregiverTip = async () => {
        if (!caregiverEmail || !selectedType) {
          message.error('Please enter a caregiver email and select a mobility type.');
          return;
        }
        setSending(true);
        try {
          const res = await axios.post(getApiEndpoint('/send-caregiver-tip'), {
            caregiverEmail,
            mobilityType: selectedType
          });
          if (res.data.success) {
            message.success('Tip email sent to caregiver!');
          } else {
            message.error(res.data.error || 'Failed to send email.');
          }
        } catch (err) {
          message.error(err.response?.data?.error || err.message || 'Failed to send email.');
        } finally {
          setSending(false);
        }
      };

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
            <Input
              type="email"
              placeholder="Caregiver's email address"
              value={caregiverEmail}
              onChange={e => {
                setLocalResponses({ ...localResponses, caregiverEmail: e.target.value });
                if (onLocalChange) onLocalChange();
              }}
              style={{ width: '100%' }}
            />
            <Button
              type="primary"
              loading={sending}
              onClick={handleSendCaregiverTip}
              style={{ width: '100%' }}
            >
              Send Mobility Tip to Caregiver
            </Button>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* QR Scanner button - only show for medication section, first question */}
                  {section === 'medication' && questionKey === 'q1' && (
                    <Button
                      icon={<QrcodeOutlined />}
                      onClick={() => setScannerVisible(true)}
                      style={{
                        padding: '4px 8px',
                        height: 'auto',
                        backgroundColor: config.color,
                        borderColor: config.color,
                        color: 'white'
                      }}
                      title="Scan medication QR code"
                    />
                  )}
                  {recognition && (
                    <Button
                      icon={<AudioOutlined />}
                      onClick={() => startListening(questionKey)}
                      loading={isListening[questionKey]}
                      style={{
                        padding: '4px 8px',
                        height: 'auto',
                        backgroundColor: isListening[questionKey] ? '#ff4d4f' : config.color,
                        borderColor: isListening[questionKey] ? '#ff4d4f' : config.color,
                        color: 'white'
                      }}
                    />
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