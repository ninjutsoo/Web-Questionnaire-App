import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Input, Space, Typography, Slider, Row, Col } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Mind({ responses, onSave }) {
  const [localResponses, setLocalResponses] = useState({
    happiness: 50,
    memoryWorry: 50,
    othersMemoryWorry: 50,
    changesNoticed: { tags: [], text: '' },
    goingWell: { tags: [], text: '' },
    improvements: { tags: [], text: '' },
    questions: { tags: [], text: '' },
    ...responses
  });

  useEffect(() => {
    setLocalResponses(prev => ({ ...prev, ...responses }));
  }, [responses]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const suggestedTags = {
    changesNoticed: ["Feeling anxious", "Forgetting words", "Getting lost", "Feeling happier", "Increased worry"],
    goingWell: ["Volunteering", "Support system", "Work satisfaction", "Positive outlook", "Excited for future plans"],
    improvements: ["Feeling down", "Loneliness", "Relationship issues", "Overwhelmed", "Trouble focusing"],
    questions: ["Do I need a memory test?", "Can I get help for anxiety?", "Is this normal for my age?"]
  };

  // Use useRef for timeout to avoid re-render issues
  const saveTimeoutRef = useRef(null);
  
  const debouncedSave = (data) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      onSave(data);
    }, 1000); // Wait 1 second after user stops moving slider
  };

  const handleSliderChange = (key, value) => {
    const updated = {
      ...localResponses,
      [key]: value
    };
    setLocalResponses(updated);
    debouncedSave(updated); // Use debounced save instead of immediate save
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
    onSave(updated);
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
    onSave(updated);
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
        {/* Slider Questions */}
        <Card 
          style={{ 
            marginBottom: '30px',
            border: '2px solid #e8e8e8',
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <HeartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
              1. How happy do you feel on most days?
            </div>
          }
        >
          <Row gutter={24}>
            <Col span={18}>
              <div style={{ padding: '20px 0' }}>
                <Slider
                  min={0}
                  max={100}
                  value={localResponses.happiness}
                  onChange={(value) => handleSliderChange('happiness', value)}
                  tooltip={{ formatter: (value) => `${value}% - ${getHappinessLabel(value)}` }}
                  trackStyle={{ backgroundColor: '#722ed1', height: 8 }}
                  handleStyle={{ borderColor: '#722ed1', borderWidth: 3, height: 24, width: 24 }}
                  railStyle={{ height: 8 }}
                />
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#722ed1' }}>
                {localResponses.happiness}%
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  {getHappinessLabel(localResponses.happiness)}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Card 
          style={{ 
            marginBottom: '30px',
            border: '2px solid #e8e8e8',
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <HeartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
              2. How much do you worry about your memory?
            </div>
          }
        >
          <Row gutter={24}>
            <Col span={18}>
              <div style={{ padding: '20px 0' }}>
                <Slider
                  min={0}
                  max={100}
                  value={localResponses.memoryWorry}
                  onChange={(value) => handleSliderChange('memoryWorry', value)}
                  tooltip={{ formatter: (value) => `${value}% - ${getWorryLabel(value)}` }}
                  trackStyle={{ backgroundColor: '#fa8c16', height: 8 }}
                  handleStyle={{ borderColor: '#fa8c16', borderWidth: 3, height: 24, width: 24 }}
                  railStyle={{ height: 8 }}
                />
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#fa8c16' }}>
                {localResponses.memoryWorry}%
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  {getWorryLabel(localResponses.memoryWorry)}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Card 
          style={{ 
            marginBottom: '30px',
            border: '2px solid #e8e8e8',
            borderRadius: '12px'
          }}
          title={
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              <HeartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
              3. How much do people around you worry about your memory?
            </div>
          }
        >
          <Row gutter={24}>
            <Col span={18}>
              <div style={{ padding: '20px 0' }}>
                <Slider
                  min={0}
                  max={100}
                  value={localResponses.othersMemoryWorry}
                  onChange={(value) => handleSliderChange('othersMemoryWorry', value)}
                  tooltip={{ formatter: (value) => `${value}% - ${getWorryLabel(value)}` }}
                  trackStyle={{ backgroundColor: '#f5222d', height: 8 }}
                  handleStyle={{ borderColor: '#f5222d', borderWidth: 3, height: 24, width: 24 }}
                  railStyle={{ height: 8 }}
                />
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#f5222d' }}>
                {localResponses.othersMemoryWorry}%
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  {getWorryLabel(localResponses.othersMemoryWorry)}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tag + Textarea Questions */}
        {[
          {
            key: 'changesNoticed',
            title: 'Have you noticed any changes in mood or memory?',
            tags: suggestedTags.changesNoticed,
            number: 4
          },
          {
            key: 'goingWell',
            title: "What's going well mentally or emotionally?",
            tags: suggestedTags.goingWell,
            number: 5
          },
          {
            key: 'improvements',
            title: 'What could be better about your mental well-being?',
            tags: suggestedTags.improvements,
            number: 6
          },
          {
            key: 'questions',
            title: 'What do you want to ask your provider about your mental health?',
            tags: suggestedTags.questions,
            number: 7
          }
        ].map((question) => (
          <Card 
            key={question.key}
            style={{ 
              marginBottom: '30px',
              border: '2px solid #e8e8e8',
              borderRadius: '12px'
            }}
            title={
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                <HeartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                {`${question.number}. ${question.title}`}
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
                  value={localResponses[question.key]?.tags || []}
                  onChange={(values) => handleTagChange(question.key, values)}
                  style={{ width: '100%' }}
                  options={question.tags.map(tag => ({ label: tag, value: tag }))}
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
                  value={localResponses[question.key]?.text || ''}
                  onChange={(e) => handleTextChange(question.key, e.target.value)}
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