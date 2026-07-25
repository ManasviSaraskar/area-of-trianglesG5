// components/shared/GridDiagram.jsx
import React, { useState } from 'react';

const GridDiagram = ({ base, height, cellSize = 30, interactive = false, onCount }) => {
  const [counts, setCounts] = useState({ whole: 0, half: 0 });
  const w = base * cellSize;
  const h = height * cellSize;
  const ox = 10, oy = 10;

  // Classify each cell as 'whole', 'half', or 'outside' relative to the diagonal
  const getCellType = (col, row) => {
    // Triangle: top-left(0,0) → top-right(base,0) → bottom-left(0,height)
    // Diagonal: y = height - (height/base)*x
    // Cell spans [col, col+1] x [row, row+1] (in grid coords, y increases downward)
    // In triangle coords: col=x, row increases downward from 0
    const leftEdge = col;
    const rightEdge = col + 1;
    const topEdge = row;
    const bottomEdge = row + 1;
    // diagonal at x: y_diag(x) = (height/base)*x (in standard coords from top-left)
    const diagAtLeft = (height / base) * leftEdge;
    const diagAtRight = (height / base) * rightEdge;
    // Cell is below-left of diagonal → fully inside if bottomEdge <= diagAtLeft
    // Fully outside if topEdge >= diagAtRight
    if (bottomEdge <= diagAtLeft + 0.01) return 'whole';
    if (topEdge >= diagAtRight - 0.01) return 'outside';
    return 'half';
  };

  const handleCellClick = (col, row) => {
    if (!interactive) return;
    const type = getCellType(col, row);
    if (type === 'outside') return;
    const newCounts = { ...counts };
    if (type === 'whole') newCounts.whole += 1;
    else if (type === 'half') newCounts.half += 1;
    setCounts(newCounts);
    if (onCount) onCount(newCounts);
  };

  const cells = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < base; col++) {
      const type = getCellType(col, row);
      if (type === 'outside') continue;
      const x = ox + col * cellSize;
      const y = oy + row * cellSize;
      cells.push({ col, row, type, x, y });
    }
  }

  return (
    <svg viewBox={`0 0 ${w + 20} ${h + 20}`} xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto' }}>
      {/* Grid lines */}
      {Array.from({ length: base + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={ox + i*cellSize} y1={oy}
          x2={ox + i*cellSize} y2={oy + h}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      ))}
      {Array.from({ length: height + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={ox} y1={oy + i*cellSize}
          x2={ox + w} y2={oy + i*cellSize}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      ))}

      {/* Cell fills */}
      {cells.map(({ col, row, type, x, y }) => (
        <rect key={`c${col}_${row}`}
          x={x+1} y={y+1} width={cellSize-2} height={cellSize-2}
          fill={type === 'whole'
            ? 'hsla(205,70%,65%,0.45)'
            : 'hsla(35,90%,65%,0.35)'}
          rx="2"
          style={interactive && type !== 'outside'
            ? { cursor: 'pointer', transition: 'fill 0.15s ease' }
            : {}}
          onClick={() => handleCellClick(col, row)}
        >
          {interactive && (
            <title>{type === 'whole' ? 'Whole square (+1)' : 'Half square (+0.5)'}</title>
          )}
        </rect>
      ))}

      {/* Half-square labels */}
      {cells.filter(c => c.type === 'half').map(({ col, row, x, y }) => (
        <text key={`lbl${col}_${row}`}
          x={x + cellSize/2} y={y + cellSize/2 + 5}
          textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.7)"
          fontWeight="700">½</text>
      ))}

      {/* Triangle outline */}
      <polygon
        points={`${ox},${oy} ${ox+w},${oy} ${ox},${oy+h}`}
        fill="none" stroke="#4f8ef7" strokeWidth="2.5"
      />

      {/* Diagonal */}
      <line x1={ox+w} y1={oy} x2={ox} y2={oy+h}
        stroke="#4f8ef7" strokeWidth="2.5" strokeDasharray="6,3" />
    </svg>
  );
};

export default GridDiagram;
