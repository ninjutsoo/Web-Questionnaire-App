import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Select, Input, Space, Typography, Slider, Row, Col, Button } from 'antd';
import { HeartOutlined, CarOutlined, MedicineBoxOutlined, StarOutlined, AudioOutlined } from '@ant-design/icons';

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
            marginBottom: '30px',
            border: `2px solid ${config.borderColor}`,
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <config.icon style={{ marginRight: '8px', color: config.color }} />
              {`${index + 1}. ${question.text}`}
            </div>
          }
        >
          <Row gutter={24}>
            <Col span={18}>
              <div style={{ padding: '20px 0' }}>
                <Slider
                  min={question.min || 0}
                  max={question.max || 100}
                  value={localResponses[questionKey] || 50}
                  onChange={(value) => handleSliderChange(questionKey, value)}
                  tooltip={{ formatter: (value) => `${value}%` }}
                  trackStyle={{ backgroundColor: config.color, height: 8 }}
                  handleStyle={{ borderColor: config.color, borderWidth: 3, height: 24, width: 24 }}
                  railStyle={{ height: 8 }}
                />
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: config.color }}>
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
            marginBottom: '30px',
            border: `2px solid ${config.borderColor}`,
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <config.icon style={{ marginRight: '8px', color: config.color }} />
              {`${index + 1}. ${question.text}`}
            </div>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                Select what applies to you:
              </Text>
              <Select
                mode="multiple"
                size="large"
                placeholder="Choose from suggestions..."
                value={localResponses[questionKey]?.tags || []}
                onChange={(values) => handleTagChange(questionKey, values)}
                style={{ width: '100%' }}
                options={question.tags?.map(tag => ({ label: tag, value: tag })) || []}
                maxTagCount="responsive"
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong style={{ fontSize: '16px' }}>
                  Additional thoughts or details:
                </Text>
                {recognition && (
                  <Button
                    icon={<AudioOutlined />}
                    onClick={() => startListening(questionKey)}
                    loading={isListening[questionKey]}
                    style={{
                      backgroundColor: isListening[questionKey] ? '#ff4d4f' : config.color,
                      borderColor: isListening[questionKey] ? '#ff4d4f' : config.color,
                      color: 'white'
                    }}
                  >
                    {isListening[questionKey] ? 'Listening...' : 'Speak'}
                  </Button>
                )}
              </div>
              <TextArea
                size="large"
                rows={4}
                placeholder="You can write anything else you'd like to share about this question..."
                value={localResponses[questionKey]?.text || ''}
                onChange={(e) => handleTextChange(questionKey, e.target.value)}
                style={{ fontSize: '16px' }}
              />
            </div>
          </Space>
        </Card>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        backgroundColor: config.backgroundColor,
        padding: '30px',
        borderRadius: '12px',
        color: config.color
      }}>
        <Title level={2} style={{ color: config.color, marginBottom: '10px' }}>
          {config.title}
        </Title>
        <Text style={{ fontSize: '16px', color: config.color }}>
          {config.description}
        </Text>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {sortedQuestionEntries.map(([questionKey, question], index) => 
          renderQuestion(questionKey, question, index)
        )}
      </Space>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: config.backgroundColor,
        borderRadius: '8px',
        border: `1px solid ${config.borderColor}`
      }}>
        <Text style={{ fontSize: '16px', color: config.tipColor }}>
          {config.tipText}
        </Text>
      </div>
    </div>
  );
});

export default FourMSection; 