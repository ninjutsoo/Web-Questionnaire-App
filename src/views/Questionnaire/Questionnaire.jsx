import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Button, Progress, message } from 'antd';
import { HomeOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons';
import { auth } from '../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getQuestionnaire, getUserSession, saveSectionResponses } from '../../services/questionnaireService';
import FourMSection from './4msSection';
import ReviewSubmit from './ReviewSubmit';

export default function Questionnaire() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('matters');
  const [questionnaire, setQuestionnaire] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [responses, setResponses] = useState({
    matters: {},
    medication: {},
    mind: {},
    mobility: {}
  });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Refs to access child component data
  const whatMattersRef = useRef(null);
  const medicationRef = useRef(null);
  const mindRef = useRef(null);
  const mobilityRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        console.log("No user authenticated, redirecting to signin");
        navigate("/signin");
      } else {
        console.log("User authenticated:", currentUser.uid, currentUser.email);
        setUser(currentUser);
        initializeQuestionnaire(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const initializeQuestionnaire = async (uid) => {
    try {
      console.log('Initializing questionnaire for user:', uid);
      // Load questionnaire structure and user session in parallel
      const [questionnaireData, sessionData] = await Promise.all([
        getQuestionnaire(),
        getUserSession(uid)
      ]);
      
      console.log('Questionnaire data loaded:', !!questionnaireData);
      console.log('Session data loaded:', !!sessionData);
      
      if (questionnaireData) {
        setQuestionnaire(questionnaireData);
      } else {
        console.error('No questionnaire data received');
        message.error('Failed to load questionnaire structure');
        return;
      }
      
      if (sessionData) {
        setSessionId(sessionData.sessionId);
        setResponses(sessionData.data.responses || {
          matters: {},
          medication: {},
          mind: {},
          mobility: {}
        });
      } else {
        console.error('No session data received');
        message.error('Failed to load user session');
        return;
      }
      
      console.log('Questionnaire initialized successfully');
    } catch (error) {
      console.error('Error initializing questionnaire:', error);
      message.error('Failed to load questionnaire. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple function to update local responses (no automatic saving)
  const updateResponses = (section, data) => {
    const updatedResponses = {
      ...responses,
      [section]: data
    };
    setResponses(updatedResponses);
  };

  // Manual save function - only saves when user clicks save button
  const handleSave = async () => {
    if (!sessionId) {
      message.error('No session found. Please refresh the page and try again.');
      return;
    }
    
    try {
      message.loading('Saving your progress...', 1);
      
      // Collect current data from all child components
      const currentData = {
        matters: whatMattersRef.current?.getCurrentData() || {},
        medication: medicationRef.current?.getCurrentData() || {},
        mind: mindRef.current?.getCurrentData() || {},
        mobility: mobilityRef.current?.getCurrentData() || {}
      };
      
      const savePromises = Object.entries(currentData).map(([section, data]) => {
        if (data && Object.keys(data).length > 0) {
          return saveSectionResponses(sessionId, section, data);
        }
        return Promise.resolve();
      });
      
      await Promise.all(savePromises);
      
      // Update local state after successful save
      setResponses(currentData);
      
      message.success('All progress saved successfully!');
    } catch (error) {
      console.error('Error saving progress:', error);
      message.error('Failed to save progress. Please try again.');
    }
  };

  const getCurrentSectionData = (sectionKey) => {
    // Get current live data from child components (including unsaved changes)
    switch(sectionKey) {
      case 'matters':
        return whatMattersRef.current?.getCurrentData() || responses.matters || {};
      case 'medication':
        return medicationRef.current?.getCurrentData() || responses.medication || {};
      case 'mind':
        return mindRef.current?.getCurrentData() || responses.mind || {};
      case 'mobility':
        return mobilityRef.current?.getCurrentData() || responses.mobility || {};
      default:
        return {};
    }
  };

  const calculateProgress = (sectionKey) => {
    if (!questionnaire || !sectionKey) {
      return 0;
    }
    
    const sectionQuestions = questionnaire.sections[sectionKey]?.questions || {};
    const totalQuestions = Object.keys(sectionQuestions).length;
    
    if (totalQuestions === 0) return 0;
    
    const sectionData = getCurrentSectionData(sectionKey);
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
    
    return Math.round((answered / totalQuestions) * 100);
  };

  const calculateOverallProgress = () => {
    if (!questionnaire) return 0;
    
    const sections = ['matters', 'medication', 'mind', 'mobility'];
    let totalAnswered = 0;
    let totalQuestions = 0;
    
    sections.forEach(sectionKey => {
      const sectionQuestions = questionnaire.sections[sectionKey]?.questions || {};
      const sectionTotal = Object.keys(sectionQuestions).length;
      totalQuestions += sectionTotal;
      
      const currentData = getCurrentSectionData(sectionKey);
      
      Object.values(currentData).forEach(value => {
        if (typeof value === 'object' && value !== null) {
          if ((value.tags && value.tags.length > 0) || (value.text && value.text.trim())) {
            totalAnswered++;
          }
        } else if (typeof value === 'number' || (typeof value === 'string' && value.trim())) {
          totalAnswered++;
        }
      });
    });
    
    return totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  };

  const getSectionBaseColor = (tabKey) => {
    const baseColors = {
      matters: '#1890ff',     // Bright Blue
      medication: '#00b96b',  // Emerald Green
      mind: '#9254de',        // Vivid Purple
      mobility: '#ff4d4f',    // Red-Orange
      review: '#13c2c2'       // Teal for review
    };
    return baseColors[tabKey] || '#1890ff';
  };

  const getTabColor = (tabKey) => {
    const sectionData = responses[tabKey] || {};
    const progress = calculateProgress(tabKey);
    
    if (progress === 0) return '#f0f0f0';
    if (progress < 50) return '#ff7875';
    if (progress < 100) return '#ffa940';
    return getSectionBaseColor(tabKey);
  };

  // Function to trigger progress updates when local data changes
  const triggerProgressUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabItems = [
    {
      key: 'matters',
      label: 'What Matters',
      children: (
        <FourMSection 
          ref={whatMattersRef}
          section="matters"
          questionnaire={questionnaire}
          responses={responses.matters}
          onLocalChange={triggerProgressUpdate}
        />
      )
    },
    {
      key: 'medication',
      label: 'Medication',
      children: (
        <FourMSection 
          ref={medicationRef}
          section="medication"
          questionnaire={questionnaire}
          responses={responses.medication}
          onLocalChange={triggerProgressUpdate}
        />
      )
    },
    {
      key: 'mind',
      label: 'Mind',
      children: (
        <FourMSection 
          ref={mindRef}
          section="mind"
          questionnaire={questionnaire}
          responses={responses.mind}
          onLocalChange={triggerProgressUpdate}
        />
      )
    },
    {
      key: 'mobility',
      label: 'Mobility',
      children: (
        <FourMSection 
          ref={mobilityRef}
          section="mobility"
          questionnaire={questionnaire}
          responses={responses.mobility}
          onLocalChange={triggerProgressUpdate}
        />
      )
    },
    {
      key: 'review',
      label: 'Review & Submit',
      children: (
        <ReviewSubmit 
          questionnaire={questionnaire}
          responses={responses}
          onSave={handleSave}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading your assessment...
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <div style={{ marginBottom: '20px' }}>❌ Failed to load questionnaire</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px 40px', 
        borderBottom: '1px solid #e8e8e8',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Button 
            icon={<LeftOutlined />}
            onClick={() => navigate('/home')}
            size="large"
            style={{ 
              fontSize: '16px',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              color: 'white'
            }}
          >
            Back to Home
          </Button>
          
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            color: '#1890ff',
            textAlign: 'center',
            flex: 1
          }}>
            Health Assessment - 4 Ms
          </h1>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button 
              icon={<SaveOutlined />}
              onClick={handleSave}
              size="large"
              style={{
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
                color: 'white'
              }}
            >
              Save Progress
            </Button>
            <Button 
              icon={<HomeOutlined />}
              onClick={() => navigate('/home')}
              size="large"
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: 'white'
              }}
            />
          </div>
        </div>
      </div>

      {/* Progress Bar for Current Tab */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px 40px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
            {activeTab === 'review' ? 'Overall Assessment Progress' : `${tabItems.find(tab => tab.key === activeTab)?.label} Progress`}
          </div>
          <Progress 
            percent={activeTab === 'review' ? calculateOverallProgress() : calculateProgress(activeTab)} 
            strokeColor={getSectionBaseColor(activeTab)}
            size="default"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          type="card"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          items={tabItems.map(item => ({
            ...item,
            label: (
              <div style={{ 
                padding: '8px 16px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: getSectionBaseColor(item.key),
                borderRadius: '6px',
                color: 'white',
                minWidth: '120px',
                textAlign: 'center',
                opacity: item.key === activeTab ? 1 : 0.7
              }}>
                <div>{item.label}</div>
                <div style={{ 
                  fontSize: '12px', 
                  marginTop: '2px',
                  opacity: 0.9 
                }}>
                  {item.key === 'review' ? `${calculateOverallProgress()}% Overall` : `${calculateProgress(item.key)}% Complete`}
                </div>
              </div>
            )
          }))}
        />
      </div>
    </div>
  );
} 