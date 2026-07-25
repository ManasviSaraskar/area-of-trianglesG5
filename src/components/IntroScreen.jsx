// components/IntroScreen.jsx
import React from 'react';

const FLOATING = ['📐','🔺','⛵','½','×','÷','🚩','🎏','⛺','🍕','3','6','8','12'];

const PHASE_ITEMS = [
  { icon: '🔍', name: 'Wonder', desc: 'An area mystery!', color: '#38bdf8' },
  { icon: '📖', name: 'Story', desc: 'See area in action', color: '#a78bfa' },
  { icon: '🧪', name: 'Simulate', desc: 'Build unit squares', color: '#4ade80' },
  { icon: '🎮', name: 'Play', desc: 'Gamified challenges', color: '#fb923c' },
  { icon: '📓', name: 'Reflect', desc: 'What did you learn?', color: '#f472b6' },
];

const IntroScreen = ({ onStart }) => {
  return (
    <div className="intro-screen">
      {/* Floating background symbols */}
      <div className="float-nums" aria-hidden="true">
        {FLOATING.map((sym, i) => (
          <span
            key={i}
            className="float-num"
            style={{
              position: 'absolute',
              top: `${5 + (i * 17) % 85}%`,
              left: `${(i * 137) % 95}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${12 + (i % 5) * 3}s`,
              opacity: 0.15,
              fontSize: '1.8rem',
            }}
          >{sym}</span>
        ))}
      </div>

      {/* Grade tag */}
      <div className="intro-grade-tag">
        ✨ · Grade 3 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        Area of Triangles
      </h1>
      <p className="intro-subtitle">Lesson 8.6 · Introduction to Area</p>

      {/* Mascot + speech */}
      <div className="mascot-row">
        <div className="mascot-avatar">🤖</div>
        <div className="mascot-speech">
          Let's explore area! 📐
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to see <strong>area</strong> everywhere, count unit squares, discover the formula, and solve real-world problems!
      </p>

      {/* Journey map */}
      <div className="card journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY</div>
        <div className="journey-phases">
          {PHASE_ITEMS.map((p, i) => (
            <React.Fragment key={p.name}>
              <div className="journey-phase-item">
                <div className="journey-phase-icon"
                  style={{ background: `${p.color}22`, border: `1px solid ${p.color}44` }}>
                  <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                </div>
                <span className="phase-name" style={{ color: p.color }}>{p.name}</span>
                <span className="phase-desc">{p.desc}</span>
              </div>
              {i < PHASE_ITEMS.length - 1 && (
                <span className="journey-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        id="begin-journey-btn"
        className="btn btn-primary intro-cta-btn"
        onClick={onStart}
        aria-label="Begin your learning journey"
      >
        🚀 Begin Your Journey!
      </button>

      {/* Stat cards */}
      <div className="intro-stat-cards">
        <div className="intro-stat-card">
          <span className="stat-emoji">🎯</span>
          <span className="stat-label">3 Worlds</span>
        </div>
        <div className="intro-stat-card">
          <span className="stat-emoji">📐</span>
          <span className="stat-label">Area Concepts</span>
        </div>
        <div className="intro-stat-card">
          <span className="stat-emoji">✨</span>
          <span className="stat-label">Badges & XP</span>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
