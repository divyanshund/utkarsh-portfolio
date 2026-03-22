const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const QUALITY = 80;
const MAX_WIDTH = 2400;
const VARIANTS = [1280, 640];
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function findImages(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findImages(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

function webpPath(originalPath, suffix = '') {
  const dir = path.dirname(originalPath);
  const name = path.basename(originalPath, path.extname(originalPath));
  return path.join(dir, `${name}${suffix}.webp`);
}

async function processImage(filePath) {
  const relativePath = path.relative(IMAGES_DIR, filePath);
  const metadata = await sharp(filePath).metadata();
  const originalWidth = metadata.width;

  const entry = {
    original: relativePath,
    variants: []
  };

  // Main WebP (capped at MAX_WIDTH)
  const mainWidth = Math.min(originalWidth, MAX_WIDTH);
  const mainOut = webpPath(filePath);
  await sharp(filePath)
    .resize({ width: mainWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(mainOut);
  entry.variants.push({ path: path.relative(IMAGES_DIR, mainOut), width: mainWidth });

  // Responsive variants
  for (const w of VARIANTS) {
    if (originalWidth > w) {
      const variantOut = webpPath(filePath, `-${w}w`);
      await sharp(filePath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(variantOut);
      entry.variants.push({ path: path.relative(IMAGES_DIR, variantOut), width: w });
    }
  }

  // Delete original JPG/PNG
  fs.unlinkSync(filePath);

  return entry;
}

async function main() {
  console.log('Finding images...');
  const images = await findImages(IMAGES_DIR);
  console.log(`Found ${images.length} images to process.\n`);

  const manifest = [];
  let processed = 0;

  for (const img of images) {
    try {
      const entry = await processImage(img);
      manifest.push(entry);
      processed++;
      const sizes = entry.variants.map(v => `${v.width}w`).join(', ');
      console.log(`[${processed}/${images.length}] ${entry.original} → ${sizes}`);
    } catch (err) {
      console.error(`FAILED: ${img} — ${err.message}`);
    }
  }

  const manifestPath = path.join(__dirname, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${processed}/${images.length} images processed.`);
  console.log(`Manifest saved to ${manifestPath}`);
}

main();
