import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Input, Space, Typography, Slider, Row, Col } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Mind({ questionnaire, responses, onSave }) {
  const [localResponses, setLocalResponses] = useState(responses || {});

  useEffect(() => {
    setLocalResponses(responses || {});
  }, [responses]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Get questions from questionnaire structure
  const questions = questionnaire?.sections?.mind?.questions || {};

  // Use useRef for timeout to avoid re-render issues
  const saveTimeoutRef = useRef(null);
  
  const debouncedSave = (data, delay = 5000) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      onSave(data);
    }, delay);
  };

  const handleSliderChange = (key, value) => {
    const updated = {
      ...localResponses,
      [key]: value
    };
    setLocalResponses(updated);
    debouncedSave(updated, 1000); // Wait 1 second for sliders
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
    debouncedSave(updated); // Wait 5 seconds for tags
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
    debouncedSave(updated); // Wait 5 seconds for text
  };

  const getHappinessLabel = (value) => {
    if (value <= 20) return "Mostly Unhappy";
    if (value <= 40) return "Sometimes Unhappy";
    if (value <= 60) return "Mixed";
    if (value <= 80) return "Generally Happy";
    return "Mostly Happy";
  };

  const getWorryLabel = (value) => {
    if (value <= 20) return "Not Worried";
    if (value <= 40) return "Slightly Worried";
    if (value <= 60) return "Somewhat Worried";
    if (value <= 80) return "Quite Worried";
    return "Very Worried";
  };

  const renderQuestion = (questionKey, question, index) => {
    if (question.type === 'slider') {
      return (
        <Card 
          key={questionKey}
          style={{ 
            marginBottom: '30px',
            border: '2px solid #e8e8e8',
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <HeartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
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
                  trackStyle={{ backgroundColor: '#722ed1', height: 8 }}
                  handleStyle={{ borderColor: '#722ed1', borderWidth: 3, height: 24, width: 24 }}
                  railStyle={{ height: 8 }}
                />
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#722ed1' }}>
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
            border: '2px solid #e8e8e8',
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <HeartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
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
              <Text strong style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                Additional thoughts or details:
              </Text>
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
        backgroundColor: '#9254de',
        padding: '30px',
        borderRadius: '12px',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '10px' }}>
          🧠 Your Mood and Mental Sharpness
        </Title>
        <Text style={{ fontSize: '16px', color: 'white' }}>
          Help us understand how you're feeling mentally and emotionally. This helps us provide better care.
        </Text>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {Object.entries(questions).map(([questionKey, question], index) => 
          renderQuestion(questionKey, question, index)
        )}
      </Space>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: '#f9f0ff',
        borderRadius: '8px',
        border: '1px solid #d3adf7'
      }}>
        <Text style={{ fontSize: '16px', color: '#531dab' }}>
          🧠 Your mental health is just as important as your physical health. We're here to support you.
        </Text>
      </div>
    </div>
  );
} 