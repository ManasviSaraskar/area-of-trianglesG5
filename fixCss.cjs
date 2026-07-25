const fs = require('fs');
let css = fs.readFileSync('src/App.css', 'utf8');

// Strip out everything after the first null byte or the start of the bad append
const splitIndex = css.indexOf('/* --- PLAY PHASE UI --- */');
if (splitIndex > -1) {
  css = css.substring(0, splitIndex);
} else {
  // If it's corrupted and the string search failed, we can strip out null bytes
  css = css.replace(/\0/g, '');
  const splitIndex2 = css.indexOf('/* --- PLAY PHASE UI --- */');
  if (splitIndex2 > -1) {
    css = css.substring(0, splitIndex2);
  }
}

const newCss = `
/* --- PLAY PHASE UI --- */
.question-text {
  font-family: 'Fredoka One', cursive;
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: white;
}

.mcq-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mcq-option {
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 16px;
  font-size: 1.1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.mcq-option:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.3);
}

.mcq-option.selected {
  background: rgba(255,193,7,0.2);
  border-color: #ffc107;
}

.mcq-option.correct {
  background: rgba(74,222,128,0.2);
  border-color: #4ade80;
}

.mcq-option.wrong {
  background: rgba(239,68,68,0.2);
  border-color: #ef4444;
  animation: shake 0.4s ease;
}

.true-false-row {
  display: flex;
  gap: 16px;
}

.tf-btn {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.true-btn {
  background: rgba(74,222,128,0.1);
  color: #4ade80;
  border-color: rgba(74,222,128,0.3);
}
.true-btn:hover { background: rgba(74,222,128,0.2); }
.true-btn.selected { background: #4ade80; color: #1e293b; }

.false-btn {
  background: rgba(239,68,68,0.1);
  color: #ef4444;
  border-color: rgba(239,68,68,0.3);
}
.false-btn:hover { background: rgba(239,68,68,0.2); }
.false-btn.selected { background: #ef4444; color: #1e293b; }

.hint-box {
  background: rgba(255,193,7,0.1);
  border: 1px solid rgba(255,193,7,0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  color: #ffc107;
  font-size: 0.95rem;
}

.hint-label {
  font-weight: bold;
  margin-right: 8px;
}

/* Hearts UI */
.hearts-container {
  display: flex;
  align-items: center;
  gap: 4px;
}
.heart {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}
.heart.empty {
  opacity: 0.3;
  filter: grayscale(100%);
  animation: none;
}
`;

fs.writeFileSync('src/App.css', css + newCss, 'utf8');
console.log('App.css fixed!');
