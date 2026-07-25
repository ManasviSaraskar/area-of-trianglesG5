// components/phases/StoryPhase.jsx
import React, { useState, useEffect } from 'react';
import storyContent from '../../data/storyContent.js';
import RectangleSplitDiagram from '../shared/RectangleSplitDiagram.jsx';
import GridDiagram from '../shared/GridDiagram.jsx';
import { narrate, stopAudio } from '../../hooks/useAudio.js';
import { getStoryNarration } from '../../utils/narration.js';

const StoryPanel = ({ panel }) => (
  <div
    className="card story-panel anim-slide-up"
    style={{ padding: 0, overflow: 'hidden', maxWidth: 720, margin: '0 auto' }}
  >
    {/* Visual Image Header */}
    {panel.image && (
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#0a0a2e',
      }}>
        <img
          src={panel.image}
          alt={panel.title}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: 400,
            objectFit: 'contain',
            objectPosition: 'center center',
          }}
        />
        {/* Dark Gradient Overlay for Title */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,46,0.92) 100%)',
          padding: '24px 28px',
        }}>
          <h3 style={{
            fontFamily: "'Fredoka', cursive",
            fontSize: '1.9rem',
            color: '#ffc107',
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}>
            {panel.title}
          </h3>
        </div>
      </div>
    )}


    {/* Content Section */}
    <div style={{ padding: '24px 28px 28px', background: 'rgba(30, 30, 100, 0.4)' }}>
      {!panel.image && (
        <h3 style={{
          fontFamily: "'Fredoka', cursive",
          fontSize: '1.9rem',
          color: '#ffc107',
          marginBottom: 16,
        }}>
          {panel.title}
        </h3>
      )}

      <p style={{
        fontSize: '1.05rem',
        lineHeight: 1.65,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 16,
      }}>
        {panel.text}
      </p>

      {/* Highlight Box (Matching Reference ✨ "..." ✨) */}
      {panel.highlight && (
        <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
          <div className="story-highlight-box">
            ✨ {panel.highlight} ✨
          </div>
        </div>
      )}

      {/* Visual Diagrams */}
      {(panel.showSplit || panel.showFormula || panel.showGrid) && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {panel.showSplit && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RectangleSplitDiagram base={panel.splitBase} height={panel.splitHeight} split={true} size="medium" />
            </div>
          )}
          {panel.showFormula && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,193,7,0.1)',
                border: '1.5px solid rgba(255,193,7,0.4)',
                borderRadius: 12,
                padding: '12px 24px',
                fontFamily: "'Fredoka', cursive",
                fontSize: '1.4rem',
                color: '#ffc107',
              }}>
                {panel.base} × {panel.height} ÷ 2 = <span style={{ color: '#4caf50' }}>{panel.area}</span>
              </div>
            </div>
          )}
          {panel.showGrid && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ maxWidth: 280 }}>
                <GridDiagram base={panel.gridBase} height={panel.gridHeight} cellSize={32} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const StoryPhase = ({ onComplete, audioEnabled = true, onPanelChange }) => {
  const [panelIdx, setPanelIdx] = useState(0);
  const panel = storyContent[panelIdx];
  const isLast = panelIdx === storyContent.length - 1;

  useEffect(() => {
    if (audioEnabled) {
      narrate(getStoryNarration(panelIdx));
    }
    return () => stopAudio();
  }, [panelIdx, audioEnabled]);

  useEffect(() => {
    if (onPanelChange) {
      onPanelChange(panelIdx);
    }
  }, [panelIdx]); // Intentionally omitting onPanelChange to prevent re-renders

  return (
    <div className="phase-container">
      <div className="story-panels">
        <StoryPanel panel={panel} key={panelIdx} />

        {/* Story navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 720,
          margin: '24px auto 0',
        }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPanelIdx(i => Math.max(0, i - 1))}
            disabled={panelIdx === 0}
            style={{ opacity: panelIdx === 0 ? 0.4 : 1 }}
          >
            ← Back
          </button>

          {/* Dots */}
          <div className="story-dots">
            {storyContent.map((_, i) => (
              <div
                key={i}
                className={`story-dot ${i === panelIdx ? 'active' : ''}`}
              />
            ))}
          </div>

          {!isLast ? (
            <button
              className="btn btn-primary btn-sm"
              id="story-next-btn"
              onClick={() => setPanelIdx(i => i + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              id="story-complete-btn"
              onClick={onComplete}
            >
              🧪 Let's Simulate! →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPhase;
