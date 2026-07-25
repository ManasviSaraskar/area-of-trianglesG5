// components/quiz/QuestionRenderer.jsx
import React, { useState } from 'react';
import RectangleSplitDiagram from '../shared/RectangleSplitDiagram.jsx';
import GridDiagram from '../shared/GridDiagram.jsx';

const QuestionRenderer = ({ question, onAnswer, hintsUsed }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [status, setStatus] = useState(null); // 'correct', 'wrong', null

  React.useEffect(() => {
    setSelectedOption(null);
    setStatus(null);
  }, [question]);

  if (!question) return null;

  const handleMCQClick = (opt) => {
    if (selectedOption !== null) return; // prevent multiple clicks
    setSelectedOption(opt);
    const isCorrect = opt === question.correctAnswer;
    setStatus(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => onAnswer(opt), 600);
  };

  const handleTFClick = (val) => {
    if (selectedOption !== null) return;
    setSelectedOption(val);
    const isCorrect = val === question.correctAnswer;
    setStatus(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => onAnswer(val), 600);
  };

  const renderVisual = () => {
    switch (question.visual) {
      case 'splitDiagram':
        return (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ maxWidth: 320, width: '100%' }}>
              <RectangleSplitDiagram
                base={question.base}
                height={question.height}
                split={true}
                missingSlot={question.missingSlot}
                size="medium"
              />
            </div>
          </div>
        );
      case 'gridDiagram':
        return (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ maxWidth: 280, width: '100%' }}>
              <GridDiagram base={question.base} height={question.height} cellSize={32} />
            </div>
          </div>
        );
      case 'picture':
        return (
          <div style={{
            fontSize: '4.5rem', textAlign: 'center', margin: '16px 0',
            animation: 'bounceIn 0.4s ease'
          }}>
            {question.objectEmoji || '📐'}
          </div>
        );
      case 'sentence':
        return (
          <div style={{
            background: 'rgba(245,197,24,0.08)',
            border: '1.5px dashed rgba(245,197,24,0.4)',
            borderRadius: 14,
            padding: '18px 24px',
            textAlign: 'center',
            margin: '16px 0',
            fontFamily: "'Fredoka One', cursive",
            fontSize: '1.5rem',
            color: '#f5c518'
          }}>
            {question.base ? `${question.base} × ` : '? × '}
            {question.height ? `${question.height} ÷ 2 = ` : '? ÷ 2 = '}
            {question.area ? `${question.area}` : '?'}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Question Text */}
      <h3 className="question-text">
        {question.objectEmoji && <span style={{ marginRight: 8 }}>{question.objectEmoji}</span>}
        {question.questionText}
      </h3>

      {/* Visual scaffold */}
      {renderVisual()}

      {/* Hints if used */}
      {hintsUsed >= 1 && (
        <div className="hint-box">
          <span className="hint-label">💡 Hint 1:</span>
          {question.hint1}
        </div>
      )}
      {hintsUsed >= 2 && (
        <div className="hint-box" style={{ background: 'rgba(56,189,248,0.1)', borderColor: 'rgba(56,189,248,0.3)', color: '#38bdf8' }}>
          <span className="hint-label">💡 Hint 2:</span>
          {question.hint2}
        </div>
      )}

      {/* Answer Inputs */}
      {question.visual === 'trueFalse' || question.type === 'true_false_area' ? (
        <div className="true-false-row" style={{ marginTop: 24 }}>
          <button
            className={`tf-btn true-btn ${selectedOption === 'True' ? 'selected' : ''} ${selectedOption === 'True' ? status : ''}`}
            onClick={() => handleTFClick('True')}
          >
            True ✓
          </button>
          <button
            className={`tf-btn false-btn ${selectedOption === 'False' ? 'selected' : ''} ${selectedOption === 'False' ? status : ''}`}
            onClick={() => handleTFClick('False')}
          >
            False ✗
          </button>
        </div>
      ) : question.options ? (
        <div className="mcq-options">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className={`mcq-option ${selectedOption === opt ? 'selected' : ''} ${selectedOption === opt ? status : ''}`}
              onClick={() => handleMCQClick(opt)}
            >
              {opt} {typeof opt === 'number' && 'sq. units'}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default QuestionRenderer;
