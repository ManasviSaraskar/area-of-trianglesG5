// components/phases/StoryPhase.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import storyContent from '../../data/storyContent.js';
import RectangleSplitDiagram from '../shared/RectangleSplitDiagram.jsx';
import GridDiagram from '../shared/GridDiagram.jsx';
import { narrate, stopAudio } from '../../hooks/useAudio.js';
import { getStoryNarration } from '../../utils/narration.js';

const StoryPhase = ({ onComplete, onBack, audioEnabled = true, onPanelChange }) => {
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
  }, [panelIdx]);

  const handlePrev = () => {
    stopAudio();
    if (panelIdx > 0) {
      setPanelIdx(i => i - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const handleNext = () => {
    stopAudio();
    if (!isLast) {
      setPanelIdx(i => i + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="story-phase" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "90px", paddingBottom: "40px" }}>
      <div className="story-card shadow-2xl" style={{ 
        width: "100%", 
        maxWidth: "1000px", 
        minHeight: "500px", 
        background: "#1d1f3b",
        border: "1px solid rgba(255,255,255,0.1)", 
        borderRadius: "24px", 
        display: "flex", 
        overflow: "hidden", 
        flexDirection: "row" 
      }}>
        
        {/* Left Side: Image area */}
        <div style={{ flex: 1, position: "relative", background: "#090a15", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          {panel.image && (
            <>
              <img src={panel.image} alt={panel.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "80px", background: "linear-gradient(to left, #1d1f3b, transparent)" }} />
            </>
          )}
        </div>

        {/* Right Side: Content area */}
        <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left", zIndex: 10 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${panelIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 
                style={{ 
                  fontFamily: "'Fredoka', cursive", 
                  fontSize: "2.8rem", 
                  color: "#ffc107", 
                  marginBottom: "20px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                  fontWeight: 900,
                  lineHeight: 1.1
                }}
              >
                {panel.title}
              </h2>

              <p 
                style={{ 
                  fontSize: "1.4rem", 
                  lineHeight: "1.6", 
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                  marginBottom: "16px"
                }}
              >
                {panel.text}
              </p>

              {/* Highlight Box */}
              {panel.highlight && (
                <div style={{ margin: '16px 0 24px' }}>
                  <div className="story-highlight-box" style={{ padding: "12px 24px", display: "inline-block" }}>
                    ✨ {panel.highlight} ✨
                  </div>
                </div>
              )}

              {/* Visual Diagrams */}
              {(panel.showSplit || panel.showFormula || panel.showGrid) && (
                <div style={{ marginTop: 20, paddingTop: 16 }}>
                  {panel.showSplit && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <RectangleSplitDiagram base={panel.splitBase} height={panel.splitHeight} split={true} size="medium" />
                    </div>
                  )}
                  {panel.showFormula && (
                    <div style={{ padding: '8px 0' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ maxWidth: 280 }}>
                        <GridDiagram base={panel.gridBase} height={panel.gridHeight} cellSize={32} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Nav */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        width: "100%", 
        maxWidth: "1000px", 
        marginTop: "32px", 
        padding: "0 16px", 
        alignItems: "center" 
      }}>
        <button 
          className="btn btn-secondary" 
          style={{ fontSize: "1.125rem" }}
          onClick={handlePrev}
        >
          ← Back
        </button>
        
        <div style={{ display: "flex", gap: "8px" }}>
          {storyContent.map((_, i) => (
            <div 
              key={i} 
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                transition: "all 0.3s ease",
                background: i === panelIdx ? "#ffc107" : "rgba(255,255,255,0.2)",
                transform: i === panelIdx ? "scale(1.25)" : "scale(1)"
              }}
            />
          ))}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ fontSize: "1.125rem" }}
          onClick={handleNext}
        >
          {!isLast ? 'Next →' : 'To Sandbox →'}
        </button>
      </div>
    </div>
  );
};

export default StoryPhase;
