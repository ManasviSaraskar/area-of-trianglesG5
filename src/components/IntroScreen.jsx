// components/IntroScreen.jsx
import React, { useState } from 'react';
import { playAudio, stopAudio } from '../hooks/useAudio.js';

const IntroScreen = ({ onStart }) => {
  const [learningStarted, setLearningStarted] = useState(false);
  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ · Grade 3 Maths</div>
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Area of Triangles</span>{' '}
        <span style={{ color: 'var(--text-primary)' }}>- Exploring Space</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 8.6 · Introduction to Area
      </p>

      <div className="mascot-container">
        <div className="mascot">📐</div>
        <div className="speech-bubble">
          Let's explore area! 📐
        </div>
      </div>

      <p className="intro-desc">
        Learn to see <strong style={{ color: 'var(--gold)' }}>area</strong> everywhere, count unit squares, discover the formula, and solve real-world problems!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {[
            { icon: "🔍", label: "Wonder", desc: "An area mystery" },
            { icon: "📖", label: "Story", desc: "See area in action" },
            { icon: "🧪", label: "Simulate", desc: "Build unit squares" },
            { icon: "🎮", label: "Practice", desc: "Gamified challenges" },
            { icon: "📓", label: "Reflect", desc: "What did you learn?" }
          ].map((p, i, arr) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < arr.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {!learningStarted ? (
        <button className="btn btn-primary btn-lg intro-start-btn" onClick={() => { stopAudio(); playAudio("welcome"); setLearningStarted(true); }}>
          Start Learning
        </button>
      ) : (
        <button className="btn btn-primary btn-lg intro-start-btn" style={{ marginTop: '20px' }} onClick={() => { stopAudio(); onStart(); }}>
          🚀 Begin Your Journey!
        </button>
      )}
    </div>
  );
};

export default IntroScreen;
