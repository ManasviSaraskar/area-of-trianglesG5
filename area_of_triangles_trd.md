# Technical Requirements Document (TRD)

## Triangle Trekkers — Discovering the Area of Triangles | Grade 3 Math
### Intellia SG | Global Primary Mathematics Curriculum

---

> **Reference UI (strict mirror):** https://equal-tau.vercel.app/
> **Reference Repo (strict mirror):** https://github.com/dsamyak/equal
> **Embed target:** https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for the **"Triangle Trekkers — Discovering the Area of Triangles"** interactive lesson module (Lesson 8.6) within Intellia SG's Grade 3 Math program.

The module is a **React 18 application (Vite + JSX)**, structured identically to the reference repository **https://github.com/dsamyak/equal**, and styled to match **https://equal-tau.vercel.app/**. It will be embedded at:
`https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/`

Audio narration uses **ElevenLabs exclusively** (no browser Web Speech API fallback), mirroring the audio pipeline of the reference "Equal Groups" module, adapted for this lesson's scripts.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 (JSX, Vite) | Matches `equal` repo structure exactly |
| State Management | `useState` + `useReducer` | Sufficient for single-module complexity |
| Styling | CSS Modules + Tailwind | Matches existing repo CSS approach |
| Icons | Lucide React | Available in artifact/build environment |
| Animation | CSS keyframes + transitions | No external dependency needed |
| SVG Diagrams | Inline SVG (React) | For rectangle-split and grid diagrams |
| Persistence | `localStorage` | Session state, no backend needed |
| Audio (Primary) | ElevenLabs API | Premium, consistent voice (Alice) |
| Audio (Playback) | HTML5 Audio API (`new Audio()`) | Browser-native, no library needed |
| Math | Vanilla JS | No library required |
| Build Tool | Vite | Matches repo (`vite.config.js` present) |

---

## 3. Project Structure (mirrors the `equal` repo)

