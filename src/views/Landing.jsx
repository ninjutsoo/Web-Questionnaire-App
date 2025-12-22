import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SaveOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  SafetyOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  BulbOutlined,
  RiseOutlined
} from '@ant-design/icons';
import './Landing.css';
import logoSrc from '../assets/logo.svg';
import landingImage from '../assets/landing.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-shell">
        {/* Hero Section */}
        <div className="landing-hero">
          <div className="hero-content">
            <img
              src={logoSrc}
              alt="4Ms Health Assessment logo"
              className="hero-logo"
            />
            <h1>4Ms Health Questionnaire</h1>
            <p className="hero-subtitle">
              Wayne State University's A.G.R.E.E.D GWEP has created this application as a tool to help demand 4M care for you and/or your loved one aged 65+. This app helps you keep important health information organized and easy to share with your healthcare providers.
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

        {/* What are the 4M's Section */}
        <div className="four-ms-section">
          <h2>What are the 4M's?</h2>
          <div className="four-ms-content">
            <div className="four-ms-image">
              <img 
                src={landingImage} 
                alt="4Ms Framework - What Matters, Medication, Mentation, Mobility" 
                className="framework-image"
              />
              <p className="citation">Source: <a href="https://www.ihi.org" target="_blank" rel="noopener noreferrer">IHI.org</a></p>
            </div>
          </div>
        </div>

        {/* How to Use This App Section */}
        <div className="how-to-use-section">
          <h2>How to Use This App</h2>
          <div className="how-to-grid">
            <div className="how-to-card">
              <div className="how-to-icon what-matters-bg">
                <HeartOutlined />
              </div>
              <h3>What Matters</h3>
              <p>Keep track of what is important to you. Update your goals, concerns, and daily needs as they change.</p>
            </div>
            <div className="how-to-card">
              <div className="how-to-icon medication-bg">
                <MedicineBoxOutlined />
              </div>
              <h3>Medication</h3>
              <p>Record all medications you take including prescriptions and over-the-counter medicines. Add notes if you notice side effects, questions, or concerns.</p>
            </div>
            <div className="how-to-card">
              <div className="how-to-icon mentation-bg">
                <BulbOutlined />
              </div>
              <h3>Mentation</h3>
              <p>Monitor your mental well-being by making note of changes in sleep, memory, mood, or stress.</p>
            </div>
            <div className="how-to-card">
              <div className="how-to-icon mobility-bg">
                <RiseOutlined />
              </div>
              <h3>Mobility</h3>
              <p>Track how you are moving day to day. Log falls, changes in balance or strength, exercises you do, and any challenges with walking or movement.</p>
            </div>
          </div>
        </div>

        {/* Share With Your Doctor Section */}
        <div className="share-section">
          <div className="share-content">
            <h2>Share With Your Doctor</h2>
            <p>Bring this information to every medical visit. Tracking your changes in one place helps your healthcare team provide you with 4M care.</p>
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
