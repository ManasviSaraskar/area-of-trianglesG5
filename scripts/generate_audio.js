import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env variables from .env / .env.local
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.resolve(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...vals] = trimmed.split('=');
          const val = vals.join('=').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const API_KEY = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

const STYLE_SETTINGS = {
  statement:    { stability: 0.75, similarity_boost: 0.75, style: 0.0 },
  instruction:  { stability: 0.80, similarity_boost: 0.75, style: 0.0 },
  question:     { stability: 0.60, similarity_boost: 0.80, style: 0.3 },
  encouragement:{ stability: 0.55, similarity_boost: 0.85, style: 0.6 },
  emphasis:     { stability: 0.85, similarity_boost: 0.70, style: 0.1 },
  thinking:     { stability: 0.65, similarity_boost: 0.80, style: 0.2 },
  celebration:  { stability: 0.45, similarity_boost: 0.90, style: 0.8 },
};

const phrases = [
  // ── WONDER PHASE ──
  { text: "Sarah sees a sailboat with a triangular sail in Sydney. How does she know how much cloth was used to make that sail? Let us find out what area really means!", style: 'encouragement' },

  // ── STORY PHASE ──
  { text: "John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, and Mei are Triangle Trekkers — young explorers who measure shapes wherever they travel!", style: 'statement' },
  { text: "In Egypt, John looks at a giant pyramid face. \"That's a huge triangle!\" A rectangle appears around it, split right down the middle by a diagonal line.", style: 'statement' },
  { text: "In Switzerland, Mike sees a triangular flag on a mountain hut. He counts unit squares on a grid — whole squares AND half squares — to find its area.", style: 'statement' },
  { text: "In Japan, Yuki folds an origami banner. \"Base times height, then split it in half!\" she says. Area = (base × height) ÷ 2. That's the formula!", style: 'emphasis' },
  { text: "Now it's YOUR turn to become a Triangle Trekker! You'll split rectangles, count grid squares, and use the formula to measure triangles all around the world!", style: 'encouragement' },

  // ── SIMULATION STATIONS ──
  { text: "Drag the line to split the rectangle into two triangles.", style: 'instruction' },
  { text: "See how one triangle is exactly half the space? That's the secret!", style: 'question' },
  { text: "Count the whole squares and the half squares inside the triangle.", style: 'instruction' },
  { text: "Now fill in the missing number. Six times four, divided by two, equals what?", style: 'question' },

  // ── FEEDBACK & REFLECT ──
  { text: "Yes! You measured that triangle perfectly! You're a true Triangle Trekker!", style: 'celebration' },
  { text: "Not quite! Let's look at the shape again.", style: 'encouragement' },
  { text: "What an adventure! Can you tell me one thing you learned about triangles today?", style: 'thinking' },
  { text: "Lesson complete! You are an official Triangle Trekker Champion!", style: 'celebration' },
  { text: "Badge unlocked! You are a Map Reader!", style: 'celebration' },
  { text: "Badge unlocked! Shape Splitter! You completed all three stations!", style: 'celebration' },
  { text: "Badge unlocked! Triangle Champion! You scored over eighty percent!", style: 'celebration' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_+|_+$)/g, '')
    .slice(0, 40);
}

async function generateAudio() {
  const outputDir = path.resolve(__dirname, '../public/assets/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const mapEntries = {};

  console.log(`Starting audio generation for ${phrases.length} phrases using ElevenLabs Alice voice...`);
  console.log(`API Key detected: ${API_KEY ? API_KEY.slice(0, 8) + '...' : 'NONE'}`);

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = slugify(text);
    const filename = `audio_${slug}_${i}.mp3`;
    const filePath = path.join(outputDir, filename);
    const relativePath = `/assets/audio/${filename}`;

    mapEntries[text] = relativePath;

    if (fs.existsSync(filePath)) {
      console.log(`[SKIP] (${i + 1}/${phrases.length}) Already exists: ${filename}`);
      continue;
    }

    if (!API_KEY) {
      console.warn(`[WARN] Skipping generation for "${text}" - No VITE_ELEVENLABS_API_KEY provided.`);
      continue;
    }

    console.log(`[GENERATE] (${i + 1}/${phrases.length}) "${text.slice(0, 50)}..." [${style}]`);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: STYLE_SETTINGS[style] || STYLE_SETTINGS.statement,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API HTTP Error ${response.status}: ${errText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`  -> Saved ${filename} (${buffer.length} bytes)`);

      // Rate limit delay (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`[ERROR] Failed for "${text.slice(0, 30)}...":`, err.message);
    }
  }

  // Write audioMap.js
  const mapPath = path.resolve(__dirname, '../src/utils/audioMap.js');
  const mapContent = `// utils/audioMap.js — AUTO-GENERATED by scripts/generate_audio.js
// Maps narration text -> static .mp3 path in public/assets/audio/

const audioMap = ${JSON.stringify(mapEntries, null, 2)};

export default audioMap;
`;
  fs.writeFileSync(mapPath, mapContent);
  console.log(`\nUpdated ${mapPath} successfully.`);
}

generateAudio();
