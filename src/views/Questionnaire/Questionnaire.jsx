import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Button, Progress, message } from 'antd';
import { HomeOutlined, LeftOutlined } from '@ant-design/icons';
import { auth, db } from '../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import WhatMatters from './WhatMatters';
import Medication from './Medication';
import Mind from './Mind';
import Mobility from './Mobility';
import ReviewSubmit from './ReviewSubmit';

export default function Questionnaire() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('matters');
  const [responses, setResponses] = useState({
    matters: {},
    medication: {},
    mind: {},
    mobility: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        console.log("No user authenticated, redirecting to signin");
        navigate("/signin");
      } else {
        console.log("User authenticated:", currentUser.uid, currentUser.email);
        setUser(currentUser);
        loadExistingResponses(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const loadExistingResponses = async (uid) => {
    try {
      // Use the existing Users collection which already has proper permissions
      const docRef = doc(db, 'Users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Load questionnaire responses if they exist
        if (data.questionnaireResponses) {
          setResponses(data.questionnaireResponses || responses);
        }
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResponses = async (section, data) => {
    if (!user) return;
    
    const updatedResponses = {
      ...responses,
      [section]: data
    };
    
    setResponses(updatedResponses);
    
    try {
      // Save to the existing Users collection with merge option
      await setDoc(doc(db, 'Users', user.uid), {
        questionnaireResponses: updatedResponses,
        questionnaireLastUpdated: new Date(),
      }, { merge: true }); // This preserves existing user data
      
      message.success('Progress saved!');
    } catch (error) {
      console.error('Error saving responses:', error);
      message.error('Failed to save progress');
    }
  };

  const calculateProgress = (sectionData) => {
    const totalQuestions = {
      matters: 4,
      medication: 4, 
      mind: 7,
      mobility: 4
    };
    
    if (!sectionData || typeof sectionData !== 'object') {
      return 0;
    }
    
    const answered = Object.keys(sectionData).length;
    const total = totalQuestions[activeTab] || 1;
    return Math.round((answered / total) * 100);
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
    const progress = calculateProgress(sectionData);
    
    if (progress === 0) return '#f0f0f0';
    if (progress < 50) return '#ff7875';
    if (progress < 100) return '#ffa940';
    return getSectionBaseColor(tabKey);
  };

  const tabItems = [
    {
      key: 'matters',
      label: 'What Matters',
      children: (
        <WhatMatters 
          responses={responses.matters}
          onSave={(data) => saveResponses('matters', data)}
        />
      )
    },
    {
      key: 'medication',
      label: 'Medication',
      children: (
        <Medication 
          responses={responses.medication}
          onSave={(data) => saveResponses('medication', data)}
        />
      )
    },
    {
      key: 'mind',
      label: 'Mind',
      children: (
        <Mind 
          responses={responses.mind}
          onSave={(data) => saveResponses('mind', data)}
        />
      )
    },
    {
      key: 'mobility',
      label: 'Mobility',
      children: (
        <Mobility 
          responses={responses.mobility}
          onSave={(data) => saveResponses('mobility', data)}
        />
      )
    },
    {
      key: 'review',
      label: 'Review & Submit',
      children: (
        <ReviewSubmit 
          responses={responses}
          onFinalSubmit={() => {
            message.success('Assessment submitted successfully!');
            navigate('/home');
          }}
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

      {/* Progress Bar for Current Tab */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px 40px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
            {tabItems.find(tab => tab.key === activeTab)?.label} Progress
          </div>
          <Progress 
            percent={calculateProgress(responses[activeTab] || {})} 
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
                {item.label}
              </div>
            )
          }))}
        />
      </div>
    </div>
  );
} 