import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import audioMap from '../src/utils/audioMap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.resolve(__dirname, '../public/assets/audio');
const validFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

if (fs.existsSync(audioDir)) {
  const files = fs.readdirSync(audioDir);
  let deletedCount = 0;

  files.forEach(file => {
    if (file.endsWith('.mp3') && !validFiles.has(file)) {
      console.log(`[DELETE] Removing orphaned file: ${file}`);
      fs.unlinkSync(path.join(audioDir, file));
      deletedCount++;
    }
  });

  console.log(`Audio cleanup complete. Deleted ${deletedCount} orphaned files.`);
} else {
  console.log('Audio directory does not exist yet.');
}
