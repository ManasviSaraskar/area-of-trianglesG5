// utils/scoring.js — XP, Stars, Distractor generation

import { shuffleArray } from './shuffle.js';

export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold ≥90%
  if (correct >= 7) return 2; // Silver ≥70%
  if (correct >= 5) return 1; // Bronze ≥50%
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 6;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}

export function generateDistractors(correct, min = 1, max = 48, count = 3) {
  const distractors = new Set();
  const offsets = [-6, -4, -2, 2, 4, 6];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct && distractors.size < count) {
      distractors.add(d);
    }
  });
  // Common error: forgetting to divide by 2
  const forgotHalf = correct * 2;
  if (forgotHalf <= max && forgotHalf !== correct && distractors.size < count) {
    distractors.add(forgotHalf);
  }
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * 3;
    if (d <= max && d !== correct) distractors.add(d);
    else distractors.add(correct - (distractors.size + 1) * 2);
  }
  return shuffleArray([correct, ...[...distractors].slice(0, count)]);
}

export function countTriangleSquares(base, height) {
  const total = (base * height) / 2;
  // Approximate whole/half breakdown for right triangle
  const whole = Math.floor(total) - Math.floor(Math.min(base, height) / 2);
  const half = Math.min(base, height);
  return { whole: Math.max(0, whole), half, total };
}
