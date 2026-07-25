# Product Requirements Document (PRD)

## Triangle Trekkers — Discovering the Area of Triangles | Grade 3 Math
### Intellia SG | Global Primary Mathematics Curriculum

---

> **Reference UI (strict mirror):** https://equal-tau.vercel.app/
> **Reference Repo (strict mirror):** https://github.com/dsamyak/equal
> **Parent Course:** https://intelliasg.com/courses/grade-3-math
> **Planned Lesson URL:** https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/
> **Positioning:** Extension lesson **8.6 — Area of Triangles**, following existing Section 8 (Geometry) → 8.4 Perimeter → 8.5 Area using square units, on the Grade 3 Math course page you provided.

---

## 1. Executive Summary

This document defines the product requirements for **"Triangle Trekkers — Discovering the Area of Triangles,"** an interactive, gamified, simulation-based web lesson for **Grade 3 students (ages 8–9)**. The module teaches learners to find the area of a triangle by building on their existing knowledge of area-by-square-counting (Lesson 8.5) and rectangles, using a concrete-pictorial-abstract (CPA) bridge: **a triangle is half of a rectangle**.

The lesson is framed as a **global expedition** — a class of children from different countries (John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, and Mei) travel the world measuring triangular objects: pyramid faces in Egypt, sailboat sails in Australia, mountain flags in Switzerland, roof panels in Japan, and more. Every story, simulation, and question is wrapped in this "explore the world" theme, teaching the math concept **first**, then reinforcing it through **randomized, gamified practice**.

The product is a standalone web module to be hosted at:
`https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/`

It is built using **React (Vite + JSX, JavaScript/CSS)** and is designed to **strictly mirror the visual and UX structure** established at **https://equal-tau.vercel.app/** and its repository **https://github.com/dsamyak/equal**. No structural, layout, or component-pattern deviation from that reference is permitted without explicit sign-off.

