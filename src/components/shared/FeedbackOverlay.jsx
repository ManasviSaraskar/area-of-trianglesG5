// components/shared/FeedbackOverlay.jsx
import React, { useEffect, useState } from 'react';

const FeedbackOverlay = ({ isCorrect, explanation, xpEarned, onContinue, attemptCount }) => {
  const [showXP, setShowXP] = useState(false);
  const isLastAttempt = attemptCount >= 3;

  useEffect(() => {
    if (isCorrect) {
      const t = setTimeout(() => setShowXP(true), 300);
      return () => clearTimeout(t);
    }
  }, [isCorrect]);

  const btnLabel = isCorrect
    ? 'Next Question →'
    : isLastAttempt
      ? 'Got it! Continue →'
      : 'Try Again 🔁';

  const emoji = isCorrect ? '🎉' : isLastAttempt ? '💡' : '🤔';
  const title = isCorrect ? 'Excellent!' : isLastAttempt ? "Here's the answer!" : 'Not quite!';
  const text = isCorrect
    ? "You measured that triangle perfectly! You're a true Triangle Trekker! 🌍"
    : explanation;

  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true">
      <div className={`feedback-card ${isCorrect ? 'correct' : 'wrong'}`}>
        <div className="feedback-emoji">{emoji}</div>
        <div className="feedback-title">{title}</div>
        <div className="feedback-text">{text}</div>
        {isCorrect && showXP && (
          <div className="xp-float">⭐ +{xpEarned} XP</div>
        )}
        {!isCorrect && !isLastAttempt && (
          <div style={{
            marginTop: 8,
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.55)',
            fontStyle: 'italic'
          }}>
            Hint unlocked! Read it carefully and try again.
          </div>
        )}
        <button className="btn btn-primary btn-sm" onClick={onContinue}
          style={{ marginTop: 16 }}>
          {btnLabel}
        </button>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
