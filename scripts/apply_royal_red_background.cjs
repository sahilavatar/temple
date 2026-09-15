const fs = require('fs');
const jpeg = require('jpeg-js');

const inputPath = 'src/assets/images/hanuman_divine_murti_1789459343450.jpg';
const outputPath = 'public/textures/hanuman_sacred_murti.jpg';

const raw = fs.readFileSync(inputPath);
const img = jpeg.decode(raw, { useTArray: true });
const { width, height, data } = img;

const outData = Buffer.alloc(width * height * 4);

// Exact boundary envelopes for Lord Hanuman's Sacred Murti:
// Top Mukut apex begins at y = 104
// The solar halo disc spans y = 110 to 260, strictly bounded to eliminate the floating black streak
function getRightBound(y) {
  if (y < 104) return 0;
  if (y <= 110) return 445;
  if (y <= 115) return 496;
  if (y <= 120) return 506;
  if (y <= 125) return 514;
  if (y <= 130) return 521;
  if (y <= 135) return 527;
  if (y <= 140) return 533;
  if (y <= 145) return 538;
  if (y <= 150) return 543;
  if (y <= 160) return 550;
  if (y <= 260) return 578;
  if (y < 450) return 620;
  return 655;
}

function getLeftBound(y) {
  if (y < 104) return 9999;
  if (y <= 110) return 415;
  if (y <= 115) return 364;
  if (y <= 120) return 355;
  if (y <= 125) return 346;
  if (y <= 130) return 339;
  if (y <= 135) return 333;
  if (y <= 140) return 327;
  if (y <= 145) return 322;
  if (y <= 150) return 317;
  if (y <= 160) return 310;
  if (y <= 260) return 275;
  if (y < 450) return 240;
  return 200;
}

// 1. Initial statue seed identification
const isStatueSeed = new Uint8Array(width * height);

for (let y = 104; y < height; y++) {
  const left = getLeftBound(y);
  const right = getRightBound(y);

  for (let x = left; x <= right; x++) {
    const idx = y * width + x;
    const i = idx * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const isGoldOrSkin = (r > 105 && g > 65) && (r > b + 18);
    const isSaffron = (r > 95) && (r > g + 15);
    const isSculptureHighlight = lum > 0.25;
    const isInternalCrease = (x >= left + 25 && x <= right - 25) && lum > 0.04;

    if (isGoldOrSkin || isSaffron || isSculptureHighlight || isInternalCrease) {
      isStatueSeed[idx] = 1;
    }
  }
}

// 2. Connected component flood-fill from chest center (424, 400)
// Guarantees ONLY the sacred deity body is captured
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let qHead = 0, qTail = 0;

const seedIdx = 400 * width + 424;
visited[seedIdx] = 1;
queue[qTail++] = seedIdx;

while (qHead < qTail) {
  const curr = queue[qHead++];
  const cx = curr % width;
  const cy = Math.floor(curr / width);

  const neighbors = [
    cx > 0 ? curr - 1 : -1,
    cx < width - 1 ? curr + 1 : -1,
    cy > 104 ? curr - width : -1,
    cy < height - 1 ? curr + width : -1,
  ];

  for (const n of neighbors) {
    if (n !== -1 && !visited[n] && isStatueSeed[n]) {
      visited[n] = 1;
      queue[qTail++] = n;
    }
  }
}

// 3. Morphological closing to fill internal creases and micro-shadows inside the statue body only
const closedMask = new Uint8Array(width * height);
for (let y = 104; y < height - 1; y++) {
  const left = getLeftBound(y);
  const right = getRightBound(y);

  for (let x = left; x <= right; x++) {
    const idx = y * width + x;
    if (visited[idx]) {
      closedMask[idx] = 1;
    } else {
      // Only close if strictly inside the bounds
      let leftHit = false, rightHit = false;
      for (let dx = 1; dx <= 10 && x - dx >= left; dx++) {
        if (visited[idx - dx]) { leftHit = true; break; }
      }
      for (let dx = 1; dx <= 10 && x + dx <= right; dx++) {
        if (visited[idx + dx]) { rightHit = true; break; }
      }
      if (leftHit && rightHit) {
        closedMask[idx] = 1;
      }
    }
  }
}

// 4. Smooth 3px antialiasing feather for silky-smooth organic transition
const featherMask = new Float32Array(width * height);
for (let y = 104; y < height - 2; y++) {
  for (let x = 2; x < width - 2; x++) {
    let sum = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        sum += closedMask[(y + dy) * width + (x + dx)];
      }
    }
    featherMask[y * width + x] = sum / 25.0;
  }
}

// ========================================================
// 5. COMPOSITE WITH PRISTINE ROYAL RED SILK
// Clean continuous radial aura centered behind Lord Hanuman
// ========================================================
for (let y = 0; y < height; y++) {
  const v = y / height;
  for (let x = 0; x < width; x++) {
    const u = x / width;
    const idx = (y * width + x) * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const m = featherMask[y * width + x];

    // Smooth circular radial distance from solar aura center (424, 220)
    const normDx = (x - 424) / (width * 0.55);
    const normDy = (y - 220) / (height * 0.55);
    const radDist = Math.sqrt(normDx * normDx + normDy * normDy);

    // Continuous radial falloff with zero creases
    const auraGlow = Math.max(0, 1 - radDist * 0.75);
    const edgeSoftness = Math.max(0.76, 1.0 - radDist * 0.18);

    // Auspicious Royal Red:
    // Central radiant aura: rich vermillion crimson (R: 218, G: 48, B: 34)
    // Ambient field: deep royal temple crimson red (R: 185, G: 20, B: 26)
    const bgR = Math.min(255, Math.round((186 + auraGlow * 34) * edgeSoftness));
    const bgG = Math.min(255, Math.round((20 + auraGlow * 30) * edgeSoftness));
    const bgB = Math.min(255, Math.round((26 + auraGlow * 10) * edgeSoftness));

    // Composite:
    const finalR = Math.round(r * m + bgR * (1 - m));
    const finalG = Math.round(g * m + bgG * (1 - m));
    const finalB = Math.round(b * m + bgB * (1 - m));

    outData[idx] = finalR;
    outData[idx + 1] = finalG;
    outData[idx + 2] = finalB;
    outData[idx + 3] = 255;
  }
}

const encoded = jpeg.encode({ data: outData, width, height }, 96);
fs.writeFileSync(outputPath, encoded.data);
console.log(`Successfully generated flawless ${outputPath} (${encoded.data.length} bytes)`);
