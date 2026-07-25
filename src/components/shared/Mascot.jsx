// components/shared/Mascot.jsx
import React from 'react';

const MOODS = {
  idle:         { emoji: '🤖', color: '#4f8ef7', anim: '' },
  curious:      { emoji: '🤔', color: '#a855f7', anim: '' },
  happy:        { emoji: '😊', color: '#4ade80', anim: 'anim-bounce-in' },
  thinking:     { emoji: '💭', color: '#38bdf8', anim: '' },
  celebrating:  { emoji: '🎉', color: '#f5c518', anim: 'anim-celebrate' },
  encouraging:  { emoji: '💪', color: '#fb923c', anim: '' },
};

const Mascot = ({ mood = 'idle', size = 64, speech = null }) => {
  const m = MOODS[mood] || MOODS.idle;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
      <div
        className={m.anim}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${m.color}33 0%, ${m.color}66 100%)`,
          border: `2px solid ${m.color}66`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          flexShrink: 0,
          boxShadow: `0 4px 20px ${m.color}44`,
          animation: mood === 'celebrating' ? 'celebrate 1s ease infinite' : mood === 'happy' ? 'bounceIn 0.5s ease' : 'float 3s ease-in-out infinite',
        }}
        title={`LearnFlow — ${mood}`}
      >
        🤖
      </div>
      {speech && (
        <div style={{
          background: 'white',
          color: '#1a1a2e',
          borderRadius: '14px 14px 14px 4px',
          padding: '10px 16px',
          fontSize: '0.9rem',
          fontWeight: 700,
          maxWidth: 260,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          lineHeight: 1.5,
        }}>
          {speech}
        </div>
      )}
    </div>
  );
};

export default Mascot;
