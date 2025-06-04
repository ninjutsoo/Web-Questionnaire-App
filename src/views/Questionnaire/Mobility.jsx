import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Space, Typography } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Mobility({ responses, onSave }) {
  const [localResponses, setLocalResponses] = useState({
    movementMethods: { tags: [], text: '' },
    goingWell: { tags: [], text: '' },
    limitations: { tags: [], text: '' },
    questions: { tags: [], text: '' },
    ...responses
  });

  useEffect(() => {
    setLocalResponses(prev => ({ ...prev, ...responses }));
  }, [responses]);

  const suggestedTags = {
    movementMethods: ["Walk", "Cane", "Wheelchair", "Exercise videos", "Public transport", "Physical therapy", "Drive with help"],
    goingWell: ["Can walk easily", "Exercise regularly", "Home is easy to move in", "Dog walking", "Pain is improving"],
    limitations: ["Fall risk", "Shoulder pain", "Breathlessness", "Can't carry laundry", "Back pain", "Hard to reach shelves"],
    questions: ["How can I move more safely?", "Do I need a mobility aid?", "How to deal with pain?", "Is it time to think about home changes?"]
  };

  const questions = [
    {
      key: 'movementMethods',
      title: 'How do you move around at home and outside?',
      tags: suggestedTags.movementMethods
    },
    {
      key: 'goingWell',
      title: "What's going well with your mobility?",
      tags: suggestedTags.goingWell
    },
    {
      key: 'limitations',
      title: 'What is limiting your movement or getting in your way?',
      tags: suggestedTags.limitations
    },
    {
      key: 'questions',
      title: 'What questions do you want to ask your provider about your mobility?',
      tags: suggestedTags.questions
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
                <CarOutlined style={{ marginRight: '8px', color: '#fa541c' }} />
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
                  {index === 0 ? 'Describe how you get around and any equipment you use:' : 'Additional thoughts or details:'}
                </Text>
                <TextArea
                  size="large"
                  rows={index === 0 ? 5 : 4}
                  placeholder={index === 0 ? 
                    "Example: I walk with a cane around the house. I use my car to go to the store but sometimes need help with heavy bags. I do chair exercises every morning." :
                    "You can write anything else you'd like to share about this question..."
                  }
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