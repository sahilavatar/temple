import * as THREE from 'three';
import { TempleTextures } from './proceduralTextures';

export interface TimeColors {
  skyZenith: THREE.Color;
  skyHorizon: THREE.Color;
  skyGround: THREE.Color;
  sunColor: THREE.Color;
  sunIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  fogColor: THREE.Color;
  fogDensity: number;
  cloudColor: THREE.Color;
  cloudOpacity: number;
  sunPosition: THREE.Vector3;
}

export class MountainEnvironment {
  private static skyTextureCanvas: HTMLCanvasElement | null = null;
  private static skyCanvasTexture: THREE.CanvasTexture | null = null;
  private static sunMesh: THREE.Mesh | null = null;
  private static sunGlowSprite: THREE.Sprite | null = null;
  private static starsGroup: THREE.Points | null = null;
  private static cloudMeshes: THREE.Mesh[] = [];

  /**
   * Builds the 360° lush Himalayan mountain environment
   */
  public static createEnvironment(scene: THREE.Scene): {
    cloudMeshes: THREE.Mesh[];
    updateTimeOfDay: (
      time01: number,
      sunLight: THREE.DirectionalLight,
      hemiLight: THREE.HemisphereLight
    ) => void;
  } {
    const envGroup = new THREE.Group();
    this.cloudMeshes = [];

    // Textures
    const grassTex = TempleTextures.getLushAlpineGrass();
    const mountainGreenTex = TempleTextures.getMountainGreenery();
    const glowSprite = TempleTextures.getGlowSprite();

    // ==========================================
    // 1. PROCEDURAL HIGH-QUALITY SKY DOME (360° SPHERE)
    // ==========================================
    const skyGeo = new THREE.SphereGeometry(420, 32, 24);

    this.skyTextureCanvas = document.createElement('canvas');
    this.skyTextureCanvas.width = 32;
    this.skyTextureCanvas.height = 512;
    this.skyCanvasTexture = new THREE.CanvasTexture(this.skyTextureCanvas);
    this.skyCanvasTexture.colorSpace = THREE.SRGBColorSpace;

    // CRITICAL: fog: false prevents scene fog from washing out the sky dome!
    const skyMat = new THREE.MeshBasicMaterial({
      map: this.skyCanvasTexture,
      depthWrite: false,
      side: THREE.BackSide,
      fog: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    envGroup.add(skyMesh);

    // ==========================================
    // 2. CELESTIAL SUN WITH CORONA GLOW
    // ==========================================
    const sunGeo = new THREE.SphereGeometry(7.0, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    envGroup.add(this.sunMesh);

    const coronaMat = new THREE.SpriteMaterial({
      map: glowSprite,
      color: 0xffd060,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
    });
    this.sunGlowSprite = new THREE.Sprite(coronaMat);
    this.sunGlowSprite.scale.set(45, 45, 1);
    this.sunMesh.add(this.sunGlowSprite);

    // ==========================================
    // 3. TWILIGHT STARS (Fades in during dusk/twilight)
    // ==========================================
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount; s++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 360;
      // Keep stars primarily above horizon
      const y = Math.abs(Math.cos(phi) * r) + 20;
      const x = Math.sin(phi) * Math.sin(theta) * r;
      const z = Math.sin(phi) * Math.cos(theta) * r;
      starPositions[s * 3] = x;
      starPositions[s * 3 + 1] = y;
      starPositions[s * 3 + 2] = z;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    this.starsGroup = new THREE.Points(starGeo, starMat);
    envGroup.add(this.starsGroup);

    // ==========================================
    // 4. SEA OF VALLEY CLOUDS (Himalayan Valley Mist)
    // ==========================================
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf0f9ff,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.75,
      depthWrite: false, // Prevents depth-buffer sorting glitches with mountains
    });

    const createCloudTier = (size: number, yPos: number, rotZ: number) => {
      const geo = new THREE.PlaneGeometry(520, 520, 24, 24);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const wave = Math.sin(u * 0.015) * Math.cos(v * 0.015) * 5.0;
        pos.setZ(i, wave);
      }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(0, yPos, 0);
      mesh.rotation.z = rotZ;
      envGroup.add(mesh);
      this.cloudMeshes.push(mesh);
    };

    createCloudTier(520, -14, 0);
    createCloudTier(480, -23, Math.PI / 3);

    // ==========================================
    // 5. REALISTIC HIMALAYAN MOUNTAIN RANGES
    // Authentic slate bedrock, dark conifer belts, weathered granite crags, and glacial snow summits
    // ==========================================
    const mountainSlopeTex = TempleTextures.getMountainGreenery();
    const mountainRockTex = TempleTextures.getMountainRock();
    const snowSummitTex = TempleTextures.getSnowCap();

    // Natural subalpine slate scree & deep pine slope base
    const baseSlopeMat = new THREE.MeshStandardMaterial({
      map: mountainSlopeTex,
      color: 0x3d4a41, // Natural earthy slate & alpine conifer tone
      roughness: 0.92,
      metalness: 0.02,
      flatShading: true,
    });

    // Darker slate bedrock for shadowed mountain facets
    const darkSlopeMat = new THREE.MeshStandardMaterial({
      map: mountainSlopeTex,
      color: 0x2d3732,
      roughness: 0.94,
      metalness: 0.02,
      flatShading: true,
    });

    // Deep Himalayan pine forest foothills
    const forestFoothillMat = new THREE.MeshStandardMaterial({
      map: mountainSlopeTex,
      color: 0x203024, // Muted natural conifer pine
      roughness: 0.92,
      metalness: 0.01,
      flatShading: true,
    });

    // Weathered high-altitude granite & metamorphic rock crags
    const rockyRidgeMat = new THREE.MeshStandardMaterial({
      map: mountainRockTex,
      color: 0x5a6575, // Cool Himalayan granite
      roughness: 0.95,
      flatShading: true,
    });

    // Pure glacial snow summit with crevasse fissures
    const snowApexMat = new THREE.MeshStandardMaterial({
      map: snowSummitTex,
      color: 0xf8fafc,
      roughness: 0.62,
      metalness: 0.03,
      flatShading: true,
    });

    // 20 Majestic Himalayan Mountains ringing the 360° horizon
    const peakCount = 20;
    for (let i = 0; i < peakCount; i++) {
      const angle = (i / peakCount) * Math.PI * 2 + (i % 3) * 0.12;
      const dist = 140 + (i % 5) * 20;
      const px = Math.cos(angle) * dist;
      const pz = Math.sin(angle) * dist;
      const peakH = 75 + (i % 4) * 25 + ((i * 7) % 20);
      const peakRadius = 44 + (i % 3) * 14;

      const yBase = -25;
      const segs = 9 + (i % 3);

      // Realistic altitudinal distribution:
      // Major peaks have deeper snowfields; rugged peaks have towering granite ribs
      const isGlacierPeak = i % 3 === 0;
      const snowRatio = isGlacierPeak ? 0.35 : 0.22;
      const cragRatio = isGlacierPeak ? 0.28 : 0.36;
      const baseRatio = 1.0 - snowRatio - cragRatio;

      const hBase = peakH * baseRatio;
      const rBaseTop = peakRadius * (1.0 - baseRatio * 0.72);

      const hCrag = peakH * cragRatio;
      const rCragTop = peakRadius * snowRatio * 0.85;

      const hSnow = peakH * snowRatio;

      // 1. Natural Mountain Base (Earthy slate scree & dark pine)
      const baseMat = i % 2 === 0 ? baseSlopeMat : darkSlopeMat;
      const lushBase = new THREE.Mesh(
        new THREE.CylinderGeometry(rBaseTop, peakRadius, hBase, segs),
        baseMat
      );
      lushBase.position.set(px, yBase + hBase / 2, pz);
      envGroup.add(lushBase);

      // 2. Weathered Himalayan Granite Crags
      const cragMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(rCragTop, rBaseTop, hCrag, segs),
        rockyRidgeMat
      );
      cragMesh.position.set(px, yBase + hBase + hCrag / 2, pz);
      envGroup.add(cragMesh);

      // 3. Snow-Capped Apex (Glacial summit)
      const snowCap = new THREE.Mesh(
        new THREE.ConeGeometry(rCragTop, hSnow, segs),
        snowApexMat
      );
      snowCap.position.set(px, yBase + hBase + hCrag + hSnow / 2, pz);
      envGroup.add(snowCap);
    }

