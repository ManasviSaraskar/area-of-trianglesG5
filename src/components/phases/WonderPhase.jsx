// components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import { narrate, stopAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';


const FLOATING_PARTICLES = ['📐', '🔺', '⛵', '🟦', '🟩', '🛏️', '✨'];

const WonderPhase = ({ onComplete, audioEnabled = true }) => {
  useEffect(() => {
    if (audioEnabled) {
      narrate(wonderNarration());
    }
    return () => stopAudio();
  }, [audioEnabled]);


  return (
    <div className="phase-container" style={{ textAlign: 'center', position: 'relative' }}>
      {/* Floating particles background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {FLOATING_PARTICLES.map((particle, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: `${10 + (i * 15) % 80}%`,
              left: `${5 + (i * 137) % 90}%`,
              fontSize: '2rem',
              opacity: 0.2,
              animation: `float ${6 + i * 2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {particle}
          </span>
        ))}
      </div>

      {/* Large glowing purple question mark */}
      <div className="wonder-icon-circle">
        ?
      </div>

      {/* Mascot row */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div className="mascot-avatar" style={{ width: 54, height: 54, fontSize: '1.8rem' }}>
          🤖
        </div>
        <div className="mascot-speech" style={{ fontSize: '0.95rem', padding: '10px 18px' }}>
          Hmm... I wonder... 🧐
        </div>
      </div>

      {/* Translucent question card */}
      <div className="card" style={{ maxWidth: 640, margin: '0 auto 28px', padding: '36px 32px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⛵</div>
        <h2 style={{
          fontFamily: "'Fredoka', cursive",
          fontSize: '1.5rem',
          lineHeight: 1.45,
          color: '#ffffff',
          marginBottom: 12,
          fontWeight: 600,
        }}>
          Sarah sees a sailboat with a triangular sail in Sydney.<br />
          <strong>How does she know how much cloth was used to make that sail?</strong>
        </h2>
        <p style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
          Let us find out what area really means!
        </p>
      </div>

      {/* CTA Button */}
      <button
        id="wonder-discover-btn"
        className="btn btn-purple"
        style={{ fontSize: '1.25rem', padding: '16px 48px' }}
        onClick={onComplete}
      >
        ✨ Let's Discover! ✨
      </button>
    </div>
  );
};

export default WonderPhase;
