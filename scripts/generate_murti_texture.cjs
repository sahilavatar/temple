const fs = require('fs');
const jpeg = require('jpeg-js');

const inputPath = 'public/textures/hanuman_marble_stela.jpg';
const outputPath = 'public/textures/hanuman_sacred_murti.jpg';

const raw = fs.readFileSync(inputPath);
const img = jpeg.decode(raw, { useTArray: true });
const { width, height, data } = img;

const outData = Buffer.alloc(width * height * 4);

function clamp(v, min = 0, max = 255) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

for (let y = 0; y < height; y++) {
  const v = y / height;
  for (let x = 0; x < width; x++) {
    const u = x / width;
    const idx = (y * width + x) * 4;

    const r0 = data[idx];
    const g0 = data[idx + 1];
    const b0 = data[idx + 2];
    const origLum = (0.299 * r0 + 0.587 * g0 + 0.114 * b0) / 255;

    // Deep royal sanctum background (seamless velvet)
    const bgR = Math.round(20 + v * 6);
    const bgG = Math.round(2 + v * 2);
    const bgB = Math.round(5 + v * 2);

    // Check if background:
    const isDarkBg = origLum < 0.13 || (r0 < 36 && g0 < 20 && b0 < 20);
    if (isDarkBg) {
      outData[idx] = bgR;
      outData[idx + 1] = bgG;
      outData[idx + 2] = bgB;
      outData[idx + 3] = 255;
      continue;
    }

    // -----------------------------------------------------------
    // 1. PALETTES (Rich, saturated, high-contrast)
    // -----------------------------------------------------------

    // A. LIGHT TAN (Skin: Face, Torso, Arms, Hands, Feet)
    // Warm, dignified Indian Sandalwood skin tone
    // Highlights are warm amber-tan (NOT blown-out white)
    const tanR = clamp(origLum * 145 + 105);
    const tanG = clamp(origLum * 135 + 72);
    const tanB = clamp(origLum * 125 + 48);

    // B. SHINY GOLD (Crown Mukut, Halo, Gada, Jewelry)
    // 24K rich temple gold with gleaming metallic speculars
    let goldR = clamp(origLum * 238 + 24);
    let goldG = clamp(origLum * 188 + 16);
    let goldB = clamp(origLum * 52 + 6);
    if (origLum > 0.65) {
      const spec = (origLum - 0.65) / 0.35;
      goldR = clamp(goldR + spec * 22);
      goldG = clamp(goldG + spec * 42);
      goldB = clamp(goldB + spec * 85);
    }

    // C. SACRED SAFFRON ORANGE (Clothing: Dhoti, Draped Sash)
    // Consecrated vibrant saffron orange with deep fold shadow
    const saffR = clamp(origLum * 132 + 122);
    const saffG = clamp(origLum * 105 + 32);
    const saffB = clamp(origLum * 28 + 4);

    // D. LOTUS PEDESTAL (Rose-gold, warm ivory and saffron petals)
    const lotusR = clamp(origLum * 178 + 76);
    const lotusG = clamp(origLum * 132 + 42);
    const lotusB = clamp(origLum * 68 + 18);

    // -----------------------------------------------------------
    // 2. CONTINUOUS REGIONAL WEIGHTS (Organic, contour-fitting)
    // -----------------------------------------------------------

    // --- CROWN & HALO (Shiny Gold) ---
    // Upper apex down to forehead brow: y < 195 (v < 0.154)
    // Smooth fade into face between y=190 and 200
    const crownWeight = smoothstep(200, 188, y);

    // --- FACE (Light Tan) ---
    // y between 195 and 280, x between 340 and 510
    const isFaceY = y >= 195 && y <= 280;
    const isFaceX = x >= 335 && x <= 515;
    const isFace = isFaceY && isFaceX;

    // --- SPECIAL FACE FEATURES (Tilak, Eyes, Lips) ---
    let specialFaceWeight = 0;
    let specR = 0, specG = 0, specB = 0;

    if (isFace) {
      // Forehead Urdhva Pundra Tilak: center x ≈ 424, y ≈ 202 to 226
      const tilakDistX = Math.abs(x - 424);
      if (y >= 203 && y <= 226 && tilakDistX <= 11) {
        if (tilakDistX <= 3) {
          // Central vermillion line
          specialFaceWeight = 1.0;
          specR = 232; specG = 28; specB = 16;
        } else if (tilakDistX <= 9) {
          // Sandalwood white wings
          specialFaceWeight = 1.0;
          specR = 252; specG = 248; specB = 240;
        }
      }

      // Lotus Eyes: left eye (x ≈ 398 to 418, y ≈ 228 to 238), right eye (x ≈ 430 to 450, y ≈ 228 to 238)
      const isLeftEye = y >= 227 && y <= 238 && x >= 396 && x <= 416;
      const isRightEye = y >= 227 && y <= 238 && x >= 432 && x <= 452;
      if (isLeftEye || isRightEye) {
        specialFaceWeight = 0.95;
        if (origLum < 0.42) {
          // Dark devotional kohl outline & pupil
          specR = 18; specG = 12; specB = 10;
        } else {
          // Clean white sclera
          specR = 250; specG = 248; specB = 242;
        }
      }

      // Lips: y ≈ 246 to 254, x ≈ 416 to 432
      if (y >= 246 && y <= 254 && Math.abs(x - 424) <= 9) {
        specialFaceWeight = 0.85;
        specR = clamp(origLum * 110 + 140);
        specG = clamp(origLum * 60 + 45);
        specB = clamp(origLum * 40 + 30);
      }

      // Kundal (Earrings) on sides of face: x < 355 or x > 495
      if (x < 355 || x > 495) {
        specialFaceWeight = 0.88;
        specR = goldR; specG = goldG; specB = goldB;
      }
    }

    // --- TORSO, CHEST & ABDOMEN (Light Tan) ---
    // y between 280 and 545, x between 335 and 515
    const isTorso = y > 280 && y <= 545 && x >= 335 && x <= 515;

    // Golden Necklaces on chest: y between 320 and 460, origLum > 0.68
    const isNecklace = isTorso && y >= 320 && y <= 450 && origLum > 0.68 && Math.abs(x - 424) < 70;

    // --- RIGHT ARM & BLESSING HAND (Abhaya mudra) (Light Tan) ---
    // Upraised hand & arm: y between 320 and 500, x between 250 and 340
    const isRightArm = y >= 320 && y <= 500 && x >= 250 && x <= 340;

    // --- LEFT ARM & HAND ON GADA (Light Tan) ---
    // Shoulder down to hand resting on Gada: y between 340 and 635, x between 520 and 615
    const isLeftArm = y >= 340 && y <= 635 && x >= 520 && x <= 615;

    // Golden Armlets on arms:
    const isArmlet = (isRightArm && y >= 370 && y <= 415 && origLum > 0.62) ||
                     (isLeftArm && y >= 450 && y <= 495 && origLum > 0.62);

    // --- GOLDEN WAISTBAND (Kamarbandh) ---
    // Separates torso from dhoti naturally: y between 535 and 565, x between 330 and 520
    const isKamarbandh = y >= 535 && y <= 565 && x >= 330 && x <= 520;

    // --- CLOTHING: SACRED SAFFRON ORANGE ---
    // 1. Draped sash / angavastram along viewer's left:
    //    y between 480 and 990, x between 240 and 335
    const isSash = y >= 480 && y <= 990 && x >= 235 && x <= 335;

    // 2. Dhoti covering legs and waist:
    //    y between 555 and 1025, x between 330 and 515
    const isDhoti = y >= 555 && y <= 1025 && x >= 330 && x <= 515;

    const isClothing = isSash || isDhoti;

    // --- GADA (MACE) (Shiny Gold) ---
    // Held along deity's left side:
    // Shaft: y between 635 and 880, x between 535 and 625
    // Melon head: y between 880 and 1075, x between 505 and 635
    const isGadaShaft = y > 635 && y <= 880 && x >= 535 && x <= 625;
    const isGadaHead = y > 880 && y <= 1075 && x >= 505 && x <= 635;
    const isGada = isGadaShaft || isGadaHead;

    // --- BARE FEET (Light Tan) ---
    // Resting on lotus base: y between 1025 and 1085, x between 340 and 490
    const isFeet = y >= 1025 && y <= 1085 && x >= 340 && x <= 490;

    // Golden Anklets (Payal) at ankles: y between 1018 and 1032, x between 340 and 490
    const isAnklet = y >= 1018 && y <= 1032 && x >= 340 && x <= 490 && origLum > 0.60;

    // --- LOTUS PEDESTAL (Rose-gold, Saffron & Ivory Petals) ---
    // Base across entire width: y >= 1085, x between 230 and 640
    const isLotus = y >= 1085;

    // -----------------------------------------------------------
    // 3. FINAL BLENDING & COLOR ASSIGNMENT
    // -----------------------------------------------------------
    let finalR = tanR;
    let finalG = tanG;
    let finalB = tanB;

    if (crownWeight > 0.05) {
      // Crown & Solar Halo -> SHINY GOLD
      finalR = goldR * crownWeight + tanR * (1 - crownWeight);
      finalG = goldG * crownWeight + tanG * (1 - crownWeight);
      finalB = goldB * crownWeight + tanB * (1 - crownWeight);
    } else if (isFace) {
      // Divine Face -> LIGHT TAN
      finalR = tanR;
      finalG = tanG;
      finalB = tanB;
      if (specialFaceWeight > 0) {
        finalR = specR * specialFaceWeight + finalR * (1 - specialFaceWeight);
        finalG = specG * specialFaceWeight + finalG * (1 - specialFaceWeight);
        finalB = specB * specialFaceWeight + finalB * (1 - specialFaceWeight);
      }
    } else if (isTorso || isRightArm || isLeftArm) {
      // Bare Skin (Chest, Abdomen, Arms, Hands) -> LIGHT TAN
      finalR = tanR;
      finalG = tanG;
      finalB = tanB;
      if (isNecklace || isArmlet) {
        finalR = goldR * 0.85 + finalR * 0.15;
        finalG = goldG * 0.85 + finalG * 0.15;
        finalB = goldB * 0.85 + finalB * 0.15;
      }
    } else if (isKamarbandh) {
      // Golden Waistband -> SHINY GOLD
      finalR = goldR;
      finalG = goldG;
      finalB = goldB;
    } else if (isGada) {
      // Divine Gada (Mace) -> SHINY GOLD
      finalR = goldR;
      finalG = goldG;
      finalB = goldB;
    } else if (isFeet) {
      // Bare Lotus Feet -> LIGHT TAN
      finalR = tanR;
      finalG = tanG;
      finalB = tanB;
      if (isAnklet) {
        finalR = goldR;
        finalG = goldG;
        finalB = goldB;
      }
    } else if (isClothing) {
      // Clothing (Dhoti & Draped Sash) -> SACRED SAFFRON ORANGE
      finalR = saffR;
      finalG = saffG;
      finalB = saffB;
    } else if (isLotus) {
      // Lotus Pedestal -> Rose-gold & Ivory Petals
      finalR = lotusR;
      finalG = lotusG;
      finalB = lotusB;
    } else {
      // Outer border frame / decorative stela edge -> Antique Gold / Bronze
      finalR = clamp(origLum * 180 + 35);
      finalG = clamp(origLum * 140 + 25);
      finalB = clamp(origLum * 60 + 10);
    }

    // Soft antialiased blend into dark sanctum background at boundary edges
    const edgeFade = smoothstep(0.18, 0.12, origLum);
    if (edgeFade > 0) {
      finalR = finalR * (1 - edgeFade) + bgR * edgeFade;
      finalG = finalG * (1 - edgeFade) + bgG * edgeFade;
      finalB = finalB * (1 - edgeFade) + bgB * edgeFade;
    }

    outData[idx] = clamp(finalR);
    outData[idx + 1] = clamp(finalG);
    outData[idx + 2] = clamp(finalB);
    outData[idx + 3] = 255;
  }
}

const encoded = jpeg.encode({ data: outData, width, height }, 96);
fs.writeFileSync(outputPath, encoded.data);
console.log(`Successfully generated organic contoured ${outputPath} (${encoded.data.length} bytes)`);
