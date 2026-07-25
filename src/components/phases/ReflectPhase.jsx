import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import BadgePanel from '../gamification/BadgePanel.jsx';
import { narrate, stopAudio } from '../../hooks/useAudio.js';

const ReflectPhase = ({ audioEnabled, xp, totalStars, badges, onFinishLesson }) => {
  const [journalText, setJournalText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitJournal = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (audioEnabled) {
      if (!submitted) {
        narrate([{ text: "What an adventure! Can you tell me one thing you learned about triangles today?", style: 'thinking' }]);
      } else {
        narrate([{ text: "Lesson complete! You are an official Triangle Trekker Champion!", style: 'celebration' }]);
      }
    }
    return () => stopAudio();
  }, [submitted, audioEnabled]);

  return (
    <div className="phase-container reflect-container">
      <div className="phase-header">
        <div className="phase-tag reflect">📔 Phase 5</div>
        <h2 className="phase-title">Reflect & Celebrate! 🌟</h2>
      </div>

      {!submitted ? (
        <div className="card reflect-card">
          <Mascot mood="thinking" speech="What did you discover about triangles today? 💭" />
          <p className="reflect-prompt" style={{ marginTop: 16 }}>
            "Draw a triangle or explain in your own words how you split a rectangle to find a triangle's area! What secret did you learn today?"
          </p>

          <form onSubmit={handleSubmitJournal}>
            <textarea
              className="journal-area"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Type your answer here... (e.g. A right triangle is always half of a rectangle! Area = base × height ÷ 2)"
              aria-label="Reflection journal input"
            />
            <div style={{ marginTop: 20 }}>
              <button
                type="submit"
                className="btn btn-primary"
                id="submit-reflection-btn"
                disabled={!journalText.trim()}
              >
                ✨ Submit Reflection & Claim Badge!
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="completion-badge card" style={{ padding: 40, textAlign: 'center' }}>
          <div className="big-badge">🌟</div>
          <div className="badge-name">World Explorer Badge Unlocked!</div>
          <div className="badge-sub">
            Congratulations! You have completed all 5 phases of <strong>Triangle Trekkers</strong>!
          </div>

          <div style={{
            display: 'flex', gap: 24, justifyContent: 'center', margin: '24px 0',
            background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 28px'
          }}>
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: '#f5c518' }}>{xp}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Total XP</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: '#f5c518' }}>⭐ {totalStars}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Stars Earned</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: '#4ade80' }}>{badges.length}/8</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Badges</div>
            </div>
          </div>

          {/* Badges unlocked */}
          <div style={{ width: '100%', marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Your Unlocked Badges
            </h4>
            <BadgePanel badges={badges} />
          </div>

          <button className="btn btn-primary" id="finish-lesson-btn" onClick={onFinishLesson}>
            🎓 Complete Lesson
          </button>
        </div>
      )}
    </div>
  );
};

export default ReflectPhase;
