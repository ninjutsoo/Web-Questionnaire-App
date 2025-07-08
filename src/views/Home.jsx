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

const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/signin");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Section */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title level={2} style={{ color: "#1890ff", marginBottom: "8px" }}>
          Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋
        </Title>
        <Text style={{ fontSize: "16px", color: "#666" }}>
          Your 4Ms Health Assessment Dashboard
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: "40px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Health Assessment"
              value="4"
              suffix="Sections"
              prefix={<FormOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="AI Assistant"
              value="24/7"
              suffix="Available"
              prefix={<RobotOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Progress"
              value={75}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Last Updated"
              value="Today"
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Actions */}
      <Row gutter={[24, 24]} style={{ marginBottom: "40px" }}>
        <Col xs={24} lg={12}>
          <Card
            hoverable
            style={{ 
              height: "200px",
              cursor: "pointer",
              border: "2px solid #1890ff",
              borderRadius: "12px"
            }}
            onClick={() => navigate("/questionnaire")}
          >
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              height: "100%",
              justifyContent: "space-between"
            }}>
              <div>
                <Title level={3} style={{ color: "#1890ff", marginBottom: "16px" }}>
                  <FormOutlined style={{ marginRight: "8px" }} />
                  Health Assessment
                </Title>
                <Text style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
                  Complete your 4Ms health assessment covering Matters, Medication, Mind, and Mobility. 
                  Get personalized insights and recommendations.
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Button type="primary" size="large">
                  Continue Assessment
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            hoverable
            style={{ 
              height: "200px",
              cursor: "pointer",
              border: "2px solid #52c41a",
              borderRadius: "12px"
            }}
            onClick={() => navigate("/ai-chatbot")}
          >
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              height: "100%",
              justifyContent: "space-between"
            }}>
              <div>
                <Title level={3} style={{ color: "#52c41a", marginBottom: "16px" }}>
                  <RobotOutlined style={{ marginRight: "8px" }} />
                  AI Health Assistant
                </Title>
                <Text style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
                  Chat with your AI health assistant. Get personalized advice, ask questions, 
                  and receive support for your health journey.
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Button 
                  type="primary" 
                  size="large"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Progress Section */}
      <Card title="Your Progress" style={{ borderRadius: "12px" }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <Text strong>Matters</Text>
              </div>
              <Progress percent={75} strokeColor="#1890ff" />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <Text strong>Medication</Text>
              </div>
              <Progress percent={60} strokeColor="#52c41a" />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <Text strong>Mind</Text>
              </div>
              <Progress percent={90} strokeColor="#722ed1" />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <Text strong>Mobility</Text>
              </div>
              <Progress percent={85} strokeColor="#fa8c16" />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