```
area-of-triangles/
├── public/
│   ├── assets/
│   │   ├── audio/                      # Pre-generated .mp3 files (ElevenLabs)
│   │   │   ├── audio_wonder_hook_0.mp3
│   │   │   ├── audio_story_panel1_0.mp3
│   │   │   ├── audio_story_panel2_0.mp3
│   │   │   ├── audio_story_panel3_0.mp3
│   │   │   ├── audio_story_panel4_0.mp3
│   │   │   ├── audio_story_panel5_0.mp3
│   │   │   ├── audio_story_panel6_0.mp3
│   │   │   ├── audio_station_a_instruction_0.mp3
│   │   │   ├── audio_station_b_instruction_0.mp3
│   │   │   ├── audio_station_c_instruction_0.mp3
│   │   │   ├── audio_correct_0.mp3
│   │   │   ├── audio_reflect_prompt_0.mp3
│   │   │   └── ... (all phase phrases pre-generated)
│   │   └── images/
│   │       ├── mascot-idle.svg
│   │       ├── mascot-happy.svg
│   │       ├── mascot-thinking.svg
│   │       ├── mascot-celebrate.svg
│   │       └── world-map-bg.svg
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Root component, global state (useReducer)
│   ├── App.css                         # Global styles (mirrors equal-tau CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx             # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx             # 5-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx         # Phase 1: Hook animation + ElevenLabs narration
│   │   │   ├── StoryPhase.jsx          # Phase 2: Round-the-world narrative panels
│   │   │   ├── SimulatePhase.jsx       # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx           # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx        # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── TriangleSplitterStation.jsx  # Station A: Drag to split rectangle into 2 triangles
│   │   │   ├── GridCounterStation.jsx       # Station B: Count whole/half unit squares
│   │   │   └── FormulaBuilderStation.jsx    # Station C: Fill "___ × ___ ÷ 2 = ___"
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx    # Polymorphic dispatcher → type-specific component
│   │   │   ├── GridCountQ.jsx          # Q1: Count grid squares → find area
│   │   │   ├── PictureCompareQ.jsx     # Q2: Tap triangle with larger area
│   │   │   ├── FillAreaQ.jsx           # Q3: Fill blank — find area
│   │   │   ├── FillBaseQ.jsx           # Q4: Fill blank — find base
│   │   │   ├── FillHeightQ.jsx         # Q5: Fill blank — find height
│   │   │   ├── WordProbFindAreaQ.jsx   # Q6: Word problem — find area
│   │   │   ├── WordProbCompareQ.jsx    # Q7: Word problem — compare two triangles
│   │   │   ├── TrueFalseAreaQ.jsx      # Q8: True/False — is this area calc correct?
│   │   │   ├── SpotRightTriangleQ.jsx  # Q9: Which triangle is half the rectangle? (4 choices)
│   │   │   ├── RectangleLinkQ.jsx      # Q10: Rectangle-to-triangle link
│   │   │   └── HintOverlay.jsx         # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx           # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx          # 1–3 star rating per world
│   │   │   ├── BadgePanel.jsx          # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx       # Fire streak counter
│   │   │   └── WorldMap.jsx            # 10-world progress map (horizontal scroll)
│   │   └── shared/
│   │       ├── Mascot.jsx              # LearnFlow robot with mood states + explorer hat
│   │       ├── RectangleSplitDiagram.jsx # Reusable SVG: rectangle + diagonal split
│   │       ├── GridDiagram.jsx         # Reusable SVG: unit-square grid with triangle overlay
│   │       ├── NumberPad.jsx           # Large tap-friendly digit input (0–9)
│   │       └── FeedbackOverlay.jsx     # Correct/incorrect overlay with animation
│   ├── data/
│   │   ├── questionBank.js             # 100 question objects (all types)
│   │   └── storyContent.js             # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                 # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js             # Gamification state hook
│   │   └── useLocalStorage.js          # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                 # AUTO-GENERATED: text → .mp3 path map
│       ├── shuffle.js                  # Fisher-Yates randomization
│       ├── scoring.js                  # XP + star calculation + distractor gen
│       └── badgeEngine.js              # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js               # Offline ElevenLabs audio pre-generation
│   └── clean_audio.js                  # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                   # ElevenLabs proxy (if server-side key needed)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```javascript
const initialState = {
  // Navigation
  phase: 'intro',              // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,                // 0–5 (6 story panels)
  currentSimStation: 0,         // 0=TriangleSplitter, 1=GridCounter, 2=FormulaBuilder
  simStationsComplete: [false, false, false],
  simRound: 0,                  // Round index within current station (0–3)

  // Play / Challenge phase
  questionSet: [],              // 100 shuffled Question objects
  currentQuestion: 0,           // 0–99
  currentWorld: 0,               // 0–9 (10 worlds)
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,              // Attempts on current question (max 3)

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],                   // Array of unlocked badge IDs

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,           // ElevenLabs narration on/off
  musicEnabled: false,          // Background ambient music (off by default)
};
```

### 4.2 Reducer Action Types

```javascript
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```javascript
// ANSWER_CORRECT dispatch
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const worldIndex = Math.floor(state.currentQuestion / 10);
  const newWorldScore = (state.worldScores[worldIndex] || 0) + 1;
  const updatedWorldScores = [...state.worldScores];
  updatedWorldScores[worldIndex] = newWorldScore;
  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    worldScores: updatedWorldScores,
    totalStars: calcTotalStars(updatedWorldScores),
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT dispatch
case ACTIONS.ANSWER_INCORRECT: {
  return {
    ...state,
    streak: 0,
    attemptCount: state.attemptCount + 1,
  };
}
```

---

## 5. Question Data Model

### 5.1 Question Schema

