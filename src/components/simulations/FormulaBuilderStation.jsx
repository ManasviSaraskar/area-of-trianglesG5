import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/soundEffects.js';

const ROUNDS = [
  { base: 6, height: 4, area: 12, missingSlot: 'area',   label: 'Find the Area 🎯' },
  { base: 6, height: 5, area: 15, missingSlot: 'base',   label: 'Find the Base 🔍' },
  { base: 8, height: 5, area: 20, missingSlot: 'height', label: 'Find the Height 📏' },
];

const FormulaBuilderStation = ({ onComplete, onFormulaCorrect }) => {
  const [round, setRound] = useState(0);
  const cfg = ROUNDS[round];

  const correctAnswer = cfg.missingSlot === 'area' ? cfg.area
    : cfg.missingSlot === 'base' ? cfg.base
    : cfg.height;

  const [choices, setChoices] = useState([]);
  const [slottedValue, setSlottedValue] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [shake, setShake] = useState(false);
  const [btnPressed, setBtnPressed] = useState(null);

  useEffect(() => {
    const wrongOptions = [correctAnswer * 2, correctAnswer + 4, Math.max(2, correctAnswer - 2)];
    const opts = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    setChoices(opts);
    setSlottedValue(null);
    setLaunched(false);
    setShake(false);
    setBtnPressed(null);
  }, [round, correctAnswer]);

  const handleChoiceClick = (val) => {
    if (launched) return;
    setSlottedValue(val);
  };

  const handleLaunch = () => {
    if (slottedValue === correctAnswer) {
      playSound('launch');
      setTimeout(() => playSound('correct'), 300);
      setLaunched(true);
      if (onFormulaCorrect) onFormulaCorrect();
    } else {
      playSound('wrong');
      setShake(true);
      setTimeout(() => { setShake(false); setSlottedValue(null); }, 600);
    }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS.length) {
      onComplete();
    } else {
      setRound(next);
    }
  };

  const Slot = ({ value, active }) => (
    <div style={{
      background: 'rgba(255,255,255,0.08)',
      border: `2px dashed ${active && value === null ? '#facc15' : value !== null ? '#4ade80' : '#475569'}`,
      borderRadius: 10,
      minWidth: 56, height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: value !== null ? '#4ade80' : '#facc15',
      fontFamily: "'Fredoka One', cursive",
      fontSize: '1.5rem',
      fontWeight: 700,
      transition: 'all 0.2s ease',
      animation: active && value === null ? 'slotPulse 1.5s ease infinite' : 'none',
      boxShadow: value !== null ? '0 0 12px rgba(74,222,128,0.4)' : 'none',
    }}>
      {value !== null ? value : '?'}
    </div>
  );

  const FormulaDisplay = () => (
    <div style={{
      background: '#020617',
      border: '2px solid #1e293b',
      borderRadius: 14,
      padding: '16px 12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    }}>
      {cfg.missingSlot === 'base'
        ? <Slot value={slottedValue} active={true} />
        : <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', color: '#38bdf8' }}>{cfg.base}</span>
      }
      <span style={{ color: '#475569', fontSize: '1.3rem', fontFamily: "'Fredoka One', cursive" }}>×</span>

      {cfg.missingSlot === 'height'
        ? <Slot value={slottedValue} active={true} />
        : <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', color: '#38bdf8' }}>{cfg.height}</span>
      }

      <span style={{ color: '#475569', fontSize: '1.1rem', fontFamily: "'Fredoka One', cursive" }}>÷ 2 =</span>

      {cfg.missingSlot === 'area'
        ? <Slot value={slottedValue} active={true} />
        : <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', color: '#4ade80' }}>{cfg.area}</span>
      }
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {ROUNDS.map((_, i) => (
          <div key={i} style={{
            width: 32, height: 6, borderRadius: 3,
            background: i < round ? '#4ade80' : i === round ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.3rem', fontFamily: "'Fredoka One', cursive" }}>
          ⚙️ Formula Machine
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>
          {cfg.label} — Pick the missing number!
        </p>
      </div>

      {/* Machine body */}
      <div style={{
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        border: `3px solid ${shake ? '#ef4444' : '#334155'}`,
        borderRadius: 20,
        padding: '20px 16px',
        width: '100%',
        maxWidth: 480,
        animation: shake ? 'shake 0.4s ease' : 'none',
        transition: 'border-color 0.2s ease',
      }}>
        {/* Status lights */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: launched ? '#4ade80' : '#ef4444', boxShadow: `0 0 8px ${launched ? '#4ade80' : '#ef4444'}` }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: slottedValue !== null ? '#facc15' : '#334155' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: launched ? '#4ade80' : '#334155' }} />
        </div>

        <FormulaDisplay />

        {/* Action area */}
        <div style={{ marginTop: 20, minHeight: 80 }}>
          {!launched ? (
            slottedValue === null ? (
              // Choice buttons — large tap targets
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                {choices.map((c, i) => (
                  <button
                    key={i}
                    onPointerDown={() => setBtnPressed(i)}
                    onPointerUp={() => { setBtnPressed(null); handleChoiceClick(c); }}
                    onPointerCancel={() => setBtnPressed(null)}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: '2px solid #fbbf24',
                      borderRadius: 12,
                      padding: '14px 22px',
                      minWidth: 64,
                      color: '#fff',
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      boxShadow: btnPressed === i ? '0 0 0 #b45309' : '0 5px 0 #b45309',
                      transform: btnPressed === i ? 'translateY(5px)' : 'none',
                      transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                      touchAction: 'manipulation',
                      userSelect: 'none',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              // Launch button
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  {slottedValue} loaded — fire when ready!
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setSlottedValue(null)}
                    style={{
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 10, padding: '12px 20px', color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer', fontSize: '0.9rem', touchAction: 'manipulation',
                    }}
                  >
                    ↩ Change
                  </button>
                  <button
                    onPointerDown={() => setBtnPressed('go')}
                    onPointerUp={() => { setBtnPressed(null); handleLaunch(); }}
                    onPointerCancel={() => setBtnPressed(null)}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                      border: '3px solid #fca5a5',
                      borderRadius: '50%', width: 80, height: 80,
                      color: '#fff', fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem',
                      cursor: 'pointer',
                      boxShadow: btnPressed === 'go' ? '0 0 0 #7f1d1d' : '0 6px 0 #7f1d1d',
                      transform: btnPressed === 'go' ? 'translateY(6px)' : 'none',
                      transition: 'transform 0.08s, box-shadow 0.08s',
                      touchAction: 'manipulation', userSelect: 'none',
                    }}
                  >
                    GO!
                  </button>
                </div>
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', animation: 'bounceIn 0.5s ease' }}>
              <div style={{ color: '#4ade80', fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>
                🌟 CORRECT!
              </div>
              <button className="btn btn-primary" onClick={handleNext}>
                {round + 1 < ROUNDS.length ? 'Next Challenge →' : '✓ Complete Station C'}
              </button>
            </div>
          )}
        </div>
      </div>

      {shake && (
        <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.95rem' }}>
          ⚡ Wrong fuel! Try a different number!
        </div>
      )}

      <style>{`
        @keyframes slotPulse {
          0%,100% { border-color: #475569; box-shadow: none; }
          50%      { border-color: #facc15; box-shadow: inset 0 0 12px rgba(250,204,21,0.25); }
        }
      `}</style>
    </div>
  );
};

export default FormulaBuilderStation;
