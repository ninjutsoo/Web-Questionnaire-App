import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Select, Input, Space, Typography, Slider, Row, Col, Button } from 'antd';
import { HeartOutlined, CarOutlined, MedicineBoxOutlined, StarOutlined } from '@ant-design/icons';
import { AudioOutlined } from '@ant-design/icons';
import SpeechReader from '../../components/SpeechReader';

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
    tipText: "Taking care of your mental health is just as important as physical health. Don't forget to click 'Save Progress' to save your responses.",
    tipColor: '#722ed1'
  },
  mobility: {
    title: "🚶‍♀️ How You Move Around and Stay Active",
    description: "Tell us about your mobility and movement. We want to help you stay active and independent.",
    icon: CarOutlined,
    color: '#fa541c',
    backgroundColor: '#fff2e8',
    borderColor: '#ffbb96',
    tipText: "Staying active helps maintain your independence and improves your overall health. Don't forget to click 'Save Progress' to save your mobility information.",
    tipColor: '#d46b08'
  },
  medication: {
    title: "💊 Your Medications and Health Management",
    description: "Tell us about your medications and how you manage your health. We want to ensure you're taking care of yourself properly.",
    icon: MedicineBoxOutlined,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
    tipText: "Proper medication management is crucial for your health. Don't forget to click 'Save Progress' to save your medication information.",
    tipColor: '#096dd9'
  },
  matters: {
    title: "⭐ What Matters Most to You",
    description: "Tell us about your priorities and what's important in your life. We want to understand your goals and preferences.",
    icon: StarOutlined,
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    tipText: "Understanding what matters to you helps us provide better care. Don't forget to click 'Save Progress' to save your preferences.",
    tipColor: '#389e0d'
  }
};

const FourMSection = forwardRef(({ section, questionnaire, responses, onLocalChange }, ref) => {
  const [localResponses, setLocalResponses] = useState(responses || {});
  const [isListening, setIsListening] = useState({});
  const [recognition, setRecognition] = useState(null);

  const config = SECTION_CONFIG[section];

  useEffect(() => {
    setLocalResponses(responses || {});
  }, [responses]);

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
    <div style={{ padding: '10px' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        backgroundColor: config.backgroundColor,
        padding: '15px',
        borderRadius: '12px',
        color: config.color
      }}>
        <Title level={2} style={{ 
          color: config.color, 
          marginBottom: '8px',
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

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {sortedQuestionEntries.map(([questionKey, question], index) => 
          renderQuestion(questionKey, question, index)
        )}
      </Space>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        padding: '12px',
        backgroundColor: config.backgroundColor,
        borderRadius: '8px',
        border: `1px solid ${config.borderColor}`
      }}>
        <Text style={{ 
          fontSize: 'clamp(13px, 3vw, 15px)', 
          color: config.tipColor,
          lineHeight: '1.4'
        }}>
          {config.tipText}
        </Text>
      </div>
    </div>
  );
});

export default FourMSection; 