```typescript
interface Question {
  id: string;                    // e.g. "Q1_003", "Q7_008"
  type: QuestionType;            // One of 10 enum values (see below)
  world: number;                 // 0–9 (which world this belongs to)
  difficulty: 1 | 2 | 3;         // 1=easy(≤15), 2=medium(≤30), 3=hard(≤48)

  // Core math values
  base: number;
  height: number;
  area: number;                  // (base × height) ÷ 2
  missingSlot: 'base' | 'height' | 'area';

  // Rendering
  questionText: string;          // Full narrated question text (ElevenLabs reads this)
  visual: VisualType;             // 'splitDiagram' | 'gridDiagram' | 'picture' | 'sentence' | 'trueFalse'
  objectEmoji?: string;           // E.g. '⛵', '🚩', '🪁', '🏔️', '⛺'

  // MCQ
  options?: (number|string)[];    // 4 MCQ options (always includes correctAnswer)

  // Hints
  hint1: string;                  // Shown after 1 wrong attempt
  hint2: string;                  // Shown after 2 wrong attempts (animation trigger)
  explanation: string;            // Full text explanation after 3 fails (read aloud)

  // Word problems only
  characterName?: string;
  character2Name?: string;        // For comparison questions (Q7)
  objectName?: string;

  // True/False only
  isTrue?: boolean;

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'grid_count'          // Q1: Count grid squares → find area
  | 'picture_compare'     // Q2: Tap triangle with larger area
  | 'fill_area'           // Q3: base × height ÷ 2 = ___
  | 'fill_base'           // Q4: ___ × height ÷ 2 = area
  | 'fill_height'         // Q5: base × ___ ÷ 2 = area
  | 'word_problem_area'   // Q6: find-area word problem
  | 'word_problem_compare'// Q7: compare-two-triangles word problem
  | 'true_false_area'     // Q8: Is "base × height ÷ 2 = X" true or false?
  | 'spot_right_triangle' // Q9: Which triangle is half of the shown rectangle?
  | 'rectangle_link';     // Q10: Rectangle-to-triangle link

type VisualType =
  | 'splitDiagram'  // SVG rectangle + diagonal split (RectangleSplitDiagram)
  | 'gridDiagram'   // SVG unit-square grid with triangle overlay (GridDiagram)
  | 'picture'       // Static comparison picture card
  | 'sentence'       // "___ × ___ ÷ 2 = ___" with highlighted blank
  | 'trueFalse';     // Statement + True/False buttons
```

### 5.2 Sample Question Objects

```javascript
// Q1 — Grid Count
{
  id: "Q1_001",
  type: "grid_count",
  world: 0,
  difficulty: 1,
  base: 4, height: 3, area: 6,
  missingSlot: "area",
  questionText: "This triangle covers 4 whole squares and 4 half squares. What is the area?",
  visual: "gridDiagram",
  objectEmoji: "⛵",
  hint1: "Two half squares make one whole square. Count carefully!",
  hint2: "4 whole squares + 4 half squares = 4 + 2 = 6 square units.",
  explanation: "4 whole squares plus 4 half squares (which make 2 more wholes) equals 6 square units.",
  options: [4, 5, 6, 8],
  correctAnswer: 6,
}

// Q6 — Word Problem (Find Area)
{
  id: "Q6_004",
  type: "word_problem_area",
  world: 3,
  difficulty: 2,
  base: 6, height: 8, area: 24,
  missingSlot: "area",
  questionText: "John's kite has a base of 6 cm and a height of 8 cm. What is its area?",
  visual: "picture",
  objectEmoji: "🪁",
  characterName: "John",
  objectName: "kite",
  hint1: "Multiply the base and height first: 6 × 8.",
  hint2: "6 × 8 = 48. Now split it in half: 48 ÷ 2.",
  explanation: "6 × 8 = 48, and 48 ÷ 2 = 24. John's kite has an area of 24 square cm.",
  options: [12, 20, 24, 48],
  correctAnswer: 24,
}

// Q7 — Word Problem (Compare)
{
  id: "Q7_002",
  type: "word_problem_compare",
  world: 2,
  difficulty: 2,
  base: 8, height: 5, area: 20,
  missingSlot: "area",
  questionText: "Priya's flag is a triangle with base 8 and height 5. Carlos's flag is a triangle with base 6 and height 6. Whose flag has the bigger area?",
  visual: "picture",
  objectEmoji: "🚩",
  characterName: "Priya",
  character2Name: "Carlos",
  objectName: "flag",
  hint1: "Find each area separately: (8 × 5) ÷ 2 and (6 × 6) ÷ 2.",
  hint2: "Priya: 40 ÷ 2 = 20. Carlos: 36 ÷ 2 = 18. Compare them!",
  explanation: "Priya's flag is 20 square units and Carlos's is 18 square units, so Priya's flag is bigger.",
  options: ["Priya", "Carlos", "They are equal", "Cannot tell"],
  correctAnswer: "Priya",
}

// Q10 — Rectangle-to-Triangle Link
{
  id: "Q10_005",
  type: "rectangle_link",
  world: 5,
  difficulty: 3,
  base: 6, height: 8, area: 24,
  missingSlot: "area",
  questionText: "A rectangle has an area of 48 square units. A triangle formed by its diagonal has an area of ___",
  visual: "sentence",
  hint1: "A triangle formed by a rectangle's diagonal is always half the rectangle.",
  hint2: "48 ÷ 2 = 24.",
  explanation: "The diagonal always splits a rectangle into two equal triangles, so the triangle's area is 48 ÷ 2 = 24.",
  options: [12, 24, 36, 48],
  correctAnswer: 24,
}
```

