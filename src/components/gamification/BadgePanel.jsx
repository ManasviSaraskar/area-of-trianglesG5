// components/gamification/BadgePanel.jsx
import React from 'react';
import { BADGES } from '../../utils/badgeEngine.js';

export const BadgeToast = ({ badgeId, onClose }) => {
  const badge = BADGES.find(b => b.id === badgeId);
  if (!badge) return null;
  return (
    <div className="badge-toast">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="badge-title">{badge.icon} Badge Unlocked!</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
      </div>
      <div style={{ fontWeight: 800, color: '#f5c518', fontSize: '0.9rem', marginBottom: 4 }}>{badge.label}</div>
      <div className="badge-desc">{badge.description}</div>
    </div>
  );
};

const BadgePanel = ({ badges }) => (
  <div className="badges-grid">
    {BADGES.map(b => (
      <div key={b.id} className={`badge-item ${badges.includes(b.id) ? 'unlocked' : 'locked'}`}>
        <span className="badge-icon">{b.icon}</span>
        <span className="badge-name">{b.label.replace(/^.+ /, '')}</span>
      </div>
    ))}
  </div>
);

export default BadgePanel;
