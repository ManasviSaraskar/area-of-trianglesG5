// components/phases/PlayPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { WORLDS } from '../../data/questionBank.js';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import Mascot from '../shared/Mascot.jsx';
import { calcStars, calcXP } from '../../utils/scoring.js';
import { playSound } from '../../utils/soundEffects.js';

/* ─────────────────────────────────────────────────────────
   World Complete Celebration Card
───────────────────────────────────────────────────────── */
function WorldCompleteCard({ world, score, totalQ, xpEarned, isLastWorld, onNext }) {
  const stars = calcStars(score, totalQ);
  const starArr = Array(3).fill(0);

  return (
    <div className="card quiz-card" style={{ textAlign: 'center', padding: '40px 32px', animation: 'bounceIn 0.5s ease' }}>
      {/* Confetti-like emoji burst */}
      <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎉</div>
      <div style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: '1.8rem',
        color: '#ffc107',
        marginBottom: 4,
      }}>
        World Complete!
      </div>
      <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', marginBottom: 24 }}>
        {world.emoji} {world.name} · {world.country}
      </div>

      {/* Star rating */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {starArr.map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: '2.5rem',
              filter: i < stars ? 'none' : 'grayscale(100%)',
              opacity: i < stars ? 1 : 0.25,
              animation: i < stars ? `bounceIn 0.4s ${i * 0.15}s ease both` : 'none',
            }}
          >⭐</span>
        ))}
      </div>

      {/* Score breakdown */}
      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        <div style={{
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: 12,
          padding: '12px 20px',
          minWidth: 100,
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.6rem', color: '#4ade80' }}>{score}/{totalQ}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>CORRECT</div>
        </div>
        <div style={{
          background: 'rgba(255,193,7,0.1)',
          border: '1px solid rgba(255,193,7,0.3)',
          borderRadius: 12,
          padding: '12px 20px',
          minWidth: 100,
        }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.6rem', color: '#ffc107' }}>+{xpEarned}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>XP EARNED</div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        id="world-complete-next-btn"
        onClick={onNext}
        style={{ fontSize: '1.1rem', padding: '14px 40px' }}
      >
        {isLastWorld ? '📔 Proceed to Reflect →' : `🌍 Next World →`}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   World Intro Card  (shown before a new world's questions)
───────────────────────────────────────────────────────── */
function WorldIntroCard({ world, worldIndex, onBegin }) {
  const gradients = [
    'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(14,165,233,0.08) 100%)',
    'linear-gradient(135deg, rgba(245,197,24,0.15) 0%, rgba(249,168,37,0.08) 100%)',
    'linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(76,175,80,0.08) 100%)',
  ];
  const borderColors = ['rgba(56,189,248,0.4)', 'rgba(245,197,24,0.4)', 'rgba(74,222,128,0.4)'];
  const accentColors = ['#38bdf8', '#f5c518', '#4ade80'];

  return (
    <div
      className="card quiz-card"
      style={{
        textAlign: 'center',
        padding: '48px 32px',
        background: gradients[worldIndex] || gradients[0],
        border: `1.5px solid ${borderColors[worldIndex] || borderColors[0]}`,
        animation: 'slideInUp 0.45s ease both',
      }}
    >
      {/* World badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 9999,
        padding: '5px 16px',
        fontSize: '0.78rem',
        fontWeight: 800,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        🌍 World {worldIndex + 1} of {WORLDS.length}
      </div>

      {/* Big emoji */}
      <div style={{
        fontSize: '5rem',
        marginBottom: 16,
        animation: 'float 3s ease-in-out infinite',
        display: 'block',
      }}>
        {world.emoji}
      </div>

      <div style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: '2rem',
        color: accentColors[worldIndex] || accentColors[0],
        marginBottom: 6,
      }}>
        {world.name}
      </div>
      <div style={{
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: 32,
        fontWeight: 600,
      }}>
        📍 {world.country}
      </div>

      <button
        className="btn btn-primary"
        id={`begin-world-${worldIndex}-btn`}
        onClick={onBegin}
        style={{ fontSize: '1.15rem', padding: '16px 48px' }}
      >
        🎮 Begin World {worldIndex + 1}!
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Play Phase
───────────────────────────────────────────────────────── */
const PlayPhase = ({
  questionSet,
  currentQuestion,
  currentWorld,
  worldScores,
  xp,
  streak,
  onAnswer,
  onNextQuestion,
  onSelectWorld,
  onComplete,
}) => {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastIsCorrect, setLastIsCorrect] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const [hearts, setHearts] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  // World transition state
  // 'quiz' | 'worldComplete' | 'worldIntro'
  const [viewState, setViewState] = useState('worldIntro'); // start with World 1 intro
  const [completedWorldIdx, setCompletedWorldIdx] = useState(null);
  const [worldXpEarned, setWorldXpEarned] = useState(0);
  const prevWorldRef = useRef(currentWorld);

  // Track XP earned within this world session
  const worldXpRef = useRef(0);

  const q = questionSet[currentQuestion];
  const world = WORLDS[currentWorld] || WORLDS[0];

  const worldQuestions = questionSet.filter(item => item.world === currentWorld);
  const localIndex = worldQuestions.findIndex(item => item.id === q?.id);

  const isWorldUnlocked = (wIdx) =>
    wIdx === 0 || (worldScores[wIdx - 1] !== null && worldScores[wIdx - 1] >= 3);

  const calcStarsLocal = (score) => calcStars(score, worldQuestions.length);

  /* ── Answer handler ── */
  const handleUserAnswer = (userAns) => {
    if (!q) return;
    const isCorrect = userAns === q.correctAnswer;
    const currentAttempt = attemptCount + 1;

    if (isCorrect) {
      playSound('correct');
      const gainedXP = calcXP(currentAttempt, hintsUsed, streak);
      worldXpRef.current += gainedXP;
      setEarnedXP(gainedXP);
      setLastIsCorrect(true);
      setShowFeedback(true);
      onAnswer(true, gainedXP);
    } else {
      playSound('wrong');
      setAttemptCount(currentAttempt);
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);

      if (newHearts === 0) {
        setGameOver(true);
      } else {
        if (currentAttempt < 3) {
          setHintsUsed(h => Math.min(h + 1, 2));
        } else {
          onAnswer(false, 0);
        }
        setLastIsCorrect(false);
        setShowFeedback(true);
      }
    }
  };

  /* ── Feedback continue ── */
  const handleContinue = () => {
    setShowFeedback(false);
    if (lastIsCorrect || attemptCount >= 3) {
      setAttemptCount(0);
      setHintsUsed(0);

      // Check: is this the last question in the world?
      const isLastQInWorld = localIndex === worldQuestions.length - 1;

      if (isLastQInWorld) {
        // Show world complete screen
        const score = (worldScores[currentWorld] || 0) + (lastIsCorrect ? 1 : 0);
        setCompletedWorldIdx(currentWorld);
        setWorldXpEarned(worldXpRef.current);
        worldXpRef.current = 0;
        setViewState('worldComplete');
        onNextQuestion(); // advance the index so next world is ready
      } else {
        onNextQuestion();
      }
    } else {
      setResetKey(k => k + 1);
    }
  };

  /* ── After world complete, move to next world intro or reflect ── */
  const handleWorldCompleteNext = () => {
    const nextWorldIdx = (completedWorldIdx ?? currentWorld) + 1;
    if (nextWorldIdx >= WORLDS.length) {
      // All worlds done → reflect
      onComplete();
    } else {
      setViewState('worldIntro');
    }
  };

  /* ── Begin new world ── */
  const handleBeginWorld = () => {
    setHearts(3);
    setGameOver(false);
    setAttemptCount(0);
    setHintsUsed(0);
    setResetKey(k => k + 1);
    setViewState('quiz');
  };

  /* ── Retry after hearts run out ── */
  const handleRetryWorld = () => {
    setHearts(3);
    setGameOver(false);
    setAttemptCount(0);
    setHintsUsed(0);
    setResetKey(k => k + 1);
  };

  /* ── detect external world change (from world-pill click) ── */
  useEffect(() => {
    if (prevWorldRef.current !== currentWorld) {
      prevWorldRef.current = currentWorld;
      setViewState('worldIntro');
      setHearts(3);
      setGameOver(false);
      setAttemptCount(0);
      setHintsUsed(0);
      setResetKey(k => k + 1);
    }
  }, [currentWorld]);

  /* ── Determine which world to show in the complete/intro screens ── */
  const displayedWorldForIntro = WORLDS[currentWorld] || WORLDS[0];
  const displayedWorldForComplete = WORLDS[completedWorldIdx] || WORLDS[0];
  const completedScore =
    completedWorldIdx !== null
      ? (worldScores[completedWorldIdx] || 0)
      : 0;

  return (
    <div className="phase-container">
      {/* ── Header ── */}
      <div className="phase-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="phase-tag play">🎮 Phase 4 — IntelliPlay™</div>
          <h2 className="phase-title" style={{ margin: '8px 0 0 0' }}>
            {world.emoji} {world.name} ({world.country})
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {/* Hearts */}
          <div className="hearts-container">
            {Array(3).fill(0).map((_, i) => (
              <span key={i} className={`heart ${i >= hearts ? 'empty' : ''}`}>❤️</span>
            ))}
          </div>
          {/* XP Badge */}
          <div style={{
            background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.4)',
            borderRadius: 20, padding: '6px 12px', color: '#4ade80',
            fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 0 10px rgba(74,222,128,0.2)',
          }}>
            <span>✨</span> {xp} XP
          </div>
        </div>
      </div>

      {/* ── World map selector strip ── */}
      <div className="world-map-strip">
        {WORLDS.map((w, idx) => {
          const unlocked = isWorldUnlocked(idx);
          const score = worldScores[idx];
          const stars = score !== null ? calcStars(score, 5) : 0;
          return (
            <div
              key={w.id}
              className={`world-pill ${idx === currentWorld ? 'active' : ''} ${!unlocked ? 'locked' : ''} ${score >= 3 ? 'complete' : ''}`}
              onClick={() => {
                if (unlocked) {
                  onSelectWorld(idx);
                }
              }}
            >
              <span className="world-emoji">{unlocked ? w.emoji : '🔒'}</span>
              <span className="world-num">World {idx + 1}</span>
              <span className="world-stars">
                {score !== null ? ('⭐'.repeat(stars) || '0/5') : 'Locked'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Main content area ── */}

      {/* WORLD INTRO card */}
      {viewState === 'worldIntro' && (
        <WorldIntroCard
          world={displayedWorldForIntro}
          worldIndex={currentWorld}
          onBegin={handleBeginWorld}
        />
      )}

      {/* WORLD COMPLETE card */}
      {viewState === 'worldComplete' && (
        <WorldCompleteCard
          world={displayedWorldForComplete}
          score={completedScore}
          totalQ={worldQuestions.length || 5}
          xpEarned={worldXpEarned}
          isLastWorld={(completedWorldIdx ?? 0) >= WORLDS.length - 1}
          onNext={handleWorldCompleteNext}
        />
      )}

      {/* QUIZ */}
      {viewState === 'quiz' && (
        <>
          {gameOver ? (
            <div className="card quiz-card" style={{ textAlign: 'center', padding: 40, animation: 'shake 0.5s ease' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>💔</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '2rem', color: '#ef4444', marginBottom: 12 }}>
                Out of Hearts!
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: 24 }}>
                Don't worry, Triangle Trekker! You can try again.
              </p>
              <button className="btn btn-primary" onClick={handleRetryWorld}>
                🔄 Refill Hearts &amp; Retry
              </button>
            </div>
          ) : q ? (
            <div className="card quiz-card">
              {/* Progress bar */}
              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((localIndex + 1) / Math.max(worldQuestions.length, 1)) * 100}%` }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 16 }}>
                <span>Question {localIndex + 1} of {worldQuestions.length}</span>
                <span>Difficulty: {'⭐'.repeat(q.difficulty)}</span>
              </div>

              <QuestionRenderer
                key={`${q?.id}-${resetKey}`}
                question={q}
                onAnswer={handleUserAnswer}
                hintsUsed={hintsUsed}
              />
            </div>
          ) : (
            // Fallback — all questions done (should not normally appear)
            <div className="card quiz-card" style={{ textAlign: 'center', padding: 40 }}>
              <Mascot mood="celebrating" speech="All challenges completed! 🎉" />
              <div style={{ marginTop: 24 }}>
                <button className="btn btn-primary" onClick={onComplete}>
                  📔 Proceed to Reflect Phase →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Feedback modal overlay */}
      {showFeedback && (
        <FeedbackOverlay
          isCorrect={lastIsCorrect}
          explanation={q?.explanation}
          xpEarned={earnedXP}
          attemptCount={attemptCount}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default PlayPhase;
