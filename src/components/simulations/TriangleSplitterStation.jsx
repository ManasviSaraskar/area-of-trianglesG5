import React, { useState, useRef, useCallback } from 'react';
import { playSound } from '../../utils/soundEffects.js';

const ROUNDS = [
  { base: 4, height: 3, objectEmoji: '⛵', theme: 'Sydney Sail', color1: '#38bdf8', color2: '#ffc107', bg: '#0ea5e9' },
  { base: 6, height: 4, objectEmoji: '🏔️', theme: 'Alpine Peak', color1: '#818cf8', color2: '#f472b6', bg: '#7c3aed' },
  { base: 8, height: 5, objectEmoji: '🪁', theme: 'Festival Kite', color1: '#4ade80', color2: '#fb923c', bg: '#22c55e' },
];

const UNIT = 44;

const TriangleSplitterStation = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [isSplit, setIsSplit] = useState(false);
  const [slicePath, setSlicePath] = useState([]);
  const [showFlash, setShowFlash] = useState(false);
  const [showAreaLabels, setShowAreaLabels] = useState(false);
  const [hoverHalf, setHoverHalf] = useState(null); // 'upper' | 'lower' | null
  const isSlicingRef = useRef(false);
  const svgRef = useRef(null);

  const cfg = ROUNDS[round];
  const W = cfg.base * UNIT;
  const H = cfg.height * UNIT;
  const PAD = 36;
  const vbW = W + PAD * 2;
  const vbH = H + PAD * 2 + 24; // extra room for bottom label

  const getSvgPt = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const inv = m.inverse();
    const r = pt.matrixTransform(inv);
    return { x: r.x - PAD, y: r.y - PAD };
  }, []);

  const triggerSplit = useCallback(() => {
    if (isSplit) return;
    isSlicingRef.current = false;
    playSound('slice');
    setIsSplit(true);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 600);
    setTimeout(() => setShowAreaLabels(true), 700);
  }, [isSplit]);

  const onPointerDown = useCallback((e) => {
    if (isSplit) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isSlicingRef.current = true;
    const pt = getSvgPt(e.clientX, e.clientY);
    setSlicePath([pt]);
  }, [isSplit, getSvgPt]);

  const onPointerMove = useCallback((e) => {
    if (!isSlicingRef.current || isSplit) return;
    const pt = getSvgPt(e.clientX, e.clientY);
    setSlicePath(prev => {
      const next = [...prev, pt];
      if (next.length > 4) {
        const dx = next[next.length - 1].x - next[0].x;
        const dy = next[next.length - 1].y - next[0].y;
        if (Math.hypot(dx, dy) > W * 0.55) triggerSplit();
      }
      return next;
    });
  }, [isSplit, getSvgPt, W, triggerSplit]);

  const onPointerUp = useCallback(() => {
    isSlicingRef.current = false;
    setTimeout(() => setSlicePath([]), 250);
  }, []);

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS.length) {
      onComplete();
    } else {
      setRound(next);
      setIsSplit(false);
      setSlicePath([]);
      setShowAreaLabels(false);
      setHoverHalf(null);
    }
  };

  const rectArea = cfg.base * cfg.height;
  const triArea = rectArea / 2;

  return (
    <div className="splitter-container" style={{ userSelect: 'none', touchAction: 'none', width: '100%' }}>
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

      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: cfg.bg, fontSize: '1.3rem', fontFamily: "'Fredoka One', cursive" }}>
          {cfg.objectEmoji} {cfg.theme} — Slice It! ✂️
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>
          Swipe diagonally across the rectangle — or tap the button!
        </p>
      </div>

      {/* Responsive SVG wrapper */}
      <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vbW} ${vbH}`}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: isSplit ? 'default' : 'crosshair', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <linearGradient id={`tri1Grad${round}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={cfg.color1} stopOpacity="0.9" />
              <stop offset="100%" stopColor={cfg.color1} stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id={`tri2Grad${round}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={cfg.color2} stopOpacity="0.55" />
              <stop offset="100%" stopColor={cfg.color2} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <g transform={`translate(${PAD},${PAD})`}>
            {/* Grid squares (before split only) */}
            {!isSplit && Array.from({ length: cfg.height }).map((_, r) =>
              Array.from({ length: cfg.base }).map((_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={c * UNIT + 1}
                  y={r * UNIT + 1}
                  width={UNIT - 2}
                  height={UNIT - 2}
                  rx={3}
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1}
                />
              ))
            )}

            {/* Rectangle outline */}
            <rect x={0} y={0} width={W} height={H}
              fill="none"
              stroke={isSplit ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)'}
              strokeWidth={2.5} strokeDasharray={isSplit ? '6 4' : 'none'} />

            {/* Top-left triangle */}
            <g
              style={{
                transform: isSplit ? 'translate(-20px,-20px) rotate(-10deg)' : 'none',
                transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                transformOrigin: `${W * 0.25}px ${H * 0.25}px`,
              }}
              onMouseEnter={() => isSplit && setHoverHalf('upper')}
              onMouseLeave={() => setHoverHalf(null)}
            >
              <polygon
                points={`0,0 ${W},0 0,${H}`}
                fill={`url(#tri1Grad${round})`}
                stroke={cfg.color1}
                strokeWidth={3}
                style={{
                  filter: hoverHalf === 'upper' ? `drop-shadow(0 0 16px ${cfg.color1})` : 'none',
                  transition: 'filter 0.2s ease',
                }}
              />
              {showAreaLabels && (
                <text x={W * 0.18} y={H * 0.32}
                  fill="#fff" fontSize={Math.max(16, UNIT * 0.55)} fontWeight="bold"
                  textAnchor="middle" fontFamily="'Fredoka One', cursive"
                  style={{ animation: 'bounceIn 0.4s ease' }}
                >
                  {triArea} sq
                </text>
              )}
            </g>

            {/* Bottom-right triangle */}
            <g
              style={{
                transform: isSplit ? 'translate(20px,20px) rotate(10deg)' : 'none',
                transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                transformOrigin: `${W * 0.75}px ${H * 0.75}px`,
              }}
              onMouseEnter={() => isSplit && setHoverHalf('lower')}
              onMouseLeave={() => setHoverHalf(null)}
            >
              <polygon
                points={`${W},0 ${W},${H} 0,${H}`}
                fill={`url(#tri2Grad${round})`}
                stroke={cfg.color2}
                strokeWidth={3}
                style={{
                  filter: hoverHalf === 'lower' ? `drop-shadow(0 0 16px ${cfg.color2})` : 'none',
                  transition: 'filter 0.2s ease',
                }}
              />
              {showAreaLabels && (
                <text x={W * 0.8} y={H * 0.72}
                  fill="#fff" fontSize={Math.max(16, UNIT * 0.55)} fontWeight="bold"
                  textAnchor="middle" fontFamily="'Fredoka One', cursive"
                  style={{ animation: 'bounceIn 0.4s ease' }}
                >
                  {triArea} sq
                </text>
              )}
            </g>

            {/* Diagonal cut line */}
            {isSplit && (
              <line x1={0} y1={H} x2={W} y2={0}
                stroke="#ff3b30" strokeWidth={2.5} strokeDasharray="6 4"
                style={{ filter: 'drop-shadow(0 0 6px #ff3b30)', animation: 'fadeIn 0.3s ease' }}
              />
            )}

            {/* Slash trail during swipe */}
            {slicePath.length > 1 && (
              <polyline
                points={slicePath.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={6}
                strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 8px #fff)' }}
              />
            )}

            {/* Flash line */}
            {showFlash && (
              <line x1={0} y1={H} x2={W} y2={0}
                stroke="#fff" strokeWidth={10}
                style={{ animation: 'splitterFlash 0.5s ease-out forwards', filter: 'drop-shadow(0 0 20px #fff)' }}
              />
            )}

            {/* Dimension labels */}
            {/* Base label (bottom) */}
            <text
              x={W / 2}
              y={H + 20}
              fill="#38bdf8"
              fontFamily="'Fredoka', cursive"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              ← base = {cfg.base} →
            </text>

            {/* Height label (left side) */}
            <text
              x={-14}
              y={H / 2}
              fill="#f472b6"
              fontFamily="'Fredoka', cursive"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(-90, -14, ${H / 2})`}
            >
              ← height = {cfg.height} →
            </text>
          </g>
        </svg>
      </div>

      {/* Action area */}
      <div style={{ minHeight: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 12 }}>
        {!isSplit ? (
          <>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Swipe across the shape ☝️
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={triggerSplit}
              style={{
                fontSize: '0.9rem',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                border: '2px solid #fca5a5',
                borderRadius: 12,
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(239,68,68,0.4)',
              }}
            >
              ✂️ Tap to Split!
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'bounceIn 0.5s ease', gap: 12, width: '100%', maxWidth: 440 }}>
            {/* Area equation card */}
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1.5px solid rgba(74,222,128,0.35)',
              borderRadius: 14,
              padding: '14px 20px',
              width: '100%',
              textAlign: 'center',
            }}>
              <div style={{ color: '#4ade80', fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>
                🎉 Split into 2 Equal Triangles!
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: "'Fredoka One', cursive",
                fontSize: '1.15rem',
                flexWrap: 'wrap',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Rectangle</span>
                <span style={{ color: '#ffc107', fontSize: '1.3rem' }}>{rectArea}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>÷ 2 =</span>
                <span style={{
                  color: '#4ade80',
                  fontSize: '1.4rem',
                  textShadow: '0 0 12px rgba(74,222,128,0.5)',
                }}>{triArea}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>each</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: 8 }}>
                💡 Each triangle = <strong style={{ color: '#ffc107' }}>({cfg.base} × {cfg.height}) ÷ 2</strong> = <strong style={{ color: '#4ade80' }}>{triArea} sq units</strong>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleNext} style={{ padding: '12px 28px', fontSize: '1rem', borderRadius: 12, width: '100%' }}>
              {round + 1 < ROUNDS.length ? 'Next Shape →' : '✓ Complete Station A'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes splitterFlash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TriangleSplitterStation;
