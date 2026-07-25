// components/shared/NumberPad.jsx
import React from 'react';

const NumberPad = ({ value, onChange, onSubmit, max = 99 }) => {
  const handleDigit = (d) => {
    const next = value + d;
    if (parseInt(next, 10) > max) return;
    onChange(next);
  };

  const handleClear = () => onChange('');
  const handleBackspace = () => onChange(value.slice(0, -1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Display */}
      <div style={{
        width: '100%',
        maxWidth: 280,
        minHeight: 56,
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(245,197,24,0.4)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Fredoka One', cursive",
        fontSize: '2rem',
        color: value ? '#f5c518' : 'rgba(255,255,255,0.2)',
      }}>
        {value || '?'}
      </div>

      {/* Pad */}
      <div className="number-pad">
        {['1','2','3','4','5','6','7','8','9','0'].map(d => (
          <button key={d} className="num-btn" onClick={() => handleDigit(d)}
            aria-label={`digit ${d}`}>{d}</button>
        ))}
        <button className="num-btn clear-btn" onClick={handleBackspace}
          aria-label="backspace">⌫</button>
        <button className="num-btn clear-btn" onClick={handleClear}
          aria-label="clear">C</button>
        <button className="num-btn submit-btn" onClick={onSubmit}
          aria-label="submit">✓</button>
        {/* Placeholder cells to fill grid */}
        <div /><div />
      </div>
    </div>
  );
};

export default NumberPad;
