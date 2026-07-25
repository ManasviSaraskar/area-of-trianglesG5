// utils/badgeEngine.js

export const BADGES = [
  {
    id: 'map_reader',
    label: '🏅 Map Reader',
    icon: '🏅',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'shape_splitter',
    label: '🥈 Shape Splitter',
    icon: '🥈',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'triangle_champion',
    label: '🥇 Triangle Champion',
    icon: '🥇',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_split',
    label: '💎 Perfect Split',
    icon: '💎',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    icon: '🔥',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'world_explorer',
    label: '🌟 World Explorer',
    icon: '🌟',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_counter',
    label: '🎯 Sharp Counter',
    icon: '🎯',
    description: 'Complete Station B without any wrong count',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'formula_finder',
    label: '🧭 Formula Finder',
    icon: '🧭',
    description: 'Answer 5 formula-builder questions correctly',
    condition: (s) => (s.formulaCorrect || 0) >= 5,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}
