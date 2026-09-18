import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/soundEffects.js';

const ROUNDS = [
  {
    title: '⛵ Mission 1: Sydney Yacht Sail',
    desc: 'Count the base and height on the grid, then calculate the triangle sail area!',
    type: 'right', // right-angled triangle
    base: 6,
    height: 4,
    area: 12,
    unit: 'm',
    themeColor: '#38bdf8',
    missing: ['base', 'height', 'area'], // Fill in all 3
  },
  {
    title: '🏔️ Mission 2: Alpine Mountain Peak',
    desc: 'Use the perpendicular height and base to calculate the triangle face area!',
    type: 'isosceles', // symmetric triangle
    base: 8,
    height: 5,
    area: 20,
    unit: 'm',
    themeColor: '#4ade80',
    missing: ['area'], // Calculate area: 8 × 5 ÷ 2 = ?
  },
  {
    title: '🔺 Mission 3: Ancient Pyramid Face',
    desc: 'Given the base and total area, find the perpendicular height!',
    type: 'acute',
    base: 10,
    height: 6,
    area: 30,
    unit: 'm',
    themeColor: '#ffc107',
    missing: ['height'], // Solve: 10 × ? ÷ 2 = 30
  },
];

const CELL = 30; // Grid cell size in px

const TriangleFormulaStation = ({ onComplete, onStationBPerfect }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const cfg = ROUNDS[roundIdx];

  const [inputs, setInputs] = useState({ base: '', height: '', area: '' });
  const [activeSlot, setActiveSlot] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showHelperRect, setShowHelperRect] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [numberChoices, setNumberChoices] = useState([]);

  useEffect(() => {
    // Pre-fill non-missing values
    const initialInputs = {
      base: cfg.missing.includes('base') ? '' : String(cfg.base),
      height: cfg.missing.includes('height') ? '' : String(cfg.height),
      area: cfg.missing.includes('area') ? '' : String(cfg.area),
    };
    setInputs(initialInputs);
    setActiveSlot(cfg.missing[0] || 'area');
    setIsSolved(false);
    setShowHelperRect(false);
    setErrorShake(false);

    // Generate choices
    const needed = cfg.missing.map(m => cfg[m]);
    const distractors = [
      cfg.base * cfg.height, // common error: forgot to divide by 2!
      cfg.base + cfg.height,
      cfg.base * 2,
      cfg.height * 2,
      cfg.area + 4,
      Math.max(2, cfg.area - 4),
      cfg.base + 2,
      cfg.height + 1,
    ];
    const pool = [...new Set([...needed, ...distractors])];
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 7);
    needed.forEach(n => {
      if (!shuffled.includes(n)) shuffled[Math.floor(Math.random() * shuffled.length)] = n;
    });
    setNumberChoices(shuffled.sort((a, b) => a - b));
  }, [roundIdx]);

  const handleChipClick = (num) => {
    if (isSolved) return;
    playSound('pop');
    if (!activeSlot) {
      const emptySlot = cfg.missing.find(slot => !inputs[slot]);
      if (emptySlot) {
        setInputs(prev => ({ ...prev, [emptySlot]: String(num) }));
      }
      return;
    }

    setInputs(prev => ({ ...prev, [activeSlot]: String(num) }));

    // Move to next missing slot
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
    const b = parseInt(inputs.base, 10);
    const h = parseInt(inputs.height, 10);
    const a = parseInt(inputs.area, 10);

    const isBaseCorrect = b === cfg.base;
    const isHeightCorrect = h === cfg.height;
    const isAreaCorrect = a === cfg.area;

    if (isBaseCorrect && isHeightCorrect && isAreaCorrect) {
      playSound('correct');
      setIsSolved(true);
      setShowHelperRect(true);
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

  const handleNextRound = () => {
    playSound('pop');
    if (roundIdx < ROUNDS.length - 1) {
      setRoundIdx(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  // SVG Geometry Calculation
  const gridW = cfg.base * CELL;
  const gridH = cfg.height * CELL;
  const padX = 25;
  const padY = 25;
  const svgWidth = gridW + padX * 2;
  const svgHeight = gridH + padY * 2;

  // Triangle Vertices depending on triangle type
  let p1, p2, p3, apexX;
  if (cfg.type === 'right') {
    // Right triangle: bottom-left (0, H), bottom-right (W, H), top-left (0, 0)
    p1 = { x: padX, y: padY + gridH };
    p2 = { x: padX + gridW, y: padY + gridH };
    p3 = { x: padX, y: padY };
    apexX = padX;
  } else if (cfg.type === 'isosceles') {
    // Symmetric triangle: bottom-left, bottom-right, apex centered
    p1 = { x: padX, y: padY + gridH };
    p2 = { x: padX + gridW, y: padY + gridH };
    p3 = { x: padX + gridW / 2, y: padY };
    apexX = padX + gridW / 2;
  } else {
    // Acute triangle: apex at 30% width
    p1 = { x: padX, y: padY + gridH };
    p2 = { x: padX + gridW, y: padY + gridH };
    p3 = { x: padX + (gridW * 0.35), y: padY };
    apexX = padX + (gridW * 0.35);
  }

  const trianglePoints = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;

  return (
    <div className="triangle-formula-station" style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
      {/* Progress Pills */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
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
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.45rem', color: cfg.themeColor, margin: '0 0 4px' }}>
          {cfg.title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', margin: 0 }}>
          {cfg.desc}
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1.25fr) minmax(280px, 1.35fr)',
        gap: 20,
        background: 'rgba(15, 15, 45, 0.75)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: '22px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        alignItems: 'center',
      }}>
        {/* Left Column: Interactive Triangle on Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.15)',
            padding: 8,
            boxShadow: isSolved ? '0 0 24px rgba(74,222,128,0.25)' : 'none',
            transition: 'box-shadow 0.4s ease'
          }}>
            <svg width={svgWidth} height={svgHeight} style={{ display: 'block', overflow: 'visible' }}>
              <defs>
                <pattern id="triangleGrid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                  <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                </pattern>
                <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect x={padX} y={padY} width={gridW} height={gridH} fill="url(#triangleGrid)" />

              {/* Bounding Ghost Rectangle (Visual Helper) */}
              {showHelperRect && (
                <rect
                  x={padX}
                  y={padY}
                  width={gridW}
                  height={gridH}
                  fill="rgba(255, 193, 7, 0.08)"
                  stroke="#ffc107"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  style={{ animation: 'fadeIn 0.3s ease' }}
                />
              )}

              {/* The Triangle */}
              <polygon
                points={trianglePoints}
                fill="url(#triGrad)"
                stroke="#38bdf8"
                strokeWidth="3"
                style={{
                  filter: isSolved ? 'drop-shadow(0 0 10px rgba(56,189,248,0.6))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Perpendicular Height Altitude Line */}
              <line
                x1={apexX}
                y1={padY}
                x2={apexX}
                y2={padY + gridH}
                stroke="#f472b6"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
              {/* Right angle marker at base of height */}
              <path
                d={`M ${apexX} ${padY + gridH - 10} L ${apexX + 10} ${padY + gridH - 10} L ${apexX + 10} ${padY + gridH}`}
                fill="none"
                stroke="#f472b6"
                strokeWidth="1.5"
              />

              {/* Apex marker */}
              <circle cx={p3.x} cy={p3.y} r="5" fill="#f472b6" />

              {/* Height Label beside altitude line */}
              <text
                x={apexX > padX + gridW / 2 ? apexX - 12 : apexX + 12}
                y={padY + gridH / 2}
                fill="#f472b6"
                fontFamily="'Fredoka', cursive"
                fontSize="13"
                fontWeight="bold"
                textAnchor={apexX > padX + gridW / 2 ? "end" : "start"}
              >
                h = {cfg.height}
              </text>

              {/* Base Dimension Arrow along bottom */}
              <line
                x1={padX}
                y1={padY + gridH + 14}
                x2={padX + gridW}
                y2={padY + gridH + 14}
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text
                x={padX + gridW / 2}
                y={padY + gridH + 12}
                fill="#38bdf8"
                fontFamily="'Fredoka', cursive"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dy="-4"
              >
                base = {cfg.base} {cfg.unit}
              </text>
            </svg>
          </div>

          {/* Toggle Helper Button */}
          <button
            onClick={() => setShowHelperRect(prev => !prev)}
            style={{
              marginTop: 10,
              background: showHelperRect ? 'rgba(255,193,7,0.18)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${showHelperRect ? '#ffc107' : 'rgba(255,255,255,0.2)'}`,
              color: showHelperRect ? '#ffc107' : 'rgba(255,255,255,0.75)',
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <span>📦</span>
            <span>{showHelperRect ? 'Hide Bounding Rectangle' : 'Show Rectangle Helper'}</span>
          </button>
        </div>

        {/* Right Column: Fill-In-The-Blank Triangle Formula Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              🔺 Area of Triangle Formula
            </div>

            {/* Formula Equation Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontFamily: "'Fredoka', cursive",
              fontSize: '1.25rem',
            }}>
              {/* Base Slot */}
              <div
                onClick={() => cfg.missing.includes('base') && handleClearSlot('base')}
                style={{
                  minWidth: 54,
                  height: 52,
                  padding: '0 8px',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cfg.missing.includes('base') ? 'pointer' : 'default',
                  background: activeSlot === 'base' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.06)',
                  border: `2px ${activeSlot === 'base' ? 'solid #38bdf8' : inputs.base ? 'solid #4ade80' : 'dashed rgba(255,255,255,0.2)'}`,
                  color: inputs.base ? '#ffffff' : '#38bdf8',
                  boxShadow: activeSlot === 'base' ? '0 0 12px rgba(56,189,248,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  animation: errorShake ? 'shake 0.4s ease' : 'none'
                }}
              >
                <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 800 }}>BASE</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{inputs.base || '?'}</span>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem' }}>×</span>

              {/* Height Slot */}
              <div
                onClick={() => cfg.missing.includes('height') && handleClearSlot('height')}
                style={{
                  minWidth: 54,
                  height: 52,
                  padding: '0 8px',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cfg.missing.includes('height') ? 'pointer' : 'default',
                  background: activeSlot === 'height' ? 'rgba(244,114,182,0.25)' : 'rgba(255,255,255,0.06)',
                  border: `2px ${activeSlot === 'height' ? 'solid #f472b6' : inputs.height ? 'solid #4ade80' : 'dashed rgba(255,255,255,0.2)'}`,
                  color: inputs.height ? '#ffffff' : '#f472b6',
                  boxShadow: activeSlot === 'height' ? '0 0 12px rgba(244,114,182,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  animation: errorShake ? 'shake 0.4s ease' : 'none'
                }}
              >
                <span style={{ fontSize: '0.62rem', color: '#f472b6', fontWeight: 800 }}>HEIGHT</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{inputs.height || '?'}</span>
              </div>

              <span style={{ color: '#ffc107', fontSize: '1.2rem', fontWeight: 800 }}>÷ 2</span>

              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem' }}>=</span>

              {/* Area Slot */}
              <div
                onClick={() => cfg.missing.includes('area') && handleClearSlot('area')}
                style={{
                  minWidth: 64,
                  height: 52,
                  padding: '0 10px',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cfg.missing.includes('area') ? 'pointer' : 'default',
                  background: activeSlot === 'area' ? 'rgba(74,222,128,0.25)' : isSolved ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `2px ${activeSlot === 'area' ? 'solid #4ade80' : isSolved ? 'solid #4ade80' : inputs.area ? 'solid #4ade80' : 'dashed rgba(255,255,255,0.2)'}`,
                  color: inputs.area ? (isSolved ? '#4ade80' : '#ffffff') : '#4ade80',
                  boxShadow: isSolved ? '0 0 16px rgba(74,222,128,0.5)' : activeSlot === 'area' ? '0 0 12px rgba(74,222,128,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  animation: errorShake ? 'shake 0.4s ease' : 'none'
                }}
              >
                <span style={{ fontSize: '0.62rem', color: '#4ade80', fontWeight: 800 }}>TRIANGLE AREA</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{inputs.area || '?'}</span>
              </div>
            </div>
          </div>

          {/* Number Choices Keypad */}
          {!isSolved && (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center' }}>
                Tap a number chip to place into the active blank:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {numberChoices.map((num, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(num)}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      width: 48,
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
                ✨ Check Triangle Formula
              </button>
            </div>
          )}

          {/* Solved Stage Feedback */}
          {isSolved && (
            <div style={{
              background: 'rgba(74,222,128,0.12)',
              border: '1.5px solid rgba(74,222,128,0.4)',
              borderRadius: 14,
              padding: '16px',
              textAlign: 'center',
              animation: 'bounceIn 0.4s ease'
            }}>
              <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.15rem', marginBottom: 6 }}>
                🎉 Perfectly Calculated!
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 10,
                padding: '10px 14px',
                margin: '8px 0',
                fontSize: '0.95rem',
                color: '#ffc107',
                fontWeight: 700
              }}>
                ({cfg.base} × {cfg.height}) ÷ 2 = <strong style={{ color: '#4ade80', fontSize: '1.15rem' }}>{cfg.area} {cfg.unit}²</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' }}>
                The triangle takes up exactly half the space of the {cfg.base} × {cfg.height} bounding box!
              </p>
              <button
                onClick={handleNextRound}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  borderRadius: 12
                }}
              >
                {roundIdx < ROUNDS.length - 1 ? 'Next Triangle Mission →' : 'Complete Station B! 🌟'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriangleFormulaStation;