    // Midground Rolling Alpine Foothills
    const ridgeCount = 14;
    for (let r = 0; r < ridgeCount; r++) {
      const angle = (r / ridgeCount) * Math.PI * 2 + 0.2;
      const dist = 72 + (r % 3) * 16;
      const rx = Math.cos(angle) * dist;
      const rz = Math.sin(angle) * dist;
      const rH = 26 + (r % 4) * 8;
      const rRad = 24 + (r % 2) * 8;

      const ridge = new THREE.Mesh(
        new THREE.ConeGeometry(rRad, rH, 7),
        forestFoothillMat
      );
      ridge.position.set(rx, rH / 2 - 20, rz);
      envGroup.add(ridge);
    }

    // ==========================================
    // 6. MOUNTAINTOP CLIFF & LUSH GREEN PLATEAU MEADOW
    // Designed with zero co-planar faces to eliminate grass glitching!
    // ==========================================
    // Cliff rock base: openEnded cylinder strictly BELOW the grass carpet (y < -1.0)
    const cliffBase = new THREE.Mesh(
      new THREE.CylinderGeometry(25.4, 36.0, 16.0, 24, 1, true),
      new THREE.MeshStandardMaterial({
        map: mountainRockTex,
        color: 0x475569,
        roughness: 0.95,
        flatShading: true,
      })
    );
    cliffBase.position.set(0, -9.0, 0);
    envGroup.add(cliffBase);

