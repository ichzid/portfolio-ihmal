// convert-webp.mjs
// Run: node convert-webp.mjs
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try sharp (bundled with Next.js 13+)
const sharpPaths = [
  path.join(__dirname, 'node_modules', 'sharp'),
  path.join(__dirname, 'node_modules', '@img', 'sharp-win32-x64'),
];

let sharp;
try {
  sharp = require('sharp');
  console.log('✅ sharp found');
} catch (e) {
  console.log('❌ sharp not found:', e.message);
  console.log('\n📋 Manual option: Go to https://squoosh.app/');
  console.log('   Upload: public/images/profile.jpg');
  console.log('   Format: WebP, Quality: 82');
  console.log('   Save as: public/images/profile.webp');
  process.exit(1);
}

const input = path.join(__dirname, 'public', 'images', 'profile.jpg');
const output = path.join(__dirname, 'public', 'images', 'profile.webp');

if (!existsSync(input)) {
  console.log('❌ Input file not found:', input);
  process.exit(1);
}

const result = await sharp(input)
  .webp({ quality: 82, effort: 6 })
  .toFile(output);

const originalSize = 634399;
const newSize = result.size;
const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

console.log(`✅ Converted successfully!`);
console.log(`   Original: ${(originalSize / 1024).toFixed(0)} KB`);
console.log(`   WebP:     ${(newSize / 1024).toFixed(0)} KB`);
console.log(`   Savings:  ${savings}%`);
console.log(`   Output:   ${output}`);
