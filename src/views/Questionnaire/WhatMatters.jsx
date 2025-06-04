import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Space, Typography } from 'antd';
import { TagsOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WhatMatters({ responses, onSave }) {
  const [localResponses, setLocalResponses] = useState({
    importantThings: { tags: [], text: '' },
    enjoyableActivities: { tags: [], text: '' },
    obstacles: { tags: [], text: '' },
    providerInfo: { tags: [], text: '' },
    ...responses
  });

  useEffect(() => {
    setLocalResponses(prev => ({ ...prev, ...responses }));
  }, [responses]);

  const suggestedTags = {
    importantThings: ["Family", "Health", "Friends", "Retirement", "Faith", "Volunteering", "Hobbies", "Pets", "Independence"],
    enjoyableActivities: ["Playing music", "Watching sports", "Working", "Spending time with grandchildren", "Reading", "Cooking", "Gardening", "Community service"],
    obstacles: ["Trouble sleeping", "Low energy", "Caring for others", "Mobility issues", "Bladder issues", "Hearing loss", "Access to food"],
    providerInfo: ["Living with family", "Caring for someone", "Yearly goals", "Faith-based needs", "People who support me", "People who stress me"]
  };

  const questions = [
    {
      key: 'importantThings',
      title: 'What are the most important things in your life right now?',
      tags: suggestedTags.importantThings
    },
    {
      key: 'enjoyableActivities', 
      title: 'What activities do you enjoy doing regularly?',
      tags: suggestedTags.enjoyableActivities
    },
    {
      key: 'obstacles',
      title: "What's getting in the way of doing what you enjoy?",
      tags: suggestedTags.obstacles
    },
    {
      key: 'providerInfo',
      title: 'What do you want your provider to know about you?',
      tags: suggestedTags.providerInfo
    }
  ];

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
        {questions.map((question, index) => (
          <Card 
            key={question.key}
            style={{ 
              marginBottom: '30px',
              border: '2px solid #e8e8e8',
              borderRadius: '12px'
            }}
            title={
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                <TagsOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                {`${index + 1}. ${question.title}`}
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