    // LUSH GREEN ALPINE GRASS CARPET (The ONLY surface at y = 0.0)
    const plateauGrass = new THREE.Mesh(
      new THREE.CylinderGeometry(25.5, 25.5, 1.0, 48),
      new THREE.MeshStandardMaterial({
        map: grassTex,
        color: 0x3b9b5a, // Natural Himalayan alpine meadow green
        roughness: 0.88,
        metalness: 0.02,
      })
    );
    plateauGrass.position.set(0, -0.5, 0);
    plateauGrass.receiveShadow = true;
    envGroup.add(plateauGrass);

    // Lush Grass Mounds around the plateau edge
    const grassMoundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      color: 0x30834a,
      roughness: 0.88,
    });

    const moundPositions: [number, number, number, number][] = [
      [-12, 0.15, 9, 3.8],
      [12, 0.15, 9, 4.2],
      [-14, 0.20, -2, 4.5],
      [14, 0.20, -2, 4.8],
      [-10, 0.18, -13, 5.0],
      [10, 0.18, -13, 5.2],
      [0, 0.18, -16, 5.5],
    ];

    moundPositions.forEach(([mx, my, mz, mr]) => {
      const mound = new THREE.Mesh(
        new THREE.SphereGeometry(mr, 12, 8),
        grassMoundMat
      );
      mound.scale.set(1.0, 0.22, 1.0);
      mound.position.set(mx, my, mz);
      mound.receiveShadow = true;
      envGroup.add(mound);
    });

    // ==========================================
    // 7. LUSH FLOWERING BUSHES & RHODODENDRONS
    // Native Himalayan flora blooming in the grass
    // ==========================================
    const bushMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.9,
      flatShading: true,
    });
    const rhododendronFlowerMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // Radiant Himalayan crimson/pink rhododendron
      roughness: 0.6,
    });
    const marigoldFlowerMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Saffron marigold orange
      roughness: 0.5,
    });

    const createFloweringShrub = (bx: number, bz: number, flowerType: 'rhodo' | 'marigold') => {
      const shrubGroup = new THREE.Group();
      // Foliage cluster
      for (let i = 0; i < 4; i++) {
        const leafBall = new THREE.Mesh(new THREE.SphereGeometry(0.55 - i * 0.08, 7, 6), bushMat);
        leafBall.position.set(
          Math.sin(i * 1.6) * 0.35,
          0.35 + i * 0.12,
          Math.cos(i * 1.6) * 0.35
        );
        shrubGroup.add(leafBall);
      }

      // Blossoms
      const flMat = flowerType === 'rhodo' ? rhododendronFlowerMat : marigoldFlowerMat;
      for (let f = 0; f < 6; f++) {
        const flower = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 5), flMat);
        const fa = (f / 6) * Math.PI * 2;
        flower.position.set(Math.cos(fa) * 0.45, 0.5 + (f % 2) * 0.15, Math.sin(fa) * 0.45);
        shrubGroup.add(flower);
      }

      shrubGroup.position.set(bx, 0, bz);
      envGroup.add(shrubGroup);
    };

    // Plant lush flowering bushes along the edges of the ceremonial path and grounds
    createFloweringShrub(-4.2, 8.5, 'marigold');
    createFloweringShrub(4.2, 8.5, 'marigold');
    createFloweringShrub(-4.5, 12.0, 'rhodo');
    createFloweringShrub(4.5, 12.0, 'rhodo');
    createFloweringShrub(-7.0, 5.0, 'marigold');
    createFloweringShrub(7.0, 5.0, 'rhodo');
    createFloweringShrub(-6.5, -4.0, 'rhodo');
    createFloweringShrub(6.5, -4.0, 'marigold');

    // ==========================================
    // 8. WEATHERED MOSS-COVERED BOULDERS
    // ==========================================
    const boulderMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
      flatShading: true,
    });
    const mossMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Moss green cap on rocks
      roughness: 0.85,
    });

    const boulderCount = 18;
    for (let b = 0; b < boulderCount; b++) {
      const bAngle = (b / boulderCount) * Math.PI * 2;
      // Keep ceremonial entrance clear (approx. angle 1.2 to 1.9)
      if (bAngle > 1.2 && bAngle < 1.9) continue;

      const bDist = 20.5 + (b % 4) * 1.5;
      const bx = Math.cos(bAngle) * bDist;
      const bz = Math.sin(bAngle) * bDist;
      const bScale = 1.4 + (b % 3) * 0.8;

      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(bScale, 1), boulderMat);
      rock.position.set(bx, 0.4 + bScale * 0.25, bz);
      rock.rotation.set((b * 0.5) % 3, (b * 0.8) % 3, (b * 0.2) % 3);
      rock.castShadow = true;
      rock.receiveShadow = true;
      envGroup.add(rock);

      // Velvet moss cap on top of boulder
      const mossCap = new THREE.Mesh(new THREE.SphereGeometry(bScale * 0.65, 7, 5), mossMat);
      mossCap.scale.set(1.0, 0.35, 1.0);
      mossCap.position.set(bx, 0.4 + bScale * 0.85, bz);
      envGroup.add(mossCap);
    }

    // ==========================================
    // 9. LUSH HIMALAYAN DEODAR CEDAR & PINE TREES
    // Vibrant deep forest greens framing the panoramic summit
    // ==========================================
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e1e, roughness: 0.9 });
    const pineGreenMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85, flatShading: true });
    const pineGreenMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.88, flatShading: true });

    const createPineTree = (tx: number, tz: number, scale: number = 1.0, isDarker = false) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.32 * scale, 3.4 * scale, 7), trunkMat);
      trunk.position.y = 1.7 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const folMat = isDarker ? pineGreenMat2 : pineGreenMat1;
      for (let f = 0; f < 5; f++) {
        const fR = (2.0 - f * 0.35) * scale;
        const fH = (2.3 - f * 0.2) * scale;
        const foliage = new THREE.Mesh(new THREE.ConeGeometry(fR, fH, 7), folMat);
        foliage.position.y = (2.6 + f * 1.35) * scale;
        foliage.castShadow = true;
        tree.add(foliage);
      }

      tree.position.set(tx, 0, tz);
      envGroup.add(tree);
    };

    // Framing trees left
    createPineTree(-17, 6, 1.4, false);
    createPineTree(-18, -3, 1.6, true);
    createPineTree(-15, -11, 1.3, false);
    createPineTree(-17, 13, 1.2, true);

    // Framing trees right
    createPineTree(17, 6, 1.5, true);
    createPineTree(18, -3, 1.7, false);
    createPineTree(15, -11, 1.3, true);
    createPineTree(17, 13, 1.1, false);

    // Behind temple
    createPineTree(-8, -18, 1.5, false);
    createPineTree(8, -18, 1.5, true);
    createPineTree(0, -20, 1.8, false);

    scene.add(envGroup);

    // ==========================================
    // 10. REAL-TIME PROCEDURAL DAY / NIGHT ENGINE
    // time01: 0.0 = Bright Mountain Day (Vivid Blue Sky), 1.0 = Peaceful Starry Night
    // ==========================================
    let lastRenderedTime = -1;

    const updateTimeOfDay = (
      time01: number,
      sunLight: THREE.DirectionalLight,
      hemiLight: THREE.HemisphereLight
    ) => {
      // Clamp between 0.0 and 1.0
      const t = Math.max(0, Math.min(1, time01));

      // 1. Calculate Celestial Sun Orbit
      // Day (t = 0): High in sky (y: 85, dist: 280)
      // Sunset (t = 0.5): Setting over western ridges (y: 12)
      // Night (t = 1.0): Below horizon (y: -40)
      const sunAngle = THREE.MathUtils.lerp(0.8, 3.4, t);
      const sunDist = 280;
      const sunX = Math.cos(sunAngle) * sunDist;
      const sunY = THREE.MathUtils.lerp(85, -45, t);
      const sunZ = Math.sin(sunAngle) * sunDist * 0.45;

      if (this.sunMesh) {
        this.sunMesh.position.set(sunX, sunY, sunZ);
        // Fade sun corona as it sets
        if (this.sunGlowSprite) {
          this.sunGlowSprite.material.opacity = Math.max(0, 1.0 - t * 1.3);
        }
      }

      sunLight.position.set(sunX * 0.2, Math.max(sunY * 0.5, 4), sunZ * 0.2);

      // 2. Determine Color States
      const daySun = new THREE.Color(0xfffbeb);
      const sunsetSun = new THREE.Color(0xfb923c);
      const nightSun = new THREE.Color(0x93c5fd);

      const curSunCol = new THREE.Color();
      if (t < 0.5) {
        curSunCol.lerpColors(daySun, sunsetSun, t * 2.0);
      } else {
        curSunCol.lerpColors(sunsetSun, nightSun, (t - 0.5) * 2.0);
      }
      sunLight.color.copy(curSunCol);
      sunLight.intensity = THREE.MathUtils.lerp(2.2, 0.25, t);

      // Hemisphere Ambient Lighting
      const dayHemiSky = new THREE.Color(0xdbeafe);
      const nightHemiSky = new THREE.Color(0x1e293b);
      hemiLight.color.lerpColors(dayHemiSky, nightHemiSky, t);

      const dayHemiGnd = new THREE.Color(0x166534);
      const nightHemiGnd = new THREE.Color(0x052e16);
      hemiLight.groundColor.lerpColors(dayHemiGnd, nightHemiGnd, t);
      hemiLight.intensity = THREE.MathUtils.lerp(1.25, 0.45, t);

      // Mountain Mist Fog (Clean blue during day, deep midnight at night)
      const dayFog = new THREE.Color(0xa5cff7);
      const nightFog = new THREE.Color(0x090f1d);
      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerpColors(dayFog, nightFog, t);
        scene.fog.density = THREE.MathUtils.lerp(0.0026, 0.0038, t);
      }

      // Valley Clouds
      const dayCloud = new THREE.Color(0xf0f9ff);
      const nightCloud = new THREE.Color(0x1e293b);
      const curCloud = new THREE.Color().lerpColors(dayCloud, nightCloud, t);
      this.cloudMeshes.forEach((c) => {
        if (c.material instanceof THREE.MeshStandardMaterial) {
          c.material.color.copy(curCloud);
        }
      });

      // Twilight Stars (Fade in as darkness falls)
      const starOpacity = Math.max(0, (t - 0.25) / 0.75);
      if (this.starsGroup && this.starsGroup.material instanceof THREE.PointsMaterial) {
        this.starsGroup.material.opacity = starOpacity;
      }

      // 3. Redraw Sky Canvas Texture (Only when time value changes significantly to preserve performance)
      if (
        this.skyTextureCanvas &&
        this.skyCanvasTexture &&
        Math.abs(t - lastRenderedTime) > 0.005
      ) {
        lastRenderedTime = t;
        const ctx = this.skyTextureCanvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 0, 512);

          // Interpolate sky stops
          const cZenith = new THREE.Color().lerpColors(
            new THREE.Color('#0284c7'), // Deep Himalayan azure blue
            new THREE.Color('#020617'), // Deep cosmic black-navy
            t
          );

          const cMid = new THREE.Color().lerpColors(
            new THREE.Color('#38bdf8'), // Cerulean sky blue
            new THREE.Color('#0b1329'), // Midnight navy
            t
          );

          const cHorizon = new THREE.Color().lerpColors(
            new THREE.Color('#bae6fd'), // Crisp mountain horizon blue
            new THREE.Color('#1e1b4b'), // Indigo horizon
            t
          );

          const cGround = new THREE.Color().lerpColors(
            new THREE.Color('#15803d'), // Lush valley green reflection
            new THREE.Color('#020617'), // Nocturnal valley
            t
          );

          // Canvas 0 is zenith, 256 is horizon, 512 is nadir
          grad.addColorStop(0.0, `#${cZenith.getHexString()}`);
          grad.addColorStop(0.28, `#${cMid.getHexString()}`);
          grad.addColorStop(0.50, `#${cHorizon.getHexString()}`);
          grad.addColorStop(0.70, `#${cGround.getHexString()}`);
          grad.addColorStop(1.0, `#${cGround.getHexString()}`);

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 32, 512);
          this.skyCanvasTexture.needsUpdate = true;
        }
      }
    };

    return { cloudMeshes: this.cloudMeshes, updateTimeOfDay };
  }
}
