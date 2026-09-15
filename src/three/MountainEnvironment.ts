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
    const grassNormalTex = TempleTextures.getLushAlpineGrassNormal();
    const mountainGreenTex = TempleTextures.getMountainGreenery();
    const mountainRockNormalTex = TempleTextures.getMountainRockNormal();
    const ashlarTexture = TempleTextures.getAshlarStone();
    const ashlarNormal = TempleTextures.getAshlarNormal();
    const sandstoneTexture = TempleTextures.getSandstone();
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
    // 5. MAJESTIC HIMALAYAN PEAK (REALISTIC LOOMING BACKGROUND MOUNTAIN)
    // Towering sacred peak behind the temple with sharp arêtes, glacial cirques,
    // snowfields, couloirs, and high-altitude summit mist
    // ==========================================
    const mountainRockTex = TempleTextures.getMountainRock();
    const mountainRockClone = mountainRockTex.clone();
    mountainRockClone.wrapS = THREE.RepeatWrapping;
    mountainRockClone.wrapT = THREE.RepeatWrapping;
    mountainRockClone.repeat.set(6, 3);
    mountainRockClone.needsUpdate = true;

    const mountainRockNormalClone = mountainRockNormalTex.clone();
    mountainRockNormalClone.wrapS = THREE.RepeatWrapping;
    mountainRockNormalClone.wrapT = THREE.RepeatWrapping;
    mountainRockNormalClone.repeat.set(6, 3);
    mountainRockNormalClone.needsUpdate = true;

    const mWidth = 440;
    const mDepth = 220;
    const mSegsX = 144;
    const mSegsZ = 80;
    const mountainGeo = new THREE.PlaneGeometry(mWidth, mDepth, mSegsX, mSegsZ);
    mountainGeo.rotateX(-Math.PI / 2);

    const mPos = mountainGeo.attributes.position;

    for (let i = 0; i < mPos.count; i++) {
      const lx = mPos.getX(i);
      const lz = mPos.getZ(i);

      // Central Mount Kailash / Dronagiri pyramid horn
      const d1 = Math.hypot(lx + 8, lz + 5);
      const ang1 = Math.atan2(lz + 5, lx + 8);
      // Arêtes: 4 sharp radiating knife-edge ridges
      const ridge1 = Math.pow(Math.max(0, Math.cos(ang1 - 0.45)), 3.5);
      const ridge2 = Math.pow(Math.max(0, Math.cos(ang1 - 2.15)), 3.5);
      const ridge3 = Math.pow(Math.max(0, Math.cos(ang1 + 1.15)), 3.2);
      const ridge4 = Math.pow(Math.max(0, Math.cos(ang1 + 2.65)), 3.2);
      const ridgeMult = 1.0 + (ridge1 + ridge2 + ridge3 + ridge4) * 0.55;
      const h1 = Math.max(0, 130 - d1 * 1.32) * ridgeMult;

      // Western shoulder massif
      const d2 = Math.hypot(lx + 75, lz - 15);
      const h2 = Math.max(0, 92 - d2 * 1.35);

      // Eastern ridge horn
      const d3 = Math.hypot(lx - 70, lz - 10);
      const h3 = Math.max(0, 86 - d3 * 1.35);

      // Far western buttress
      const d4 = Math.hypot(lx + 145, lz + 10);
      const h4 = Math.max(0, 68 - d4 * 1.25);

      // Far eastern buttress
      const d5 = Math.hypot(lx - 140, lz + 15);
      const h5 = Math.max(0, 65 - d5 * 1.25);

      let y = Math.max(h1, Math.max(h2, Math.max(h3, Math.max(h4, h5))));

      // Multi-octave rock crag noise and couloirs
      if (y > 2) {
        const n1 = Math.sin(lx * 0.075 + lz * 0.055) * Math.cos(lx * 0.048 - lz * 0.085) * 8.5;
        const n2 = Math.sin(lx * 0.20 - lz * 0.16) * 3.4;
        const n3 = Math.cos(lx * 0.50 + lz * 0.38) * 1.2;
        // Couloirs (vertical glacial erosion chutes)
        const couloir = Math.sin(ang1 * 6 + y * 0.13) * (y > 35 ? 2.8 : 0.9);
        y += n1 + n2 + n3 - couloir;
      }

      // Edge taper so it fades smoothly into the valley cloud sea
      const edgeFactorX = Math.max(0, 1.0 - Math.pow(Math.abs(lx) / (mWidth * 0.48), 3));
      const edgeFactorZ = Math.max(0, 1.0 - Math.pow(Math.abs(lz) / (mDepth * 0.48), 3));
      y = y * edgeFactorX * edgeFactorZ - 20;

      mPos.setY(i, y);
    }

    mPos.needsUpdate = true;
    mountainGeo.computeVertexNormals();

    const mNormals = mountainGeo.attributes.normal;
    const mColors = new Float32Array(mPos.count * 3);

    for (let i = 0; i < mPos.count; i++) {
      const y = mPos.getY(i);
      const ny = mNormals.getY(i);
      const nx = mNormals.getX(i);
      const nz = mNormals.getZ(i);

      // Snow accumulation based on elevation and slope
      const snowHeightFactor = THREE.MathUtils.clamp((y - 30) / 65, 0, 1);
      const snowSlopeFactor = THREE.MathUtils.clamp((ny - 0.22) / 0.42, 0, 1);
      let snowCoverage = snowHeightFactor * (0.35 + 0.65 * snowSlopeFactor);
      if (y > 95) {
        snowCoverage = Math.max(snowCoverage, THREE.MathUtils.clamp((y - 95) / 25, 0, 1) * 0.92);
      }

      // Base rock shading (transition from dark slate scree to high granite crags)
      const altFactor = THREE.MathUtils.clamp((y + 15) / 75, 0, 1);
      const rockR = THREE.MathUtils.lerp(0.20, 0.42, altFactor);
      const rockG = THREE.MathUtils.lerp(0.25, 0.45, altFactor);
      const rockB = THREE.MathUtils.lerp(0.22, 0.52, altFactor);

      // Morning Himalayan sun alpenglow catch
      const sunCatch = Math.max(0, (nx * 0.6 + nz * 0.4) * 0.14);

      // Cold blue ice shadow in crevasses
      const iceShadow = Math.max(0, -nx * 0.08);

      const finalR = THREE.MathUtils.lerp(rockR, 0.95, snowCoverage) + sunCatch;
      const finalG = THREE.MathUtils.lerp(rockG, 0.97, snowCoverage) + sunCatch * 0.92;
      const finalB = THREE.MathUtils.lerp(rockB, 1.00, snowCoverage) + sunCatch * 0.82 + iceShadow;

      mColors[i * 3] = THREE.MathUtils.clamp(finalR, 0, 1);
      mColors[i * 3 + 1] = THREE.MathUtils.clamp(finalG, 0, 1);
      mColors[i * 3 + 2] = THREE.MathUtils.clamp(finalB, 0, 1);
    }

    mountainGeo.setAttribute('color', new THREE.BufferAttribute(mColors, 3));

    const mountainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: mountainRockClone,
      normalMap: mountainRockNormalClone,
      normalScale: new THREE.Vector2(1.15, 1.15),
      roughness: 0.86,
      metalness: 0.02,
    });

    const mountainMesh = new THREE.Mesh(mountainGeo, mountainMat);
    // Positioned directly behind the temple in the distant northern horizon
    mountainMesh.position.set(-12, -4, -195);
    envGroup.add(mountainMesh);

    // ==========================================
    // 6. MOUNTAINTOP CLIFF & LUSH GREEN PLATEAU MEADOW
    // High-resolution smooth surfaces with tangent-space normal mapping
    // ==========================================

    // Cliff rock base: openEnded cylinder strictly BELOW the grass carpet (y < -1.0)
    const cliffBase = new THREE.Mesh(
      new THREE.CylinderGeometry(26.4, 37.0, 16.0, 48, 4, true),
      new THREE.MeshStandardMaterial({
        map: mountainRockTex,
        normalMap: mountainRockNormalTex,
        normalScale: new THREE.Vector2(1.1, 1.1),
        color: 0x475569,
        roughness: 0.92,
      })
    );
    cliffBase.position.set(0, -9.0, 0);
    envGroup.add(cliffBase);

    // LUSH GREEN ALPINE GRASS CARPET (High-resolution normal mapped meadow)
    const plateauGrass = new THREE.Mesh(
      new THREE.CylinderGeometry(26.6, 26.6, 1.0, 64),
      new THREE.MeshStandardMaterial({
        map: grassTex,
        normalMap: grassNormalTex,
        normalScale: new THREE.Vector2(0.9, 0.9),
        color: 0x3b9b5a, // Natural Himalayan alpine meadow green
        roughness: 0.82,
        metalness: 0.01,
      })
    );
    plateauGrass.position.set(0, -0.5, 0);
    plateauGrass.receiveShadow = true;
    envGroup.add(plateauGrass);

    // Lush Organic Grass Mounds around the plateau edge (High polygon smoothness: 36 x 24)
    const grassMoundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      normalMap: grassNormalTex,
      normalScale: new THREE.Vector2(0.85, 0.85),
      color: 0x348b50,
      roughness: 0.84,
      metalness: 0.01,
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
        new THREE.SphereGeometry(mr, 36, 24),
        grassMoundMat
      );
      mound.scale.set(1.0, 0.22, 1.0);
      mound.position.set(mx, my, mz);
      mound.receiveShadow = true;
      envGroup.add(mound);
    });

    // ==========================================
    // 7. REALISTIC HIMALAYAN TREE SPECIFICATIONS (Matching Reference Images)
    // - 'broadleaf': Lush sacred canopy trees with thick gnarled trunks & volumetric leaf clusters (Screenshot 1)
    // - 'cedar': Realistic branching timber trees with tiered foliage pads (Screenshot 2)
    // ==========================================
    interface RealisticTreeSpec {
      x: number;
      z: number;
      scale: number;
      treeType: 'broadleaf' | 'cedar';
      fullness: number; // 0.85 (airy) to 1.35 (thick, lush canopy)
      tiltAngle: number;
      tiltDir?: number;
      colorHex: number; // unique evergreen hue
      hasRoots?: boolean;
    }

    const treeSpecs: RealisticTreeSpec[] = [
      // Left Flank
      { x: -17, z: 6, scale: 1.55, treeType: 'broadleaf', fullness: 1.35, tiltAngle: 0.04, tiltDir: 0.3, colorHex: 0x226338, hasRoots: true },
      { x: -18, z: -3, scale: 1.7, treeType: 'cedar', fullness: 1.0, tiltAngle: -0.05, tiltDir: -0.4, colorHex: 0x276b50, hasRoots: false },
      { x: -15, z: -11, scale: 1.4, treeType: 'cedar', fullness: 1.25, tiltAngle: 0.03, tiltDir: 0.1, colorHex: 0x2f7d45, hasRoots: true },
      { x: -17, z: 13, scale: 1.25, treeType: 'cedar', fullness: 0.9, tiltAngle: -0.04, tiltDir: -0.2, colorHex: 0x3a884e, hasRoots: false },
      { x: -11, z: 17, scale: 1.2, treeType: 'broadleaf', fullness: 1.15, tiltAngle: 0.05, tiltDir: 0.5, colorHex: 0x2b7642, hasRoots: true },

      // Right Flank
      { x: 17, z: 6, scale: 1.6, treeType: 'broadleaf', fullness: 1.35, tiltAngle: -0.04, tiltDir: -0.3, colorHex: 0x1e5a32, hasRoots: true },
      { x: 18, z: -3, scale: 1.75, treeType: 'cedar', fullness: 1.1, tiltAngle: 0.05, tiltDir: 0.4, colorHex: 0x286e54, hasRoots: false },
      { x: 15, z: -11, scale: 1.45, treeType: 'cedar', fullness: 1.2, tiltAngle: -0.03, tiltDir: -0.2, colorHex: 0x317c46, hasRoots: true },
      { x: 17, z: 13, scale: 1.2, treeType: 'cedar', fullness: 0.9, tiltAngle: 0.04, tiltDir: 0.3, colorHex: 0x39864b, hasRoots: false },
      { x: 11, z: 17, scale: 1.2, treeType: 'broadleaf', fullness: 1.15, tiltAngle: -0.04, tiltDir: -0.5, colorHex: 0x2c7743, hasRoots: true },

      // Behind Temple Ridge Sentinels
      { x: -8, z: -18, scale: 1.6, treeType: 'cedar', fullness: 1.15, tiltAngle: 0.03, tiltDir: 0.1, colorHex: 0x1f5b33, hasRoots: false },
      { x: 8, z: -18, scale: 1.6, treeType: 'cedar', fullness: 1.2, tiltAngle: -0.04, tiltDir: -0.2, colorHex: 0x2a7241, hasRoots: false },
      { x: 0, z: -21.5, scale: 2.0, treeType: 'broadleaf', fullness: 1.4, tiltAngle: 0.02, tiltDir: 0.0, colorHex: 0x1b552d, hasRoots: true },
    ];

    // ==========================================
    // 9. FULLY ENCLOSED DRESSED STONE TEMPLE PARAPET (Prakara Boundary)
    // Fully enclosed seamless hand-hewn ashlar balustrade at the absolute edge of the
    // map (radius 26.0) safely behind all trees. Zero gaps, zero low-poly spikes/triangles.
    // ==========================================
    const parapetWallMat = new THREE.MeshStandardMaterial({
      map: ashlarTexture,
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.75, 0.75),
      color: 0x992424, // Terracotta red ashlar stone, identical to temple plinth & curbs
      roughness: 0.76,
      metalness: 0.04,
    });

    const parapetCopingMat = new THREE.MeshStandardMaterial({
      map: sandstoneTexture,
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.55, 0.55),
      color: 0xd97706, // Warm ochre sandstone coping slab
      roughness: 0.72,
      metalness: 0.03,
    });

    const parapetRadius = 26.0;
    const numSegments = 48;
    const dAngle = (Math.PI * 2) / numSegments;
    const chordLen = 2 * parapetRadius * Math.sin(dAngle / 2);
    const wallHeight = 0.62;
    const wallThick = 0.42;
    const copingHeight = 0.12;
    const copingThick = 0.50;
    const pierWidth = 0.52;
    const pierHeight = 0.72;

    // Shared geometries for optimal rendering performance
    const wallSectionGeo = new THREE.BoxGeometry(wallThick, wallHeight, chordLen * 1.01);
    const copingSectionGeo = new THREE.BoxGeometry(copingThick, copingHeight, chordLen * 1.03);
    const pierGeo = new THREE.BoxGeometry(pierWidth, pierHeight, pierWidth);
    const pierCapGeo = new THREE.BoxGeometry(pierWidth * 1.15, 0.08, pierWidth * 1.15);

    for (let i = 0; i < numSegments; i++) {
      const segAngle = i * dAngle + dAngle / 2;
      const midX = Math.cos(segAngle) * parapetRadius;
      const midZ = Math.sin(segAngle) * parapetRadius;

      // Fully enclosed continuous wall body (no gaps)
      const wall = new THREE.Mesh(wallSectionGeo, parapetWallMat);
      wall.position.set(midX, wallHeight / 2, midZ);
      wall.rotation.y = -segAngle;
      wall.castShadow = true;
      wall.receiveShadow = true;
      envGroup.add(wall);

      // Smooth flat beveled stone coping slab
      const coping = new THREE.Mesh(copingSectionGeo, parapetCopingMat);
      coping.position.set(midX, wallHeight + copingHeight / 2, midZ);
      coping.rotation.y = -segAngle;
      coping.castShadow = true;
      coping.receiveShadow = true;
      envGroup.add(coping);

      // Node junction piers with flat-topped beveled caps
      const jAngle = i * dAngle;
      const jX = Math.cos(jAngle) * parapetRadius;
      const jZ = Math.sin(jAngle) * parapetRadius;

      const pier = new THREE.Mesh(pierGeo, parapetWallMat);
      pier.position.set(jX, pierHeight / 2, jZ);
      pier.rotation.y = -jAngle;
      pier.castShadow = true;
      pier.receiveShadow = true;
      envGroup.add(pier);

      const pierCap = new THREE.Mesh(pierCapGeo, parapetCopingMat);
      pierCap.position.set(jX, pierHeight + 0.04, jZ);
      pierCap.rotation.y = -jAngle;
      pierCap.castShadow = true;
      pierCap.receiveShadow = true;
      envGroup.add(pierCap);
    }

    // ==========================================
    // 10. PHOTOREALISTIC HIMALAYAN TREE ENGINE (Matching Reference Images)
    // - 'broadleaf': Lush sacred canopy trees with thick gnarled trunks & volumetric leaf cards (Screenshot 1)
    // - 'cedar': Realistic branching timber trees with tiered foliage pads (Screenshot 2)
    // ==========================================
    const deodarBarkTex = TempleTextures.getDeodarBarkTexture();
    const deodarBarkNormal = TempleTextures.getDeodarBarkNormal();
    const realisticLeafTex = TempleTextures.getRealisticLeafClumpTexture();
    const realisticPineTex = TempleTextures.getRealisticPineLeafClumpTexture();

    const deodarBarkMat = new THREE.MeshStandardMaterial({
      map: deodarBarkTex,
      normalMap: deodarBarkNormal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.9,
      metalness: 0.02,
    });

    /**
     * Helper to construct an organic, volumetric foliage cluster
     * using multi-angle intersecting alpha leaf cards
     */
    const addVolumetricLeafClump = (
      parent: THREE.Group,
      lx: number,
      ly: number,
      lz: number,
      radius: number,
      mat: THREE.Material
    ) => {
      const clump = new THREE.Group();
      clump.position.set(lx, ly, lz);
      const cardSize = radius * 2.1;

      // 3 vertical crossed leaf-cards at 60 degree intervals
      for (let i = 0; i < 3; i++) {
        const card = new THREE.Mesh(new THREE.PlaneGeometry(cardSize, cardSize), mat);
        card.rotation.y = (i * Math.PI) / 3 + (Math.random() - 0.5) * 0.2;
        card.castShadow = true;
        card.receiveShadow = true;
        clump.add(card);
      }

      // 2 diagonal tilted cards (catching directional and ambient mountain light)
      const tilt1 = new THREE.Mesh(new THREE.PlaneGeometry(cardSize * 0.92, cardSize * 0.92), mat);
      tilt1.rotation.set(0.68, 0.45, 0.2);
      tilt1.position.y = radius * 0.12;
      tilt1.castShadow = true;
      tilt1.receiveShadow = true;
      clump.add(tilt1);

      const tilt2 = new THREE.Mesh(new THREE.PlaneGeometry(cardSize * 0.92, cardSize * 0.92), mat);
      tilt2.rotation.set(-0.68, -0.45, -0.2);
      tilt2.position.y = radius * 0.12;
      tilt2.castShadow = true;
      tilt2.receiveShadow = true;
      clump.add(tilt2);

      // Top sun-catching dome cap card (oriented near-horizontal to catch overhead sunlight)
      const topCap = new THREE.Mesh(new THREE.PlaneGeometry(cardSize * 0.88, cardSize * 0.88), mat);
      topCap.rotation.set(Math.PI * 0.46, 0, Math.random() * Math.PI);
      topCap.position.y = radius * 0.32;
      topCap.castShadow = true;
      topCap.receiveShadow = true;
      clump.add(topCap);

      parent.add(clump);
    };

    /**
     * 1. Sacred Broadleaf Canopy Tree (Screenshot 1)
     * - Thick gnarled trunk with prominent buttress roots
     * - Multiple major timber boughs splitting upward and outward
     * - Volumetric canopy of individual veined leaf clusters forming a lush dome
     */
    const createBroadleafTree = (spec: RealisticTreeSpec) => {
      const tree = new THREE.Group();
      const { scale, fullness, tiltAngle } = spec;
      const tiltDir = spec.tiltDir || 0;

      const leafMat = new THREE.MeshStandardMaterial({
        map: realisticLeafTex,
        color: spec.colorHex,
        alphaTest: 0.42,
        transparent: false,
        depthWrite: true,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
        roughness: 0.72,
        metalness: 0.02,
      });

      // 1. Thick, gnarled timber trunk with organic taper
      const baseR = (0.55 + fullness * 0.18) * scale;
      const midR = (0.42 + fullness * 0.12) * scale;
      const trunkH = (2.6 + fullness * 0.5) * scale;

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(midR, baseR, trunkH, 10),
        deodarBarkMat
      );
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      // Flaring buttress roots grounding the trunk into the earth (Screenshot 1)
      if (spec.hasRoots) {
        const rootCount = 5;
        for (let r = 0; r < rootCount; r++) {
          const rAng = (r / rootCount) * Math.PI * 2 + spec.scale * 1.8;
          const rootLen = (1.2 + fullness * 0.5) * scale;
          const root = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08 * scale, (0.28 + fullness * 0.08) * scale, rootLen, 7),
            deodarBarkMat
          );
          root.position.set(
            Math.cos(rAng) * (baseR * 0.65 + rootLen * 0.38),
            0.15 * scale,
            Math.sin(rAng) * (baseR * 0.65 + rootLen * 0.38)
          );
          root.rotation.z = Math.cos(rAng) * 0.72;
          root.rotation.x = -Math.sin(rAng) * 0.72;
          root.rotation.y = rAng;
          root.castShadow = true;
          root.receiveShadow = true;
          tree.add(root);
        }
      }

      // 2. Primary spreading timber limbs branching out from trunk apex
      const limbCount = 6;
      const primaryLimbs: THREE.Group[] = [];

      for (let i = 0; i < limbCount; i++) {
        const limbAng = (i / limbCount) * Math.PI * 2 + (i % 2) * 0.3;
        const limbLen = (2.6 + (i % 3) * 0.45 + fullness * 0.4) * scale;
        const limbBaseR = (0.22 + fullness * 0.05) * scale;
        const limbTipR = (0.11 + fullness * 0.03) * scale;

        const limbGroup = new THREE.Group();
        limbGroup.position.set(0, trunkH - 0.25 * scale, 0);
        limbGroup.rotation.y = limbAng;
        limbGroup.rotation.z = -0.78 - (i % 2) * 0.12; // Outward angle ~45-52 deg

        const limbMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(limbTipR, limbBaseR, limbLen, 7),
          deodarBarkMat
        );
        limbMesh.position.y = limbLen / 2;
        limbMesh.castShadow = true;
        limbMesh.receiveShadow = true;
        limbGroup.add(limbMesh);

        // Secondary fork branching upward into the canopy
        const forkLen = (1.3 + (i % 2) * 0.25) * scale;
        const forkGroup = new THREE.Group();
        forkGroup.position.set(0, limbLen * 0.52, 0);
        forkGroup.rotation.z = 0.42; // diverging angle upward
        forkGroup.rotation.y = 0.4;

        const forkMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09 * scale, 0.14 * scale, forkLen, 6),
          deodarBarkMat
        );
        forkMesh.position.y = forkLen / 2;
        forkMesh.castShadow = true;
        forkMesh.receiveShadow = true;
        forkGroup.add(forkMesh);

        // Add foliage cluster firmly anchored to the secondary fork
        addVolumetricLeafClump(forkGroup, 0, forkLen * 0.85, 0, (1.25 + fullness * 0.25) * scale, leafMat);
        limbGroup.add(forkGroup);

        // Foliage cluster along main limb (firmly enveloped around timber bough)
        addVolumetricLeafClump(limbGroup, 0, limbLen * 0.62, 0, (1.25 + fullness * 0.25) * scale, leafMat);
        // Foliage cluster at main limb tip
        addVolumetricLeafClump(limbGroup, 0, limbLen * 0.95, 0, (1.35 + fullness * 0.28) * scale, leafMat);

        // Drooping lower outer foliage cluster directly attached to limb timber (replacing floating unanchored coordinates)
        addVolumetricLeafClump(limbGroup, 0, limbLen * 0.78, 0.2 * scale, (1.2 + fullness * 0.22) * scale, leafMat);

        tree.add(limbGroup);
        primaryLimbs.push(limbGroup);
      }

      // 3. Central Crown Dome Clusters (anchored immediately above trunk apex and bough junctions)
      const crownHeights = [
        { y: trunkH + 0.6 * scale, r: (1.45 + fullness * 0.3) * scale, count: 4, spread: 0.85 * scale },
        { y: trunkH + 1.4 * scale, r: (1.35 + fullness * 0.25) * scale, count: 3, spread: 0.65 * scale },
        { y: trunkH + 2.2 * scale, r: (1.25 + fullness * 0.2) * scale, count: 1, spread: 0.0 },
      ];

      crownHeights.forEach((ch) => {
        for (let c = 0; c < ch.count; c++) {
          const ang = (c / ch.count) * Math.PI * 2 + ch.y;
          const cx = Math.cos(ang) * ch.spread;
          const cz = Math.sin(ang) * ch.spread;
          addVolumetricLeafClump(tree, cx, ch.y, cz, ch.r, leafMat);
        }
      });

      // Tree overall placement & subtle lean
      tree.position.set(spec.x, 0, spec.z);
      tree.rotation.z = -Math.cos(tiltDir) * tiltAngle;
      tree.rotation.x = Math.sin(tiltDir) * tiltAngle;
      envGroup.add(tree);
    };

    /**
     * 2. Himalayan Branching Cedar / Conifer Tree (Screenshot 2)
     * - Stately timber trunk with vertical bark fissures
     * - Distinct horizontal and gently drooping structural timber branches
     * - Layered horizontal foliage cards with authentic alpha leaf/needle cutouts
     */
    const createBranchingCedarTree = (spec: RealisticTreeSpec) => {
      const tree = new THREE.Group();
      const { scale, fullness, tiltAngle } = spec;
      const tiltDir = spec.tiltDir || 0;

      const pineMat = new THREE.MeshStandardMaterial({
        map: realisticPineTex,
        color: spec.colorHex,
        alphaTest: 0.42,
        transparent: false,
        depthWrite: true,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
        roughness: 0.76,
        metalness: 0.02,
      });

      // 1. Tall timber trunk with natural taper (height 9-12m)
      const trunkBaseR = (0.34 + fullness * 0.1) * scale;
      const trunkMidR = (0.22 + fullness * 0.06) * scale;
      const trunkTopR = (0.08 + fullness * 0.03) * scale;

      const trunkH1 = (3.2 + fullness * 0.4) * scale;
      const trunk1 = new THREE.Mesh(
        new THREE.CylinderGeometry(trunkMidR, trunkBaseR, trunkH1, 8),
        deodarBarkMat
      );
      trunk1.position.y = trunkH1 / 2;
      trunk1.castShadow = true;
      trunk1.receiveShadow = true;
      tree.add(trunk1);

      const trunkH2 = (5.6 + fullness * 0.8) * scale;
      const trunk2 = new THREE.Mesh(
        new THREE.CylinderGeometry(trunkTopR, trunkMidR, trunkH2, 8),
        deodarBarkMat
      );
      const leanX = Math.cos(tiltDir) * Math.sin(tiltAngle) * (trunkH2 * 0.4);
      const leanZ = Math.sin(tiltDir) * Math.sin(tiltAngle) * (trunkH2 * 0.4);
      trunk2.position.set(leanX, trunkH1 + trunkH2 / 2 - 0.1 * scale, leanZ);
      trunk2.rotation.z = -Math.cos(tiltDir) * tiltAngle;
      trunk2.rotation.x = Math.sin(tiltDir) * tiltAngle;
      trunk2.castShadow = true;
      trunk2.receiveShadow = true;
      tree.add(trunk2);

      // Flared anchoring roots
      if (spec.hasRoots) {
        const rootCount = 4;
        for (let r = 0; r < rootCount; r++) {
          const rAng = (r / rootCount) * Math.PI * 2 + spec.scale * 2.0;
          const rootLen = (0.95 + fullness * 0.4) * scale;
          const root = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06 * scale, (0.22 + fullness * 0.06) * scale, rootLen, 6),
            deodarBarkMat
          );
          root.position.set(
            Math.cos(rAng) * (trunkBaseR * 0.7 + rootLen * 0.38),
            0.12 * scale,
            Math.sin(rAng) * (trunkBaseR * 0.7 + rootLen * 0.38)
          );
          root.rotation.z = Math.cos(rAng) * 0.68;
          root.rotation.x = -Math.sin(rAng) * 0.68;
          root.rotation.y = rAng;
          root.castShadow = true;
          root.receiveShadow = true;
          tree.add(root);
        }
      }

      // 2. Layered horizontal timber boughs radiating from trunk (Screenshot 2)
      const branchCount = fullness >= 1.2 ? 11 : 9;
      const startY = 1.9 * scale;
      const totalBranchH = (trunkH1 + trunkH2 - startY - 0.8 * scale);

      for (let b = 0; b < branchCount; b++) {
        const p = b / (branchCount - 1);
        const branchY = startY + p * totalBranchH;
        // Golden ratio spiral rotation for natural branching spread
        const branchAng = b * 2.4 + fullness;
        const branchLen = (3.2 - p * 1.7 + fullness * 0.5) * scale;
        const bBaseR = (0.15 - p * 0.07) * scale;
        const bTipR = (0.05 - p * 0.02) * scale;

        // Anchor at trunk center with lean interpolation
        const anchorX = Math.cos(tiltDir) * Math.sin(tiltAngle) * (branchY * 0.4);
        const anchorZ = Math.sin(tiltDir) * Math.sin(tiltAngle) * (branchY * 0.4);

        const branchGroup = new THREE.Group();
        branchGroup.position.set(anchorX, branchY, anchorZ);
        branchGroup.rotation.y = branchAng;
        // Horizontal with organic droop at lower tiers
        branchGroup.rotation.z = -1.48 - (1 - p) * 0.12;

        const branchMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(bTipR, bBaseR, branchLen, 7),
          deodarBarkMat
        );
        branchMesh.position.y = branchLen / 2;
        branchMesh.castShadow = true;
        branchMesh.receiveShadow = true;
        branchGroup.add(branchMesh);

        // Tiered conifer foliage pads along the horizontal bough (Screenshot 2)
        // Generously nested along the timber bough, enveloping it with lush needle sprays and zero bare hanging lines
        addVolumetricLeafClump(branchGroup, 0, branchLen * 0.45, 0, (1.05 + fullness * 0.25) * scale, pineMat);
        addVolumetricLeafClump(branchGroup, 0, branchLen * 0.78, 0, (1.15 + fullness * 0.28) * scale, pineMat);
        addVolumetricLeafClump(branchGroup, 0, branchLen * 1.02, 0, (1.2 + fullness * 0.3) * scale, pineMat);

        tree.add(branchGroup);
      }

      // 3. Slender apical conifer shoot at top (Screenshot 2)
      const topY = trunkH1 + trunkH2 + 0.3 * scale;
      const topLeanX = Math.cos(tiltDir) * Math.sin(tiltAngle) * (topY * 0.4);
      const topLeanZ = Math.sin(tiltDir) * Math.sin(tiltAngle) * (topY * 0.4);
      addVolumetricLeafClump(tree, topLeanX, topY, topLeanZ, (0.8 + fullness * 0.2) * scale, pineMat);

      tree.position.set(spec.x, 0, spec.z);
      envGroup.add(tree);
    };

    // Instantiate trees based on their individual species specification
    treeSpecs.forEach((spec) => {
      if (spec.treeType === 'broadleaf') {
        createBroadleafTree(spec);
      } else {
        createBranchingCedarTree(spec);
      }
    });

    // ==========================================
    // 10. 3D INSTANCED ALPINE GRASS TUFTS (1 Single Draw Call!)
    // High-density volumetric mountain ground cover with 3 intersecting cards (60° apart)
    // ==========================================
    const grassTuftTex = TempleTextures.getGrassTuftTexture();
    const grassTuftMat = new THREE.MeshStandardMaterial({
      map: grassTuftTex,
      alphaTest: 0.42,
      transparent: false,
      roughness: 0.82,
      metalness: 0.01,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });

    // Build 3-way crossed planes geometry for grass tuft (12 vertices total)
    const p1 = new THREE.PlaneGeometry(0.85, 0.68);
    p1.translate(0, 0.34, 0);
    const p2 = p1.clone();
    p2.rotateY(Math.PI / 3);
    const p3 = p1.clone();
    p3.rotateY((2 * Math.PI) / 3);

    const pos1 = p1.attributes.position.array;
    const uv1 = p1.attributes.uv.array;
    const idx1 = p1.index!.array;

    const combPos = new Float32Array(pos1.length * 3);
    combPos.set(pos1, 0);
    combPos.set(p2.attributes.position.array, pos1.length);
    combPos.set(p3.attributes.position.array, pos1.length * 2);

    const combUV = new Float32Array(uv1.length * 3);
    combUV.set(uv1, 0);
    combUV.set(p2.attributes.uv.array, uv1.length);
    combUV.set(p3.attributes.uv.array, uv1.length * 2);

    const combIdx = new Uint16Array(idx1.length * 3);
    combIdx.set(idx1, 0);
    for (let j = 0; j < idx1.length; j++) {
      combIdx[idx1.length + j] = idx1[j] + 4;
      combIdx[idx1.length * 2 + j] = idx1[j] + 8;
    }

    const tuftGeo = new THREE.BufferGeometry();
    tuftGeo.setAttribute('position', new THREE.BufferAttribute(combPos, 3));
    tuftGeo.setAttribute('uv', new THREE.BufferAttribute(combUV, 2));
    tuftGeo.setIndex(new THREE.BufferAttribute(combIdx, 1));
    tuftGeo.computeVertexNormals();

    const tuftCount = 800;
    const instancedGrass = new THREE.InstancedMesh(tuftGeo, grassTuftMat, tuftCount);
    instancedGrass.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const colorA = new THREE.Color(0x16a34a); // Vivid alpine green
    const colorB = new THREE.Color(0x15803d); // Rich meadow green
    const colorC = new THREE.Color(0x65a30d); // Sunlit lime grass
    const curColor = new THREE.Color();

    // Helper to ensure grass tufts never encroach on or grow on top of the paved flagstone walkway, steps, or plinth
    const isExcludedZone = (x: number, z: number): boolean => {
      // 1. Walkway, curbs & approach corridor: walkway is x: [-2.4, 2.4], z: [5.5, 15.5].
      // With curb (±2.6) and tuft geometry width (0.75m), keep buffer |x| < 3.5 from z: 3.5 to 17.5
      if (Math.abs(x) < 3.5 && z >= 3.5 && z <= 17.5) {
        return true;
      }
      // 2. Temple steps, plinth, and sanctum structure
      if (Math.abs(x) < 6.8 && z >= -11.5 && z < 5.5) {
        return true;
      }
      // 3. Ceremonial Deepastambha lamp pillars at (±3.2, 13.5)
      if (Math.hypot(Math.abs(x) - 3.2, z - 13.5) < 1.8) {
        return true;
      }
      // 4. Plateau edge boundary & parapet wall (keep grass tufts inside the terrace balustrade)
      if (Math.hypot(x, z) > 25.5) {
        return true;
      }
      return false;
    };

    for (let i = 0; i < tuftCount; i++) {
      let gx = 0;
      let gz = 0;
      let placed = false;

      for (let attempt = 0; attempt < 35; attempt++) {
        if (i < 180) {
          // Flanking safely on the lawn beyond walkway curbs (|x| >= 3.6)
          const side = i % 2 === 0 ? -1 : 1;
          gx = side * (3.8 + Math.random() * 3.5);
          gz = 5.0 + Math.random() * 11.5;
        } else if (i < 300) {
          // Courtyard flanks outside the temple plinth (|x| >= 7.2)
          const side = i % 2 === 0 ? -1 : 1;
          gx = side * (7.2 + Math.random() * 4.5);
          gz = -6.0 + Math.random() * 11.0;
        } else if (i < 480) {
          // Surrounding the Deodar trees and rock boulders
          const treeX = (i % 2 === 0 ? -1 : 1) * (14 + Math.random() * 5);
          const treeZ = (Math.random() - 0.5) * 22;
          gx = treeX + (Math.random() - 0.5) * 4.0;
          gz = treeZ + (Math.random() - 0.5) * 4.0;
        } else {
          // Outer alpine plateau meadows and mounds
          const ang = Math.random() * Math.PI * 2;
          const rad = 8.5 + Math.random() * 16.5;
          gx = Math.cos(ang) * rad;
          gz = Math.sin(ang) * rad;
        }

        if (!isExcludedZone(gx, gz)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        // Safe fallback in outer meadow
        const side = i % 2 === 0 ? -1 : 1;
        gx = side * (12.0 + (i % 6) * 1.1);
        gz = 8.0 + (i % 7) * 1.2;
      }

      const s = 0.75 + Math.random() * 0.55;
      dummy.position.set(gx, 0.0, gz);
      dummy.rotation.set((Math.random() - 0.5) * 0.12, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.12);
      dummy.scale.set(s, s * (0.85 + Math.random() * 0.4), s);
      dummy.updateMatrix();
      instancedGrass.setMatrixAt(i, dummy.matrix);

      const rVal = Math.random();
      if (rVal < 0.45) {
        curColor.copy(colorA);
      } else if (rVal < 0.8) {
        curColor.copy(colorB);
      } else {
        curColor.copy(colorC);
      }
      instancedGrass.setColorAt(i, curColor);
    }

    instancedGrass.instanceMatrix.needsUpdate = true;
    if (instancedGrass.instanceColor) {
      instancedGrass.instanceColor.needsUpdate = true;
    }
    envGroup.add(instancedGrass);

    scene.add(envGroup);

    // ==========================================
    // 11. REAL-TIME PROCEDURAL DAY / NIGHT ENGINE
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
