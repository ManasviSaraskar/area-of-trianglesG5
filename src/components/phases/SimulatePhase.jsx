import React, { useState, useEffect } from 'react';
import TriangleSplitterStation from '../simulations/TriangleSplitterStation.jsx';
import TriangleFormulaStation from '../simulations/TriangleFormulaStation.jsx';
import FormulaBuilderStation from '../simulations/FormulaBuilderStation.jsx';
import { narrate, stopAudio } from '../../hooks/useAudio.js';
import { simulateStationANarration, simulateStationBNarration, simulateStationCNarration } from '../../utils/narration.js';

const STATIONS = [
  { id: 0, label: 'A: Triangle Splitter', emoji: '✂️', desc: 'Concrete' },
  { id: 1, label: 'B: Triangle Area Lab', emoji: '🔺', desc: 'Formula' },
  { id: 2, label: 'C: Formula Builder',   emoji: '⚙️', desc: 'Abstract' },
];

const SimulatePhase = ({ audioEnabled, simStationsComplete, onStationComplete, onComplete, dispatch }) => {
  const [activeStation, setActiveStation] = useState(0);

  const allDone = simStationsComplete.every(Boolean);

  const handleStationComplete = (idx) => {
    onStationComplete(idx);
    if (idx < 2) {
      setTimeout(() => setActiveStation(idx + 1), 400);
    }
  };

  useEffect(() => {
    if (audioEnabled) {
      if (activeStation === 0) {
        narrate(simulateStationANarration());
      } else if (activeStation === 1) {
        narrate(simulateStationBNarration());
      } else if (activeStation === 2) {
        narrate(simulateStationCNarration());
      }
    }
    return () => stopAudio();
  }, [activeStation, audioEnabled]);

  return (
    <div className="phase-container">
      <div className="phase-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="phase-tag simulate">🔬 Phase 3</div>
            <h2 className="phase-title" style={{ margin: '8px 0 4px' }}>Simulate — 3 Stations</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', margin: 0 }}>
              Complete all 3 stations to advance!
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            id="skip-simulate-btn"
            onClick={onComplete}
            style={{ fontSize: '0.8rem', padding: '8px 18px', opacity: 0.7, alignSelf: 'flex-start', flexShrink: 0 }}
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Station tabs */}
      <div className="station-tabs" role="tablist">
        {STATIONS.map((s) => (
          <button
            key={s.id}
            id={`station-tab-${s.id}`}
            role="tab"
            aria-selected={activeStation === s.id}
            className={`station-tab
              ${activeStation === s.id ? 'active' : ''}
              ${simStationsComplete[s.id] ? 'done' : ''}
              ${!simStationsComplete[s.id - 1] && s.id > 0 && !simStationsComplete[s.id] && activeStation !== s.id ? 'locked' : ''}
            `}
            onClick={() => {
              // Allow navigating to completed stations or current
              if (simStationsComplete[s.id] || s.id === activeStation || simStationsComplete[s.id - 1] || s.id === 0) {
                setActiveStation(s.id);
              }
            }}
          >
            {simStationsComplete[s.id] ? '✅' : s.emoji} {s.label}
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Station content */}
      {!allDone && (
        <div className="card sim-station-card">
          <div className="sim-instruction">
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>
              {STATIONS[activeStation].emoji}
            </span>
            <div>
              {activeStation === 0 && (
                <><strong>Triangle Splitter (Concrete):</strong> Swipe across the rectangle to split it along its diagonal. Watch as two equal triangles form — each one is exactly half the rectangle's area!</>
              )}
              {activeStation === 1 && (
                <><strong>Triangle Area Lab (Formula):</strong> Use the triangle area formula! Fill in the blanks: <strong>base × height ÷ 2 = Area</strong>. Toggle the bounding rectangle to see how the triangle is exactly half!</>
              )}
              {activeStation === 2 && (
                <><strong>Formula Builder (Abstract):</strong> Fill in the missing number using the formula: <strong>base × height ÷ 2 = area</strong>. Pick the right answer from the choices!</>
              )}
            </div>
          </div>

          {activeStation === 0 && (
            <TriangleSplitterStation
              onComplete={() => handleStationComplete(0)}
            />
          )}
          {activeStation === 1 && (
            <TriangleFormulaStation
              onComplete={() => handleStationComplete(1)}
              onStationBPerfect={() => dispatch && dispatch({ type: 'SET_STATION_B_PERFECT' })}
            />
          )}
          {activeStation === 2 && (
            <FormulaBuilderStation
              onComplete={() => handleStationComplete(2)}
              onFormulaCorrect={() => dispatch && dispatch({ type: 'INC_FORMULA_CORRECT' })}
            />
          )}
        </div>
      )}

      {/* All done CTA */}
      {allDone && (
        <div style={{ textAlign: 'center', marginTop: 24, animation: 'bounceIn 0.5s ease' }}>
          <div style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1.5px solid rgba(74,222,128,0.35)',
            borderRadius: 16,
            padding: '20px 28px',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🥈</div>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.3rem', color: '#4ade80', marginBottom: 4 }}>
              All Stations Complete!
            </div>
            <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>
              You've earned the Shape Splitter badge!
            </div>
          </div>
          <button className="btn btn-primary" id="simulate-complete-btn" onClick={onComplete}>
            🎮 Time to Play! →
          </button>
        </div>
      )}
    </div>
  );
};

export default SimulatePhase;
