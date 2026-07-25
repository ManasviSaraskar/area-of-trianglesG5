import React, { useState, useRef, useCallback } from 'react';
import { playSound } from '../../utils/soundEffects.js';

const ROUNDS = [
  { base: 4, height: 3, objectEmoji: '⛵', theme: 'Sydney Sail' },
  { base: 6, height: 4, objectEmoji: '🔺', theme: 'Giza Pyramid' },
  { base: 8, height: 5, objectEmoji: '🚩', theme: 'Swiss Flag' },
];

const UNIT = 44; // SVG units — will scale responsively via viewBox

const TriangleSplitterStation = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [isSplit, setIsSplit] = useState(false);
  const [slicePath, setSlicePath] = useState([]);
  const [showFlash, setShowFlash] = useState(false);
  const isSlicingRef = useRef(false);
  const svgRef = useRef(null);

  const cfg = ROUNDS[round];
  const W = cfg.base * UNIT;
  const H = cfg.height * UNIT;
  const PAD = 32;
  const vbW = W + PAD * 2;
  const vbH = H + PAD * 2;

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
      // Check swipe distance
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
        <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.3rem', fontFamily: "'Fredoka One', cursive" }}>
          {cfg.objectEmoji} Slice It! ⚔️
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>
          Swipe diagonally — or tap the button below!
        </p>
      </div>

      {/* Responsive SVG wrapper */}
      <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vbW} ${vbH}`}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <g transform={`translate(${PAD},${PAD})`}>
            {/* Rectangle outline */}
            <rect x={0} y={0} width={W} height={H}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2} strokeDasharray="6 4" />

            {/* Top-left triangle */}
            <g style={{
              transform: isSplit ? 'translate(-18px,-18px) rotate(-8deg)' : 'none',
              transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
              transformOrigin: `${W * 0.25}px ${H * 0.25}px`,
            }}>
              <polygon
                points={`0,0 ${W},0 0,${H}`}
                fill={isSplit ? 'rgba(56,189,248,0.25)' : 'rgba(56,189,248,0.8)'}
                stroke="#0ea5e9" strokeWidth={3}
              />
              {isSplit && (
                <text x={W * 0.2} y={H * 0.3}
                  fill="#fff" fontSize={Math.max(16, UNIT * 0.6)} fontWeight="bold"
                  textAnchor="middle" fontFamily="'Fredoka One', cursive">
                  = {triArea}
                </text>
              )}
            </g>

            {/* Bottom-right triangle */}
            <g style={{
              transform: isSplit ? 'translate(18px,18px) rotate(8deg)' : 'none',
              transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
              transformOrigin: `${W * 0.75}px ${H * 0.75}px`,
            }}>
              <polygon
                points={`${W},0 ${W},${H} 0,${H}`}
                fill="#ffc107" stroke="#f9a825" strokeWidth={3}
              />
              {isSplit && (
                <text x={W * 0.78} y={H * 0.75}
                  fill="#fff" fontSize={Math.max(16, UNIT * 0.6)} fontWeight="bold"
                  textAnchor="middle" fontFamily="'Fredoka One', cursive">
                  = {triArea}
                </text>
              )}
            </g>

            {/* Slash trail */}
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
          </g>
        </svg>
      </div>

      {/* Action area */}
      <div style={{ minHeight: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 12 }}>
        {!isSplit ? (
          <>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Swipe across the shape ☝️
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={triggerSplit}
              style={{ fontSize: '0.9rem', padding: '10px 24px' }}
            >
              ✂️ Tap to Split!
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'bounceIn 0.5s ease', gap: 12 }}>
            <div style={{ color: '#4ade80', fontSize: '1rem', fontWeight: 800, textAlign: 'center', padding: '0 16px' }}>
              🎉 Rectangle area = {rectArea} → 2 equal triangles of {triArea} each!
            </div>
            <button className="btn btn-primary" onClick={handleNext}>
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
