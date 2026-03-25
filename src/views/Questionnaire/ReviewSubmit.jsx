import React from 'react';
import { Card, Button, Space, Typography, Divider, Tag, Row, Col, message } from 'antd';
import { CheckCircleOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function ReviewSubmit({ questionnaire, responses, onFinalSubmit }) {
  // If legacy responses stored slider values as 0-100 percentages, normalize them into 1-10.
  const normalizeLikertValue = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
    if (value > 10) {
      const scaled = (value / 100) * 9 + 1; // map 0-100 -> 1-10
      return Math.min(10, Math.max(1, Math.round(scaled)));
    }
    if (value < 1) return 1;
    return Math.min(10, Math.round(value));
  };

  // Used for showing the selected "button label" in the Review & Save screen.
  const MIND_SLIDER_VALUE_LABELS = {
    happiness: {
      1: 'Not at all happy',
      3: 'A little happy',
      5: 'Neutral',
      8: 'Happy',
      10: 'Very happy'
    },
    memory: {
      1: 'Not worried',
      3: 'A little worried',
      5: 'Somewhat worried',
      8: 'Worried',
      10: 'Very worried'
    },
    sleep: {
      1: 'Very poor sleep',
      3: 'Poor sleep',
      5: 'Okay sleep',
      8: 'Good sleep',
      10: 'Excellent sleep'
    }
  };

  const getOrderedQuestionKeys = (sectionKey) => {
    const questions = questionnaire?.sections?.[sectionKey]?.questions || {};
    const sliderOrder = ['happiness', 'memory', 'sleep'];

    const sortedEntries = Object.entries(questions).sort(([keyA], [keyB]) => {
      // Custom order for mind section: sliders first, then text questions.
      if (sectionKey === 'mind') {
        const indexA = sliderOrder.indexOf(keyA);
        const indexB = sliderOrder.indexOf(keyB);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
      }

      // Custom order for mobility section: mobilityType first, then other questions.
      if (sectionKey === 'mobility') {
        if (keyA === 'mobilityType') return -1;
        if (keyB === 'mobilityType') return 1;
      }

      // Numeric sorting for q1, q2, q3, etc.
      const numA = keyA.match(/\d+/)?.[0];
      const numB = keyB.match(/\d+/)?.[0];
      if (numA && numB) return parseInt(numA, 10) - parseInt(numB, 10);

      return keyA.localeCompare(keyB);
    });

    return sortedEntries.map(([key]) => key);
  };

  const getSliderLabel = (questionKey, rawValue) => {
    const normalized = normalizeLikertValue(rawValue);
    const labels = MIND_SLIDER_VALUE_LABELS[questionKey] || {};
    if (typeof normalized !== 'number') return '';
    if (labels[normalized]) return labels[normalized];

    // Fallback: choose nearest defined button value label
    const numericKeys = Object.keys(labels).map((k) => parseInt(k, 10));
    if (numericKeys.length === 0) return '';
    const nearest = numericKeys.reduce((closest, current) =>
      Math.abs(current - normalized) < Math.abs(closest - normalized) ? current : closest
    );
    return labels[nearest] || '';
  };

  const getSectionSummary = (sectionKey, sectionData) => {
    if (!sectionData || Object.keys(sectionData).length === 0) {
      return { answered: 0, total: getTotalQuestions(sectionKey) };
    }

    let answered = 0;
    Object.values(sectionData).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        // Tag + text questions - count as answered if has tags OR text
        if ((value.tags && value.tags.length > 0) || (value.text && value.text.trim())) {
          answered++;
        }
      } else if (typeof value === 'number' || (typeof value === 'string' && value.trim())) {
        // Slider or text questions - count if not empty
        answered++;
      }
    });

    return { answered, total: getTotalQuestions(sectionKey) };
  };

  const getTotalQuestions = (sectionKey) => {
    if (!questionnaire?.sections?.[sectionKey]?.questions) return 0;
    return Object.keys(questionnaire.sections[sectionKey].questions).length;
  };

  const getCompletionColor = (answered, total) => {
    const percentage = (answered / total) * 100;
    if (percentage === 0) return '#f0f0f0';
    if (percentage < 50) return '#ff7875';
    if (percentage < 100) return '#ffa940';
    return '#52c41a';
  };

  const sections = [
    {
      key: 'matters',
      title: 'What Matters',
      icon: '🏷️',
      color: '#1890ff'
    },
    {
      key: 'medication', 
      title: 'Medication',
      icon: '💊',
      color: '#52c41a'
    },
    {
      key: 'mind',
      title: 'Mind',
      icon: '🧠',
      color: '#722ed1'
    },
    {
      key: 'mobility',
      title: 'Mobility',
      icon: '🚶‍♀️',
      color: '#fa541c'
    }
  ];

  const renderSectionSummary = (section) => {
    const sectionData = responses[section.key] || {};
    const summary = getSectionSummary(section.key, sectionData);
    const percentage = Math.round((summary.answered / summary.total) * 100);

    return (
      <Card
        key={section.key}
        style={{
          marginBottom: '20px',
          border: `2px solid ${getCompletionColor(summary.answered, summary.total)}`,
          borderRadius: '12px'
        }}
        headStyle={{
          textAlign: 'center',
          paddingLeft: '0px',
          paddingRight: '0px'
        }}
        title={
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: section.color,
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '10px' }}>{section.icon}</span>
            {section.title}
          </div>
        }
        extra={
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: getCompletionColor(summary.answered, summary.total)
            }}>
              {summary.answered}/{summary.total} Answered
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {percentage}% Complete
            </div>
          </div>
        }
      >
        {Object.keys(sectionData).length === 0 ? (
          <Text style={{ fontSize: '16px', color: '#999', fontStyle: 'italic' }}>
            No responses yet
          </Text>
        ) : (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {getOrderedQuestionKeys(section.key)
              .filter((key) => Object.prototype.hasOwnProperty.call(sectionData, key))
              .map((key) => {
                const value = sectionData[key];
                // Get the actual question text/type from the questionnaire structure
                const question = questionnaire?.sections?.[section.key]?.questions?.[key];
                const questionText = question?.text || key.replace(/([A-Z])/g, ' $1').trim();
                const questionType = question?.type;

                return (
                  <div key={key} style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                    <Text strong style={{ fontSize: '15px', color: '#333', display: 'block', marginBottom: '8px' }}>
                      {questionText}
                    </Text>
                    <div style={{ marginTop: '4px', paddingLeft: '16px' }}>
                      {typeof value === 'object' && value !== null ? (
                        <div>
                          {value.tags && value.tags.length > 0 && (
                            <div style={{ marginBottom: '6px' }}>
                              {value.tags.map(tag => (
                                <Tag key={tag} color="blue" style={{ marginBottom: '2px' }}>
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          )}
                          {value.text && (
                            <Paragraph
                              style={{
                                fontSize: '14px',
                                margin: 0,
                                color: '#666',
                                backgroundColor: '#f0f0f0',
                                padding: '8px',
                                borderRadius: '4px',
                                fontStyle: 'italic'
                              }}
                            >
                              "{value.text}"
                            </Paragraph>
                          )}
                        </div>
                      ) : (
                        <Text style={{ fontSize: '16px', color: '#1890ff', fontWeight: '600' }}>
                          {typeof value === 'number'
                            ? questionType === 'slider'
                              ? getSliderLabel(key, value)
                              : value
                            : value}
                        </Text>
                      )}
                    </div>
                  </div>
                );
              })}
          </Space>
        )}
      </Card>
    );
  };

  const handleSubmit = () => {
    // Calculate overall completion
    let totalAnswered = 0;
    let totalQuestions = 0;
    
    sections.forEach(section => {
      const summary = getSectionSummary(section.key, responses[section.key]);
      totalAnswered += summary.answered;
      totalQuestions += summary.total;
    });

    const overallPercentage = Math.round((totalAnswered / totalQuestions) * 100);

    if (overallPercentage === 0) {
      message.warning('Please answer at least some questions before saving.');
      return;
    }

    if (overallPercentage < 25) {
      message.info(`You've completed ${overallPercentage}% of the assessment. You can save now or continue answering more questions.`);
    }

    onFinalSubmit();
  };

  // Calculate overall completion for header
  let totalAnswered = 0;
  let totalQuestions = 0;
  
  sections.forEach(section => {
    const summary = getSectionSummary(section.key, responses[section.key]);
    totalAnswered += summary.answered;
    totalQuestions += summary.total;
  });

  const overallPercentage = Math.round((totalAnswered / totalQuestions) * 100);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2} style={{ color: '#13c2c2', marginBottom: '10px' }}>
          📋 Review Your Health Assessment
        </Title>
        <Text style={{ fontSize: '18px', color: '#666', marginBottom: '20px', display: 'block' }}>
          Please review your responses below. You can go back to edit any section if needed.
        </Text>
        
        <Card style={{ 
          backgroundColor: overallPercentage >= 75 ? '#f6ffed' : overallPercentage >= 50 ? '#fff7e6' : '#fff2f0',
          border: `2px solid ${getCompletionColor(totalAnswered, totalQuestions)}`,
          marginBottom: '30px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ 
              color: getCompletionColor(totalAnswered, totalQuestions),
              margin: 0
            }}>
              Overall Progress: {totalAnswered}/{totalQuestions} Questions ({overallPercentage}%)
            </Title>
            {overallPercentage < 50 && (
              <Text style={{ fontSize: '16px', color: '#fa8c16' }}>
                💡 Remember: All questions are optional. You can save anytime or continue answering.
              </Text>
            )}
          </div>
        </Card>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {sections.map(renderSectionSummary)}
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: '40px 0' }} />

      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button
            icon={<EditOutlined />}
            size="large"
            style={{ 
              fontSize: '16px',
              height: '50px',
              padding: '0 30px',
              backgroundColor: '#fa8c16',
              borderColor: '#fa8c16',
              color: 'white'
            }}
            onClick={() => message.info('Use the tabs above to edit any section')}
          >
            Edit Responses
          </Button>
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            style={{ 
              fontSize: '18px',
              height: '50px',
              padding: '0 40px',
              backgroundColor: '#13c2c2',
              borderColor: '#13c2c2',
              color: 'white'
            }}
            onClick={handleSubmit}
          >
            Save Assessment
          </Button>
        </Space>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae7ff'
        }}>
          <CheckCircleOutlined style={{ color: '#13c2c2', fontSize: '20px', marginRight: '10px' }} />
          <Text style={{ fontSize: '16px', color: '#006d75' }}>
            Your responses are automatically saved. After saving, you can still return to update your assessment anytime.
          </Text>
        </div>
      </div>
    </div>
  );
} 