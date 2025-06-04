import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Space, Typography } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Medication({ responses, onSave }) {
  const [localResponses, setLocalResponses] = useState({
    currentMedications: { tags: [], text: '' },
    goingWell: { tags: [], text: '' },
    issues: { tags: [], text: '' },
    questions: { tags: [], text: '' },
    ...responses
  });

  useEffect(() => {
    setLocalResponses(prev => ({ ...prev, ...responses }));
  }, [responses]);

  const suggestedTags = {
    currentMedications: ["Calcium", "Aspirin", "Heart medicine", "Inhaler", "Diabetes medicine", "Vitamins", "Probiotics", "Herbal supplements"],
    goingWell: ["More active", "Better sleep", "Improved appetite", "Stable condition", "No side effects"],
    issues: ["Dizziness", "Nausea", "High cost", "Hard to manage", "Unsure effectiveness", "Side effects"],
    questions: ["Do I need all these?", "Are my vaccines up to date?", "Can I get cheaper alternatives?", "Should we check labs?", "Who to call with questions?"]
  };

  const questions = [
    {
      key: 'currentMedications',
      title: 'What medications do you take regularly or as needed? (include vitamins & supplements)',
      tags: suggestedTags.currentMedications
    },
    {
      key: 'goingWell',
      title: "What's going well with your medications?",
      tags: suggestedTags.goingWell
    },
    {
      key: 'issues',
      title: 'What issues are you having with your medications?',
      tags: suggestedTags.issues
    },
    {
      key: 'questions',
      title: 'What questions or concerns do you want to ask your provider about your medications?',
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
        backgroundColor: '#00b96b',
        padding: '30px',
        borderRadius: '12px',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '10px' }}>
          💊 Your Medications and How You Feel About Them
        </Title>
        <Text style={{ fontSize: '16px', color: 'white' }}>
          Tell us about your medications, vitamins, and supplements. Your safety and comfort are important to us.
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
                <MedicineBoxOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
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
                  {index === 0 ? 'List your medications, dosages, and frequency:' : 'Additional thoughts or details:'}
                </Text>
                <TextArea
                  size="large"
                  rows={index === 0 ? 6 : 4}
                  placeholder={index === 0 ? 
                    "Example: Lisinopril 10mg - once daily in morning\nVitamin D 1000 IU - once daily\nAspirin 81mg - as needed for headaches" :
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
        backgroundColor: '#f6ffed',
        borderRadius: '8px',
        border: '1px solid #b7eb8f'
      }}>
        <Text style={{ fontSize: '16px', color: '#389e0d' }}>
          💊 Please bring all your medication bottles to your appointment for a complete review.
        </Text>
      </div>
    </div>
  );
} 