---

## 6. Rectangle-Split & Grid Diagram SVG Components

```javascript
// RectangleSplitDiagram.jsx — reusable SVG for rectangle + diagonal split
const RectangleSplitDiagram = ({
  base,
  height,
  missingSlot,
  split = true,
  animated = false,
  size = 'medium', // 'small' | 'medium' | 'large'
}) => {
  const unit = size === 'large' ? 26 : size === 'medium' ? 20 : 14;
  const w = base * unit;
  const h = height * unit;
  const pad = 24;

  return (
    <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2 + 24}`}
         xmlns="http://www.w3.org/2000/svg"
         style={{ maxWidth: '100%', height: 'auto' }}>
      {/* Rectangle outline */}
      <rect x={pad} y={pad} width={w} height={h}
            fill="none" stroke="#94a3b8" strokeWidth="2" />

      {/* Upper-left triangle */}
      <polygon points={`${pad},${pad} ${pad + w},${pad} ${pad},${pad + h}`}
               fill="hsl(205, 70%, 88%)" stroke="hsl(205, 70%, 55%)" strokeWidth="2" />

      {/* Lower-right triangle (peels away on split) */}
      <polygon points={`${pad + w},${pad} ${pad + w},${pad + h} ${pad},${pad + h}`}
               fill={split ? "hsl(40, 85%, 88%)" : "hsl(205, 70%, 88%)"}
               stroke="hsl(40, 85%, 55%)" strokeWidth="2"
               className={split ? "triangle-peel" : ""} />

      {/* Diagonal line */}
      <line x1={pad} y1={pad} x2={pad + w} y2={pad + h}
            stroke="#334155" strokeWidth="2.5" strokeDasharray={split ? "0" : "6,3"} />

      {/* Base / height labels */}
      <text x={pad + w / 2} y={pad + h + 18} textAnchor="middle" fontSize="13" fill="#555">
        {missingSlot === 'base' ? '?' : base}
      </text>
      <text x={pad - 10} y={pad + h / 2} textAnchor="end" fontSize="13" fill="#555">
        {missingSlot === 'height' ? '?' : height}
      </text>

      {/* Formula label underneath */}
      <text x={(w + pad * 2) / 2} y={h + pad * 2 + 18} textAnchor="middle" fontSize="15"
            fill="#333" fontWeight="bold">
        {`${base} × ${height} ÷ 2 = ${missingSlot === 'area' ? '?' : (base * height) / 2}`}
      </text>
    </svg>
  );
};
```

```javascript
// GridDiagram.jsx — reusable SVG for unit-square grid with triangle overlay
const GridDiagram = ({ base, height, cellSize = 24 }) => {
  const w = base * cellSize;
  const h = height * cellSize;

  return (
    <svg viewBox={`0 0 ${w + 20} ${h + 20}`} xmlns="http://www.w3.org/2000/svg">
      {/* Grid lines */}
      {Array.from({ length: base + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={10 + i * cellSize} y1={10}
              x2={10 + i * cellSize} y2={10 + h} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {Array.from({ length: height + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={10} y1={10 + i * cellSize}
              x2={10 + w} y2={10 + i * cellSize} stroke="#e2e8f0" strokeWidth="1" />
      ))}

      {/* Triangle overlay (right triangle: top-left → top-right → bottom-left) */}
      <polygon points={`10,10 ${10 + w},10 10,${10 + h}`}
               fill="hsla(205, 70%, 60%, 0.35)" stroke="#1d4ed8" strokeWidth="2" />
    </svg>
  );
};

// Whole/half-square tally logic (utils/scoring.js → countTriangleSquares)
export function countTriangleSquares(base, height) {
  // For a right triangle with integer base/height on a grid:
  // wholeSquares = squares fully below the diagonal
  // halfSquares  = squares the diagonal passes through (always = base, or height, whichever governs the slope)
  // Simplified for base===height (common in this lesson): whole = (b-1)*(b)/2 pairs; else computed per round in data
  const total = (base * height) / 2;
  return { total };
}
```

Animation variants:
- `animated=true` → CSS `dotCountUp`-style keyframe: grid squares fade in with staggered delay
- **shake** variant → CSS `shake` keyframe applied to `<svg>` wrapper on wrong answer
- **bounce** variant → CSS `bounceIn` keyframe applied to `<svg>` wrapper on correct answer
- **triangle-peel** class → CSS transform/translate animation that visually slides the second triangle away from the first on split confirmation

---

## 7. Simulation Station Component Specs

### 7.1 `TriangleSplitterStation.jsx` — Station A (Concrete)

```javascript
const [rectConfig, setRectConfig] = useState(getStationARound(state.simRound));
// rectConfig: { base: 6, height: 4, objectEmoji: '⛵', theme: 'sail' }

const [splitProgress, setSplitProgress] = useState(0); // 0–100, drag progress along diagonal
const [isSplit, setIsSplit] = useState(false);
```

**Interaction (Drag):**
- A draggable handle sits on the diagonal midpoint; dragging it fully to the corner triggers `isSplit = true`
- On split: `RectangleSplitDiagram` renders with `split=true`, triggering the `triangle-peel` animation
- A live label updates: `"Rectangle = {base} × {height} = {base*height}"` → `"Triangle = {base*height} ÷ 2 = {area}"`

**Interaction (Tap fallback):**
- A single "Split it!" button animates the same sequence for accessibility mode

**Completion Check:**
- `isSplit === true` required before "Submit" button appears
- On submit: mascot celebrates, ElevenLabs plays celebration audio
- If student tries to submit before splitting: gentle nudge narration, no penalty

**Station A Rounds (4 rounds, randomized order):**
```javascript
{ base: 4, height: 3, objectEmoji: '⛵', theme: 'Sydney sail' }
{ base: 6, height: 4, objectEmoji: '🔺', theme: 'Giza pyramid face' }
{ base: 8, height: 5, objectEmoji: '🚩', theme: 'Swiss flag' }
{ base: 6, height: 6, objectEmoji: '🏠', theme: 'Tokyo roof panel' }
```

### 7.2 `GridCounterStation.jsx` — Station B (Pictorial)

```javascript
const [grid, setGrid] = useState(generateGridRound(round));
const [wholeCount, setWholeCount] = useState(0);
const [halfCount, setHalfCount] = useState(0);
const [submitted, setSubmitted] = useState(false);
```

**Card / Grid Generation (`generateGridRound`):**
- Creates a base × height grid with a right-triangle overlay
- Cells are tagged `'whole' | 'half' | 'none'` based on their position relative to the diagonal
- Rendered without numeric labels — pure visual counting

**Interaction:**
- Student taps whole cells to add 1 to `wholeCount`, half cells to add 1 to `halfCount`
- Live tally shown: `"Whole: {wholeCount} | Half: {halfCount} | Total: {wholeCount + halfCount/2}"`
- "Check" button submits `wholeCount + halfCount / 2` against the true area

**Rounds (3 rounds per station):**
- Round 1: base 4, height 3 (easy count)
- Round 2: base 6, height 4 (medium count)
- Round 3: base 8, height 5 (careful counting required)

### 7.3 `FormulaBuilderStation.jsx` — Station C (Abstract)

```javascript
const [problem, setProblem] = useState(getFormulaProblem(state.simRound));
// problem: { base, height, area, missingSlot }
const [inputValue, setInputValue] = useState('');
const [showDiagram, setShowDiagram] = useState(false);
```

**Layout:**
```jsx
<div class="formula-row">
  {missingSlot === 'base'
    ? <BlankInput value={inputValue} />
    : <span class="given-value">{base}</span>}
  <span class="label">×</span>
  {missingSlot === 'height'
    ? <BlankInput value={inputValue} />
    : <span class="given-value">{height}</span>}
  <span class="label">÷ 2 =</span>
  {missingSlot === 'area'
    ? <BlankInput value={inputValue} />
    : <span class="given-value">{area}</span>}
</div>
<NumberPad max={48} value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />
<button onClick={() => setShowDiagram(!showDiagram)}>Show me the grid 📐</button>
{showDiagram && <GridDiagram base={base} height={height} />}
```

**Variants (rotated across 3 rounds):**
- Round 1: Find area → `6 × 4 ÷ 2 = ___`
- Round 2: Find base → `___ × 5 ÷ 2 = 15`
- Round 3: Find height → `8 × ___ ÷ 2 = 20`

ElevenLabs reads the full formula aloud when displayed: *"Six times four, divided by two equals what? Type the answer!"*

---

## 8. Audio Pipeline (ElevenLabs — Matching Reference Architecture)

### 8.1 Voice Configuration

| Setting | Value |
|---|---|
| Voice Name | Alice |
| Voice ID | `Xb7hH8MSUJpSbSDYk0k2` |
| Model | `eleven_multilingual_v2` |
| API Key Var | `VITE_ELEVENLABS_API_KEY` (in `.env.local`) |

### 8.2 Speech Style Settings (per style type)

| Style | stability | similarity_boost | style_exaggeration |
|---|---|---|---|
| statement | 0.75 | 0.75 | 0.0 |
| instruction | 0.80 | 0.75 | 0.0 |
| question | 0.60 | 0.80 | 0.3 |
| encouragement | 0.55 | 0.85 | 0.6 |
| emphasis | 0.85 | 0.70 | 0.1 |
| thinking | 0.65 | 0.80 | 0.2 |
| celebration | 0.45 | 0.90 | 0.8 |

### 8.3 Offline Pre-generation Script (`scripts/generate_audio.js`)

```javascript
const phrases = [
  // Phase 1 — Wonder
  { text: "Sarah is at the harbor in Sydney. She sees a sailboat with a triangular sail.", style: 'thinking' },
  { text: "How much cloth was used to make that sail? Let's find out!", style: 'question' },
  { text: "Today we're going to discover how to measure the area of a triangle!", style: 'encouragement' },

  // Phase 2 — Story Panels
  { text: "John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, and Mei are Triangle Trekkers.", style: 'statement' },
  { text: "In Egypt, John looks at a giant pyramid face — that's a huge triangle!", style: 'statement' },
  { text: "A right triangle is always half of a rectangle.", style: 'emphasis' },
  { text: "If the rectangle is six times four, twenty four square units, the triangle is twenty four divided by two, twelve square units!", style: 'statement' },
  { text: "In Switzerland, Mike counts whole squares and half squares on a grid to find the area of a flag.", style: 'statement' },
  { text: "Base times height, then split it in half. That's the formula!", style: 'emphasis' },

  // Phase 3 — Simulation Instructions
  { text: "Drag the line to split the rectangle into two triangles.", style: 'instruction' },
  { text: "See how one triangle is exactly half the space? That's the secret!", style: 'question' },
  { text: "Count the whole squares and the half squares inside the triangle.", style: 'instruction' },
  { text: "Now fill in the missing number. Six times four, divided by two, equals what?", style: 'question' },

  // Phase 4 — Feedback
  { text: "Yes! You measured that triangle perfectly! You're a true Triangle Trekker!", style: 'celebration' },
  { text: "Not quite! Let's look at the shape again.", style: 'encouragement' },
  { text: "Let's count the squares together!", style: 'thinking' },

  // Phase 5 — Reflect
  { text: "What an adventure! Can you tell me one thing you learned about triangles today?", style: 'thinking' },
  { text: "Lesson complete! You are an official Triangle Trekker Champion!", style: 'celebration' },

  // Badge unlocks
  { text: "Badge unlocked! You are a Map Reader!", style: 'celebration' },
  { text: "Badge unlocked! Shape Splitter! You completed all three stations!", style: 'celebration' },
  { text: "Badge unlocked! Triangle Champion! You scored over eighty percent!", style: 'celebration' },
];

// Script hits ElevenLabs API for each phrase, saves to public/assets/audio/
// Auto-generates src/utils/audioMap.js mapping text → .mp3 path
```

### 8.4 Frontend Audio Engine (`src/hooks/useAudio.js`)

```javascript
// Step 1: Check audioMap for pre-generated static asset
// Step 2: If not found + API key present → fetch from ElevenLabs dynamically
// Step 3: Cache dynamic result in elevenLabsCache (in-memory Map)
// Step 4: Play via HTML5 Audio API (new Audio(url))
// Step 5: While segment i plays → preload segment i+1 (eager preload)

const elevenLabsCache = new Map(); // In-memory; cleared on page refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  // 1. Static map check (fastest path)
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache check
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  // 3. Dynamic generation (requires API key)
  if (!apiKey) return null; // Silent skip — no fallback
  const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: styleSettings,
      }),
    }
  );

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue; // Silent skip if no audio available

    // Eager preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey);
    }

    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url); // Resolves on 'ended' event
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve; // Silent fail — never block UX
    audio.play().catch(resolve);
  });
}
```

### 8.5 Audio Cleanup (`scripts/clean_audio.js`)
- Imports `audioMap.js` to determine all valid referenced `.mp3` paths
- Scans `public/assets/audio/` for all `.mp3` files
- Deletes any `.mp3` not present in `audioMap` (orphaned files)
- Run after any phrase deletion or text edit in `generate_audio.js`

### 8.6 Narration Synchronization Rules (1:1 Parity)
**CRITICAL:** Every on-screen text string that is narrated must match `narration.js` **exactly** (same words, same punctuation, same capitalization). Any UI text change requires:
1. Update `generate_audio.js` phrases array
2. Re-run: `node scripts/generate_audio.js`
3. Update corresponding text in the React UI component
4. Optionally run: `node scripts/clean_audio.js`

---

## 9. Randomization Engine

### 9.1 Fisher-Yates Shuffle (`utils/shuffle.js`)

```javascript
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  // Pick 10 from each type (shuffled), then shuffle the combined 100
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}
```

### 9.2 MCQ Distractor Generation (`utils/scoring.js`)

```javascript
export function generateDistractors(correct, min = 0, max = 48, count = 3) {
  const distractors = new Set();
  // Strategy: offsets of ±2, ±4, ±6 — plausible wrong areas (common miscalculation sizes)
  const offsets = [-6, -4, -2, 2, 4, 6];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct && distractors.size < count)
      distractors.add(d);
  });
  // Common error: forgetting to divide by 2 (base × height instead of ÷2)
  const forgotHalf = correct * 2;
  if (forgotHalf <= max && forgotHalf !== correct) distractors.add(forgotHalf);

  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * 2;
    if (d <= max && d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors].slice(0, count + 1));
}
```

### 9.3 Session Persistence (24-hour resume)

```javascript
const SESSION_KEY = 'intellia_area_triangles_v1';

