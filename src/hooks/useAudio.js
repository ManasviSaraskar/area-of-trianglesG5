// hooks/useAudio.js — Static pre-recorded audio engine
// All audio is pre-generated via scripts/generate_audio.js
// No dynamic generation happens at runtime.
import audioMap from '../utils/audioMap.js';

let currentAudio = null;
let aborted = false;

export async function playAudio(url) {
  return new Promise((resolve) => {
    stopAudio();
    aborted = false;
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = resolve;
    audio.onerror = resolve;
    audio.play().catch(resolve);
  });
}

export function stopAudio() {
  aborted = true;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function getAudioUrl(text) {
  return audioMap[text] || null;
}

export async function narrate(segments, onSegmentStart) {
  stopAudio();
  aborted = false;
  for (let i = 0; i < segments.length; i++) {
    if (aborted) break;
    const { text } = segments[i];
    const url = getAudioUrl(text);
    if (!url) continue;
    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url);
    if (aborted) break;
  }
}
