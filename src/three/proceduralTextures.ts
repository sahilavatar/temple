import * as THREE from 'three';

/**
 * Procedural texture generators using HTML Canvas.
 * Produces crisp, beautiful materials for ancient Indian stone, carved friezes,
 * brass, marble, marigolds, and flame glows with zero external assets.
 */

export class TempleTextures {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Weathered ancient Indian red sandstone (Dholpur / Hampi stone)
   */
  public static getSandstone(): THREE.CanvasTexture {
    const key = 'sandstone';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base warm ochre-sandstone gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#a3633d');
    grad.addColorStop(0.5, '#b8754b');
    grad.addColorStop(1, '#8f5332');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Fine stone grain and sedimentary banding
    ctx.fillStyle = 'rgba(60, 30, 15, 0.08)';
    for (let y = 0; y < 512; y += 4) {
      const h = Math.sin(y * 0.05) * 2;
      ctx.fillRect(0, y + h, 512, 2);
    }

    // Chisel and weathering noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 32;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.8));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.6));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Carved stone lotus frieze band (ancient Indian temple architectural relief)
   */
  public static getCarvedFrieze(): THREE.CanvasTexture {
    const key = 'carved_frieze';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#9e5f39';
    ctx.fillRect(0, 0, 512, 256);

    // Draw repeating lotus petals & relief waves
    ctx.strokeStyle = '#6e3c1e';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#b57448';

    const count = 8;
    const step = 512 / count;

    for (let i = 0; i < count; i++) {
      const cx = i * step + step / 2;
      // Lotus petal
      ctx.beginPath();
      ctx.moveTo(cx, 40);
      ctx.quadraticCurveTo(cx - step * 0.45, 120, cx, 210);
      ctx.quadraticCurveTo(cx + step * 0.45, 120, cx, 40);
      ctx.fill();
      ctx.stroke();

      // Inner petal vein
      ctx.beginPath();
      ctx.moveTo(cx, 60);
      ctx.lineTo(cx, 190);
      ctx.stroke();

      // Border rosettes
      ctx.fillStyle = '#d98e5b';
      ctx.beginPath();
      ctx.arc(cx, 28, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b57448';
    }

    // Top and bottom carved stone moulding grooves
    ctx.fillStyle = '#613217';
    ctx.fillRect(0, 0, 512, 12);
    ctx.fillRect(0, 244, 512, 12);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Temple Sanctum Polished Stone Floor with Mandala Inlay
   */
  public static getSanctumFloor(): THREE.CanvasTexture {
    const key = 'sanctum_floor';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Polished dark granite slab
    ctx.fillStyle = '#221f1d';
    ctx.fillRect(0, 0, 512, 512);

    // Stone tile grooves
    ctx.strokeStyle = 'rgba(180, 140, 90, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 492, 492);
    ctx.strokeRect(30, 30, 452, 452);

    // Central brass/gold floral mandala inlay
    ctx.save();
    ctx.translate(256, 256);
    ctx.strokeStyle = '#d4af37'; // Gold inlay
    ctx.lineWidth = 2.5;

    for (let r = 0; r < 8; r++) {
      ctx.rotate((Math.PI * 2) / 8);
      ctx.beginPath();
      ctx.arc(0, 70, 35, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    // Subtle stone marbling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 90 + 20, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Sacred Hanuman Sindoor / Vermillion Texture with Golden Glow
   */
  public static getSindoorMurtiTexture(): THREE.CanvasTexture {
    const key = 'sindoor_murti';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich sacred saffron-vermillion gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#f2501a');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, '#c23807');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Fine powdered grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 40;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.4));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.1));
    }
    ctx.putImageData(imgData, 0, 0);

    // Golden sparkles / chandan dots
    ctx.fillStyle = 'rgba(255, 220, 100, 0.4)';
    for (let i = 0; i < 150; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Polished Antique Brass / Panchaloha for bell, diyas, and Gada
   */
  public static getAntiqueBrass(): THREE.CanvasTexture {
    const key = 'brass';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#b8860b');
    grad.addColorStop(0.4, '#ffd700');
    grad.addColorStop(0.8, '#daa520');
    grad.addColorStop(1, '#8b6508');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Subtle hammered metal rings
    ctx.strokeStyle = 'rgba(80, 50, 10, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 12 + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Antique White Carved Marble Texture for Classical Murti / Sculpture
   * Generates warm off-white stone with delicate grey veining, crevice ambient occlusion,
   * and satin crystalline stone surface finish matching the reference sculpture.
   */
  public static getAntiqueMarbleTexture(): THREE.CanvasTexture {
    const key = 'antique_marble_statue';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Warm ivory-white marble base
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#f2ece4');
    grad.addColorStop(0.3, '#ede7df');
    grad.addColorStop(0.7, '#e8e2d9');
    grad.addColorStop(1, '#dfd8ce');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Soft warm stone clouding / shading
    for (let i = 0; i < 35; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const rad = Math.random() * 90 + 30;
      const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      radial.addColorStop(0, 'rgba(195, 185, 172, 0.22)');
      radial.addColorStop(0.5, 'rgba(215, 206, 194, 0.1)');
      radial.addColorStop(1, 'rgba(240, 235, 227, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Delicate meandering marble veins
    ctx.lineWidth = 1.6;
    for (let v = 0; v < 7; v++) {
      ctx.strokeStyle = `rgba(145, 135, 122, ${0.12 + Math.random() * 0.1})`;
      ctx.beginPath();
      let vx = Math.random() * 512;
      let vy = 0;
      ctx.moveTo(vx, vy);
      while (vy < 512) {
        vx += (Math.random() - 0.48) * 18;
        vy += Math.random() * 16 + 6;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }

    // Micro mineral grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 10;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.95));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.9));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Intricate Carved Stone Drapery & Jewelry Relief Border
   */
  public static getCarvedMarbleRelief(): THREE.CanvasTexture {
    const key = 'carved_marble_relief';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Stone relief background
    ctx.fillStyle = '#e4ddd3';
    ctx.fillRect(0, 0, 512, 128);

    // Carved border ridges
    ctx.strokeStyle = '#9c9284';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, 504, 120);

    // Repeating beaded lotus and scroll filigree
    const count = 16;
    const step = 512 / count;
    for (let i = 0; i < count; i++) {
      const cx = i * step + step / 2;
      ctx.fillStyle = '#f5efe6';
      ctx.beginPath();
      ctx.arc(cx, 64, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8a8073';
      ctx.stroke();

      // Inner bead
      ctx.fillStyle = '#8a8073';
      ctx.beginPath();
      ctx.arc(cx, 64, 6, 0, Math.PI * 2);
      ctx.fill();

      // Fluting petals
      ctx.strokeStyle = '#b0a698';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 18, 64);
      ctx.lineTo(cx + 18, 64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, 46);
      ctx.lineTo(cx, 82);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Saffron Temple Silk Flag with Sacred Hanuman Flying Emblem (Minimalist & Simple)
   */
  public static getTempleFlag(): THREE.CanvasTexture {
    const key = 'temple_flag';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const renderBaseFlag = () => {
      // Saffron silk gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0, '#ea580c');
      grad.addColorStop(0.5, '#f97316');
      grad.addColorStop(1, '#fb923c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Deep Red border
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, 502, 246);

      // Thin sacred gold inner border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(12, 12, 488, 232);

      // Golden fringe along the bottom edge
      ctx.fillStyle = '#fbbf24';
      for (let x = 18; x < 496; x += 16) {
        ctx.fillRect(x, 242, 8, 12);
      }
    };

    renderBaseFlag();

    // Subtle luminous circular aura halo behind the emblem
    ctx.save();
    const auraGrad = ctx.createRadialGradient(256, 128, 20, 256, 128, 110);
    auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    auraGrad.addColorStop(0.8, 'rgba(251, 146, 60, 0.2)');
    auraGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(256, 128, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);

    // Load the Lord Hanuman carrying Dronagiri mountain image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/textures/hanuman_flag_emblem.jpg';

    const drawHanumanImage = () => {
      renderBaseFlag();

      // Delicate golden radiance halo ring
      ctx.save();
      const aura = ctx.createRadialGradient(256, 128, 10, 256, 128, 115);
      aura.addColorStop(0, 'rgba(254, 243, 199, 0.5)');
      aura.addColorStop(0.7, 'rgba(253, 224, 71, 0.25)');
      aura.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(256, 128, 115, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Process image to make white background transparent and draw seamlessly
      try {
        const tempCanvas = document.createElement('canvas');
        const nw = img.naturalWidth || 512;
        const nh = img.naturalHeight || 512;
        tempCanvas.width = nw;
        tempCanvas.height = nh;
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const imgData = tempCtx.getImageData(0, 0, nw, nh);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 225 && g > 225 && b > 225) {
              const avg = (r + g + b) / 3;
              data[i + 3] = Math.max(0, Math.min(255, (255 - avg) * 9));
            }
          }
          tempCtx.putImageData(imgData, 0, 0);

          // Draw the minimalist Lord Hanuman emblem centered on the saffron flag
          const emblemSize = 205;
          const ex = 256 - emblemSize / 2;
          const ey = 128 - emblemSize / 2 - 2;
          ctx.drawImage(tempCanvas, ex, ey, emblemSize, emblemSize);
        } else {
          // Fallback with multiply blend
          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          const emblemSize = 205;
          ctx.drawImage(img, 256 - emblemSize / 2, 128 - emblemSize / 2, emblemSize, emblemSize);
          ctx.restore();
        }
      } catch {
        // Fallback with multiply blend mode
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        const emblemSize = 205;
        ctx.drawImage(img, 256 - emblemSize / 2, 128 - emblemSize / 2, emblemSize, emblemSize);
        ctx.restore();
      }

      texture.needsUpdate = true;
    };

    img.onload = drawHanumanImage;
    if (img.complete && img.naturalWidth > 0) {
      drawHanumanImage();
    }

    return texture;
  }

  /**
   * Rugged Mountain Granite & Crag Texture for sunny peaks
   */
  public static getMountainRock(): THREE.CanvasTexture {
    const key = 'mountain_rock';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Sunlit granite / high altitude rock gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#544c45');
    grad.addColorStop(0.3, '#6e6256');
    grad.addColorStop(0.7, '#433b35');
    grad.addColorStop(1, '#2c2622');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Rock strata lines and rugged striations
    ctx.strokeStyle = 'rgba(215, 200, 180, 0.15)';
    ctx.lineWidth = 3;
    for (let y = 0; y < 512; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 512; x += 40) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 16);
      }
      ctx.stroke();
    }

    // Granite speckle noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 45;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 1.1));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Snow-capped Himalayan mountain summit texture with glacial ice and rock fissures
   */
  public static getSnowCap(): THREE.CanvasTexture {
    const key = 'snow_cap';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Glacial snow gradient with cold blue mountain shadow
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#f8fafc'); // Pure pristine snow
    grad.addColorStop(0.45, '#edf2f7'); // High-altitude neve
    grad.addColorStop(0.75, '#cbd5e1'); // Ice shadow
    grad.addColorStop(1.0, '#475569'); // Exposed dark summit crag bedrock
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Natural rock ribs and couloirs cutting through snow
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      const startX = Math.random() * 512;
      ctx.moveTo(startX, 150 + Math.random() * 100);
      let curX = startX;
      for (let y = 250; y < 512; y += 30) {
        curX += (Math.random() - 0.5) * 20;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Radial soft glow sprite for diya flames and sanctum prabhavali
   */
  public static getGlowSprite(): THREE.CanvasTexture {
    const key = 'glow_sprite';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 230, 120, 1)');
    grad.addColorStop(0.2, 'rgba(255, 160, 40, 0.8)');
    grad.addColorStop(0.5, 'rgba(240, 90, 20, 0.3)');
    grad.addColorStop(1, 'rgba(200, 50, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Stone Jaali (Perforated Carved Lattice Screen) for temple wall windows
   */
  public static getJaaliLattice(): THREE.CanvasTexture {
    const key = 'jaali';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#7a4527';
    ctx.fillRect(0, 0, 256, 256);

    // Carve 4-pointed star / jali holes
    ctx.fillStyle = '#1c1917'; // hollow dark background behind
    const step = 64;
    for (let x = 0; x < 256; x += step) {
      for (let y = 0; y < 256; y += step) {
        ctx.beginPath();
        const cx = x + step / 2;
        const cy = y + step / 2;
        ctx.moveTo(cx, cy - 24);
        ctx.lineTo(cx + 24, cy);
        ctx.lineTo(cx, cy + 24);
        ctx.lineTo(cx - 24, cy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#4a2510';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 4);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Lush Himalayan Alpine Grass with wildflowers and natural blade texture
   */
  public static getLushAlpineGrass(): THREE.CanvasTexture {
    const key = 'lush_alpine_grass';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich multi-tone emerald mountain meadow base
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#15803d'); // Vibrant emerald green
    grad.addColorStop(0.35, '#166534'); // Deep forest meadow
    grad.addColorStop(0.7, '#14532d'); // Rich mountain grass
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Dappled sunlit moss & blade variation
    for (let i = 0; i < 3000; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const len = 4 + Math.random() * 9;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;

      const greenTone = Math.random();
      if (greenTone < 0.4) {
        ctx.strokeStyle = '#22c55e'; // Fresh bright green blade
      } else if (greenTone < 0.75) {
        ctx.strokeStyle = '#16a34a'; // Vibrant grass green
      } else {
        ctx.strokeStyle = '#14532d'; // Deep shadow green
      }
      ctx.lineWidth = 1 + Math.random() * 1.5;

      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + Math.cos(angle) * len, gy + Math.sin(angle) * len);
      ctx.stroke();
    }

    // Scattered tiny alpine wildflowers (Marigolds, rhododendrons, daisies)
    const flowerColors = ['#fbbf24', '#f59e0b', '#f43f5e', '#ffffff', '#fb7185'];
    for (let f = 0; f < 180; f++) {
      const fx = Math.random() * 512;
      const fy = Math.random() * 512;
      const r = 1.5 + Math.random() * 2.5;
      ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      ctx.beginPath();
      ctx.arc(fx, fy, r, 0, Math.PI * 2);
      ctx.fill();

      // Golden flower center
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(fx, fy, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Realistic Himalayan Mountain Slope Texture with authentic rock strata, slate scree, and dark alpine pine
   */
  public static getMountainGreenery(): THREE.CanvasTexture {
    const key = 'mountain_greenery';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Realistic geological gradient: exposed high-altitude slate crags transitioning down into dark pine scree
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, '#475569'); // High elevation slate rock & talus
    grad.addColorStop(0.25, '#3b4452'); // Rugged metamorphic stone
    grad.addColorStop(0.55, '#2f3b33'); // Subalpine scrub & scree
    grad.addColorStop(0.80, '#223326'); // Dense Himalayan pine / deodar forest
    grad.addColorStop(1.0, '#19261c'); // Deep valley shadow
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Geological horizontal rock strata bands
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 350; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 512; x += 32) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 12);
      }
      ctx.stroke();
    }

    // Vertical snowmelt / talus chutes
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      const sx = Math.random() * 512;
      ctx.moveTo(sx, 0);
      let cx = sx;
      for (let y = 0; y < 512; y += 40) {
        cx += (Math.random() - 0.5) * 16;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // Natural Himalayan conifer pine tree clusters (dark, earthy, realistic conifer green)
    for (let i = 0; i < 950; i++) {
      const cx = Math.random() * 512;
      const cy = 180 + Math.random() * 332; // mostly lower two-thirds
      const rad = 2 + Math.random() * 6;
      ctx.fillStyle = Math.random() > 0.4 ? '#1c2e22' : '#273e2f';
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    this.cache.set(key, texture);
    return texture;
  }
}
