// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Card, Row, Col, Button, Typography, Space, Statistic, Progress } from "antd";
import { 
  RobotOutlined, 
  FormOutlined, 
  HeartOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getQuestionnaire, getUserSession } from "../services/questionnaireService";

const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [responses, setResponses] = useState({
    matters: {},
    medication: {},
    mind: {},
    mobility: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/signin");
      } else {
        setUser(currentUser);
        // Fetch questionnaire and user session
        try {
          const [questionnaireData, sessionData] = await Promise.all([
            getQuestionnaire(),
            getUserSession(currentUser.uid)
          ]);
          setQuestionnaire(questionnaireData);
          setResponses(sessionData?.data?.responses || {
            matters: {},
            medication: {},
            mind: {},
            mobility: {}
          });
        } catch (err) {
          // fallback: keep empty
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const calculateProgress = (sectionKey) => {
    if (!questionnaire || !sectionKey) {
      return 0;
    }
    const sectionQuestions = questionnaire.sections?.[sectionKey]?.questions || {};
    const totalQuestions = Object.keys(sectionQuestions).length;
    if (totalQuestions === 0) return 0;
    const sectionData = responses[sectionKey] || {};
    let answered = 0;
    Object.values(sectionData).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        if ((value.tags && value.tags.length > 0) || (value.text && value.text.trim())) {
          answered++;
        }
      } else if (typeof value === 'number' || (typeof value === 'string' && value.trim())) {
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
      const sectionQuestions = questionnaire.sections?.[sectionKey]?.questions || {};
      const sectionTotal = Object.keys(sectionQuestions).length;
      totalQuestions += sectionTotal;
      const sectionData = responses[sectionKey] || {};
      Object.values(sectionData).forEach(value => {
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

  // Format last updated date
  const getLastUpdated = () => {
    // Try to get updatedAt from session data
    let updatedAt = null;
    if (questionnaire && responses && responses.updatedAt) {
      updatedAt = responses.updatedAt;
    } else if (window.sessionData && window.sessionData.updatedAt) {
      updatedAt = window.sessionData.updatedAt;
    } else if (window.lastSessionUpdatedAt) {
      updatedAt = window.lastSessionUpdatedAt;
    }
    // Try to get from sessionData if available
    if (!updatedAt && typeof window !== 'undefined' && window.sessionData && window.sessionData.data && window.sessionData.data.updatedAt) {
      updatedAt = window.sessionData.data.updatedAt;
    }
    // Try to get from localStorage if available
    if (!updatedAt && typeof window !== 'undefined' && localStorage.getItem('lastSessionUpdatedAt')) {
      updatedAt = localStorage.getItem('lastSessionUpdatedAt');
    }
    // Try to get from responses if it has updatedAt
    if (!updatedAt && responses && responses.updatedAt) {
      updatedAt = responses.updatedAt;
    }
    // If still not found, try to get from questionnaire session
    if (!updatedAt && questionnaire && questionnaire.updatedAt) {
      updatedAt = questionnaire.updatedAt;
    }
    if (!updatedAt) return 'Never';
    // If it's a Firestore Timestamp object
    if (typeof updatedAt === 'object' && updatedAt.toDate) {
      updatedAt = updatedAt.toDate();
    }
    // If it's a string or number, try to parse
    const dateObj = new Date(updatedAt);
    if (isNaN(dateObj.getTime())) return 'Never';
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    if (isToday) return 'Today';
    return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '48px 0', textAlign: 'center' }}>
      <Title level={2} style={{ color: '#1890ff', marginBottom: 8, fontSize: 32 }}>
        Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}! <span role="img" aria-label="wave">👋</span>
      </Title>
      <Text style={{ fontSize: 18, color: '#666', marginBottom: 32, display: 'block' }}>
        Your 4Ms Health Assessment Dashboard
      </Text>

      <div style={{ margin: '40px 0 24px 0', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Text strong style={{ fontSize: 18, color: '#333', display: 'block', marginBottom: 16 }}>
          Overall Progress
        </Text>
        <Progress
          percent={calculateOverallProgress()}
          strokeColor="#52c41a"
          size="large"
          style={{ width: '100%', marginBottom: 12 }}
        />
        <Text type="secondary" style={{ fontSize: 15 }}>
          Last Updated: <span style={{ color: '#faad14' }}>{getLastUpdated()}</span>
        </Text>
      </div>

      <Button
        type="primary"
        size="large"
        style={{ marginTop: 32, width: 240, height: 48, fontSize: 18, borderRadius: 8 }}
        onClick={() => navigate('/questionnaire')}
      >
        Continue Assessment
      </Button>
    </div>
  );
}
