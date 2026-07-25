// components/shared/RectangleSplitDiagram.jsx
import React from 'react';

const RectangleSplitDiagram = ({
  base,
  height,
  missingSlot,
  split = false,
  animated = false,
  size = 'medium',
}) => {
  const unit = size === 'large' ? 28 : size === 'medium' ? 22 : 16;
  const w = base * unit;
  const h = height * unit;
  const pad = 28;
  const totalW = w + pad * 2;
  const totalH = h + pad * 2 + 36;

  const area = (base * height) / 2;
  const formulaText = missingSlot === 'area'
    ? `${base} × ${height} ÷ 2 = ?`
    : missingSlot === 'base'
    ? `? × ${height} ÷ 2 = ${area}`
    : `${base} × ? ÷ 2 = ${area}`;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
    >
      {/* Rectangle fill */}
      <rect x={pad} y={pad} width={w} height={h}
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

      {/* Upper-left triangle (always shown) */}
      <polygon
        points={`${pad},${pad} ${pad+w},${pad} ${pad},${pad+h}`}
        fill="hsla(205,70%,65%,0.55)"
        stroke="hsl(205,70%,60%)"
        strokeWidth="1.5"
      />

      {/* Lower-right triangle */}
      <polygon
        points={`${pad+w},${pad} ${pad+w},${pad+h} ${pad},${pad+h}`}
        fill={split ? 'hsla(35,90%,65%,0.55)' : 'hsla(205,70%,65%,0.3)'}
        stroke={split ? 'hsl(35,90%,60%)' : 'hsl(205,70%,60%)'}
        strokeWidth="1.5"
        style={split ? { transform: `translate(${animated ? '12px,12px' : '0'}) rotate(${animated ? '3deg' : '0'})`, transformOrigin: `${pad+w}px ${pad+h}px`, transition: 'all 0.5s ease' } : {}}
      />

      {/* Diagonal */}
      <line
        x1={pad} y1={pad} x2={pad+w} y2={pad+h}
        stroke={split ? '#ffffff' : 'rgba(255,255,255,0.5)'}
        strokeWidth={split ? 2.5 : 2}
        strokeDasharray={split ? '0' : '6,3'}
      />

      {/* Right-angle marker */}
      {!split && (
        <path
          d={`M ${pad+14},${pad} L ${pad+14},${pad+14} L ${pad},${pad+14}`}
          fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
        />
      )}

      {/* Base label */}
      <text x={pad + w/2} y={pad + h + 18} textAnchor="middle" fontSize="13"
        fill={missingSlot === 'base' ? '#f5c518' : 'rgba(255,255,255,0.7)'} fontWeight="700"
        fontFamily="Nunito, sans-serif">
        {missingSlot === 'base' ? '?' : `${base} units`}
      </text>

      {/* Height label */}
      <text x={pad - 8} y={pad + h/2} textAnchor="end" dominantBaseline="middle"
        fontSize="13" fill={missingSlot === 'height' ? '#f5c518' : 'rgba(255,255,255,0.7)'}
        fontWeight="700" fontFamily="Nunito, sans-serif">
        {missingSlot === 'height' ? '?' : `${height}`}
      </text>

      {/* Formula */}
      <text x={totalW/2} y={totalH - 6} textAnchor="middle" fontSize="14"
        fill="#f5c518" fontWeight="800" fontFamily="'Fredoka One', cursive">
        {formulaText}
      </text>
    </svg>
  );
};

export default RectangleSplitDiagram;