// On app mount: restore if within 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
}

// On every state change: persist progress
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storyPanel: state.storyPanel,
    simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion,
    xp: state.xp,
    streak: state.streak,
    maxStreak: state.maxStreak,
    badges: state.badges,
    worldScores: state.worldScores,
    phaseComplete: state.phaseComplete,
    timestamp: Date.now(),
  }));
}, [state]);
```

---

## 10. Gamification Implementation

### 10.1 XP Calculation (`utils/scoring.js`)

```javascript
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 10.2 Star Rating (per world of 10 questions)

```javascript
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold: ≥90%
  if (correct >= 7) return 2; // Silver: ≥70%
  if (correct >= 5) return 1; // Bronze: ≥50% (world unlock gate)
  return 0; // Try again
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}
```

### 10.3 Badge Engine (`utils/badgeEngine.js`)

```javascript
export const BADGES = [
  {
    id: 'map_reader',
    label: '🏅 Map Reader',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'shape_splitter',
    label: '🥈 Shape Splitter',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'triangle_champion',
    label: '🥇 Triangle Champion',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_split',
    label: '💎 Perfect Split',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'world_explorer',
    label: '🌟 World Explorer',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_counter',
    label: '🎯 Sharp Counter',
    description: 'Complete Station B without any wrong count',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'formula_finder',
    label: '🧭 Formula Finder',
    description: 'Answer 5 formula-builder questions correctly',
    condition: (s) => (s.formulaCorrect || 0) >= 5,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

// Call after every state update that could unlock a badge:
const newBadges = checkBadges(newState);
if (newBadges.length > 0) {
  dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
  newBadges.forEach(id => {
    const badge = BADGES.find(b => b.id === id);
    narrate([{ text: badge.description, style: 'celebration' }], apiKey);
  });
}
```

