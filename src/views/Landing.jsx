import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  SaveOutlined,
  SmileOutlined,
  BulbOutlined,
  PhoneOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './Landing.css';
import logoSrc from '../assets/logo.svg';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-shell">
        <div className="landing-grid">
          <div className="landing-hero">
            <div className="landing-badge">
              <SmileOutlined />
              Friendly start for older adults
            </div>
            <img
              src={logoSrc}
              alt="4Ms Health Assessment logo"
              style={{ width: 140, maxWidth: '60%', height: 'auto', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}
            />
            <h1>Your simple guide to using the 4Ms Health Questionnaire</h1>
            <p>
              This app helps you share what matters, medicines you take, how you feel, and how you move.
              Answers stay private. The steps below keep things slow, clear, and easy to revisit later.
            </p>
            <div className="cta-row">
              <button className="cta-button cta-primary" onClick={() => navigate('/signup')}>
                Start with Sign Up
              </button>
              <button className="cta-button cta-secondary" onClick={() => navigate('/signin')}>
                I already have an account
              </button>
            </div>
            <p className="helper-note">
              Tip: You can pause anytime. Press the Save button inside the questionnaire to keep what you already answered.
            </p>
          </div>

          <div className="landing-card">
            <h2>Three easy steps</h2>
            <div className="step-row">
              <div className="step-bubble">1</div>
              <p className="step-text">
                Create your account (or sign in) so your answers are saved safely for you and your care team.
              </p>
            </div>
            <div className="step-row">
              <div className="step-bubble">2</div>
              <p className="step-text">
                Answer at your own pace. Each section has short, clear questions. You can stop after any section.
              </p>
            </div>
            <div className="step-row">
              <div className="step-bubble">3</div>
              <p className="step-text">
                Press the Save button in the top right of the questionnaire before leaving. This keeps your progress so you
                can continue later.
              </p>
            </div>
            <p className="small-print">
              Need a helper? Ask a family member to sit with you or read it aloud. The app works well on tablets.
            </p>
          </div>
        </div>

        <div className="landing-grid" style={{ marginTop: 18 }}>
          <div className="landing-card">
            <h2>Navigation tips built for you</h2>
            <div className="tips-list">
              <div className="tips-item">
                <span className="tips-icon">
                  <SaveOutlined />
                </span>
                <div>
                  <strong>Use Save often.</strong> When you finish a few answers, click Save so nothing is lost. You will see
                  a confirmation when saving is done.
                </div>
              </div>
              <div className="tips-item">
                <span className="tips-icon">
                  <HomeOutlined />
                </span>
                <div>
                  <strong>Look for the Home button.</strong> If you need to exit, use Home to return to your dashboard. Your
                  saved answers stay put.
                </div>
              </div>
              <div className="tips-item">
                <span className="tips-icon">
                  <BulbOutlined />
                </span>
                <div>
                  <strong>One page at a time.</strong> Scroll slowly. Read each question out loud if helpful. There is no
                  time limit.
                </div>
              </div>
              <div className="tips-item">
                <span className="tips-icon">
                  <CheckCircleOutlined />
                </span>
                <div>
                  <strong>Need a break?</strong> Save, close the browser, and come back later. Your progress will be waiting
                  after you sign back in.
                </div>
              </div>
            </div>
          </div>

          <div className="landing-card">
            <h2>What you get</h2>
            <div className="tips-list">
              <div className="tips-item">
                <span className="tips-icon">
                  <SmileOutlined />
                </span>
                <div>
                  Simple screens with large text and calm colors to reduce eye strain.
                </div>
              </div>
              <div className="tips-item">
                <span className="tips-icon">
                  <SaveOutlined />
                </span>
                <div>
                  A clear Save button so your answers are kept safe for you and your doctor.
                </div>
              </div>
              <div className="tips-item">
                <span className="tips-icon">
                  <PhoneOutlined />
                </span>
                <div>
                  Bring a caregiver on a call or beside you; they can help type while you talk.
                </div>
              </div>
            </div>
            <p className="small-print">
              When ready, click "Start with Sign Up" to make an account, or "I already have an account" to continue where you
              left off.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
