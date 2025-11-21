import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SaveOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import './Landing.css';
import logoSrc from '../assets/logo.svg';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-shell">
        {/* Hero Section */}
        <div className="landing-hero">
          <div className="hero-content">
            <div className="landing-badge">
              <SmileOutlined />
              Designed for older adults
            </div>
            <img
              src={logoSrc}
              alt="4Ms Health Assessment logo"
              className="hero-logo"
            />
            <h1>4Ms Health Questionnaire</h1>
            <p className="hero-subtitle">
              Share what matters, your medicines, how you feel, and how you move. 
              Answer at your own pace. Your information stays private and secure.
            </p>
            <div className="cta-row">
              <button className="cta-button cta-primary" onClick={() => navigate('/signup')}>
                Get Started
              </button>
              <button className="cta-button cta-secondary" onClick={() => navigate('/signin')}>
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <SaveOutlined />
            </div>
            <h3>Save Anytime</h3>
            <p>Take breaks and save your progress. Come back whenever you're ready.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ClockCircleOutlined />
            </div>
            <h3>No Time Limit</h3>
            <p>Answer questions at your own pace. There's no rush.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <SmileOutlined />
            </div>
            <h3>Easy to Read</h3>
            <p>Large text and clear design make it simple to understand.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <PhoneOutlined />
            </div>
            <h3>Get Help Anytime</h3>
            <p>Have a caregiver or family member help you fill it out.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <SafetyOutlined />
            </div>
            <h3>Private & Secure</h3>
            <p>Your answers are protected and shared only with your care team.</p>
          </div>

          <div className="feature-card feature-card-accent">
            <h3>How It Works</h3>
            <ol className="steps-list">
              <li>Create an account or sign in</li>
              <li>Answer questions in 4 sections</li>
              <li>Save your progress anytime</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
