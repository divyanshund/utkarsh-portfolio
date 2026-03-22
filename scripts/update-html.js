const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-manifest.json'), 'utf-8'));

// Build lookup: old relative path (from images/) → { webp, variants }
const lookup = {};
for (const entry of manifest) {
  const oldRel = entry.original; // e.g. "as we lose/cover.JPG"
  const mainVariant = entry.variants.find(v => !v.path.includes('-640w') && !v.path.includes('-1280w'));
  const v640 = entry.variants.find(v => v.path.includes('-640w'));
  const v1280 = entry.variants.find(v => v.path.includes('-1280w'));

  lookup[oldRel] = { main: mainVariant, v640, v1280 };
}

// Context-based sizes values
const SIZES = {
  'work-image': '(max-width: 1024px) 100vw, 700px',
  'project-hero-image': '(max-width: 900px) 100vw, 900px',
  'gallery-full': '(max-width: 900px) 100vw, 854px',
  'gallery-row-2': '(max-width: 768px) 100vw, 412px',
  'commissioned-work-image': '(max-width: 1400px) 100vw, 1400px',
  'commissioned-gallery-full': '(max-width: 768px) 100vw, 50vw',
  'video-thumbnail': '(max-width: 1024px) 100vw, 420px',
  'video-gallery-item': '(max-width: 1024px) 100vw, 85vw',
  'book-leaf': '(max-width: 768px) 90vw, 600px',
};

function buildSrcset(info) {
  const parts = [];
  if (info.v640) parts.push(`images/${info.v640.path} ${info.v640.width}w`);
  if (info.v1280) parts.push(`images/${info.v1280.path} ${info.v1280.width}w`);
  if (info.main) parts.push(`images/${info.main.path} ${info.main.width}w`);
  return parts.join(', ');
}

function detectContext(linesBefore) {
  const context = linesBefore.join('\n');
  if (context.includes('book-leaf')) return 'book-leaf';
  if (context.includes('video-gallery-item')) return 'video-gallery-item';
  if (context.includes('video-thumbnail')) return 'video-thumbnail';
  if (context.includes('commissioned-gallery-full')) return 'commissioned-gallery-full';
  if (context.includes('commissioned-work-image')) return 'commissioned-work-image';
  if (context.includes('gallery-row-2')) return 'gallery-row-2';
  if (context.includes('gallery-full')) return 'gallery-full';
  if (context.includes('project-hero-image')) return 'project-hero-image';
  if (context.includes('work-image')) return 'work-image';
  return 'gallery-full'; // default
}

function processHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let changes = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match <img src="images/..." ...>
    const imgMatch = line.match(/<img\s+src="images\/([^"]+)"/);
    if (!imgMatch) continue;

    const oldImagePath = imgMatch[1]; // e.g. "as we lose/cover.JPG"

    // Find in manifest
    const info = lookup[oldImagePath];
    if (!info || !info.main) continue;

    const contextLines = lines.slice(Math.max(0, i - 10), i + 1);
    const context = detectContext(contextLines);
    const sizes = SIZES[context] || SIZES['gallery-full'];
    const srcset = buildSrcset(info);
    const newSrc = `images/${info.main.path}`;

    // Replace src
    let newLine = line.replace(`src="images/${oldImagePath}"`, `src="${newSrc}"`);

    // Add srcset and sizes (before the closing > or before loading=)
    if (!newLine.includes('srcset=')) {
      const srcsetAttr = `srcset="${srcset}" sizes="${sizes}"`;
      // Insert after src="..."
      newLine = newLine.replace(`src="${newSrc}"`, `src="${newSrc}" ${srcsetAttr}`);
    }

    if (newLine !== line) {
      lines[i] = newLine;
      changes++;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`${path.basename(filePath)}: ${changes} images updated`);
  }
}

const htmlFiles = [
  'index.html',
  'graduation-project.html',
  'goback-project.html',
  'can-you-smell-the-divine-fragrance-in-town.html',
  'do-we-all-breathe-the-same.html',
  'commissioned.html',
];

for (const file of htmlFiles) {
  processHtmlFile(path.join(ROOT, file));
}

console.log('\nDone updating HTML files.');
