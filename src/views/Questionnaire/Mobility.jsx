import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Input, Space, Typography } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Mobility({ questionnaire, responses, onSave }) {
  const [localResponses, setLocalResponses] = useState(responses || {});
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalResponses(responses || {});
  }, [responses]);

  // Debounced save function - only triggers when localResponses actually changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      onSave(localResponses);
    }, 5000); // Save after 5 seconds of no changes

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [localResponses]); // Removed onSave from dependencies

  // Get questions from questionnaire structure
  const questions = questionnaire?.sections?.mobility?.questions || {};

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
        {Object.entries(questions).map(([questionKey, question], index) => (
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
                <Text strong style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                  {index === 0 ? 'Describe how you get around and any equipment you use:' : 'Additional thoughts or details:'}
                </Text>
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
          🚶‍♀️ Staying active helps maintain your independence and improves your overall health.
        </Text>
      </div>
    </div>
  );
} 