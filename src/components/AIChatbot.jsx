import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Typography, Space, Avatar, Spin, Alert, Divider, Tag, Switch, Tooltip } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, MessageOutlined, HeartOutlined, AudioOutlined, AudioMutedOutlined, ReloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { auth } from '../services/firebase';
import { getUserQuestionnaireContext } from '../services/questionnaireService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const { TextArea } = Input;
const { Title, Text } = Typography;

const AIChatbot = () => {
  // Initial assistant message
  const initialMessages = [
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I\'m here to help you with health-related questions, provide information, or just chat. How can I assist you today? 💙',
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('aiChatMessages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }));
      } catch {
        return initialMessages;
      }
    }
    return initialMessages;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userQuestionnaireData, setUserQuestionnaireData] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationText, setLocationText] = useState('');

  // Save suggestions to localStorage cache whenever they change
  useEffect(() => {
    if (suggestions.length > 0) {
      localStorage.setItem('aiQuickQuestions', JSON.stringify(suggestions));
    }
  }, [suggestions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        console.log('Voice transcript:', transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access to use voice input.');
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.log('Speech recognition not supported');
    }
  }, []);

  // Always load context when user changes or when component is focused
  useEffect(() => {
    let unsubscribe;
    const loadUserData = async (user) => {
      try {
        if (user) {
          const questionnaireContext = await getUserQuestionnaireContext(user.uid);
          setUserQuestionnaireData(questionnaireContext);
          console.log('Loaded user questionnaire data:', questionnaireContext);
        } else {
          setUserQuestionnaireData(null);
        }
      } catch (error) {
        setUserQuestionnaireData(null);
        console.error('Error loading user questionnaire data:', error);
      }
    };
    unsubscribe = auth.onAuthStateChanged((currentUser) => {
      loadUserData(currentUser);
    });
    // Also reload when window/tab regains focus
    const handleFocus = () => {
      const user = auth.currentUser;
      if (user) loadUserData(user);
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Load saved quick questions from Firebase
  const loadSavedQuickQuestions = async (userId) => {
    console.log('🔍 loadSavedQuickQuestions called for userId:', userId);
    try {
      // First, try to load from localStorage cache for instant display
      const saved = localStorage.getItem('aiQuickQuestions');
      console.log('🔍 localStorage cache:', saved);
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestions(parsed);
            console.log('✅ Loaded cached quick questions for instant display:', parsed);
          }
        } catch (parseError) {
          console.error('❌ Error parsing cached questions:', parseError);
        }
      }
      
      const sessionId = `${userId}_4ms_health`;
      console.log('🔍 Checking Firebase document:', sessionId);
      const docRef = doc(db, 'Answers', sessionId);
      const docSnap = await getDoc(docRef);
      
      console.log('🔍 Firebase document exists:', docSnap.exists());
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('🔍 Firebase data:', data);
        
        if (data.quickQuestions && Array.isArray(data.quickQuestions) && data.quickQuestions.length > 0) {
          // Check if Firebase data is newer than cache
          const cacheTimestamp = localStorage.getItem('aiQuickQuestionsTimestamp');
          const firebaseTimestamp = data.quickQuestionsUpdatedAt;
          
          console.log('🔍 Cache timestamp:', cacheTimestamp);
          console.log('🔍 Firebase timestamp:', firebaseTimestamp);
          
          // Check if cached questions are the default ones
          const defaultQuestions = [
            "What are some good exercises for seniors?",
            "How can I improve my sleep quality?",
            "What foods are good for heart health?",
            "How can I manage stress better?",
            "How can I stay mentally active?"
          ];
          
          const cachedQuestions = JSON.parse(localStorage.getItem('aiQuickQuestions') || '[]');
          const isCachedDefault = JSON.stringify(cachedQuestions.sort()) === JSON.stringify(defaultQuestions.sort());
          
          if (!cacheTimestamp || new Date(firebaseTimestamp) >= new Date(cacheTimestamp) || isCachedDefault) {
            setSuggestions(data.quickQuestions);
            localStorage.setItem('aiQuickQuestions', JSON.stringify(data.quickQuestions));
            localStorage.setItem('aiQuickQuestionsTimestamp', firebaseTimestamp);
            console.log('✅ Loaded quick questions from Firebase:', data.quickQuestions);
            if (isCachedDefault) {
              console.log('✅ Overriding default cached questions with Firebase data');
            }
          } else {
            console.log('✅ Using cached quick questions (Firebase data is older)');
          }
          return;
        } else {
          console.log('⚠️ Firebase document exists but no quickQuestions found');
        }
      } else {
        console.log('⚠️ Firebase document does not exist');
      }
      
      // Only set defaults if we don't have any cached questions
      if (!saved || !localStorage.getItem('aiQuickQuestions')) {
        console.log('No saved quick questions found, using defaults');
        const defaultQuestions = [
          "What are some good exercises for seniors?",
          "How can I improve my sleep quality?",
          "What foods are good for heart health?",
          "How can I manage stress better?",
          "How can I stay mentally active?"
        ];
        setSuggestions(defaultQuestions);
        // Save defaults to cache so they persist
        localStorage.setItem('aiQuickQuestions', JSON.stringify(defaultQuestions));
        localStorage.setItem('aiQuickQuestionsTimestamp', new Date().toISOString());
      } else {
        console.log('✅ Using existing cached questions');
      }
    } catch (error) {
      console.error('❌ Error loading saved quick questions:', error);
      // Only set defaults if we don't have any cached questions
      if (!localStorage.getItem('aiQuickQuestions')) {
        const defaultQuestions = [
          "What are some good exercises for seniors?",
          "How can I improve my sleep quality?",
          "What foods are good for heart health?",
          "How can I manage stress better?",
          "How can I stay mentally active?"
        ];
        setSuggestions(defaultQuestions);
        // Save defaults to cache so they persist
        localStorage.setItem('aiQuickQuestions', JSON.stringify(defaultQuestions));
        localStorage.setItem('aiQuickQuestionsTimestamp', new Date().toISOString());
      }
    }
  };

  // Save quick questions to Firebase
  const saveQuickQuestions = async (userId, questions) => {
    console.log('💾 saveQuickQuestions called for userId:', userId);
    console.log('💾 Questions to save:', questions);
    try {
      const sessionId = `${userId}_4ms_health`;
      const docRef = doc(db, 'Answers', sessionId);
      const timestamp = new Date().toISOString();
      
      console.log('💾 Saving to Firebase document:', sessionId);
      console.log('💾 Timestamp:', timestamp);
      
      await setDoc(docRef, {
        quickQuestions: questions,
        quickQuestionsUpdatedAt: timestamp
      }, { merge: true });
      
      // Update cache timestamp
      localStorage.setItem('aiQuickQuestionsTimestamp', timestamp);
      // Also save to localStorage cache for immediate access
      localStorage.setItem('aiQuickQuestions', JSON.stringify(questions));
      console.log('✅ Saved quick questions to Firebase and cache:', questions);
    } catch (error) {
      console.error('❌ Error saving quick questions:', error);
      console.error('❌ Error details:', error.message);
    }
  };

  // Fetch saved quick questions from backend on load
  useEffect(() => {
    const fetchSavedQuickQuestions = async () => {
      console.log('🔄 useEffect triggered - userQuestionnaireData changed');
      console.log('📊 userQuestionnaireData:', userQuestionnaireData);
      console.log('📊 userQuestionnaireData.userId:', userQuestionnaireData?.userId);
      
      setSuggestionsLoading(true);
      
      if (userQuestionnaireData && userQuestionnaireData.userId) {
        console.log('✅ Loading saved questions for user:', userQuestionnaireData.userId);
        await loadSavedQuickQuestions(userQuestionnaireData.userId);
      } else if (userQuestionnaireData === null) {
        // Only set defaults if userQuestionnaireData is explicitly null (not loading)
        console.log('⚠️ No user data available, setting default questions');
        setSuggestions([
          "What are some good exercises for seniors?",
          "How can I improve my sleep quality?",
          "What foods are good for heart health?",
          "How can I manage stress better?",
          "How can I stay mentally active?"
        ]);
      } else {
        console.log('⏳ User data is still loading, waiting...');
        // Don't set anything if userQuestionnaireData is undefined (still loading)
      }
      
      setSuggestionsLoading(false);
    };
    
    fetchSavedQuickQuestions();
    // eslint-disable-next-line
  }, [userQuestionnaireData]);

  // Save messages to localStorage on every change
  useEffect(() => {
    localStorage.setItem('aiChatMessages', JSON.stringify(messages));
  }, [messages]);

  // Save suggestions to localStorage cache whenever they change
  useEffect(() => {
    if (suggestions.length > 0) {
      localStorage.setItem('aiQuickQuestions', JSON.stringify(suggestions));
      console.log('✅ Auto-saved suggestions to cache:', suggestions);
    }
  }, [suggestions]);

  // Location retrieval and reverse geocoding
  const fetchLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    setLocationText('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Use OpenStreetMap Nominatim for reverse geocoding
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        // Compose a readable address
        let address = data.display_name;
        // Optionally, format with city, state, country, postcode, etc.
        if (data.address) {
          const a = data.address;
          address = [a.road, a.suburb, a.city, a.state, a.postcode, a.country]
            .filter(Boolean)
            .join(', ');
        }
        setLocationText(address);
      } catch (err) {
        setLocationError('Failed to retrieve address.');
      }
      setLocationLoading(false);
    }, (err) => {
      setLocationError('Unable to retrieve your location.');
      setLocationLoading(false);
    });
  };

  useEffect(() => {
    if (locationEnabled) {
      fetchLocation();
    } else {
      setLocationText('');
      setLocationError(null);
    }
    // eslint-disable-next-line
  }, [locationEnabled]);

  const sendMessage = async (messageContent = null) => {
    const content = messageContent || input.trim();
    if (!content) return;

    const newMessage = {
      role: 'user',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare context for AI - let backend handle system prompt
      let contextMessage = '';
      if (userQuestionnaireData && userQuestionnaireData.completedSections.length > 0) {
        contextMessage = `\n\n**User's Health Assessment Context:**\n`;
        contextMessage += `This person has completed the following sections of their health assessment: ${userQuestionnaireData.completedSections.join(', ')}.\n\n`;
        Object.entries(userQuestionnaireData.responses).forEach(([section, questions]) => {
          contextMessage += `**${section.charAt(0).toUpperCase() + section.slice(1)} Section:**\n`;
          Object.entries(questions).forEach(([question, answer]) => {
            contextMessage += `- ${question}: ${answer}\n`;
          });
          contextMessage += '\n';
        });
      }
      
      // Add location to user context
      const userContextWithLocation = {
        ...userQuestionnaireData,
        location: locationText || undefined
      };
      // DEBUG: Log what we're sending to backend
      console.log('DEBUG: Sending to backend - messages:', messages);
      console.log('DEBUG: Sending to backend - userContext:', userContextWithLocation);

      const response = await axios.post('http://localhost:5001/api/chat', {
        messages: [
          ...messages, 
          newMessage
        ],
        userContext: userContextWithLocation
      });

      // Log debug information from backend
      if (response.data.debug) {
        console.log('🔧 BACKEND DEBUG INFO:');
        console.log('Model:', response.data.debug.model);
        console.log('Max Tokens:', response.data.debug.maxTokens);
        console.log('Temperature:', response.data.debug.temperature);
        console.log('System Prompt (first 500 chars):', response.data.debug.systemPrompt);
      }

      const aiResponse = {
        role: 'assistant',
        content: response.data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I\'m having trouble connecting right now. Please try again in a moment.');
      
      // Add a fallback response
      const fallbackResponse = {
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment, or feel free to ask me about health topics, exercises, or general wellness advice.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      alert('Voice recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: '16px',
          animation: 'fadeIn 0.3s ease-in'
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: '8px'
          }}
        >
          <Avatar
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            style={{
              backgroundColor: isUser ? '#1890ff' : '#52c41a',
              flexShrink: 0
            }}
          />
          <div
            style={{
              backgroundColor: isUser ? '#1890ff' : '#f0f0f0',
              color: isUser ? 'white' : '#333',
              padding: '12px 16px',
              borderRadius: '18px',
              borderTopLeftRadius: isUser ? '18px' : '4px',
              borderTopRightRadius: isUser ? '4px' : '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              wordWrap: 'break-word',
              lineHeight: '1.5'
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <Text style={{ 
                color: isUser ? 'white' : '#666',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {isUser ? 'You' : 'AI Assistant'}
              </Text>
            </div>
            <div style={{ fontSize: isUser ? '18px' : '18px', textAlign: isUser ? 'right' : 'left', lineHeight: '1.8', paddingLeft: isUser ? 0 : 8, paddingTop: 2, paddingBottom: 2 }}>
              {isUser ? (
                message.content
              ) : (
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 style={{fontSize: '20px', fontWeight: 'bold', margin: '8px 0'}} {...props} />,
                    h2: ({node, ...props}) => <h2 style={{fontSize: '18px', fontWeight: 'bold', margin: '8px 0'}} {...props} />,
                    h3: ({node, ...props}) => <h3 style={{fontSize: '17px', fontWeight: 'bold', margin: '6px 0'}} {...props} />,
                    h4: ({node, ...props}) => <h4 style={{fontSize: '16px', fontWeight: 'bold', margin: '6px 0'}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{fontWeight: 'bold'}} {...props} />,
                    em: ({node, ...props}) => <em style={{fontStyle: 'italic'}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{margin: '12px 0', paddingLeft: '24px'}} {...props} />,
                    ol: ({node, ...props}) => <ol style={{margin: '12px 0', paddingLeft: '24px'}} {...props} />,
                    li: ({node, ...props}) => <li style={{margin: '8px 0', fontSize: '18px', textAlign: 'left'}} {...props} />,
                    p: ({node, ...props}) => <p style={{margin: '10px 0'}} {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote style={{
                        borderLeft: '3px solid #1890ff',
                        margin: '8px 0',
                        paddingLeft: '12px',
                        fontStyle: 'italic',
                        color: '#666'
                      }} {...props} />
                    ),
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code style={{
                          backgroundColor: '#f0f0f0',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontFamily: 'monospace',
                          fontSize: '15px'
                        }} {...props} />
                      ) : (
                        <pre style={{
                          backgroundColor: '#f5f5f5',
                          padding: '12px',
                          borderRadius: '6px',
                          overflow: 'auto',
                          margin: '8px 0'
                        }}>
                          <code {...props} />
                        </pre>
                      )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
            <div style={{ 
              marginTop: '4px',
              textAlign: isUser ? 'right' : 'left'
            }}>
              <Text style={{ 
                color: isUser ? 'rgba(255,255,255,0.7)' : '#999',
                fontSize: '11px'
              }}>
                {formatTime(message.timestamp)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // New Chat handler
  const handleNewChat = () => {
    setMessages(initialMessages);
    localStorage.removeItem('aiChatMessages');
  };

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '0',
      minHeight: 'calc(100vh - 112px)'
    }}>
      {/* New Chat Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', gap: 12 }}>
        <Tooltip title={locationEnabled ? (locationText ? `Location: ${locationText}` : 'Location enabled') : 'Enable location for better suggestions'}>
          <Button
            type={locationEnabled ? 'primary' : 'default'}
            icon={<EnvironmentOutlined style={{ color: locationEnabled ? '#1890ff' : '#aaa' }} />}
            onClick={() => setLocationEnabled(!locationEnabled)}
            loading={locationLoading}
            style={{
              borderColor: locationEnabled ? '#1890ff' : '#d9d9d9',
              color: locationEnabled ? '#1890ff' : '#888',
              background: locationEnabled ? 'rgba(24,144,255,0.08)' : 'white',
              fontWeight: 500,
              height: 40,
              borderRadius: 8,
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
              boxShadow: locationEnabled ? '0 0 0 2px #e6f7ff' : undefined
            }}
          >
            {locationEnabled ? 'Location ON' : 'Location OFF'}
          </Button>
        </Tooltip>
        <Button onClick={handleNewChat} type="default" danger style={{
          height: 40,
          borderRadius: 8,
          padding: '0 18px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
        }}>
          New Chat
        </Button>
      </div>
      {locationError && (
        <Alert message="Location Error" description={locationError} type="warning" showIcon style={{ marginBottom: 8 }} />
      )}
      {/* Chat Container */}
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          height: '70vh',
          overflow: 'hidden'
        }}
        styles={{ 
          body: { 
            padding: '20px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '8px',
            marginBottom: '16px'
          }}
        >
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: '#52c41a', flexShrink: 0 }}
                />
                <div
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    borderTopLeftRadius: '4px'
                  }}
                >
                  <Spin size="small" />
                  <Text style={{ marginLeft: '8px', color: '#666' }}>
                    AI is thinking...
                  </Text>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <Alert
            message="Connection Error"
            description={error}
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              borderRadius: '20px',
              resize: 'none',
              fontSize: '14px'
            }}
          />
          <Button
            type={isListening ? "primary" : "default"}
            icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={isListening ? stopListening : startListening}
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isListening ? '#ff4d4f' : undefined,
              borderColor: isListening ? '#ff4d4f' : undefined
            }}
            title={isListening ? "Stop listening" : "Start voice input"}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage()}
            loading={isLoading}
            disabled={!input.trim()}
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>
      </Card>

      {/* Quick Suggestions */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageOutlined />
            <span>Quick Questions</span>
            <Button
              icon={<ReloadOutlined spin={suggestionsLoading} />}
              size="small"
              style={{ marginLeft: 8, border: 'none', background: 'none', color: '#1890ff' }}
              onClick={() => {
                console.log('🔄 Refresh button clicked!');
                fetchQuickQuestions();
              }}
              loading={suggestionsLoading}
              aria-label="Refresh quick questions"
              title="Refresh quick questions"
            />
          </div>
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div className="questions-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          minHeight: '48px',
          justifyItems: 'center',
          alignItems: 'center',
        }}>
          {suggestionsLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} style={{ height: 48, minWidth: 180, borderRadius: 16, background: '#f0f0f0', animation: 'fadeIn 0.8s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Spin size="small" />
              </div>
            ))
          ) : suggestions.length === 0 ? (
            <Text type="secondary">No quick questions available. Try asking a question!</Text>
          ) : (
            suggestions
              .slice(0, 10)
              .sort((a, b) => a.length - b.length)
              .slice(0, 6)
              .map((suggestion, index) => {
                // Clean up extra quotes and trailing commas
                let cleanSuggestion = suggestion
                  .replace(/^\s*"/, '') // remove leading quote
                  .replace(/",?\s*$/, '') // remove trailing quote and optional comma
                  .replace(/,$/, '') // remove trailing comma if any
                  .trim();
                return (
                  <Tag
                    key={index}
                    color="blue"
                    style={{
                      cursor: 'pointer',
                      padding: '10px 18px',
                      borderRadius: '16px',
                      fontSize: '15px',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                    onClick={() => sendMessage(cleanSuggestion)}
                  >
                    {cleanSuggestion}
                  </Tag>
                );
              })
          )}
        </div>
      </Card>

      {/* Health Tips */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartOutlined style={{ color: '#ff4d4f' }} />
            <span>Health Tip of the Day</span>
          </div>
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ff4d4f'
        }}
      >
        <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
          💡 <strong>Stay Hydrated:</strong> Drinking enough water is crucial for your health, especially as you age. 
          Aim for 6-8 glasses of water daily. Dehydration can affect your energy levels, cognitive function, and overall well-being.
        </Text>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AIChatbot; 