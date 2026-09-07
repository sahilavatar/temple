import * as THREE from 'three';
import { TempleTextures } from './proceduralTextures';

/**
 * Sacred Marble Stela Enshrinement (Prabhavali Vigraha)
 * Classical Indian temple enshrinement of Lord Hanuman:
 * - High-resolution photorealistic antique white marble Vigraha matching reference iconography
 * - Abhaya Mudra divine blessing, upright Samabhanga stance, vertical fluted melon Gada
 * - Crown with integrated 24-ray solar disc Prabhamandala halo, triple garlands, and sacred Tilak
 * - Enshrined within an authentic carved marble Prabhavali arch with fluted pilasters
 * - Tiered lotus pedestal (Pitha), sacred marigold petal offerings, and devotional illumination
 */
export class HanumanSculptor {
  public static buildStatue(): THREE.Group {
    const root = new THREE.Group();
    root.name = 'LordHanumanStatue';

    // 1. Textures & Materials
    const marbleTex = TempleTextures.getAntiqueMarbleTexture();
    const reliefTex = TempleTextures.getCarvedMarbleRelief();
    const goldTex = TempleTextures.getAntiqueBrass();

    // High-resolution photorealistic marble stela texture
    const textureLoader = new THREE.TextureLoader();
    const stelaTexture = textureLoader.load(`${import.meta.env.BASE_URL}textures/hanuman_marble_stela.jpg`);
    stelaTexture.colorSpace = THREE.SRGBColorSpace;

    // Polished white Makrana marble material
    const marbleMat = new THREE.MeshStandardMaterial({
      map: marbleTex,
      color: 0xf6f1ea,
      roughness: 0.48,
      metalness: 0.03,
      bumpMap: marbleTex,
      bumpScale: 0.006,
    });

    // Ornate carved stone relief for architectural moldings
    const ornamentMat = new THREE.MeshStandardMaterial({
      map: reliefTex,
      color: 0xeee7dc,
      roughness: 0.52,
      metalness: 0.05,
      bumpMap: reliefTex,
      bumpScale: 0.012,
    });

    // Sacred gilded gold accents
    const goldMat = new THREE.MeshStandardMaterial({
      map: goldTex,
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.82,
    });

    // Deep Royal Maroon Velvet for high-contrast sanctum backdrop
    const velvetBackdropMat = new THREE.MeshStandardMaterial({
      color: 0x3b0712,
      roughness: 0.92,
      metalness: 0.04,
    });

    // Deep crevice stone material
    const shadowMat = velvetBackdropMat;

    // ========================================================
    // 2. TIERED PEDESTAL PLINTH (PITHA)
    // Sits at base (y = 0.0 to 0.38)
    // ========================================================
    const plinthGroup = new THREE.Group();

    // Bottom rectangular stepped plinth
    const baseStep = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.12, 1.2),
      marbleMat
    );
    baseStep.position.y = 0.06;
    plinthGroup.add(baseStep);

    const midStep = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.1, 1.0),
      ornamentMat
    );
    midStep.position.y = 0.17;
    plinthGroup.add(midStep);

    // Circular lotus throne pedestal
    const lowerLotus = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.95, 0.12, 32),
      marbleMat
    );
    lowerLotus.position.y = 0.28;
    plinthGroup.add(lowerLotus);

    const upperLotus = new THREE.Mesh(
      new THREE.CylinderGeometry(0.88, 0.8, 0.1, 32),
      ornamentMat
    );
    upperLotus.position.y = 0.38;
    plinthGroup.add(upperLotus);

    root.add(plinthGroup);

    // ========================================================
    // 3. SACRED PRABHAVALI (Carved Marble Torana Archway)
    // Classical temple aureole arch framing the deity
    // ========================================================
    const archGroup = new THREE.Group();

    // Left & Right Fluted Marble Pilasters / Columns
    const colHeight = 2.05;
    const colRadius = 0.11;
    const colSpacing = 0.92;

    [-colSpacing, colSpacing].forEach((xPos) => {
      // Column base pedestal
      const colBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.18, 0.3),
        ornamentMat
      );
      colBase.position.set(xPos, 0.52, -0.05);
      archGroup.add(colBase);

      // Fluted pillar shaft
      const colShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(colRadius * 0.92, colRadius, colHeight, 20),
        marbleMat
      );
      colShaft.position.set(xPos, 0.61 + colHeight / 2, -0.05);
      archGroup.add(colShaft);

      // Lotus capital & bracket at top of pillar
      const colCap = new THREE.Mesh(
        new THREE.CylinderGeometry(colRadius * 1.45, colRadius * 0.9, 0.16, 16),
        ornamentMat
      );
      colCap.position.set(xPos, 0.61 + colHeight + 0.08, -0.05);
      archGroup.add(colCap);

      // Ornate bracket projection
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.14, 0.24),
        ornamentMat
      );
      bracket.position.set(xPos, 0.61 + colHeight + 0.2, -0.05);
      archGroup.add(bracket);
    });

    // Archway Crown (Semicircular Aureole Torana)
    const archRadius = colSpacing;
    const archThickness = 0.18;
    const archY = 0.61 + colHeight + 0.14;

    const archCurve = new THREE.TorusGeometry(
      archRadius,
      archThickness,
      12,
      32,
      Math.PI
    );
    const archMesh = new THREE.Mesh(archCurve, ornamentMat);
    archMesh.position.set(0, archY, -0.05);
    archGroup.add(archMesh);

    // Outer Radiating Sunburst Frieze around arch
    const outerArchCurve = new THREE.TorusGeometry(
      archRadius + 0.14,
      0.05,
      8,
      32,
      Math.PI
    );
    const outerArchMesh = new THREE.Mesh(outerArchCurve, goldMat);
    outerArchMesh.position.set(0, archY, -0.05);
    archGroup.add(outerArchMesh);

    // Pinnacle Kalasha & Kirtimukha (Crown Finial)
    const apexKalasha = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.14, 0.26, 16),
      goldMat
    );
    apexKalasha.position.set(0, archY + archRadius + 0.18, -0.05);
    archGroup.add(apexKalasha);

    const apexSpire = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 16),
      goldMat
    );
    apexSpire.position.set(0, archY + archRadius + 0.42, -0.05);
    archGroup.add(apexSpire);

    // Rear Solid Marble Wall Stela backing
    const backingStela = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 2.8, 0.1),
      shadowMat
    );
    backingStela.position.set(0, 1.85, -0.16);
    archGroup.add(backingStela);

    root.add(archGroup);

    // ========================================================
    // 4. THE SACRED VIGRAHA (High-Relief Murti Panel)
    // Exact likeness matching the reference turnaround screenshots
    // Stands at eye level (feet at y = 0.43, crown top at y = 2.65)
    // ========================================================
    const murtiWidth = 1.48;
    const murtiHeight = 2.22; // 2:3 ratio matching image aspect

    // Sculpted curved stela panel with subtle relief curvature for authentic 3D presence
    const stelaGeo = new THREE.PlaneGeometry(murtiWidth, murtiHeight, 32, 32);
    const pos = stelaGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Gentle forward convex arch in the center (relief projection)
      const normX = x / (murtiWidth * 0.5);
      const zOffset = Math.cos(normX * (Math.PI * 0.42)) * 0.08;
      pos.setZ(i, zOffset);
    }
    stelaGeo.computeVertexNormals();

    const stelaMat = new THREE.MeshStandardMaterial({
      map: stelaTexture,
      roughness: 0.38,
      metalness: 0.04,
      bumpMap: stelaTexture,
      bumpScale: 0.02,
      side: THREE.FrontSide,
    });

    const murtiPanel = new THREE.Mesh(stelaGeo, stelaMat);
    murtiPanel.position.set(0, 1.54, 0.01);
    root.add(murtiPanel);

    // Secondary subtle double-sided depth fill panel in deep royal velvet
    const stelaBacking = new THREE.Mesh(
      new THREE.BoxGeometry(murtiWidth * 0.94, murtiHeight * 0.98, 0.08),
      velvetBackdropMat
    );
    stelaBacking.position.set(0, 1.54, -0.08);
    root.add(stelaBacking);

    // Divine Radiant Golden Aura Halo Backlight behind Lord Hanuman
    // Creates a luminous sacred rim glow separating the white marble statue from the dark background
    const auraHaloLight = new THREE.PointLight(0xffbe55, 3.5, 4.8, 1.3);
    auraHaloLight.position.set(0, 2.1, -0.04);
    root.add(auraHaloLight);

    // ========================================================
    // 5. SACRED OFFERINGS & DEVOTIONAL ILLUMINATION
    // Marigold & rose petals at Lord Hanuman's lotus feet,
    // plus dedicated warm sanctum lighting
    // ========================================================
    const offeringsGroup = new THREE.Group();

    // Marigold petals scattered across the lotus plinth
    const petalColors = [0xf59e0b, 0xd97706, 0xef4444, 0xfbbf24];
    for (let p = 0; p < 45; p++) {
      const pColor = petalColors[p % petalColors.length];
      const petalMat = new THREE.MeshStandardMaterial({
        color: pColor,
        roughness: 0.7,
      });

      const petal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.045, 0.015, 7),
        petalMat
      );
      const angle = (p / 45) * Math.PI * 2 + Math.random() * 0.3;
      const rad = 0.25 + Math.random() * 0.42;
      petal.position.set(
        Math.cos(angle) * rad,
        0.44 + Math.random() * 0.02,
        Math.sin(angle) * rad * 0.7 + 0.08
      );
      petal.rotation.y = Math.random() * Math.PI;
      petal.rotation.z = (Math.random() - 0.5) * 0.2;
      offeringsGroup.add(petal);
    }

    // Sacred Brass Diya Lamps on either side of the plinth
    [-0.85, 0.85].forEach((xPos) => {
      const diyaStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.1, 0.22, 16),
        goldMat
      );
      diyaStand.position.set(xPos, 0.28, 0.3);
      offeringsGroup.add(diyaStand);

      const diyaBowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.06, 0.07, 16),
        goldMat
      );
      diyaBowl.position.set(xPos, 0.42, 0.3);
      offeringsGroup.add(diyaBowl);

      // Warm oil lamp flame glow
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.028, 0.08, 8),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      flame.position.set(xPos, 0.49, 0.3);
      offeringsGroup.add(flame);

      const diyaLight = new THREE.PointLight(0xffaa44, 1.8, 3.5, 1.6);
      diyaLight.position.set(xPos, 0.55, 0.32);
      offeringsGroup.add(diyaLight);
    });

    root.add(offeringsGroup);

    // Focused devotional golden spotlight illuminating the divine visage and crown
    const divineVisageLight = new THREE.PointLight(0xfff5e6, 3.6, 7.0, 1.4);
    divineVisageLight.position.set(0, 2.0, 1.35);
    root.add(divineVisageLight);

    return root;
  }
}
