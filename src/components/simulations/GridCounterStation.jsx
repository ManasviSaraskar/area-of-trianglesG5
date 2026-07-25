import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/soundEffects.js';

const ROUNDS = [
  { base: 4, height: 3, area: 6,  wholes: 4, halves: 4, label: 'Sydney Sail ⛵' },
  { base: 6, height: 4, area: 12, wholes: 8, halves: 8, label: 'Egyptian Tile 🔺' },
  { base: 8, height: 5, area: 20, wholes: 16, halves: 8, label: 'Swiss Flag 🚩' },
];

// Each half-square rendered as an SVG triangle — 52×52px touch target
const HalfBlock = ({ id, isSelected, combined, onClick }) => {
  if (combined) return null;
  return (
    <svg
      width={52} height={52}
      viewBox="0 0 52 52"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.15s ease, filter 0.15s ease',
        transform: isSelected ? 'scale(1.18) rotate(-4deg)' : 'scale(1)',
        filter: isSelected
          ? 'drop-shadow(0 0 8px rgba(255,200,60,0.9))'
          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
        flexShrink: 0,
      }}
      onClick={() => onClick(id)}
      aria-label={`Half block ${id}`}
      role="button"
    >
      <polygon
        points="0,52 52,52 52,0"
        fill={isSelected ? '#fde68a' : 'hsl(35,90%,62%)'}
        stroke={isSelected ? '#fbbf24' : 'hsl(35,70%,45%)'}
        strokeWidth={2}
      />
      <text x={34} y={42} fontSize={14} fill="rgba(0,0,0,0.5)" fontWeight="bold" textAnchor="middle">½</text>
    </svg>
  );
};

const WholeBlock = ({ fresh }) => (
  <div style={{
    width: 40, height: 40, borderRadius: 6,
    background: 'hsl(205,70%,55%)',
    boxShadow: fresh ? '0 0 14px #4ade80' : 'inset 0 0 0 2px rgba(255,255,255,0.15)',
    animation: fresh ? 'blockPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' : 'none',
    flexShrink: 0,
  }} />
);

const GridCounterStation = ({ onComplete, onStationBPerfect }) => {
  const [round, setRound] = useState(0);
  const cfg = ROUNDS[round];

  const [halvesState, setHalvesState] = useState([]);
  const [selectedHalf, setSelectedHalf] = useState(null);
  const [freshCombined, setFreshCombined] = useState(new Set());

  useEffect(() => {
    setHalvesState(Array(cfg.halves).fill(null).map((_, i) => ({ id: i, combined: false })));
    setSelectedHalf(null);
    setFreshCombined(new Set());
  }, [round, cfg.halves]);

  const halvesCombined = halvesState.filter(h => h.combined).length;
  const isComplete = halvesCombined === cfg.halves;
  const extraWholes = halvesCombined / 2;

  const handleHalfClick = (id) => {
    if (halvesState.find(h => h.id === id)?.combined) return;
    if (selectedHalf === null) {
      setSelectedHalf(id);
    } else if (selectedHalf === id) {
      setSelectedHalf(null);
    } else {
      // Combine pair!
      const combinedId = Math.floor(halvesState.filter(h => h.combined).length / 2);
      playSound('pop');
      setHalvesState(prev => prev.map(h =>
        (h.id === selectedHalf || h.id === id) ? { ...h, combined: true } : h
      ));
      setFreshCombined(prev => new Set([...prev, combinedId]));
      setSelectedHalf(null);
      setTimeout(() => setFreshCombined(new Set()), 600);
    }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS.length) {
      if (onStationBPerfect) onStationBPerfect();
      onComplete();
    } else {
      setRound(next);
    }
  };

  const uncombined = halvesState.filter(h => !h.combined);

  return (
    <div className="grid-counter-container" style={{ width: '100%' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'center' }}>
        {ROUNDS.map((_, i) => (
          <div key={i} style={{
            width: 32, height: 6, borderRadius: 3,
            background: i < round ? '#4ade80' : i === round ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.3rem', fontFamily: "'Fredoka One', cursive" }}>
          🧩 Block Combiner — {cfg.label}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>
          {selectedHalf !== null
            ? '⚡ Now tap another half to fuse them!'
            : 'Tap a half-block, then tap another to combine!'}
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: '20px 16px', width: '100%',
      }}>
        {/* Whole blocks */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 800, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Whole Blocks ({cfg.wholes + extraWholes})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Array(cfg.wholes).fill(null).map((_, i) => <WholeBlock key={`w-${i}`} fresh={false} />)}
            {Array(extraWholes).fill(null).map((_, i) => <WholeBlock key={`c-${i}`} fresh={freshCombined.has(i)} />)}
          </div>
        </div>

        {/* Half blocks */}
        <div>
          <div style={{ fontSize: '0.85rem', color: 'hsl(35,90%,65%)', fontWeight: 800, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Half Blocks to Combine ({uncombined.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, minHeight: 60 }}>
            {uncombined.map(h => (
              <HalfBlock
                key={h.id}
                id={h.id}
                isSelected={selectedHalf === h.id}
                combined={false}
                onClick={handleHalfClick}
              />
            ))}
            {isComplete && (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '0.9rem', alignSelf: 'center' }}>
                All halves combined! ✨
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        {isComplete ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'bounceIn 0.5s ease' }}>
            <div style={{ color: '#4ade80', fontSize: '1.1rem', fontWeight: 800, textAlign: 'center' }}>
              🎯 Total Area = <strong>{cfg.area}</strong> square units!
            </div>
            <button className="btn btn-primary" onClick={handleNext}>
              {round + 1 < ROUNDS.length ? 'Next Shape →' : '✓ Complete Station B'}
            </button>
          </div>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            {selectedHalf !== null ? '👆 Tap another half-block...' : '👆 Select a half-block to start'}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blockPop {
          0%   { transform: scale(0.3) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.12) rotate(5deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default GridCounterStation;
