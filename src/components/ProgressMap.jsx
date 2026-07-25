// components/ProgressMap.jsx
import React from 'react';

const PHASES = [
  { key: 'wonder',   label: 'Wonder',   icon: '🔍' },
  { key: 'story',    label: 'Story',    icon: '📖' },
  { key: 'simulate', label: 'Simulate', icon: '🧪' },
  { key: 'play',     label: 'Play',     icon: '🎮' },
  { key: 'reflect',  label: 'Reflect',  icon: '📓' },
];

const ProgressMap = ({ currentPhase, phaseComplete, storyPanel, totalStoryPanels }) => {
  const phaseOrder = ['wonder', 'story', 'simulate', 'play', 'reflect'];
  const currentIdx = phaseOrder.indexOf(currentPhase);

  return (
    <div className="journey-bar" role="navigation" aria-label="Learning journey progress">
      {PHASES.map((p, i) => {
        const isComplete = phaseComplete[p.key];
        const isActive = currentPhase === p.key;
        return (
          <React.Fragment key={p.key}>
            <div
              className={`journey-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
              title={`${p.icon} ${p.label}${isComplete ? ' ✓' : ''}`}
            >
              <div className="journey-step-dot">
                {isComplete ? '✓' : p.icon}
              </div>
              <span>{p.label}</span>
            </div>
            {i < PHASES.length - 1 && (
              <div className={`journey-step-connector ${isComplete ? 'complete' : ''}`} />
            )}
          </React.Fragment>
        );
      })}

      {currentPhase === 'story' && typeof storyPanel === 'number' && (
        <div style={{ marginLeft: 12, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>
          {storyPanel + 1} / {totalStoryPanels || 6}
        </div>
      )}
    </div>
  );
};

export default ProgressMap;