---

## 11. CSS Animation Keyframes (matching `equal-tau.vercel.app` style)

```css
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}

@keyframes celebrate {
  0% { transform: rotate(-5deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.1); }
  50% { transform: rotate(-3deg) scale(1.05); }
  75% { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes trianglePeel {
  /* Applied to the second triangle polygon on split confirmation */
  0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(14px, 14px) rotate(3deg); opacity: 1; }
}

@keyframes squareFadeIn {
  /* Applied to each grid cell with staggered delay for Station B */
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shapePop {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}

/* Stagger: each grid cell / triangle element gets animation-delay: (index * 100ms) */
```

---

## 12. Component Prop Contracts

| Component | Props | Returns |
|---|---|---|
| `RectangleSplitDiagram` | `{ base, height, missingSlot?, split?, animated?, size? }` | SVG element (inline, responsive) |
| `GridDiagram` | `{ base, height, cellSize? }` | SVG element with grid + triangle overlay |
| `NumberPad` | `{ max, value, onChange, onSubmit }` | Grid of digit buttons (min 44×44px), backspace, submit |
| `Mascot` | `{ mood: 'idle'\|'happy'\|'thinking'\|'celebrating'\|'encouraging' }` | img/svg + CSS animation class mapped to mood |
| `QuestionRenderer` | `{ question: Question, onAnswer: (answer) => void, hints: number }` | Type-specific question component |
| `FeedbackOverlay` | `{ isCorrect: boolean, explanation?: string, xpEarned: number, onContinue: () => void }` | Animated modal overlay (bounceIn correct / shake wrong) |
| `WorldMap` | `{ worldScores: (number\|null)[], currentWorld: number, onSelectWorld: (i) => void }` | Horizontal scrollable world list with star ratings and lock icons |
| `BadgePanel` | `{ badges: string[], newBadgeId?: string }` | Badge grid with unlock toast animation for `newBadgeId` |

