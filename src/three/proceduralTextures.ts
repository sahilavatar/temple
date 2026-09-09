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
    img.src = `${import.meta.env.BASE_URL}textures/hanuman_flag_emblem.jpg`;

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
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Sunlit Himalayan granite / high-altitude gneiss gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, '#5a524a');
    grad.addColorStop(0.25, '#6b6155');
    grad.addColorStop(0.55, '#484039');
    grad.addColorStop(0.85, '#352e29');
    grad.addColorStop(1, '#241f1c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Stratified geological metamorphic bedding planes and joint fissures
    for (let y = 0; y < 1024; y += 14) {
      const isMajorFault = y % 56 === 0;
      ctx.strokeStyle = isMajorFault
        ? 'rgba(15, 12, 10, 0.45)'
        : 'rgba(215, 205, 190, 0.14)';
      ctx.lineWidth = isMajorFault ? 3.5 : 1.8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 1024; x += 32) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * (isMajorFault ? 16 : 8));
      }
      ctx.stroke();
    }

    // Vertical cleavage joints and frost-shatter couloirs
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = 'rgba(25, 20, 18, 0.35)';
      ctx.lineWidth = 2 + Math.random() * 2.5;
      ctx.beginPath();
      const sx = Math.random() * 1024;
      ctx.moveTo(sx, 0);
      let cx = sx;
      for (let y = 0; y < 1024; y += 40) {
        cx += (Math.random() - 0.5) * 20;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // Granite feldspar, quartz crystals, and dark biotite mica speckling
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 48;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.95));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.85));
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
   * Tangent-space Normal Map for Himalayan Mountain Rock Crags
   */
  public static getMountainRockNormal(): THREE.CanvasTexture {
    const key = 'mountain_rock_normal';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const rockTex = this.getMountainRock();
    const texture = this.generateNormalMap(rockTex.image as HTMLCanvasElement, 3.2);
    texture.repeat.set(4, 4);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Snow-capped Himalayan mountain summit texture with glacial ice, firn, and rock fissures
   */
  public static getSnowCap(): THREE.CanvasTexture {
    const key = 'snow_cap';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Glacial snow gradient with cold blue mountain shadow and pristine firn
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#ffffff'); // Pure summit snow
    grad.addColorStop(0.35, '#f1f5f9'); // High-altitude neve
    grad.addColorStop(0.65, '#cbd5e1'); // Ice shadow
    grad.addColorStop(0.85, '#94a3b8'); // Crevasse rim
    grad.addColorStop(1.0, '#334155'); // Exposed dark summit arête bedrock
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Glacial blue-tinted crevasse shadows
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      const sx = Math.random() * 1024;
      ctx.moveTo(sx, 200 + Math.random() * 300);
      let cx = sx;
      for (let y = 300; y < 900; y += 40) {
        cx += (Math.random() - 0.5) * 24;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // Natural dark rock couloirs and knife-edge arêtes cutting through snow
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 3.5;
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      const startX = Math.random() * 1024;
      ctx.moveTo(startX, 250 + Math.random() * 200);
      let curX = startX;
      for (let y = 450; y < 1024; y += 35) {
        curX += (Math.random() - 0.5) * 30;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }

    // Wind-sculpted sastrugi (horizontal windblown snow wave ridges)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    for (let y = 50; y < 600; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 1024; x += 30) {
        ctx.lineTo(x, y + Math.sin(x * 0.05) * 4);
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
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Rich multi-tone emerald mountain meadow loam base
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, '#15803d'); // Vibrant emerald green
    grad.addColorStop(0.25, '#166534'); // Deep alpine meadow
    grad.addColorStop(0.5, '#14532d'); // Rich mountain grass
    grad.addColorStop(0.75, '#1e3a24'); // Loamy humus soil undertone
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Dappled organic soil and moss mottling
    for (let m = 0; m < 400; m++) {
      const mx = Math.random() * 1024;
      const my = Math.random() * 1024;
      const mr = 8 + Math.random() * 24;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(20, 83, 45, 0.45)' : 'rgba(30, 58, 36, 0.35)';
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
    }

    // High-density interwoven alpine grass blades (6,500 blades)
    for (let i = 0; i < 6500; i++) {
      const gx = Math.random() * 1024;
      const gy = Math.random() * 1024;
      const len = 6 + Math.random() * 14;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;

      const greenTone = Math.random();
      if (greenTone < 0.35) {
        ctx.strokeStyle = '#22c55e'; // Fresh bright blade
      } else if (greenTone < 0.65) {
        ctx.strokeStyle = '#16a34a'; // Vibrant meadow green
      } else if (greenTone < 0.85) {
        ctx.strokeStyle = '#15803d'; // Rich emerald
      } else {
        ctx.strokeStyle = '#84cc16'; // Sunlit lime blade tip
      }
      ctx.lineWidth = 1.2 + Math.random() * 1.5;

      ctx.beginPath();
      ctx.moveTo(gx, gy);
      const cpx = gx + Math.cos(angle) * (len * 0.5) + (Math.random() - 0.5) * 4;
      const cpy = gy + Math.sin(angle) * (len * 0.5);
      const endx = gx + Math.cos(angle) * len;
      const endy = gy + Math.sin(angle) * len;
      ctx.quadraticCurveTo(cpx, cpy, endx, endy);
      ctx.stroke();
    }

    // Wild alpine clover trefoils (Trifolium repens / alpinum)
    for (let c = 0; c < 250; c++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 1024;
      const clovR = 3.5 + Math.random() * 3.0;

      for (let leaf = 0; leaf < 3; leaf++) {
        const la = (leaf / 3) * Math.PI * 2 + Math.random() * 0.2;
        const lx = cx + Math.cos(la) * clovR;
        const ly = cy + Math.sin(la) * clovR;

        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(lx, ly, clovR * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Inner darker crescent
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(lx, ly, clovR * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Tangent-space Normal Map for Alpine Meadow Grass Ground
   */
  public static getLushAlpineGrassNormal(): THREE.CanvasTexture {
    const key = 'lush_alpine_grass_normal';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const grassTex = this.getLushAlpineGrass();
    const texture = this.generateNormalMap(grassTex.image as HTMLCanvasElement, 2.6);
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
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Realistic geological gradient: exposed high-altitude slate crags transitioning down into dark pine scree
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0.0, '#475569'); // High elevation slate rock & talus
    grad.addColorStop(0.22, '#3b4452'); // Rugged metamorphic stone
    grad.addColorStop(0.48, '#2f3b33'); // Subalpine scrub & scree
    grad.addColorStop(0.72, '#223326'); // Dense Himalayan pine / deodar forest
    grad.addColorStop(1.0, '#162319'); // Deep valley shadow
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Geological horizontal rock strata bands
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 2.5;
    for (let y = 0; y < 650; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 1024; x += 45) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 16);
      }
      ctx.stroke();
    }

    // Vertical snowmelt / talus chutes
    ctx.strokeStyle = 'rgba(25, 33, 44, 0.35)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 28; i++) {
      ctx.beginPath();
      const sx = Math.random() * 1024;
      ctx.moveTo(sx, 0);
      let cx = sx;
      for (let y = 0; y < 1024; y += 50) {
        cx += (Math.random() - 0.5) * 25;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // Natural Himalayan conifer pine tree clusters (dark, earthy, realistic conifer green)
    for (let i = 0; i < 1800; i++) {
      const cx = Math.random() * 1024;
      const cy = 350 + Math.random() * 674; // lower two-thirds elevation
      const rad = 3 + Math.random() * 9;
      ctx.fillStyle = Math.random() > 0.4 ? '#182b1f' : '#233829';
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

  /**
   * Generates a tangent-space normal map from a grayscale canvas heightfield
   */
  private static generateNormalMap(
    sourceCanvas: HTMLCanvasElement,
    strength: number = 2.5
  ): THREE.CanvasTexture {
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    const srcCtx = sourceCanvas.getContext('2d')!;
    const srcData = srcCtx.getImageData(0, 0, w, h).data;

    const normCanvas = document.createElement('canvas');
    normCanvas.width = w;
    normCanvas.height = h;
    const normCtx = normCanvas.getContext('2d')!;
    const normImgData = normCtx.createImageData(w, h);
    const dst = normImgData.data;

    const getHeight = (x: number, y: number): number => {
      const px = ((x % w) + w) % w;
      const py = ((y % h) + h) % h;
      const idx = (py * w + px) * 4;
      return (srcData[idx] * 0.299 + srcData[idx + 1] * 0.587 + srcData[idx + 2] * 0.114) / 255.0;
    };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // Sobel / central difference gradient
        const left = getHeight(x - 1, y);
        const right = getHeight(x + 1, y);
        const top = getHeight(x, y - 1);
        const bottom = getHeight(x, y + 1);

        const dx = (right - left) * strength;
        const dy = (bottom - top) * strength;
        const dz = 1.0;

        // Normalize
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const nx = -dx / len;
        const ny = -dy / len;
        const nz = dz / len;

        const outIdx = (y * w + x) * 4;
        dst[outIdx] = Math.round((nx * 0.5 + 0.5) * 255);
        dst[outIdx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        dst[outIdx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        dst[outIdx + 3] = 255;
      }
    }

    normCtx.putImageData(normImgData, 0, 0);
    const texture = new THREE.CanvasTexture(normCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Dressed Ashlar Temple Sandstone with realistic stone coursing,
   * subtle mortar joints, chisel dressing, and iron oxide mineral warmth.
   */
  public static getAshlarStone(): THREE.CanvasTexture {
    const key = 'ashlar_stone';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base sandstone warm gradient
    const baseGrad = ctx.createLinearGradient(0, 0, 512, 512);
    baseGrad.addColorStop(0, '#c28557');
    baseGrad.addColorStop(0.5, '#b37446');
    baseGrad.addColorStop(1, '#9e6137');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Stone courses (rows of blocks)
    const rows = 8;
    const rowH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const isShifted = r % 2 === 1;
      const cols = 4;
      const colW = 512 / cols;
      const offsetX = isShifted ? colW / 2 : 0;

      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offsetX;
        if (x + colW < 0 || x > 512) continue;

        // Individual block tone variation (micro geology variation)
        const toneVar = (Math.sin(r * 3.7 + c * 5.3) * 0.5 + 0.5) * 0.25 - 0.12;
        if (toneVar > 0) {
          ctx.fillStyle = `rgba(245, 190, 140, ${toneVar})`;
        } else {
          ctx.fillStyle = `rgba(50, 25, 10, ${Math.abs(toneVar)})`;
        }
        ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

        // Chisel striations inside each block
        ctx.strokeStyle = 'rgba(70, 35, 15, 0.09)';
        ctx.lineWidth = 1.5;
        for (let l = 6; l < rowH - 6; l += 5) {
          ctx.beginPath();
          ctx.moveTo(x + 4, y + l);
          ctx.lineTo(x + colW - 4, y + l + (Math.random() - 0.5) * 1.5);
          ctx.stroke();
        }

        // Deep recessed mortar seam (dark shadow inside groove)
        ctx.strokeStyle = 'rgba(35, 18, 10, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x + 1, y + 1, colW - 2, rowH - 2);

        // Sunlit stone edge highlight (top & left bevel highlight)
        ctx.strokeStyle = 'rgba(255, 230, 190, 0.22)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + rowH - 2);
        ctx.lineTo(x + 2, y + 2);
        ctx.lineTo(x + colW - 2, y + 2);
        ctx.stroke();
      }
    }

    // Micro mineral grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 22;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.8));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.6));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Tangent-space Normal Map for Ashlar Stone
   */
  public static getAshlarNormal(): THREE.CanvasTexture {
    const key = 'ashlar_normal';
    if (this.cache.has(key)) return this.cache.get(key)!;

    // Build heightmap canvas for normal derivation
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base block height (mid gray = 128)
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 8;
    const rowH = 512 / rows;
    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const isShifted = r % 2 === 1;
      const cols = 4;
      const colW = 512 / cols;
      const offsetX = isShifted ? colW / 2 : 0;

      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offsetX;
        if (x + colW < 0 || x > 512) continue;

        // Block pillowing / beveled convex surface
        const pillowGrad = ctx.createRadialGradient(
          x + colW / 2,
          y + rowH / 2,
          5,
          x + colW / 2,
          y + rowH / 2,
          colW * 0.55
        );
        pillowGrad.addColorStop(0, '#9e9e9e'); // Higher in center
        pillowGrad.addColorStop(0.7, '#888888');
        pillowGrad.addColorStop(1, '#555555'); // Deep in seams
        ctx.fillStyle = pillowGrad;
        ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

        // Deep recessed mortar grooves
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, colW, rowH);
      }
    }

    const texture = this.generateNormalMap(canvas, 3.2);
    texture.repeat.set(2, 2);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Weathered Himalayan Flagstone Paving for Temple Courtyard Walkway
   * Natural slate and sandstone slabs with rounded eroded edges and mossy mortar
   */
  public static getAncientFlagstone(): THREE.CanvasTexture {
    const key = 'ancient_flagstone';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Earthy mortar bedrock base
    ctx.fillStyle = '#3a3229';
    ctx.fillRect(0, 0, 512, 512);

    // Irregular paving stones grid
    const cols = 5;
    const rows = 5;
    const cw = 512 / cols;
    const ch = 512 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * cw + 4;
        const py = r * ch + 4;
        const pw = cw - 8;
        const ph = ch - 8;

        // Slight geological tone variation per stone slab
        const hash = (Math.sin(r * 4.1 + c * 7.9) * 0.5 + 0.5);
        const stoneGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
        if (hash > 0.6) {
          stoneGrad.addColorStop(0, '#8c6e58'); // Warm golden sandstone
          stoneGrad.addColorStop(1, '#70533e');
        } else if (hash > 0.3) {
          stoneGrad.addColorStop(0, '#7a6858'); // Weathered Himalayan slate
          stoneGrad.addColorStop(1, '#5e5043');
        } else {
          stoneGrad.addColorStop(0, '#94755c'); // Ochre sandstone
          stoneGrad.addColorStop(1, '#7a5a41');
        }

        ctx.fillStyle = stoneGrad;
        // Rounded weathered stone corners
        ctx.beginPath();
        const rad = 6;
        ctx.roundRect(px, py, pw, ph, [rad, rad, rad, rad]);
        ctx.fill();

        // Stone texture striations & chisel clefts
        ctx.strokeStyle = 'rgba(40, 25, 15, 0.12)';
        ctx.lineWidth = 1.8;
        for (let s = 8; s < ph - 6; s += 6) {
          ctx.beginPath();
          ctx.moveTo(px + 6, py + s);
          ctx.lineTo(px + pw - 6, py + s + (Math.random() - 0.5) * 3);
          ctx.stroke();
        }

        // Sunlit edge bevel
        ctx.strokeStyle = 'rgba(240, 220, 190, 0.28)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px + 4, py + ph - 4);
        ctx.lineTo(px + 4, py + 4);
        ctx.lineTo(px + pw - 4, py + 4);
        ctx.stroke();

        // Corner moss patches in joint
        if (hash > 0.5) {
          ctx.fillStyle = 'rgba(40, 95, 45, 0.4)';
          ctx.beginPath();
          ctx.arc(px + 4, py + 4, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Granite surface speckling
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 26;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.9));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 6);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Normal map for Ancient Flagstone Paving
   */
  public static getFlagstoneNormal(): THREE.CanvasTexture {
    const key = 'flagstone_normal';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep mortar joints (dark height)
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, 512, 512);

    const cols = 5;
    const rows = 5;
    const cw = 512 / cols;
    const ch = 512 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * cw + 4;
        const py = r * ch + 4;
        const pw = cw - 8;
        const ph = ch - 8;

        const pGrad = ctx.createRadialGradient(
          px + pw / 2,
          py + ph / 2,
          4,
          px + pw / 2,
          py + ph / 2,
          pw * 0.55
        );
        pGrad.addColorStop(0, '#a8a8a8');
        pGrad.addColorStop(0.8, '#888888');
        pGrad.addColorStop(1, '#444444');
        ctx.fillStyle = pGrad;

        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, [6, 6, 6, 6]);
        ctx.fill();
      }
    }

    const texture = this.generateNormalMap(canvas, 3.0);
    texture.repeat.set(3, 6);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Realistic Himalayan Deodar Cedar Bark (Deeply furrowed charcoal-brown with lichen)
   */
  public static getDeodarBarkTexture(): THREE.CanvasTexture {
    const key = 'deodar_bark';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark charcoal-brown wood core
    const bgGrad = ctx.createLinearGradient(0, 0, 256, 0);
    bgGrad.addColorStop(0, '#2b1e16');
    bgGrad.addColorStop(0.5, '#3b291d');
    bgGrad.addColorStop(1, '#241812');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 256, 512);

    // Deep vertical bark furrows
    for (let x = 6; x < 256; x += 12) {
      ctx.strokeStyle = 'rgba(15, 9, 6, 0.65)';
      ctx.lineWidth = 3 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let cx = x;
      for (let y = 0; y < 512; y += 30) {
        cx += (Math.random() - 0.5) * 8;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();

      // Ridge highlight adjacent to furrow
      ctx.strokeStyle = 'rgba(115, 85, 62, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 3, 0);
      let hx = x + 3;
      for (let y = 0; y < 512; y += 30) {
        hx += (Math.random() - 0.5) * 8;
        ctx.lineTo(hx, y);
      }
      ctx.stroke();
    }

    // Alpine sage-green lichen colonies on bark
    ctx.fillStyle = 'rgba(110, 140, 115, 0.35)';
    for (let i = 0; i < 40; i++) {
      const lx = Math.random() * 256;
      const ly = Math.random() * 512;
      const lr = 4 + Math.random() * 10;
      ctx.beginPath();
      ctx.ellipse(lx, ly, lr * 0.6, lr, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 4);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Tangent-space Normal Map for Deodar Bark
   */
  public static getDeodarBarkNormal(): THREE.CanvasTexture {
    const key = 'deodar_bark_normal';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 512);

    for (let x = 6; x < 256; x += 12) {
      // Deep valley furrow
      ctx.strokeStyle = '#252525';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let cx = x;
      for (let y = 0; y < 512; y += 30) {
        cx += (Math.random() - 0.5) * 8;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();

      // High ridge
      ctx.strokeStyle = '#d5d5d5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 5, 0);
      let hx = x + 5;
      for (let y = 0; y < 512; y += 30) {
        hx += (Math.random() - 0.5) * 8;
        ctx.lineTo(hx, y);
      }
      ctx.stroke();
    }

    const texture = this.generateNormalMap(canvas, 3.5);
    texture.repeat.set(2, 4);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Tiered Deodar Cedar Needle Foliage Texture with rich organic depth
   */
  public static getDeodarFoliageTexture(): THREE.CanvasTexture {
    const key = 'deodar_foliage';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich forest conifer base
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
    grad.addColorStop(0, '#1c4228'); // Deep core evergreen
    grad.addColorStop(0.6, '#183b23');
    grad.addColorStop(1, '#0e2416');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Layered needle clusters (spreading horizontally)
    for (let i = 0; i < 2800; i++) {
      const nx = Math.random() * 512;
      const ny = Math.random() * 512;
      const angle = (Math.random() - 0.5) * 1.4;
      const len = 6 + Math.random() * 12;

      const r = Math.random();
      if (r > 0.7) {
        ctx.strokeStyle = '#2e7845'; // Sun-dappled needle tip
      } else if (r > 0.3) {
        ctx.strokeStyle = '#225d36'; // Rich cedar green
      } else {
        ctx.strokeStyle = '#143820'; // Deep shade
      }
      ctx.lineWidth = 1.2 + Math.random() * 1.2;

      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.lineTo(nx + Math.cos(angle) * len, ny + Math.sin(angle) * len);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * High-detail 3D Alpine Grass Blade Quad Texture with alpha cutout
   */
  public static getGrassTuftTexture(): THREE.CanvasTexture {
    const key = 'grass_tuft_quad';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Transparent background
    ctx.clearRect(0, 0, 512, 512);

    // Paint natural, organically curved alpine grass blades from base (y=512) reaching upward
    const bladeCount = 95;
    for (let b = 0; b < bladeCount; b++) {
      const baseX = 256 + (Math.random() - 0.5) * 220;
      const spread = (Math.random() - 0.5) * 180;
      const tipX = baseX + spread;
      const tipY = 30 + Math.random() * 210;
      const cpX = (baseX + tipX) / 2 + (Math.random() - 0.5) * 90;
      const cpY = 320 + Math.random() * 80;

      const bladeW = 5.0 + Math.random() * 4.0;

      // Base to tip color gradient
      const bladeGrad = ctx.createLinearGradient(baseX, 512, tipX, tipY);
      bladeGrad.addColorStop(0, '#14532d'); // Deep mountain grass root
      bladeGrad.addColorStop(0.35, '#15803d'); // Rich emerald blade
      bladeGrad.addColorStop(0.75, '#22c55e'); // Vibrant sunlit green
      bladeGrad.addColorStop(1, '#a7f3d0'); // Translucent sunlit tip
      ctx.fillStyle = bladeGrad;

      ctx.beginPath();
      ctx.moveTo(baseX - bladeW / 2, 512);
      ctx.quadraticCurveTo(cpX - bladeW * 0.35, cpY, tipX, tipY);
      ctx.quadraticCurveTo(cpX + bladeW * 0.35, cpY, baseX + bladeW / 2, 512);
      ctx.closePath();
      ctx.fill();

      // Blade midrib highlight
      if (Math.random() > 0.4) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(baseX, 480);
        ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Photorealistic Himalayan Mountain Juniper Bush Texture (Flower-free, authentic evergreen foliage)
   * Dense, layered conifer needle boughs with subtle frosty juniper berries and natural forest green tones
   */
  public static getRealisticMountainJuniperBushTexture(): THREE.CanvasTexture {
    const key = 'realistic_mountain_juniper_bush';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 512, 512);

    // 1. Structural woody twigs inside the bush core
    ctx.strokeStyle = '#2d241e';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(256, 490);
    ctx.lineTo(256, 330);
    ctx.lineTo(190, 230);
    ctx.moveTo(256, 330);
    ctx.lineTo(320, 220);
    ctx.moveTo(256, 350);
    ctx.lineTo(256, 190);
    ctx.stroke();

    // 2. Volumetric juniper needle clusters (24 radiating fan nodes)
    const juniperNodes = [
      { nx: 256, ny: 160, count: 18, scale: 1.1 },
      { nx: 200, ny: 210, count: 16, scale: 1.05 },
      { nx: 310, ny: 200, count: 16, scale: 1.05 },
      { nx: 150, ny: 270, count: 15, scale: 0.95 },
      { nx: 360, ny: 260, count: 15, scale: 0.95 },
      { nx: 256, ny: 260, count: 18, scale: 1.1 },
      { nx: 190, ny: 330, count: 14, scale: 0.9 },
      { nx: 320, ny: 320, count: 14, scale: 0.9 },
      { nx: 256, ny: 350, count: 16, scale: 1.0 },
      { nx: 120, ny: 320, count: 12, scale: 0.8 },
      { nx: 390, ny: 310, count: 12, scale: 0.8 },
    ];

    juniperNodes.forEach((node) => {
      for (let s = 0; s < node.count; s++) {
        const angle = (s / node.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const sprayLen = (42 + Math.random() * 26) * node.scale;

        ctx.save();
        ctx.translate(node.nx, node.ny);
        ctx.rotate(angle);

        // Multiple dense needle tiers along spray
        for (let t = 0.2; t <= 1.0; t += 0.2) {
          const tx = sprayLen * t;
          const needleSpread = 12 + Math.random() * 10;

          for (let n = -2; n <= 2; n++) {
            const na = (n * 0.24) + (Math.random() - 0.5) * 0.15;
            const nLen = (14 + Math.random() * 12) * node.scale;

            const nGrad = ctx.createLinearGradient(tx, 0, tx + Math.cos(na) * nLen, Math.sin(na) * needleSpread);
            nGrad.addColorStop(0, '#143820'); // Deep forest base
            nGrad.addColorStop(0.5, '#166534'); // Rich emerald
            nGrad.addColorStop(1, Math.random() > 0.4 ? '#22c55e' : '#84cc16'); // Sunlit tip
            ctx.strokeStyle = nGrad;
            ctx.lineWidth = 1.8 + Math.random() * 1.2;

            ctx.beginPath();
            ctx.moveTo(tx, 0);
            ctx.lineTo(tx + Math.cos(na) * nLen, Math.sin(na) * needleSpread);
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    });

    // 3. Authentically scattered wild Himalayan juniper berries (dark slate-blue with subtle frost bloom)
    for (let b = 0; b < 28; b++) {
      const bx = 160 + Math.random() * 192;
      const by = 180 + Math.random() * 170;
      const bRad = 3.5 + Math.random() * 2.5;

      ctx.fillStyle = '#0f172a'; // Deep slate
      ctx.beginPath();
      ctx.arc(bx, by, bRad, 0, Math.PI * 2);
      ctx.fill();

      // Frosted wax bloom highlight
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.beginPath();
      ctx.arc(bx - bRad * 0.3, by - bRad * 0.3, bRad * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Photorealistic Himalayan Mountain Scrub / Wild Alpine Foliage Bush Texture (Flower-free)
   * Dense, lush multi-layered mountain leaves with authentic pale midribs and forest greens
   */
  public static getRealisticMountainFoliageBushTexture(): THREE.CanvasTexture {
    const key = 'realistic_mountain_foliage_bush';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 512, 512);

    // 1. Central woody branching stem
    ctx.strokeStyle = '#2d251d';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(256, 490);
    ctx.lineTo(256, 320);
    ctx.lineTo(180, 220);
    ctx.moveTo(256, 320);
    ctx.lineTo(330, 210);
    ctx.moveTo(256, 340);
    ctx.lineTo(256, 175);
    ctx.stroke();

    // 2. Multi-tiered wild alpine broadleaf scrub rosettes (Pure natural greenery, NO flowers)
    const foliageNodes = [
      { cx: 256, cy: 150, count: 12, scale: 1.1 },
      { cx: 180, cy: 200, count: 11, scale: 1.05 },
      { cx: 330, cy: 190, count: 11, scale: 1.05 },
      { cx: 140, cy: 270, count: 10, scale: 0.95 },
      { cx: 370, cy: 260, count: 10, scale: 0.95 },
      { cx: 256, cy: 250, count: 14, scale: 1.1 },
      { cx: 190, cy: 320, count: 10, scale: 0.9 },
      { cx: 320, cy: 310, count: 10, scale: 0.9 },
      { cx: 256, cy: 340, count: 12, scale: 0.95 },
    ];

    foliageNodes.forEach((node) => {
      for (let l = 0; l < node.count; l++) {
        const angle = (l / node.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const leafLen = (46 + Math.random() * 20) * node.scale;
        const leafW = (18 + Math.random() * 8) * node.scale;

        ctx.save();
        ctx.translate(node.cx, node.cy);
        ctx.rotate(angle);

        // Leaf color gradient: deep forest shadow base to sunlit waxy emerald edge
        const lGrad = ctx.createLinearGradient(0, 0, leafLen, 0);
        lGrad.addColorStop(0, '#0f291e'); // Deep shadow leaf base
        lGrad.addColorStop(0.35, '#14532d'); // Mountain conifer green
        lGrad.addColorStop(0.75, '#16a34a'); // Vibrant leaf body
        lGrad.addColorStop(1, '#22c55e'); // Fresh natural tip
        ctx.fillStyle = lGrad;

        // Natural leaf geometry
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(leafLen * 0.35, -leafW * 0.65, leafLen * 0.75, -leafW * 0.55, leafLen, 0);
        ctx.bezierCurveTo(leafLen * 0.75, leafW * 0.55, leafLen * 0.35, leafW * 0.65, 0, 0);
        ctx.closePath();
        ctx.fill();

        // Pale green central midrib vein
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 1.6 * node.scale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(leafLen * 0.95, 0);
        ctx.stroke();

        // Secondary lateral veins
        ctx.strokeStyle = 'rgba(134, 239, 172, 0.45)';
        ctx.lineWidth = 0.9;
        for (let v = 10; v < leafLen - 6; v += 8) {
          ctx.beginPath();
          ctx.moveTo(v, 0);
          ctx.lineTo(v + 5, -leafW * 0.35);
          ctx.moveTo(v, 0);
          ctx.lineTo(v + 5, leafW * 0.35);
          ctx.stroke();
        }

        // Sunlight reflection on leaf surface
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.beginPath();
        ctx.ellipse(leafLen * 0.45, -leafW * 0.2, leafLen * 0.24, leafW * 0.14, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Alias methods returning the flower-free mountain evergreen foliage textures
   */
  public static getRealisticRhododendronBushTexture(): THREE.CanvasTexture {
    return this.getRealisticMountainJuniperBushTexture();
  }

  public static getRealisticMarigoldBushTexture(): THREE.CanvasTexture {
    return this.getRealisticMountainFoliageBushTexture();
  }

  /**
   * Ultra-realistic Broadleaf Foliage Clump Texture (Inspired by sacred Banyan / Peepal canopy)
   * High-detail alpha card featuring 160+ individual veined leaves with organic clusters & negative space.
   * Completely self-contained within foliage boundary with NO protruding or hanging bare lines!
   */
  public static getRealisticLeafClumpTexture(): THREE.CanvasTexture {
    const key = 'realistic_leaf_clump';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 512, 512);

    // 1. Internal woody twigs (strictly confined to center of foliage mass, fully enveloped by leaves)
    ctx.strokeStyle = '#4a3525';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawInternalTwig = (x1: number, y1: number, x2: number, y2: number, w: number) => {
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const cx = (x1 + x2) / 2 + (Math.random() - 0.5) * 12;
      const cy = (y1 + y2) / 2 + (Math.random() - 0.5) * 12;
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.stroke();
    };

    // Internal twigs only - never extending towards canvas boundary
    drawInternalTwig(256, 310, 256, 240, 5);
    drawInternalTwig(256, 260, 190, 200, 3.5);
    drawInternalTwig(256, 260, 320, 190, 3.5);
    drawInternalTwig(256, 240, 256, 170, 3);
    drawInternalTwig(190, 200, 150, 170, 2.5);
    drawInternalTwig(320, 190, 360, 160, 2.5);

    // 2. Individual realistic leaves radiating outward to form a lush, dense canopy cluster
    const leafNodes: Array<{ x: number; y: number; baseAngle: number; scale: number }> = [];

    // Dense organic clusters centered around (256, 256)
    const clusterCenters = [
      { x: 256, y: 256, r: 70, count: 40 }, // Core center density
      { x: 256, y: 170, r: 75, count: 32 }, // Top
      { x: 170, y: 210, r: 75, count: 32 }, // Top-left
      { x: 340, y: 200, r: 75, count: 32 }, // Top-right
      { x: 180, y: 290, r: 70, count: 28 }, // Bottom-left
      { x: 330, y: 290, r: 70, count: 28 }, // Bottom-right
      { x: 256, y: 330, r: 65, count: 26 }, // Bottom
      { x: 120, y: 240, r: 50, count: 18 }, // Far left
      { x: 390, y: 240, r: 50, count: 18 }, // Far right
    ];

    clusterCenters.forEach((cc) => {
      for (let i = 0; i < cc.count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.7) * cc.r;
        leafNodes.push({
          x: cc.x + Math.cos(ang) * dist,
          y: cc.y + Math.sin(ang) * dist,
          baseAngle: ang + (Math.random() - 0.5) * 0.9,
          scale: 0.75 + Math.random() * 0.55,
        });
      }
    });

    // Draw each leaf
    leafNodes.forEach((node) => {
      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.rotate(node.baseAngle);

      const len = 34 * node.scale;
      const w = 21 * node.scale;

      // Leaf blade gradient (subtle sunlight variation across leaves)
      const rVal = Math.random();
      const grad = ctx.createLinearGradient(0, 0, 0, -len);

      if (rVal < 0.35) {
        // Vibrant sunlit spring leaf (lime & emerald)
        grad.addColorStop(0, '#15803d');
        grad.addColorStop(0.5, '#22c55e');
        grad.addColorStop(1, '#84cc16');
      } else if (rVal < 0.7) {
        // Deep mature canopy green
        grad.addColorStop(0, '#14532d');
        grad.addColorStop(0.5, '#166534');
        grad.addColorStop(1, '#4ade80');
      } else if (rVal < 0.9) {
        // Sun-drenched golden olive tip
        grad.addColorStop(0, '#166534');
        grad.addColorStop(0.5, '#4d7c0f');
        grad.addColorStop(1, '#a3e635');
      } else {
        // Deep shadow underleaf
        grad.addColorStop(0, '#0f3d1e');
        grad.addColorStop(0.6, '#15803d');
        grad.addColorStop(1, '#22c55e');
      }

      ctx.fillStyle = grad;

      // Realistic pointed ovate leaf silhouette with delicate curve
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(w * 0.75, -len * 0.32, w * 0.65, -len * 0.82, 0, -len);
      ctx.bezierCurveTo(-w * 0.65, -len * 0.82, -w * 0.75, -len * 0.32, 0, 0);
      ctx.closePath();
      ctx.fill();

      // Translucent sun-reflecting rim & edge highlight
      ctx.strokeStyle = 'rgba(187, 247, 208, 0.35)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Leaf central midrib stem
      ctx.strokeStyle = 'rgba(220, 252, 231, 0.5)';
      ctx.lineWidth = 1.3 * node.scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo((Math.random() - 0.5) * 3, -len * 0.5, 0, -len * 0.92);
      ctx.stroke();

      // Subtle lateral herringbone veins
      ctx.strokeStyle = 'rgba(220, 252, 231, 0.2)';
      ctx.lineWidth = 0.75 * node.scale;
      for (let v = 0.25; v <= 0.8; v += 0.22) {
        const vy = -len * v;
        const vw = w * 0.32 * (1 - v * 0.6);
        ctx.beginPath();
        ctx.moveTo(0, vy);
        ctx.lineTo(vw, vy - 4 * node.scale);
        ctx.moveTo(0, vy);
        ctx.lineTo(-vw, vy - 4 * node.scale);
        ctx.stroke();
      }

      // Specular leaf sheen highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.ellipse(w * 0.18, -len * 0.45, w * 0.2, len * 0.26, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Ultra-realistic Himalayan Conifer / Cedar Leaf Sprig Card (Screenshot 2 style)
   * Dense horizontal sprays of needle foliage with soft internal twigs and zero protruding naked lines!
   */
  public static getRealisticPineLeafClumpTexture(): THREE.CanvasTexture {
    const key = 'realistic_pine_clump';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 512, 512);

    // 1. Internal central twig branch (strictly within needle bounds)
    ctx.strokeStyle = '#4a3525';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(256, 370);
    ctx.quadraticCurveTo(258, 256, 256, 140);
    ctx.stroke();

    // Short lateral twigs inside needle zone
    for (let t = 190; t <= 330; t += 35) {
      const dir = (t / 35) % 2 === 0 ? 1 : -1;
      const endX = 256 + dir * (70 + Math.random() * 40);
      const endY = t - 15;

      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(256, t);
      ctx.quadraticCurveTo(256 + dir * 25, t - 5, endX, endY);
      ctx.stroke();
    }

    // 2. Dense fan-shaped sprays of cedar/conifer needles radiating outward and covering the stems
    for (let i = 0; i < 950; i++) {
      const sprayCenterX = 256 + (Math.random() - 0.5) * 320;
      const sprayCenterY = 130 + Math.random() * 260;
      const sprayAngle = Math.atan2(sprayCenterY - 256, sprayCenterX - 256) + (Math.random() - 0.5) * 0.85;
      const len = 14 + Math.random() * 22;

      const r = Math.random();
      if (r < 0.4) {
        ctx.strokeStyle = '#22c55e'; // Fresh needle tip
      } else if (r < 0.75) {
        ctx.strokeStyle = '#15803d'; // Rich evergreen
      } else if (r < 0.92) {
        ctx.strokeStyle = '#14532d'; // Deep shadow
      } else {
        ctx.strokeStyle = '#84cc16'; // Sunlit lime highlight
      }

      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sprayCenterX, sprayCenterY);
      ctx.lineTo(
        sprayCenterX + Math.cos(sprayAngle) * len,
        sprayCenterY + Math.sin(sprayAngle) * len
      );
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }
}


