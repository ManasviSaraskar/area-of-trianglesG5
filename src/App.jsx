// App.jsx — Root Application Component
import React, { useReducer, useEffect, useState } from 'react';
import IntroScreen from './components/IntroScreen.jsx';
import ProgressMap from './components/ProgressMap.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';

import questionBank from './data/questionBank.js';
import { checkBadges } from './utils/badgeEngine.js';
import { calcTotalStars } from './utils/scoring.js';
import { Volume2, VolumeX } from 'lucide-react';
import { stopAudio } from './hooks/useAudio.js';
import './App.css';

const SESSION_KEY = 'intellia_area_triangles_v1';

const initialState = {
  phase: 'intro', // 'intro' | 'wonder' | 'story' | 'simulate' | 'play' | 'reflect'
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false],
  questionSet: questionBank,
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: [null, null, null],
  hintsUsed: 0,
  attemptCount: 0,
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: {
    wonder: false,
    story: false,
    simulate: false,
    play: false,
    reflect: false,
  },
  stationBPerfect: true,
  formulaCorrect: 0,
  audioEnabled: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'SET_STORY_PANEL':
      return { ...state, storyPanel: action.payload };

    case 'COMPLETE_PHASE': {
      const p = action.payload;
      const nextPhaseMap = {
        wonder: 'story',
        story: 'simulate',
        simulate: 'play',
        play: 'reflect',
        reflect: 'intro',
      };
      return {
        ...state,
        phaseComplete: { ...state.phaseComplete, [p]: true },
        phase: nextPhaseMap[p] || state.phase,
      };
    }

    case 'COMPLETE_SIM_STATION': {
      const idx = action.payload;
      const updated = [...state.simStationsComplete];
      updated[idx] = true;
      return { ...state, simStationsComplete: updated };
    }

    case 'SET_STATION_B_PERFECT':
      return { ...state, stationBPerfect: action.payload ?? true };

    case 'INC_FORMULA_CORRECT':
      return { ...state, formulaCorrect: (state.formulaCorrect || 0) + 1 };

    case 'ANSWER_CORRECT': {
      const { xpEarned } = action.payload;
      const newStreak = state.streak + 1;
      const wIdx = state.currentWorld;
      const currentScore = state.worldScores[wIdx] || 0;
      const updatedScores = [...state.worldScores];
      updatedScores[wIdx] = currentScore + 1;

      return {
        ...state,
        xp: state.xp + xpEarned,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        worldScores: updatedScores,
        totalStars: calcTotalStars(updatedScores),
      };
    }

    case 'ANSWER_INCORRECT':
      return { ...state, streak: 0 };

    case 'NEXT_QUESTION': {
      const nextQ = state.currentQuestion + 1;
      let nextWorld = state.currentWorld;
      if (nextQ < state.questionSet.length) {
        nextWorld = state.questionSet[nextQ].world;
      }
      return {
        ...state,
        currentQuestion: Math.min(nextQ, state.questionSet.length - 1),
        currentWorld: nextWorld,
      };
    }

    case 'SET_WORLD':
      return { ...state, currentWorld: action.payload };

    case 'UNLOCK_BADGES':
      return { ...state, badges: [...new Set([...state.badges, ...action.payload])] };

    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };

    case 'RESTORE_SESSION':
      return { ...state, ...action.payload };

    case 'RESET_SESSION':
      return { ...initialState };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Check badges after state updates (silent unlock — no toast popup)
  useEffect(() => {
    const newBadges = checkBadges(state);
    if (newBadges.length > 0) {
      dispatch({ type: 'UNLOCK_BADGES', payload: newBadges });
    }
  }, [state]);

  // Session persistence
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  // Scroll to top on every phase change (important on mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.phase]);

  const handleStart = () => {
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  };


  const handleAnswer = (isCorrect, xpEarned) => {
    if (isCorrect) {
      dispatch({ type: 'ANSWER_CORRECT', payload: { xpEarned } });
    } else {
      dispatch({ type: 'ANSWER_INCORRECT' });
    }
  };

  return (
    <>
      <div className="floating-numbers">
         <div className="floating-number" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>{'📐'}</div>
         <div className="floating-number" style={{ top: '30%', right: '20%', animationDelay: '2s' }}>{'🔺'}</div>
         <div className="floating-number" style={{ bottom: '20%', left: '30%', animationDelay: '4s' }}>{'📏'}</div>
         <div className="floating-number" style={{ bottom: '40%', right: '10%', animationDelay: '6s' }}>{'▲'}</div>
      </div>
      <div className="app-container">
        {/* Audio Mute Button */}
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })} 
          className="audio-toggle-btn"
          aria-label="Toggle audio mute"
        >
          {!state.audioEnabled ? <VolumeX className="w-6 h-6 text-red-400" /> : <Volume2 className="w-6 h-6 text-white" />}
        </button>

        {/* Home Button */}
        {state.phase !== 'intro' && (
          <button className="home-btn" onClick={() => { stopAudio(); dispatch({ type: 'SET_PHASE', payload: 'intro' }); }}>
            🏠 Home
          </button>
        )}

        {/* Journey Progress Bar */}
        {state.phase !== 'intro' && (
          <div className="journey-bar">
            {[
              { id: "wonder", label: "Wonder", icon: "🔍" },
              { id: "story", label: "Story", icon: "📖" },
              { id: "simulate", label: "Simulate", icon: "🧪" },
              { id: "play", label: "Practice", icon: "🎮" },
              { id: "reflect", label: "Reflect", icon: "📓" }
            ].map((step, idx) => {
              const PHASES = ["wonder", "story", "simulate", "play", "reflect"];
              const isActive = state.phase === step.id;
              const isPast = PHASES.indexOf(state.phase) > PHASES.indexOf(step.id);
              return (
                <div key={step.id} className="journey-step-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                    <div className="journey-step-dot">{isPast ? '✓' : step.icon}</div>
                    <div className="journey-step-label">{step.label}</div>
                  </div>
                  {idx < 4 && (
                    <div className={`journey-connector ${isPast ? 'filled' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Main View Router */}
        {state.phase === 'intro' && (
          <IntroScreen onStart={handleStart} />
        )}
        {state.phase === 'wonder' && (
          <WonderPhase
            audioEnabled={state.audioEnabled}
            onComplete={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' })}
            onBack={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}
          />
        )}
        {state.phase === 'story' && (
          <StoryPhase
            audioEnabled={state.audioEnabled}
            onPanelChange={(pIdx) => dispatch({ type: 'SET_STORY_PANEL', payload: pIdx })}
            onComplete={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'story' })}
            onBack={() => dispatch({ type: 'SET_PHASE', payload: 'wonder' })}
          />
        )}
        {state.phase === 'simulate' && (
          <SimulatePhase
            audioEnabled={state.audioEnabled}
            simStationsComplete={state.simStationsComplete}
            onStationComplete={(idx) => dispatch({ type: 'COMPLETE_SIM_STATION', payload: idx })}
            onComplete={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'simulate' })}
            dispatch={dispatch}
          />
        )}
        {state.phase === 'play' && (
          <PlayPhase
            audioEnabled={state.audioEnabled}
            questionSet={state.questionSet}
            currentQuestion={state.currentQuestion}
            currentWorld={state.currentWorld}
            worldScores={state.worldScores}
            xp={state.xp}
            streak={state.streak}
            onAnswer={handleAnswer}
            onNextQuestion={() => dispatch({ type: 'NEXT_QUESTION' })}
            onSelectWorld={(wIdx) => dispatch({ type: 'SET_WORLD', payload: wIdx })}
            onComplete={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'play' })}
          />
        )}
        {state.phase === 'reflect' && (
          <ReflectPhase
            audioEnabled={state.audioEnabled}
            xp={state.xp}
            totalStars={state.totalStars}
            badges={state.badges}
            onFinishLesson={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' })}
          />
        )}
      </div>
    </>
  );
}
