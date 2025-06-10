import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Select, Input, Space, Typography, Button } from 'antd';
import { TagsOutlined, AudioOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const WhatMatters = forwardRef(({ questionnaire, responses }, ref) => {
  const [localResponses, setLocalResponses] = useState(responses || {});
  const [isListening, setIsListening] = useState({});
  const [recognition, setRecognition] = useState(null);

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
  const questions = questionnaire?.sections?.matters?.questions || {};
  const sortedQuestionEntries = Object.entries(questions).sort(([keyA], [keyB]) => {
    // Handle numeric sorting for q1, q2, q3, etc.
    const numA = keyA.match(/\d+/)?.[0];
    const numB = keyB.match(/\d+/)?.[0];
    
    if (numA && numB) {
      return parseInt(numA) - parseInt(numB);
    }
    
    // Fallback to alphabetical sorting
    return keyA.localeCompare(keyB);
  });

  const handleTagChange = (questionKey, selectedTags) => {
    const updated = {
      ...localResponses,
      [questionKey]: {
        ...localResponses[questionKey],
        tags: selectedTags
      }
    };
    setLocalResponses(updated);
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        backgroundColor: '#1890ff',
        padding: '30px',
        borderRadius: '12px',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '10px' }}>
          🏷️ What Matters Most in Your Life
        </Title>
        <Text style={{ fontSize: '16px', color: 'white' }}>
          Help us understand what's important to you. You can select from suggested options or write your own thoughts.
        </Text>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {sortedQuestionEntries.map(([questionKey, question], index) => (
          <Card 
            key={questionKey}
            style={{ 
              marginBottom: '30px',
              border: '2px solid #e8e8e8',
              borderRadius: '12px'
            }}
            title={
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                <TagsOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
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
                        backgroundColor: isListening[questionKey] ? '#ff4d4f' : '#1890ff',
                        borderColor: isListening[questionKey] ? '#ff4d4f' : '#1890ff',
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
        ))}
      </Space>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae7ff'
      }}>
        <Text style={{ fontSize: '16px', color: '#0050b3' }}>
          💡 Your answers are kept locally. Click "Save Progress" in the header to save to your account.
        </Text>
      </div>
    </div>
  );
});

export default WhatMatters; 