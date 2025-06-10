import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Select, Input, Space, Typography, Button } from 'antd';
import { CarOutlined, AudioOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Mobility = forwardRef(({ questionnaire, responses }, ref) => {
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
  const questions = questionnaire?.sections?.mobility?.questions || {};
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
        backgroundColor: '#ff4d4f',
        padding: '30px',
        borderRadius: '12px',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '10px' }}>
          🚶‍♀️ How You Move Around and Stay Active
        </Title>
        <Text style={{ fontSize: '16px', color: 'white' }}>
          Tell us about your mobility and movement. We want to help you stay active and independent.
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
                <CarOutlined style={{ marginRight: '8px', color: '#fa541c' }} />
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
                    {index === 0 ? 'Describe how you get around and any equipment you use:' : 'Additional thoughts or details:'}
                  </Text>
                  {recognition && (
                    <Button
                      icon={<AudioOutlined />}
                      onClick={() => startListening(questionKey)}
                      loading={isListening[questionKey]}
                      style={{
                        backgroundColor: isListening[questionKey] ? '#ff4d4f' : '#fa541c',
                        borderColor: isListening[questionKey] ? '#ff4d4f' : '#fa541c',
                        color: 'white'
                      }}
                    >
                      {isListening[questionKey] ? 'Listening...' : 'Speak'}
                    </Button>
                  )}
                </div>
                <TextArea
                  size="large"
                  rows={index === 0 ? 5 : 4}
                  placeholder={index === 0 ? 
                    "Example: I walk with a cane around the house. I use my car to go to the store but sometimes need help with heavy bags. I do chair exercises every morning." :
                    "You can write anything else you'd like to share about this question..."
                  }
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
        backgroundColor: '#fff7e6',
        borderRadius: '8px',
        border: '1px solid #ffd591'
      }}>
        <Text style={{ fontSize: '16px', color: '#d46b08' }}>
          🚶‍♀️ Staying active helps maintain your independence and improves your overall health. Don't forget to click "Save Progress" to save your mobility information.
        </Text>
      </div>
    </div>
  );
});

export default Mobility; 