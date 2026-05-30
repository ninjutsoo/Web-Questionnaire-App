import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Tag, Row, Col, message, Alert } from 'antd';
import { CheckCircleOutlined, DownloadOutlined, EditOutlined, HomeOutlined, PrinterOutlined, ShareAltOutlined } from '@ant-design/icons';
import { SECTION_META, questionnaireSectionKeys } from '../../constants/rmeDesign';

const { Title, Text, Paragraph } = Typography;

export default function ReviewSubmit({ questionnaire, responses, onSave, onEdit, onHome }) {
  const [shareStatus, setShareStatus] = useState('');

  const normalizeLikertValue = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
    if (value > 10) {
      const scaled = (value / 100) * 9 + 1;
      return Math.min(10, Math.max(1, Math.round(scaled)));
    }
    if (value < 1) return 1;
    return Math.min(10, Math.round(value));
  };

  const mindSliderValueLabels = {
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

    return Object.entries(questions)
      .sort(([keyA], [keyB]) => {
        if (sectionKey === 'mind') {
          const indexA = sliderOrder.indexOf(keyA);
          const indexB = sliderOrder.indexOf(keyB);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
        }
        if (sectionKey === 'mobility') {
          if (keyA === 'mobilityType') return -1;
          if (keyB === 'mobilityType') return 1;
        }
        const numA = keyA.match(/\d+/)?.[0];
        const numB = keyB.match(/\d+/)?.[0];
        if (numA && numB) return parseInt(numA, 10) - parseInt(numB, 10);
        return keyA.localeCompare(keyB);
      })
      .map(([key]) => key);
  };

  const getSliderLabel = (questionKey, rawValue) => {
    const normalized = normalizeLikertValue(rawValue);
    const labels = mindSliderValueLabels[questionKey] || {};
    if (typeof normalized !== 'number') return '';
    if (labels[normalized]) return labels[normalized];
    const numericKeys = Object.keys(labels).map((key) => parseInt(key, 10));
    if (numericKeys.length === 0) return `${normalized}/10`;
    const nearest = numericKeys.reduce((closest, current) =>
      Math.abs(current - normalized) < Math.abs(closest - normalized) ? current : closest
    );
    return labels[nearest] || `${normalized}/10`;
  };

  const isAnswered = (value) => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.some((entry) => Object.values(entry || {}).some((entryValue) => String(entryValue || '').trim()));
      }
      return Boolean(
        (value.tags && value.tags.length > 0) ||
        (value.text && value.text.trim()) ||
        Object.values(value).some((entryValue) => typeof entryValue === 'string' && entryValue.trim())
      );
    }
    return typeof value === 'number' || (typeof value === 'string' && value.trim());
  };

  const getSectionSummary = (sectionKey, sectionData) => {
    const total = Object.keys(questionnaire?.sections?.[sectionKey]?.questions || {}).length;
    const answered = Object.entries(sectionData || {}).filter(([key, value]) => {
      if (key === 'medicationEntries') return isAnswered(value);
      return isAnswered(value);
    }).length;
    return { answered, total };
  };

  const sectionSummaries = questionnaireSectionKeys.map((sectionKey) => {
    const summary = getSectionSummary(sectionKey, responses?.[sectionKey] || {});
    return { sectionKey, ...summary };
  });

  const totals = sectionSummaries.reduce(
    (acc, summary) => ({
      answered: acc.answered + summary.answered,
      total: acc.total + summary.total
    }),
    { answered: 0, total: 0 }
  );
  const overallPercentage = totals.total > 0 ? Math.round((totals.answered / totals.total) * 100) : 0;

  const renderValue = (sectionKey, questionKey, value) => {
    const questionType = questionnaire?.sections?.[sectionKey]?.questions?.[questionKey]?.type;

    if (questionKey === 'medicationEntries' && Array.isArray(value)) {
      return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {value.length === 0 ? (
            <Text>No medication details added.</Text>
          ) : (
            value.map((entry, index) => (
              <div key={`med-review-${index}`} style={{ padding: 10, border: '1px solid #d8dee6', borderRadius: 6 }}>
                <Text strong>Medication {index + 1}</Text>
                <div style={{ marginTop: 6, fontSize: 16 }}>
                  <div>Category: {entry.category || 'Not provided'}</div>
                  <div>Name: {entry.name || 'Not provided'}</div>
                  <div>Dose: {entry.dose || 'Not provided'}</div>
                  <div>Frequency: {entry.frequency || 'Not provided'}</div>
                  <div>Notes: {entry.notes || 'Not provided'}</div>
                </div>
              </div>
            ))
          )}
        </Space>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div>
          {value.tags && value.tags.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {value.tags.map((tag) => (
                <Tag key={tag} style={{ marginBottom: 4, fontSize: 15, padding: '4px 8px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          {value.text && (
            <Paragraph style={{ fontSize: 16, margin: 0, color: 'var(--rme-text)', backgroundColor: '#f7f9fb', padding: 10, borderRadius: 6 }}>
              {value.text}
            </Paragraph>
          )}
        </div>
      );
    }

    return (
      <Text style={{ fontSize: 16, color: 'var(--rme-text)', fontWeight: 700 }}>
        {typeof value === 'number' && questionType === 'slider' ? getSliderLabel(questionKey, value) : value}
      </Text>
    );
  };

  const buildReportText = () => {
    const lines = [
      '4Ms Health Assessment Report',
      `Generated: ${new Date().toLocaleString()}`,
      ''
    ];

    questionnaireSectionKeys.forEach((sectionKey) => {
      const meta = SECTION_META[sectionKey];
      const sectionData = responses?.[sectionKey] || {};
      lines.push(meta.label);
      if (sectionKey === 'medication' && Array.isArray(sectionData.medicationEntries) && sectionData.medicationEntries.length > 0) {
        lines.push('Medication Details:');
        sectionData.medicationEntries.forEach((entry, index) => {
          lines.push(`  Medication ${index + 1}:`);
          lines.push(`    Category: ${entry.category || 'Not provided'}`);
          lines.push(`    Name: ${entry.name || 'Not provided'}`);
          lines.push(`    Dose: ${entry.dose || 'Not provided'}`);
          lines.push(`    Frequency: ${entry.frequency || 'Not provided'}`);
          lines.push(`    Notes: ${entry.notes || 'Not provided'}`);
        });
      }
      getOrderedQuestionKeys(sectionKey).forEach((questionKey) => {
        const question = questionnaire?.sections?.[sectionKey]?.questions?.[questionKey];
        const value = sectionData[questionKey];
        if (!isAnswered(value)) return;
        let formatted = '';
        if (typeof value === 'object' && value !== null) {
          const parts = [];
          if (value.tags?.length) parts.push(`Selected: ${value.tags.join(', ')}`);
          if (value.text?.trim()) parts.push(`Notes: ${value.text.trim()}`);
          formatted = parts.join(' | ');
        } else if (typeof value === 'number' && question?.type === 'slider') {
          formatted = getSliderLabel(questionKey, value);
        } else {
          formatted = String(value);
        }
        lines.push(`- ${question?.text || questionKey}: ${formatted}`);
      });
      lines.push('');
    });

    return lines.join('\n');
  };

  const handleShare = async () => {
    const reportText = buildReportText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: '4Ms Health Assessment Report',
          text: reportText
        });
        setShareStatus('Report shared.');
      } else {
        setShareStatus('Native sharing is not available in this browser. Use Print or Download.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error);
        setShareStatus('Share failed. Use Print or Download instead.');
      }
    }
  };

  const handlePrint = () => {
    setShareStatus('Opening print dialog.');
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([buildReportText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `4ms-health-assessment-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShareStatus('Report downloaded as a text file.');
  };

  const handleSave = async () => {
    const saved = await onSave?.();
    if (saved !== false) message.success('Assessment saved.');
  };

  const renderSectionSummary = (sectionKey) => {
    const meta = SECTION_META[sectionKey];
    const sectionData = responses?.[sectionKey] || {};
    const summary = getSectionSummary(sectionKey, sectionData);
    const percentage = summary.total > 0 ? Math.round((summary.answered / summary.total) * 100) : 0;
    const questionKeys = getOrderedQuestionKeys(sectionKey).filter((key) =>
      Object.prototype.hasOwnProperty.call(sectionData, key)
    );
    const hasMedicationEntries = sectionKey === 'medication' && Array.isArray(sectionData.medicationEntries);

    return (
      <Card
        key={sectionKey}
        style={{ marginBottom: 20, border: `3px solid ${meta.color}`, borderRadius: 8 }}
        title={
          <div style={{ color: meta.color, fontSize: 20, fontWeight: 700 }}>
            {meta.label}
          </div>
        }
        extra={
          <div style={{ textAlign: 'right', color: 'var(--rme-text)' }}>
            <strong>{summary.answered}/{summary.total} answered</strong>
            <div>{percentage}% complete</div>
          </div>
        }
      >
        <Alert
          type={percentage === 100 ? 'success' : percentage > 0 ? 'info' : 'warning'}
          showIcon
          message={percentage === 100 ? 'Complete' : percentage > 0 ? 'Started' : 'Not started'}
          style={{ marginBottom: 14 }}
        />

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {hasMedicationEntries && (
            <div style={{ padding: 12, backgroundColor: '#f7f9fb', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <Text strong style={{ fontSize: 16 }}>Medication details</Text>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onEdit?.('medication', 'medicationEntries')}
                  className="rme-button-secondary"
                  style={{ borderColor: meta.color, color: meta.color }}
                >
                  Edit Medication Details
                </Button>
              </div>
              <div style={{ marginTop: 10 }}>{renderValue(sectionKey, 'medicationEntries', sectionData.medicationEntries)}</div>
            </div>
          )}

          {questionKeys.length === 0 && !hasMedicationEntries ? (
            <Text style={{ fontSize: 16, color: 'var(--rme-muted)', fontStyle: 'italic' }}>
              No responses yet.
            </Text>
          ) : (
            questionKeys.map((key) => {
              const value = sectionData[key];
              const question = questionnaire?.sections?.[sectionKey]?.questions?.[key];
              const questionText = question?.text || key.replace(/([A-Z])/g, ' $1').trim();
              return (
                <div key={key} style={{ padding: 12, backgroundColor: '#f7f9fb', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 16, color: 'var(--rme-text)', flex: '1 1 260px' }}>
                      {questionText}
                    </Text>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => onEdit?.(sectionKey, key)}
                      aria-label={`Edit ${meta.label}: ${questionText}`}
                      className="rme-button-secondary"
                      style={{ borderColor: meta.color, color: meta.color }}
                    >
                      Edit
                    </Button>
                  </div>
                  {renderValue(sectionKey, key, value)}
                </div>
              );
            })
          )}
        </Space>
      </Card>
    );
  };

  return (
    <div style={{ padding: '10px 4px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Title level={2} style={{ color: 'var(--rme-review)', marginBottom: 10 }}>
          Review Your Health Assessment
        </Title>
        <Text style={{ fontSize: 18, color: 'var(--rme-text)', display: 'block' }}>
          Review your responses. Use Edit to go directly back to a section or question.
        </Text>
        <Card style={{ backgroundColor: '#eef9f9', border: '2px solid var(--rme-review)', marginTop: 20 }}>
          <Title level={3} style={{ color: 'var(--rme-review)', margin: 0 }}>
            Overall Progress: {totals.answered}/{totals.total} Questions ({overallPercentage}%)
          </Title>
          {overallPercentage < 50 && (
            <Text style={{ fontSize: 16, color: 'var(--rme-text)' }}>
              All questions are optional. You can save now or continue answering.
            </Text>
          )}
        </Card>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>{questionnaireSectionKeys.map(renderSectionSummary)}</Col>
      </Row>

      <Divider style={{ margin: '32px 0' }} />

      <div className="rme-no-print" style={{ textAlign: 'center' }}>
        <Space size="middle" wrap style={{ justifyContent: 'center' }}>
          <Button
            icon={<CheckCircleOutlined />}
            onClick={handleSave}
            className="rme-button"
            style={{ background: 'var(--rme-review)', borderColor: 'var(--rme-review)', color: '#fff' }}
          >
            Save Assessment
          </Button>
          <Button icon={<ShareAltOutlined />} onClick={handleShare} className="rme-button-secondary">
            Share Report
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint} className="rme-button-secondary">
            Print
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleDownload} className="rme-button-secondary">
            Download
          </Button>
          <Button icon={<HomeOutlined />} onClick={onHome} className="rme-button-secondary">
            Home
          </Button>
        </Space>
        {shareStatus && (
          <div role="status" aria-live="polite" style={{ marginTop: 18, fontSize: 16, color: 'var(--rme-review)', fontWeight: 700 }}>
            {shareStatus}
          </div>
        )}
        <div style={{ marginTop: 22, padding: 16, backgroundColor: '#eef9f9', borderRadius: 8, border: '2px solid var(--rme-review)' }}>
          <Text style={{ fontSize: 16, color: 'var(--rme-text)' }}>
            You control where this report is shared. Native sharing uses your browser or device share options.
          </Text>
        </div>
      </div>
    </div>
  );
}