---

## 13. Performance Requirements

| Metric | Target |
|---|---|
| Initial load time | < 2 seconds (Vite production build) |
| Time to first meaningful paint | < 1 second |
| SVG animation frame rate | 60 fps |
| Memory usage | < 60 MB |
| Bundle size (gzipped) | < 600 KB |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| ElevenLabs pre-gen audio TTFB | 0ms (static `.mp3` assets) |
| ElevenLabs dynamic audio TTFB | < 2 seconds (API latency) |

---

## 14. Browser & Device Support

| Environment | Support Level |
|---|---|
| Chrome 110+ (desktop) | Full |
| Safari 15+ (iPad) | Full — primary classroom device |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full |
| IE 11 | Not supported |

**Primary test device:** iPad (768px, touch) — classroom use context
**Secondary:** Desktop Chrome (1280px+)

---

## 15. Testing & QA Requirements

- **Unit tests:** `shuffle.js`, `scoring.js`, `badgeEngine.js` — verify XP math, star thresholds, and badge conditions against fixed seeds
- **Question bank validation:** automated script asserts all 100 `questionBank.js` entries have a mathematically correct `correctAnswer` (i.e., `area === (base * height) / 2` for every entry, and reverse-solved `base`/`height` values are exact integers)
- **Randomization check:** run `generateSessionQuestions` 100 times and confirm no two runs produce an identical question order
- **Audio parity check:** automated diff between `generate_audio.js` phrase list and all on-screen narrated strings in components — must match 1:1
- **Accessibility audit:** Lighthouse + manual keyboard-only pass through all 5 phases and all 3 simulation stations
- **Cross-device pass:** manual QA on iPad Safari, desktop Chrome, and one Android tablet before release

---

## 16. Deployment Notes

- Build via `vite build`; output embedded into the WordPress/LearnPress course page at `https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/` (matching the existing course structure shown at `https://intelliasg.com/courses/grade-3-math`)
- `VITE_ELEVENLABS_API_KEY` must be set in the hosting environment for dynamic Play-phase narration; pre-generated `.mp3` assets ship with the build regardless
- No backend/database required for v1.0 — all state is client-side (`localStorage`), consistent with the reference `equal` repo's architecture

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 3 Math, Lesson 8.6
**Lesson Title:** Triangle Trekkers — Discovering the Area of Triangles
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`)
**Embed Target:** https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/
