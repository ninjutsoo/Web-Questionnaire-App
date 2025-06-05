import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Input, Space, Typography } from 'antd';
import { TagsOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WhatMatters({ questionnaire, responses, onSave }) {
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
  const questions = questionnaire?.sections?.matters?.questions || {};

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
          💡 Your answers are automatically saved as you type. You can come back and edit them anytime.
        </Text>
      </div>
    </div>
  );
} 