Audio narration uses **ElevenLabs exclusively** (Voice: *Alice*, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`), with pre-generated static `.mp3` files for all phase narration and dynamic generation for practice questions — mirroring the audio pipeline used in the reference "Equal Groups" module so that voice, pacing, and warmth stay consistent across Intellia SG lessons.

The module follows Intellia's **6-step learner journey** (Intro + 5 phases):

| Step | Phase | Purpose |
|---|---|---|
| 0 | **INTRO** | Welcome screen + 5-phase progress map |
| 1 | **WONDER** | Curiosity hook |
| 2 | **STORY** | Narrative-based concept introduction (global expedition) |
| 3 | **SIMULATE** | Sandbox-style interactive simulation (3 stations) |
| 4 | **PLAY** | IntelliPlay™ gamified practice (100 randomized questions) |
| 5 | **REFLECT** | Journal / LearnFlow AI prompt + completion badge |

---

## 2. Product Vision & Goals

### Vision
To make **area of triangles** intuitive, visual, and joyful for 8–9 year old learners anywhere in the world — building a concrete-pictorial-abstract bridge from "counting squares" (already known) to "a triangle is half a rectangle" to the formula **Area = (base × height) ÷ 2**, through animated splitting simulations, a round-the-world story, and adaptive gamified challenge.

### Goals

| Goal | Metric |
|---|---|
| Learning Completion | ≥85% of students complete all 5 phases |
| Practice Engagement | ≥90% attempt at least 10 practice questions |
| Score Achievement | Average challenge score ≥75% on first attempt |
| Session Duration | Average engagement ≥15 minutes per session |
| Curriculum Alignment | 100% aligned to Grade 3 global math syllabus extension objectives |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 simulation stations |
| Global Relevance | ≥95% of learners recognize at least 3 of the 10 world landmarks used |

---

## 3. Target Users

### Primary: Grade 3 Students (Age 8–9), Global Audience
- Already comfortable with area-by-square-counting (whole squares) and perimeter (Lessons 8.4–8.5)
- Ready for an early step into **part-whole reasoning** (half-squares, splitting shapes)
- Enjoy stories, travel, flags, and landmarks — a "world explorer" framing increases engagement
- Still benefit from concrete manipulation before abstract formulas; short attention spans requiring micro-rewards
- Diverse, international classroom — content must avoid country-specific bias; names and settings are deliberately drawn from many regions

### Secondary: Parents & Teachers
- Assign as classwork, homework, or enrichment beyond the standard "Area using square units" lesson
- Expect alignment with widely used global elementary math frameworks (Common Core-style progressions, Cambridge Primary, Singapore MOE-style CPA method) rather than one country's syllabus only
- Monitor via in-lesson phase completion indicators

---

## 4. Curriculum Alignment — Global Grade 3 Math Syllabus

**Topic:** Area of Triangles (Lesson 8.6 — Geometry extension)
**Programme:** Intellia SG Grade 3 Math — Section 8: Geometry
**Course Page (provided):** https://intelliasg.com/courses/grade-3-math
**Lesson URL:** https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/

### Source References (cross-walked, not tied to a single country)
- Existing Intellia SG Grade 3 Math curriculum — Section 8 (Geometry): 8.1 Parallel & Perpendicular Lines, 8.2 Angles, 8.3 Identifying Angles in Shapes, 8.4 Perimeter, **8.5 Area using square units** → this lesson (8.6) is the natural next step
- Common global Grade 3 geometry & measurement strands (area/perimeter of 2-D shapes using square units, introduction to composite/part shapes)
- Singapore MOE-style Concrete-Pictorial-Abstract (CPA) methodology, used as the pedagogical model (not the content source)
- Cambridge Primary Mathematics-style progression (Stage 3): recognizing and measuring simple 2-D shapes, extending to half-unit reasoning as an enrichment step

> **Design note:** Formal triangle-area formulas typically appear in later grades in most national syllabi. This module presents the concept as a **Grade 3 enrichment/extension** of the existing Area (8.5) lesson, using only right triangles formed by splitting rectangles/squares — fully accessible at this age through counting and halving, with the formula introduced only as a light abstract capstone, never as rote memorization.

### Learning Objectives Covered (Lesson 8.6)
| Code | Objective |
|---|---|
| LO1 | Identify a triangle's **base** and **height**, and recognize a right-angle marker |
| LO2 | Understand that a right triangle is **half of a rectangle** formed along its diagonal |
| LO3 | Count whole and half unit squares on a grid to find a triangle's area |
| LO4 | Use the relationship: **Area of triangle = Area of rectangle ÷ 2** |
| LO5 | Apply the abstract relationship **Area = (base × height) ÷ 2** for right triangles |
| LO6 | Solve real-world, globally-themed word problems involving triangular objects |
| LO7 | Compare the areas of two different triangles using unit-square counting |

### CPA Progression for This Lesson
- **Concrete →** Digitally "cut" a rectangle along its diagonal into two equal triangles; drag one triangle away to reveal it's exactly half
- **Pictorial →** Grid diagrams with whole and half unit squares shaded inside a triangle outline
- **Abstract →** `base × height ÷ 2 = ___`; connecting back to the known rectangle-area formula (`base × height`)

### Number Ranges
| Level | Base & Height Range | Area Range |
|---|---|---|
| Easy | 2–6 units | ≤ 15 sq. units |
| Medium | 4–8 units | ≤ 30 sq. units |
| Hard | 6–12 units | ≤ 48 sq. units (includes reverse/compare questions) |

### Vocabulary Focus (age-appropriate)
"triangle," "base," "height," "right angle," "half," "rectangle," "square units," "area," "altogether," "split," "diagonal"

---

## 5. The 5-Phase Learner Journey (Intellia Model)

```
INTRO SCREEN → Progress Map (5-step visual tracker, top bar)
Welcome: "Hello, Explorer! Today we're measuring triangles around the world! 🌍📐"
Lesson badge shown (locked). 5 glowing phase dots visible.
```

### Phase 1 — WONDER (≈1–2 min)
**Hook:** "Sarah is at the harbor in Sydney. She sees a sailboat with a triangular sail. 'How much cloth was used to make that sail?' she wonders. Can you help her find out?"
- **Visual:** Animated sailboat, triangular sail highlighted, Sarah mascot puzzled
- **Animation:** A rectangle "cloth" appears behind the sail, then splits diagonally to reveal the triangle is exactly half
- **Narration (ElevenLabs):** Alice voice reads the hook warmly
- Mascot (LearnFlow robot) appears thinking → "Let's discover how to measure triangles!"

### Phase 2 — STORY (≈2–3 min) — "Around the World in Triangles"
| Panel | Content |
|---|---|
| 1 | "John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, and Mei are Triangle Trekkers — young explorers who measure shapes wherever they travel! 🌍" |
| 2 | "In Egypt, John looks at a pyramid face. 'That's a giant triangle!' A rectangle 'block' appears around it, split by a diagonal line." |
| 3 | "'A right triangle is always HALF of a rectangle,' explains the mascot. If the rectangle is 6 × 4 = 24 square units, the triangle is 24 ÷ 2 = 12 square units!" |
| 4 | "In Switzerland, Mike sees a triangular flag on a mountain hut. He counts unit squares on a grid — whole squares AND half squares — to find its area." |
| 5 | "In Japan, Yuki folds an origami banner. 'Base times height, then split it in half!' Area = (base × height) ÷ 2." |
| 6 | "Now it's your turn to become a Triangle Trekker and measure shapes with the whole crew!" |

- Illustrated story panels (animated slide-in), ElevenLabs narration
- Key vocabulary highlighted: "base," "height," "half," "area"
- Rectangle-to-triangle split diagram introduced visually and reused throughout

### Phase 3 — SIMULATE (≈5–6 min)
**3 Interactive Stations — student must complete all 3 to advance**

- **Station A — "Triangle Splitter" (Concrete):** Drag the diagonal line to split a rectangle into 2 equal triangles; watch one triangle "peel away" to confirm it equals half the rectangle's area
- **Station B — "Grid Counter" (Pictorial):** Count whole and half unit squares shaded inside a triangle on a grid; enter the total area
- **Station C — "Formula Builder" (Abstract):** Fill one blank in `___ × ___ ÷ 2 = ___` using a number pad, with a "Show me the grid" hint always available

Mascot reacts to each completed station; ElevenLabs narrates each instruction and feedback line.

### Phase 4 — PLAY (≈6–8 min)
**IntelliPlay™ Level:** 100 randomized questions across **10 globally-themed worlds**, 10 questions per world, world unlocks at ≥6/10 correct. Stars (1–3), XP, badges, and streak fire counter active. Mastery gates the world map; encouragement-first feedback throughout.

### Phase 5 — REFLECT (≈1–2 min)
Journal prompt: "Draw a triangle and show how you'd split a rectangle to find its area. What did you discover today?"
Or: LearnFlow AI chat — type/speak your understanding.
Lesson-complete badge unlocks here. XP + badge summary shown. "Share with your teacher!" export button.

---

## 6. Phase 3 — Simulation Design (Detailed)

### 6.1 Station A — "Triangle Splitter" (Concrete)
**Visual:** A colorful rectangle (themed per round: sail cloth, flag fabric, pyramid face, roof panel) with a draggable diagonal-split handle.

**Interaction:**
- Student drags a handle along the diagonal to visually cut the rectangle into two equal triangles
- On split, one triangle animates "peeling away" and floats to a comparison zone
- A live counter shows: `Rectangle area = ___` → `Triangle area = ___ ÷ 2 = ___`

**Feedback:**
- Correct split confirmed → mascot cheers, "Yes! One triangle is exactly HALF the rectangle!" 🎉
- If the student tries to submit before splitting → gentle nudge: "Drag the line to split the shape first!"

**Variants per round (randomized):**
- Round 1: 4 × 3 rectangle (sail cloth, Australia)
- Round 2: 6 × 4 rectangle (pyramid face, Egypt)
- Round 3: 8 × 5 rectangle (flag, Switzerland)
- Round 4: 6 × 6 rectangle (roof panel, Japan)

### 6.2 Station B — "Grid Counter" (Pictorial)
**Visual:** A triangle outline overlaid on a unit-square grid; some squares fully inside (whole), some cut diagonally (half).

**Interaction:**
- Student taps whole squares (adds 1) and half squares (adds 0.5) to a running total
- A live tally shows: "Whole squares: ___ | Half squares: ___ | Total area: ___"
- "Check" button submits the count

**Teaching goal:** Builds precise counting and reinforces that two half-squares make one whole — the conceptual bridge to the halving rule.

**3 rounds with increasing grid size:**
- Round 1: small triangle, base 4, height 3 (easy count)
- Round 2: medium triangle, base 6, height 4 (medium count)
- Round 3: larger triangle, base 8, height 5 (careful counting required)

### 6.3 Station C — "Formula Builder" (Abstract)
**Visual:**
```
___ × ___ ÷ 2 = ___
(one blank highlighted for input; the other two values visible)
```
- Group/grid diagram shown above as a visual scaffold
- "Show me the grid" hint button always visible
- Number pad (large, tap-friendly, 0–9)

**Variants (rotated per round):**
- Round 1: Find area → `6 × 4 ÷ 2 = ___`
- Round 2: Find base → `___ × 5 ÷ 2 = 15`
- Round 3: Find height → `8 × ___ ÷ 2 = 20`

ElevenLabs narrates each formula aloud when displayed.

---

## 7. Phase 4 — Question Bank (100 Randomized Questions)

### 7.1 Question Types (10 types × 10 questions = 100 total)

| Type | Description | Example |
|---|---|---|
| Q1 | Count grid squares (whole + half) → find area | A triangle covers 6 whole squares and 4 half squares. What is the area? |
| Q2 | Picture MCQ — tap the triangle with the larger area | [Picture] Which triangle has the bigger area? |
| Q3 | Fill blank — find area | Base = 6, Height = 4. Area = ___ |
| Q4 | Fill blank — find base | Area = 15, Height = 5. Base = ___ |
| Q5 | Fill blank — find height | Area = 20, Base = 8. Height = ___ |
| Q6 | Global word problem (real triangular object, find area) | John's kite has a base of 6 cm and a height of 8 cm. What is its area? |
| Q7 | Global word problem (compare two triangles) | Priya's flag is 8 × 5. Carlos's flag is 6 × 6. Whose flag has the bigger area? |
| Q8 | True or False — is this area calculation correct? | "Base 6, height 4, so area = 24" — True or False? |
| Q9 | Spot the right triangle that is half of the shown rectangle (pictorial MCQ) | Which triangle is exactly half of this rectangle? (4 choices) |
| Q10 | Rectangle-to-triangle link | A rectangle has an area of 24 square units. A triangle formed by its diagonal has an area of ___ |

### 7.2 Question Distribution by Difficulty

| Type | Count | Easy (≤15) | Medium (≤30) | Hard (≤48) |
|---|---|---|---|---|
| Q1 | 10 | 5 | 3 | 2 |
| Q2 | 10 | 5 | 3 | 2 |
| Q3 | 10 | 4 | 4 | 2 |
| Q4 | 10 | 3 | 4 | 3 |
| Q5 | 10 | 3 | 4 | 3 |
| Q6 | 10 | 3 | 4 | 3 |
| Q7 | 10 | 3 | 4 | 3 |
| Q8 | 10 | 5 | 3 | 2 |
| Q9 | 10 | 4 | 4 | 2 |
| Q10 | 10 | 3 | 4 | 3 |
| **Total** | **100** | **38** | **37** | **25** |

### 7.3 Number Ranges
- **Easy:** Base & height 2–6, area ≤ 15
- **Medium:** Base & height 4–8, area ≤ 30
- **Hard:** Base & height 6–12, area ≤ 48; includes reverse-find and comparison questions

### 7.4 Global Names, Objects & Contexts Used in Word Problems

**Names (deliberately international, gender-balanced):** John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, Mei, Omar, Ana

**Objects:** sailboat sails, pyramid faces, roof panels, triangular flags, kites, road/warning signs, pizza slices, tents, triangular garden plots, bunting/party banners, mountain peaks (map icons), sandwich halves

**Contexts (global landmarks & settings, no single country emphasized):** Sydney Harbour (Australia), Giza (Egypt), the Swiss Alps, Tokyo (Japan), Rio de Janeiro (Brazil), the Sahara (Morocco), the Andes (Peru), the Canadian Rockies, a village market (India), a seaside town (Ireland)

### 7.5 Language Requirements
All questions use consistent, age-appropriate vocabulary:
- "base," "height," "area," "square units," "half," "altogether"
- "split into two triangles," "how much space," "bigger area," "smaller area"

Sentence structures are short, concrete, and globally neutral — no idioms or country-specific references that could confuse an international learner.

---

## 8. Gamification Design

### 8.1 Reward System
- **Stars (⭐):** Earned per 10-question world (1–3 stars based on score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used
- **Streak 🔥:** Fire counter for consecutive correct answers
- **Streak Bonus:** +5 XP per correct answer when streak ≥ 5

### 8.2 Badges (Unlockable)
| Badge | Condition |
|---|---|
| 🏅 **Map Reader** | Complete Wonder + Story phases |
| 🥈 **Shape Splitter** | Complete all 3 Simulation stations |
| 🥇 **Triangle Champion** | Score ≥80% on Play phase |
| 💎 **Perfect Split** | Score 10/10 in any world |
| 🔥 **Streak Star** | Achieve a streak of 10 consecutive correct answers |
| 🌟 **World Explorer** | Complete all 5 phases (lesson complete badge) |
| 🎯 **Sharp Counter** | Get 5 correct in Station B (Grid Counter) without any wrong count |
| 🧭 **Formula Finder** | Answer 5 formula-builder questions (Q3–Q5) correctly |

### 8.3 Feedback Mechanics
**✅ Correct:**
- Bounce animation on answer card + mascot happy mood
- ElevenLabs celebration audio: "Yes! You measured that triangle perfectly! 🎉"
- XP floats up from answer card (+10 / +7 / +5)
- Streak fire counter increments

**❌ Incorrect (Attempt 1):**
- Gentle shake animation + ElevenLabs: "Not quite! Let's look at the shape again 📐"
- Hint 1 activates: rectangle-split diagram highlighted

**❌ Incorrect (Attempt 2):**
- Stronger shake + Hint 2: grid-counting animation shown
- ElevenLabs: "Let's count the squares together!"

**❌ Incorrect (Attempt 3):**
- Answer revealed with animated explanation (mascot explains)
- ElevenLabs: full explanation read aloud
- No score penalty — encouragement only

No negative scoring. Encouragement-first approach always.

### 8.4 World Map (IntelliPlay™ Level Progression — Global Landmark Theme)

| World | Theme | Questions | Difficulty |
|---|---|---|---|
| 1 | Sydney Harbour Sails (Australia) | Q1–10 | Easy, area ≤ 12 |
| 2 | Pyramids of Giza (Egypt) | Q11–20 | Easy–Medium, area ≤ 16 |
| 3 | Swiss Alps Flags | Q21–30 | Medium, area ≤ 20 |
| 4 | Tokyo Origami Banners (Japan) | Q31–40 | Medium, area ≤ 25 |
| 5 | Rio Kite Festival (Brazil) | Q41–50 | Medium–Hard, area ≤ 30 |
| 6 | Sahara Desert Tents (Morocco) | Q51–60 | Hard, area ≤ 35, includes reverse |
| 7 | Andes Mountain Trails (Peru) | Q61–70 | Hard, word problems |
| 8 | Canadian Rockies Peaks | Q71–80 | Hard, mixed types |
| 9 | Village Market Bunting (India) | Q81–90 | Hard, mixed |
| 10 | World Explorer Finale (Global) | Q91–100 | Hardest, reverse + comparisons |

**Unlock gate:** ≥6/10 correct (1-star minimum) required to advance to next world.
**3 stars** in a world unlocks a hidden "Bonus Challenge" (3 extra questions).

### 8.5 Mascot (LearnFlow AI Companion)
- **Character:** Friendly robot — "LearnFlow" (matching Intellia branding), dressed with a small explorer's hat and compass for this lesson
- **Mood States:** idle | curious | happy | thinking | celebrating | encouraging
- **Appearances:** Wonder hook, Story narration, Simulation feedback, Reflect phase
- **Audio:** All mascot speech via ElevenLabs Alice voice (pre-generated `.mp3`)

---

## 9. Audio & Narration Design

### 9.1 ElevenLabs Pipeline
| Setting | Value |
|---|---|
| Voice Provider | ElevenLabs (**only** — no browser Web Speech API fallback) |
| Voice Name | Alice (Clear, Engaging Educator) |
| Voice ID | `Xb7hH8MSUJpSbSDYk0k2` |
| Model | `eleven_multilingual_v2` |
| API Key Env Var | `VITE_ELEVENLABS_API_KEY` |

> **Note on the supplied reference audio:** you mentioned an audio sample the narration should match. No audio file was attached to this request, so this PRD/TRD specifies the **exact same ElevenLabs Alice pipeline, voice ID, model, and speech-style settings** used in the reference "Equal Groups" module (`equal-tau.vercel.app`) to guarantee voice and pacing consistency across Intellia SG lessons. If you upload the reference audio file, share it in a follow-up and the voice/style settings in Section 9.2 can be re-matched to it exactly.

### 9.2 Speech Styles Mapped to ElevenLabs Settings

| Style | stability | similarity_boost | style | Use case |
|---|---|---|---|---|
| statement | 0.75 | 0.75 | 0.0 | Story narration, instructions |
| instruction | 0.80 | 0.75 | 0.0 | Simulation station prompts |
| question | 0.60 | 0.80 | 0.3 | Practice question read-aloud |
| encouragement | 0.55 | 0.85 | 0.6 | Correct answer feedback |
| emphasis | 0.85 | 0.70 | 0.1 | Key vocabulary highlight |
| thinking | 0.65 | 0.80 | 0.2 | Mascot thinking moments |
| celebration | 0.45 | 0.90 | 0.8 | Badge unlock, world complete |

### 9.3 Pre-generated Audio Files
All phase narration lines (Wonder, Story panels, Simulate instructions, Reflect prompt, badge unlock messages, world completion) are pre-generated offline and stored as static `.mp3` in `public/assets/audio/`. `audioMap.js` is auto-generated and maps exact text strings → file paths. The frontend checks `audioMap` first; dynamic generation only for Play-phase questions not in the map.

### 9.4 Dynamic Generation
Practice questions (Phase 4) are generated dynamically if not pre-cached. Requires `VITE_ELEVENLABS_API_KEY` in `.env.local`. If the key is absent, narration silently skips (no browser TTS fallback). An in-memory cache prevents re-fetching the same text.

### 9.5 Segment Synchronization
Narration is parsed as an array of segments (one per sentence). While segment *i* plays, segment *i+1* is eagerly preloaded. This guarantees seamless, gap-free narration across multi-sentence scripts, using the HTML5 Audio API.

### 9.6 Narration Script Examples

**Phase 1 (Wonder) — style: thinking**
> "Sarah is at the harbor in Sydney. She sees a sailboat with a triangular sail."
> "How much cloth was used to make that sail? Let's find out!"
> "Today we're going to discover how to measure the area of a triangle!"

**Phase 2 (Story, Panel 2) — style: statement**
> "In Egypt, John looks at a giant pyramid face — that's a huge triangle!"
> "A rectangle appears around it, split right down the middle."
> "A right triangle is always half of a rectangle!"

**Phase 3 (Station A) — style: instruction**
> "Drag the line to split the rectangle into two triangles."
> "See how one triangle is exactly half the space? That's the secret!"

**Phase 4 (Correct feedback) — style: celebration**
> "Yes! You measured that triangle perfectly! You're a true Triangle Trekker!"

**Phase 5 (Reflect) — style: thinking**
> "What an adventure! Can you tell me one thing you learned about triangles today?"

---

## 10. UX & Visual Design Requirements

### 10.1 Visual Theme
- **Brand:** Intellia SG — Think. Explore. Become.
- **Reference UI (mirror exactly):** https://equal-tau.vercel.app/
- **Reference Repo (mirror exactly):** https://github.com/dsamyak/equal
- **Colors:** Match `equal-tau.vercel.app` exactly — primary brand blue, accent gold/yellow for rewards, soft coral/red for wrong-answer shake states, white card backgrounds with soft drop shadows, distinct phase-band colors per phase
- **Typography:** Rounded, playful (Nunito or Fredoka One)
- **Illustrations:** Cartoon-style, child-friendly, globally diverse characters and landmark imagery (no single culture dominating)
- **Split/Grid Diagrams:** Clean SVG rectangles, diagonal split lines, and grid overlays, colored distinctly and consistently across phases

### 10.2 Layout Structure (mirrors equal-tau.vercel.app)
- **Top Bar:** Intellia logo | Lesson title "Area of Triangles" | 5-phase dot tracker
- **Main Area:** Phase content (fills screen, responsive, smooth phase transitions)
- **Bottom Bar:** XP counter | Star count | Streak fire | Phase navigation arrows
- **Sidebar:** Hidden on mobile; shown on tablet+ as vertical phase map

### 10.3 Rectangle-Split / Grid Diagram Visual Component (Primary Visual)
Used throughout all phases. Visual spec:
- Rectangle with a clear diagonal split line, both resulting triangles shaded differently
- Grid overlay option showing whole and half unit squares
- Label underneath: `"6 × 4 ÷ 2 = 12"`
- Squares/triangles animate in (count-up / fade-in) when the diagram first renders
- Missing value shown as a dashed-outline placeholder with "?"

### 10.4 Accessibility
- Large tap targets (minimum 44×44px on all interactive elements)
- WCAG AA color contrast on all text elements
- All narration via ElevenLabs (premium, consistent voice)
- Keyboard navigable (Tab + Enter for all interactions)
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Drag interactions (diagonal split, grid counting) have touch-equivalent tap+tap fallback

### 10.5 Responsive Design
- **Primary:** iPad / tablet (768px+) — classroom context
- **Secondary:** Desktop browser (1024px+)
- **Tertiary:** Mobile (375px+) — stacked single-column layout

---

## 11. Content Requirements

### 11.1 Simulation Visuals
- Rectangle-split diagrams: SVG-rendered, diagonal handle draggable, two triangles shaded distinctly
- Grid-counting visuals: SVG grid with whole/half square shading, tally counter overlay
- Object pool per theme: sail, pyramid face, flag, roof panel, kite, tent (rotated per round)

### 11.2 Question Bank Coverage
- All 10 question types × 10 questions = 100 unique question objects in `questionBank.js`
- Questions randomized per session using Fisher-Yates shuffle — **every question, and every question order, is different per session**
- No two sessions present the same question order
- MCQ distractors always plausible (within ±3 of correct area, or a logical wrong base/height)

### 11.3 Word Problem Format (Global, Neutral Style)
**Find-area sense:**
> "[Name]'s [object] has a base of [base] [unit] and a height of [height] [unit]. What is its area?"

**Compare sense:**
> "[Name1]'s [object] is [base1] × [height1]. [Name2]'s [object] is [base2] × [height2]. Whose [object] has the bigger area?"

**Reverse-find sense:**
> "[Name]'s [object] has an area of [area] square [unit]. Its base is [base]. What is its height?"

### 11.4 Audio Script Parity (1:1 Strict Parity Rule)
Every on-screen text string that is narrated must match the narration script exactly — same words, same punctuation. This prevents confusion for young learners who are simultaneously listening and reading. Any UI text change requires updating both the audio-generation phrase list and the on-screen component text.

---

## 12. Success Criteria (v1.0)

| Criterion | Target |
|---|---|
| All 100 questions randomized correctly, every session | ✅ Required |
| All 3 simulation stations functional | ✅ Required |
| All 5 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 8 badges) working | ✅ Required |
| World map 10-world progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional | ✅ Required |
| Mobile/tablet responsive layout | ✅ Required |
| Global Grade 3 syllabus extension 100% covered | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches equal-tau.vercel.app structure exactly | ✅ Required |
| Hosted correctly at intelliasg.com lesson URL | ✅ Required |

---

## 13. Out of Scope (v1.0)
- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Non-right triangles / obtuse triangle area (reserved for a later grade module)
- Assessment against the full broader curriculum (separate test engine)

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 3 Math, Lesson 8.6
**Lesson Title:** Triangle Trekkers — Discovering the Area of Triangles
**Curriculum:** Global Grade 3 Math Syllabus (Geometry extension), CPA methodology
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`)
**Parent Course Page:** https://intelliasg.com/courses/grade-3-math
**Lesson URL:** https://intelliasg.com/courses/grade-3-math/lessons/area-of-triangles/
