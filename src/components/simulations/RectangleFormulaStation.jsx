import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/soundEffects.js';

const ROUNDS = [
  {
    title: '🌻 Mission 1: Community Garden',
    desc: 'Find the area of the garden bed to plant sunflowers!',
    length: 5,
    width: 4,
    area: 20,
    unit: 'm',
    themeColor: '#4ade80',
    missing: ['length', 'width', 'area'], // Student fills in all 3
  },
  {
    title: '☀️ Mission 2: Solar Panel Grid',
    desc: 'Calculate the total power collection area of the panel!',
    length: 6,
    width: 3,
    area: 18,
    unit: 'm',
    themeColor: '#38bdf8',
    missing: ['area'], // Student multiplies 6 × 3 = ?
  },
  {
    title: '🛸 Mission 3: Space Station Module',
    desc: 'Given the length and total area, find the missing width!',
    length: 8,
    width: 4,
    area: 32,
    unit: 'm',
    themeColor: '#a78bfa',
    missing: ['width'], // Student solves 8 × ? = 32
  },
];

const RectangleFormulaStation = ({ onComplete, onStationBPerfect }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const cfg = ROUNDS[roundIdx];

  // User input slots
  const [inputs, setInputs] = useState({ length: '', width: '', area: '' });
  const [activeSlot, setActiveSlot] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [isSliced, setIsSliced] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Available number chip choices for this round
  const [numberChoices, setNumberChoices] = useState([]);

  useEffect(() => {
    // Pre-fill non-missing values
    const initialInputs = {
      length: cfg.missing.includes('length') ? '' : String(cfg.length),
      width: cfg.missing.includes('width') ? '' : String(cfg.width),
      area: cfg.missing.includes('area') ? '' : String(cfg.area),
    };
    setInputs(initialInputs);

    // Set first missing slot as active
    const firstMissing = cfg.missing[0] || 'area';
    setActiveSlot(firstMissing);

    setIsSolved(false);
    setIsSliced(false);
    setErrorShake(false);
    setHoveredCell(null);

    // Generate smart choices
    const needed = cfg.missing.map(m => cfg[m]);
    const distractors = [
      cfg.length + cfg.width, // common mistake: adding instead of multiplying
      cfg.length * 2,
      cfg.width * 2,
      cfg.area + 4,
      Math.max(2, cfg.area - 6),
      cfg.length + 2,
      cfg.width + 1,
    ];
    const uniquePool = [...new Set([...needed, ...distractors])];
    const shuffled = uniquePool.sort(() => Math.random() - 0.5).slice(0, 7);
    // Ensure all needed numbers are in choices
    needed.forEach(n => {
      if (!shuffled.includes(n)) shuffled[Math.floor(Math.random() * shuffled.length)] = n;
    });
    setNumberChoices(shuffled.sort((a, b) => a - b));
  }, [roundIdx]);

  const handleChipClick = (num) => {
    if (isSolved) return;
    playSound('pop');
    if (!activeSlot) {
      // Pick first empty slot
      const emptySlot = cfg.missing.find(slot => !inputs[slot]);
      if (emptySlot) {
        setInputs(prev => ({ ...prev, [emptySlot]: String(num) }));
      }
      return;
    }

    setInputs(prev => ({ ...prev, [activeSlot]: String(num) }));

    // Auto-advance to next missing slot
    const currentIdx = cfg.missing.indexOf(activeSlot);
    if (currentIdx !== -1 && currentIdx < cfg.missing.length - 1) {
      setActiveSlot(cfg.missing[currentIdx + 1]);
    }
  };

  const handleClearSlot = (slot) => {
    if (isSolved || !cfg.missing.includes(slot)) return;
    playSound('pop');
    setInputs(prev => ({ ...prev, [slot]: '' }));
    setActiveSlot(slot);
  };

  const handleCheckFormula = () => {
    const l = parseInt(inputs.length, 10);
    const w = parseInt(inputs.width, 10);
    const a = parseInt(inputs.area, 10);

    const isLengthCorrect = l === cfg.length;
    const isWidthCorrect = w === cfg.width;
    const isAreaCorrect = a === cfg.area;

    if (isLengthCorrect && isWidthCorrect && isAreaCorrect) {
      playSound('correct');
      setIsSolved(true);
      if (attempts === 0 && onStationBPerfect) {
        onStationBPerfect();
      }
    } else {
      playSound('wrong');
      setErrorShake(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => setErrorShake(false), 600);
    }
  };

  const handleLaserSlice = () => {
    playSound('slice');
    setIsSliced(true);
  };

  const handleNextRound = () => {
    playSound('pop');
    if (roundIdx < ROUNDS.length - 1) {
      setRoundIdx(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const triangleArea = cfg.area / 2;

  return (
    <div className="rectangle-formula-station" style={{ width: '100%', maxWidth: '760px', margin: '0 auto' }}>
      {/* Progress Pills */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {ROUNDS.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 20,
              background: i === roundIdx ? 'rgba(255,193,7,0.2)' : i < roundIdx ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${i === roundIdx ? '#ffc107' : i < roundIdx ? '#4ade80' : 'rgba(255,255,255,0.1)'}`,
              color: i === roundIdx ? '#ffc107' : i < roundIdx ? '#4ade80' : 'rgba(255,255,255,0.5)',
              fontSize: '0.82rem',
              fontWeight: 700,
              transition: 'all 0.3s ease',
            }}
          >
            <span>{i < roundIdx ? '✓' : `0${i + 1}`}</span>
            <span>{r.title.split(':')[1] || r.title}</span>
          </div>
        ))}
      </div>

      {/* Mission Banner */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', color: cfg.themeColor, margin: '0 0 6px' }}>
          {cfg.title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: 0 }}>
          {cfg.desc}
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 1.2fr) minmax(280px, 1.4fr)',
        gap: 20,
        background: 'rgba(15, 15, 45, 0.75)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: '24px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        alignItems: 'center',
      }}>
        {/* Left Column: Visual Rectangle Grid with Dynamic Slicing */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Top Dimension Bracket (Length) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 6,
            color: '#38bdf8',
            fontWeight: 800,
            fontSize: '0.9rem',
            fontFamily: "'Fredoka', cursive"
          }}>
            <span>← Length = {cfg.length} {cfg.unit} →</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Side Dimension Bracket (Width) */}
            <div style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              color: '#f472b6',
              fontWeight: 800,
              fontSize: '0.9rem',
              fontFamily: "'Fredoka', cursive",
              textAlign: 'center',
              letterSpacing: '1px'
            }}>
              ← Width = {cfg.width} {cfg.unit} →
            </div>

            {/* Grid Box */}
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${cfg.length}, 34px)`,
                gridTemplateRows: `repeat(${cfg.width}, 34px)`,
                gap: 2,
                padding: 4,
                background: 'rgba(0,0,0,0.5)',
                border: `2px solid ${isSolved ? '#4ade80' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: isSolved ? '0 0 24px rgba(74,222,128,0.3)' : 'none',
                transition: 'all 0.4s ease'
              }}
            >
              {Array.from({ length: cfg.width }).map((_, r) =>
                Array.from({ length: cfg.length }).map((_, c) => {
                  const cellIdx = r * cfg.length + c;
                  // Check if cell is above or below diagonal (c / cfg.length vs r / cfg.width)
                  const isUpperTriangle = (c / cfg.length) + (r / cfg.width) < 1;

                  return (
                    <div
                      key={cellIdx}
                      onMouseEnter={() => setHoveredCell(cellIdx)}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 4,
                        background: isSliced
                          ? isUpperTriangle
                            ? 'rgba(56, 189, 248, 0.45)'
                            : 'rgba(255, 193, 7, 0.45)'
                          : isSolved
                            ? 'rgba(74, 222, 128, 0.35)'
                            : hoveredCell === cellIdx
                              ? 'rgba(255, 255, 255, 0.3)'
                              : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.5)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {cellIdx + 1}
                    </div>
                  );
                })
              )}

              {/* Diagonal Laser Slice Line Overlay */}
              {isSliced && (
                <svg
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="0"
                    stroke="#ff3b30"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    style={{ filter: 'drop-shadow(0 0 8px #ff3b30)' }}
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Grid Sub-label */}
          <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            Total unit squares: <strong style={{ color: '#ffc107' }}>{cfg.length * cfg.width}</strong>
          </div>
        </div>

        {/* Right Column: Fill-In-The-Blank Formula Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 14,
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 800,
              marginBottom: 10
            }}>
              📐 Area of Rectangle Formula
            </div>

            {/* Formula Equation Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontFamily: "'Fredoka', cursive",
              fontSize: '1.25rem',
            }}>
              {/* Length Slot */}
              <div
                onClick={() => cfg.missing.includes('length') && handleClearSlot('length')}
                style={{
                  minWidth: 54,
                  height: 52,
                  padding: '0 10px',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cfg.missing.includes('length') ? 'pointer' : 'default',
                  background: activeSlot === 'length' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.06)',
                  border: `2px ${activeSlot === 'length' ? 'solid #38bdf8' : inputs.length ? 'solid #4ade80' : 'dashed rgba(255,255,255,0.2)'}`,
                  color: inputs.length ? '#ffffff' : '#38bdf8',
                  boxShadow: activeSlot === 'length' ? '0 0 12px rgba(56,189,248,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  animation: errorShake ? 'shake 0.4s ease' : 'none'
                }}
              >
                <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 800 }}>LENGTH</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{inputs.length || '?'}</span>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.4rem' }}>×</span>

              {/* Width Slot */}
              <div
                onClick={() => cfg.missing.includes('width') && handleClearSlot('width')}
                style={{
                  minWidth: 54,
                  height: 52,
                  padding: '0 10px',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cfg.missing.includes('width') ? 'pointer' : 'default',
                  background: activeSlot === 'width' ? 'rgba(244,114,182,0.25)' : 'rgba(255,255,255,0.06)',
                  border: `2px ${activeSlot === 'width' ? 'solid #f472b6' : inputs.width ? 'solid #4ade80' : 'dashed rgba(255,255,255,0.2)'}`,
                  color: inputs.width ? '#ffffff' : '#f472b6',
                  boxShadow: activeSlot === 'width' ? '0 0 12px rgba(244,114,182,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  animation: errorShake ? 'shake 0.4s ease' : 'none'
                }}
              >
                <span style={{ fontSize: '0.62rem', color: '#f472b6', fontWeight: 800 }}>WIDTH</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{inputs.width || '?'}</span>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.4rem' }}>=</span>

              {/* Area Slot */}
              <div
                onClick={() => cfg.missing.includes('area') && handleClearSlot('area')}
                style={{
                  minWidth: 64,
                  height: 52,
                  padding: '0 12px',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cfg.missing.includes('area') ? 'pointer' : 'default',
                  background: activeSlot === 'area' ? 'rgba(255,193,7,0.25)' : isSolved ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `2px ${activeSlot === 'area' ? 'solid #ffc107' : isSolved ? 'solid #4ade80' : inputs.area ? 'solid #4ade80' : 'dashed rgba(255,255,255,0.2)'}`,
                  color: inputs.area ? (isSolved ? '#4ade80' : '#ffffff') : '#ffc107',
                  boxShadow: isSolved ? '0 0 16px rgba(74,222,128,0.5)' : activeSlot === 'area' ? '0 0 12px rgba(255,193,7,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  animation: errorShake ? 'shake 0.4s ease' : 'none'
                }}
              >
                <span style={{ fontSize: '0.62rem', color: '#ffc107', fontWeight: 800 }}>AREA</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{inputs.area || '?'}</span>
              </div>
            </div>
          </div>

          {/* Number Choices keypad (when not yet solved) */}
          {!isSolved && (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center' }}>
                Tap a number to place into the active blank:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {numberChoices.map((num, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(num)}
                    className="btn-num-chip"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      width: 46,
                      height: 44,
                      color: '#ffffff',
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.08)';
                      e.currentTarget.style.borderColor = '#ffc107';
                      e.currentTarget.style.background = 'rgba(255,193,7,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Check Answer Button */}
              <button
                onClick={handleCheckFormula}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '12px',
                  fontSize: '1rem',
                  borderRadius: 12,
                  boxShadow: '0 4px 16px rgba(255,193,7,0.3)',
                }}
              >
                ✨ Check Formula
              </button>
            </div>
          )}

          {/* Solved Stage & Mind-Blowing Triangle Connection! */}
          {isSolved && (
            <div style={{
              background: 'rgba(74,222,128,0.12)',
              border: '1.5px solid rgba(74,222,128,0.4)',
              borderRadius: 14,
              padding: '14px',
              textAlign: 'center',
              animation: 'bounceIn 0.4s ease'
            }}>
              <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.1rem', marginBottom: 6 }}>
                🎉 Formula Verified: {cfg.length} × {cfg.width} = {cfg.area} {cfg.unit}²
              </div>

              {!isSliced ? (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' }}>
                    What happens if we cut this rectangle in half along the diagonal?
                  </p>
                  <button
                    onClick={handleLaserSlice}
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: 12,
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 0 16px rgba(239,68,68,0.5)'
                    }}
                  >
                    ⚡ Laser Cut: Slice into 2 Triangles!
                  </button>
                </div>
              ) : (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    margin: '8px 0',
                    fontSize: '0.92rem',
                    color: '#ffc107',
                    fontWeight: 700
                  }}>
                    💡 2 Equal Triangles Formed!<br />
                    <span style={{ color: '#38bdf8' }}>Triangle Area</span> = {cfg.area} ÷ 2 = <strong style={{ color: '#4ade80', fontSize: '1.1rem' }}>{triangleArea} {cfg.unit}²</strong>
                  </div>
                  <button
                    onClick={handleNextRound}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      marginTop: 6,
                      padding: '12px',
                      fontSize: '1rem',
                      borderRadius: 12
                    }}
                  >
                    {roundIdx < ROUNDS.length - 1 ? 'Next Mission →' : 'Complete Station B! 🌟'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RectangleFormulaStation;
