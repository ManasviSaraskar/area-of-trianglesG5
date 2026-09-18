// components/phases/WonderPhase.jsx
import React, { useState, useEffect } from 'react';
import { narrate, stopAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const WonderPhase = ({ onComplete, onBack, audioEnabled = true }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (audioEnabled) {
      narrate(wonderNarration());
    }
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 800);
    return () => {
      stopAudio();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [audioEnabled]);

  const handleDiscover = () => {
    stopAudio();
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i * 0.4) % 5}s`,
              animationDuration: `${8 + (i % 6)}s`,
              fontSize: `${1.2 + (i % 3) * 0.4}rem`,
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="wonder-content">
        {/* Large glowing purple question mark */}
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>

        {/* Mascot + Speech Bubble beside it - exactly matching reffolder */}
        <div className={`mascot-container wonder-mascot ${stage >= 1 ? 'visible' : ''}`} style={{ margin: '16px 0' }}>
          <div className="mascot thinking">
            📐
          </div>
          <div className="speech-bubble wonder-bubble">
            Hmm... I wonder... 🧐
          </div>
        </div>

        {/* Translucent question card */}
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`} style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 32px' }}>
          <div className="wonder-emoji">⛵🔺❓</div>
          <h2 className="wonder-question-text" style={{ fontSize: '1.65rem', lineHeight: '1.5', color: '#ffffff', textAlign: 'center' }}>
            Sarah sees a sailboat with a triangular sail in Sydney.<br />
            <strong style={{ color: 'var(--gold)' }}>How does she know how much cloth was used to make that sail?</strong>
          </h2>
          <p className="wonder-subtext" style={{ marginTop: '12px' }}>
            Let's find out what area of a triangle really means! 🚀
          </p>
        </div>

        {/* CTA Button */}
        <button
          id="wonder-discover-btn"
          className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          style={{ marginTop: '20px' }}
          onClick={handleDiscover}
        >
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover! →
        </button>

        {onBack && (
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => { stopAudio(); onBack(); }}
              className="btn btn-outline"
              style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 24px', fontSize: '0.95rem' }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WonderPhase;
