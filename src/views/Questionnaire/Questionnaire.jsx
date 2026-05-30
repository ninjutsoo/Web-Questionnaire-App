import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Progress, message } from 'antd';
import { HomeOutlined, LeftOutlined, RightOutlined, SaveOutlined } from '@ant-design/icons';
import { auth } from '../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getQuestionnaire, getUserSession, saveSectionResponses } from '../../services/questionnaireService';
import FourMSection from './4msSection';
import ReviewSubmit from './ReviewSubmit';
import { SECTION_STEPS, getSectionMeta, questionnaireSectionKeys } from '../../constants/rmeDesign';

const EMPTY_RESPONSES = {
  matters: {},
  medication: {},
  mind: {},
  mobility: {}
};

export default function Questionnaire() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matters');
  const [questionnaire, setQuestionnaire] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [responses, setResponses] = useState(EMPTY_RESPONSES);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  const [focusQuestionKey, setFocusQuestionKey] = useState(null);
  const sectionHeadingRef = useRef(null);

  const whatMattersRef = useRef(null);
  const medicationRef = useRef(null);
  const mindRef = useRef(null);
  const mobilityRef = useRef(null);

  const sectionRefs = {
    matters: whatMattersRef,
    medication: medicationRef,
    mind: mindRef,
    mobility: mobilityRef
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/signin');
      } else {
        initializeQuestionnaire(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    sectionHeadingRef.current?.focus();
  }, [activeTab]);

  const initializeQuestionnaire = async (uid) => {
    try {
      const [questionnaireData, sessionData] = await Promise.all([
        getQuestionnaire(),
        getUserSession(uid)
      ]);

      if (!questionnaireData) {
        message.error('Failed to load questionnaire structure');
        return;
      }

      setQuestionnaire(questionnaireData);

      if (sessionData) {
        setSessionId(sessionData.sessionId);
        setResponses({ ...EMPTY_RESPONSES, ...(sessionData.data.responses || {}) });
      } else {
        message.error('Failed to load user session');
      }
    } catch (error) {
      console.error('Error initializing questionnaire:', error);
      message.error('Failed to load questionnaire. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSectionData = (sectionKey) => {
    if (!questionnaireSectionKeys.includes(sectionKey)) return {};
    return sectionRefs[sectionKey]?.current?.getCurrentData() || responses[sectionKey] || {};
  };

  const getCurrentLiveResponses = () => ({
    matters: getCurrentSectionData('matters'),
    medication: getCurrentSectionData('medication'),
    mind: getCurrentSectionData('mind'),
    mobility: getCurrentSectionData('mobility')
  });

  const hasAnswer = (value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value.medicationEntries)) {
        return value.medicationEntries.some((entry) =>
          Object.values(entry || {}).some((entryValue) => String(entryValue || '').trim())
        );
      }
      return Boolean(
        (value.tags && value.tags.length > 0) ||
        (value.text && value.text.trim()) ||
        Object.values(value).some((item) => typeof item === 'string' && item.trim())
      );
    }
    return typeof value === 'number' || (typeof value === 'string' && value.trim());
  };

  const calculateSectionStats = (sectionKey) => {
    const sectionQuestions = questionnaire?.sections?.[sectionKey]?.questions || {};
    const totalQuestions = Object.keys(sectionQuestions).length;
    const sectionData = getCurrentSectionData(sectionKey);
    const answered = Object.entries(sectionData).filter(([key, value]) => {
      if (key === 'medicationEntries') {
        return Array.isArray(value) && value.some((entry) =>
          Object.values(entry || {}).some((entryValue) => String(entryValue || '').trim())
        );
      }
      return hasAnswer(value);
    }).length;
    return { answered, total: totalQuestions, percent: totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0 };
  };

  const calculateOverallProgress = () => {
    if (!questionnaire) return 0;
    let totalAnswered = 0;
    let totalQuestions = 0;
    questionnaireSectionKeys.forEach((sectionKey) => {
      const stats = calculateSectionStats(sectionKey);
      totalAnswered += stats.answered;
      totalQuestions += stats.total;
    });
    return totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  };

  const saveAllCurrentResponses = async () => {
    if (!sessionId) {
      message.error('No session found. Please refresh the page and try again.');
      return false;
    }

    try {
      setSaveStatus('Saving your progress...');
      const currentData = getCurrentLiveResponses();
      await Promise.all(
        Object.entries(currentData).map(([section, data]) => saveSectionResponses(sessionId, section, data || {}))
      );
      setResponses(currentData);
      const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      setSaveStatus(`Saved at ${time}.`);
      message.success('Progress saved.');
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      setSaveStatus('Save failed. Please try again.');
      message.error('Failed to save progress. Please try again.');
      return false;
    }
  };

  const triggerProgressUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const currentIndex = SECTION_STEPS.indexOf(activeTab);
  const currentMeta = getSectionMeta(activeTab);
  const currentStats = activeTab === 'review'
    ? { percent: calculateOverallProgress(), answered: 0, total: 0 }
    : calculateSectionStats(activeTab);

  const goToSection = async (sectionKey, questionKey = null) => {
    if (!SECTION_STEPS.includes(sectionKey)) return;
    if (questionnaireSectionKeys.includes(activeTab)) {
      setResponses(getCurrentLiveResponses());
    }
    setFocusQuestionKey(questionKey);
    setActiveTab(sectionKey);
  };

  const goNext = async () => {
    if (activeTab === 'review') return;
    setResponses(getCurrentLiveResponses());
    const next = SECTION_STEPS[Math.min(currentIndex + 1, SECTION_STEPS.length - 1)];
    setActiveTab(next);
  };

  const goBack = () => {
    if (currentIndex <= 0) return;
    setResponses(getCurrentLiveResponses());
    setActiveTab(SECTION_STEPS[currentIndex - 1]);
  };

  const goHomeSafely = async () => {
    const shouldSave = window.confirm('Save your current assessment progress before going Home?');
    if (shouldSave) {
      const saved = await saveAllCurrentResponses();
      if (!saved) return;
    }
    navigate('/home');
  };

  const renderActiveSection = () => {
    if (activeTab === 'review') {
      return (
        <ReviewSubmit
          questionnaire={questionnaire}
          responses={getCurrentLiveResponses()}
          onSave={saveAllCurrentResponses}
          onEdit={goToSection}
          onHome={goHomeSafely}
        />
      );
    }

    return (
      <FourMSection
        ref={sectionRefs[activeTab]}
        section={activeTab}
        questionnaire={questionnaire}
        responses={responses[activeTab]}
        onLocalChange={triggerProgressUpdate}
        focusQuestionKey={focusQuestionKey}
        onFocusHandled={() => setFocusQuestionKey(null)}
      />
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: 18 }}>
        Loading your assessment...
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: 18 }}>
        <div style={{ marginBottom: 20 }}>Failed to load questionnaire.</div>
        <Button onClick={() => window.location.reload()} className="rme-button-secondary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
      <div
        data-refresh-trigger={refreshTrigger}
        style={{
          backgroundColor: '#fff',
          padding: 'clamp(8px, 2vw, 16px)',
          borderRadius: 8,
          marginBottom: 18,
          border: '2px solid #d8dee6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <h1
          ref={sectionHeadingRef}
          tabIndex={-1}
          style={{ fontSize: 24, margin: '0 0 10px', color: currentMeta.color }}
        >
          Section {currentIndex + 1} of {SECTION_STEPS.length}: {currentMeta.label}
        </h1>
        <Progress
          percent={currentStats.percent}
          strokeColor={currentMeta.color}
          size="small"
          showInfo
          format={(percent) => activeTab === 'review' ? `${percent}% overall` : `${percent}% complete`}
        />
        <p style={{ margin: '10px 0 0', fontSize: 16, color: 'var(--rme-muted)' }}>
          {activeTab === 'review'
            ? 'Review, save, and share your assessment.'
            : `${currentStats.answered} of ${currentStats.total} questions answered in ${currentMeta.label}. All questions are optional.`}
        </p>
        <div role="status" aria-live="polite" style={{ minHeight: 24, fontSize: 16, fontWeight: 700, color: 'var(--rme-review)' }}>
          {saveStatus}
        </div>
      </div>

      <nav
        aria-label="Assessment sections"
        className="rme-no-print"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
          marginBottom: 18
        }}
      >
        {SECTION_STEPS.map((sectionKey, index) => {
          const meta = getSectionMeta(sectionKey);
          const isActive = activeTab === sectionKey;
          const stats = sectionKey === 'review' ? { percent: calculateOverallProgress() } : calculateSectionStats(sectionKey);
          return (
            <button
              key={sectionKey}
              type="button"
              onClick={() => goToSection(sectionKey)}
              aria-current={isActive ? 'step' : undefined}
              className={`rme-chip ${isActive ? 'rme-chip-selected' : ''}`}
              style={{
                borderColor: isActive ? meta.color : 'var(--rme-border)',
                color: isActive ? meta.color : 'var(--rme-text)',
                background: isActive ? meta.bg : '#fff'
              }}
            >
              <strong>{index + 1}. {meta.shortLabel}</strong>
              <span style={{ display: 'block', marginTop: 4 }}>
                {sectionKey === 'review' ? `${stats.percent}% overall` : `${stats.percent}% complete`}
              </span>
            </button>
          );
        })}
      </nav>

      <main
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 16,
          border: '2px solid #d8dee6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          minHeight: 'calc(100vh - 240px)'
        }}
      >
        {renderActiveSection()}

        <div className="rme-action-bar rme-no-print" aria-label="Assessment actions">
          <Button
            icon={<LeftOutlined />}
            onClick={goBack}
            disabled={currentIndex === 0}
            className="rme-button-secondary"
          >
            Back
          </Button>
          <Button
            icon={<RightOutlined />}
            onClick={goNext}
            disabled={activeTab === 'review'}
            style={{ background: currentMeta.color, borderColor: currentMeta.color, color: '#fff' }}
            className="rme-button"
          >
            Next
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={saveAllCurrentResponses}
            className="rme-button-secondary"
            style={{ borderColor: 'var(--rme-review)', color: 'var(--rme-review)' }}
          >
            Save
          </Button>
          <Button
            icon={<HomeOutlined />}
            onClick={goHomeSafely}
            className="rme-button-secondary"
          >
            Home
          </Button>
        </div>
      </main>
    </div>
  );
}
