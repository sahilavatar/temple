import * as THREE from 'three';
import { TempleTextures } from './proceduralTextures';
import { HanumanSculptor } from './HanumanSculptor';

export interface TempleBuildResult {
  sceneGroup: THREE.Group;
  hanumanIdolGroup: THREE.Group;
  diyaLights: THREE.PointLight[];
  diyaFlames: THREE.Mesh[];
  clothFlags: THREE.Mesh[];
  collisionObstacles: THREE.Box3[];
}

export class TempleBuilder {
  public static buildTemple(): TempleBuildResult {
    const group = new THREE.Group();
    const diyaLights: THREE.PointLight[] = [];
    const diyaFlames: THREE.Mesh[] = [];
    const clothFlags: THREE.Mesh[] = [];
    const collisionObstacles: THREE.Box3[] = [];

    // ==========================================
    // AUTHENTIC REFERENCE MATERIALS
    // Terracotta Red, Saffron Ochre, Jade Teal, Gold, Sandstone
    // ==========================================
    const ashlarTexture = TempleTextures.getAshlarStone();
    const ashlarNormal = TempleTextures.getAshlarNormal();
    const flagstoneTexture = TempleTextures.getAncientFlagstone();
    const flagstoneNormal = TempleTextures.getFlagstoneNormal();
    const sandstoneTexture = TempleTextures.getSandstone();
    const carvedFriezeTexture = TempleTextures.getCarvedFrieze();
    const sanctumFloorTexture = TempleTextures.getSanctumFloor();
    const brassTexture = TempleTextures.getAntiqueBrass();
    const sindoorTexture = TempleTextures.getSindoorMurtiTexture();
    const flagTexture = TempleTextures.getTempleFlag();
    const glowSprite = TempleTextures.getGlowSprite();

    // 1. Terracotta Red Ashlar Stone (Plinth, steps, shikhara ridges, arch frame)
    const terracottaMat = new THREE.MeshStandardMaterial({
      map: ashlarTexture,
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.85, 0.85),
      color: 0x992424,
      roughness: 0.74,
      metalness: 0.04,
    });

    // 2. Saffron Ochre Dressed Sandstone (Walls, pillar shafts, pediment body)
    const ochreMat = new THREE.MeshStandardMaterial({
      map: ashlarTexture,
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.75, 0.75),
      color: 0xd97706,
      roughness: 0.72,
      metalness: 0.05,
    });

    // 3. Jade Teal / Verdigris Carved Stone (Pillar collars, arch molding, rosette medallion)
    const tealMat = new THREE.MeshStandardMaterial({
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.4, 0.4),
      color: 0x0f766e,
      roughness: 0.48,
      metalness: 0.12,
    });

    // 4. Gold (Kalashas, jewelry, gold mace/gada, halo)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.88,
    });

    // 5. Sandstone (Floors, carved brackets)
    const sandstoneMat = new THREE.MeshStandardMaterial({
      map: sandstoneTexture,
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.78,
      metalness: 0.02,
    });

    const carvedStoneMat = new THREE.MeshStandardMaterial({
      map: carvedFriezeTexture,
      normalMap: ashlarNormal,
      normalScale: new THREE.Vector2(0.65, 0.65),
      roughness: 0.72,
      metalness: 0.05,
    });

    // Dedicated Ancient Courtyard Flagstone Paving
    const flagstoneMat = new THREE.MeshStandardMaterial({
      map: flagstoneTexture,
      normalMap: flagstoneNormal,
      normalScale: new THREE.Vector2(1.15, 1.15),
      roughness: 0.82,
      metalness: 0.02,
    });

    // 6. Sanctum Floor (Dark polished granite)
    const sanctumFloorMat = new THREE.MeshStandardMaterial({
      map: sanctumFloorTexture,
      roughness: 0.24,
      metalness: 0.35,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      map: brassTexture,
      roughness: 0.22,
      metalness: 0.85,
    });

    // 7. Radiant Orange Sindoor Body for Lord Hanuman
    const orangeBodyMat = new THREE.MeshStandardMaterial({
      map: sindoorTexture,
      color: 0xfa5a14,
      roughness: 0.48,
      metalness: 0.08,
    });

    const whiteDrapeMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      roughness: 0.85,
      metalness: 0.02,
    });

    // ==========================================
    // 1. CEREMONIAL APPROACH WALKWAY & CLEAR ENTRY FRAMING
    // Flagstone path leading directly to the temple steps
    // ==========================================
    // Paved ceremonial flagstone walkway (x: -2.5 to 2.5, z: 5.5 to 15.0)
    const walkwayGeo = new THREE.BoxGeometry(4.8, 0.12, 10.0);
    const walkway = new THREE.Mesh(walkwayGeo, flagstoneMat);
    walkway.position.set(0, 0.06, 10.5);
    walkway.receiveShadow = true;
    group.add(walkway);

    // Lateral stone curbs along walkway
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 10.0), terracottaMat);
    curbL.position.set(-2.4, 0.11, 10.5);
    group.add(curbL);

    const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 10.0), terracottaMat);
    curbR.position.set(2.4, 0.11, 10.5);
    group.add(curbR);

    // Two Ceremonial Deepastambha Lamp Pillars at the start of the approach path
    const createWalkwayLampPillar = (px: number, pz: number) => {
      const pGroup = new THREE.Group();
      // Tiered base
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), terracottaMat);
      b1.position.y = 0.2;
      pGroup.add(b1);

      // Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 2.4, 8), ochreMat);
      shaft.position.y = 1.6;
      pGroup.add(shaft);

      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.16, 8), tealMat);
      collar.position.y = 2.5;
      pGroup.add(collar);

      // Crown bowl
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.2, 0.28, 10), brassMat);
      bowl.position.y = 2.85;
      pGroup.add(bowl);

      // Diya Flame
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 8), new THREE.MeshBasicMaterial({ color: 0xffaa22 }));
      flame.position.y = 3.12;
      pGroup.add(flame);
      diyaFlames.push(flame);

      const spriteMat = new THREE.SpriteMaterial({
        map: glowSprite,
        color: 0xff8800,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 1.4, 1.0);
      sprite.position.y = 3.15;
      pGroup.add(sprite);

      const light = new THREE.PointLight(0xff9922, 2.0, 9, 1.5);
      light.position.y = 3.2;
      pGroup.add(light);
      diyaLights.push(light);

      pGroup.position.set(px, 0, pz);
      group.add(pGroup);

      collisionObstacles.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(px, 1.5, pz),
        new THREE.Vector3(1.0, 3.2, 1.0)
      ));
    };

    createWalkwayLampPillar(-3.2, 13.5);
    createWalkwayLampPillar(3.2, 13.5);

    // ==========================================
    // 2. COMPACT RAISED TEMPLE PLINTH & CLEAR STEPS
    // Perfectly scaled: 10.5m wide x 13m deep, 0.6m high
    // ==========================================
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.6, 13.0), terracottaMat);
    plinth.position.set(0, 0.3, -1.0);
    plinth.receiveShadow = true;
    group.add(plinth);

    // Teal accent molding band along plinth top
    const plinthTrim = new THREE.Mesh(new THREE.BoxGeometry(10.7, 0.1, 13.2), tealMat);
    plinthTrim.position.set(0, 0.58, -1.0);
    group.add(plinthTrim);

    // WIDE, CLEAR ENTRY STEPS (Cascading Terracotta Stairs from z = 5.5 to z = 3.8)
    const stepCount = 4;
    const stepDepth = 0.45;
    const stepHeight = 0.15;
    for (let s = 0; s < stepCount; s++) {
      const stepW = 5.2 - s * 0.15;
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stepW, stepHeight, stepDepth),
        terracottaMat
      );
      stepMesh.position.set(0, (s + 0.5) * stepHeight, 5.5 - s * stepDepth);
      stepMesh.receiveShadow = true;
      group.add(stepMesh);
    }

    // Flanking Stepped Stone Balustrades with Guardian Elements
    const createStepBalustrade = (bx: number) => {
      for (let s = 0; s < stepCount; s++) {
        const balMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, 0.38 + s * 0.15, stepDepth),
          terracottaMat
        );
        balMesh.position.set(bx, 0.2 + s * 0.08, 5.5 - s * stepDepth);
        group.add(balMesh);

        const balCap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, stepDepth), tealMat);
        balCap.position.set(bx, 0.42 + s * 0.15, 5.5 - s * stepDepth);
        group.add(balCap);
      }

      // Guardian Lion Finial on bottom step post
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), terracottaMat);
      post.position.set(bx, 0.5, 5.5);
      group.add(post);

      const lion = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), ochreMat);
      lion.position.set(bx, 0.85, 5.5);
      group.add(lion);
    };
    createStepBalustrade(-2.8);
    createStepBalustrade(2.8);

    // ==========================================
    // 3. OPEN ENTRANCE ARCH (MUKHAMANDAPA PORCH)
    // Directly frames the inner sanctum and Lord Hanuman statue
    // ==========================================
    // Four Porch Pillars (Two front at z = 3.6, two rear at z = 0.8)
    const porchPillars: [number, number][] = [
      [-2.4, 3.6],
      [2.4, 3.6],
      [-2.4, 0.8],
      [2.4, 0.8],
    ];

    porchPillars.forEach(([px, pz]) => {
      const pGroup = new THREE.Group();
      // Base
      const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.4, 0.75), terracottaMat);
      pBase.position.y = 0.2;
      pGroup.add(pBase);

      // Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 3.0, 12), ochreMat);
      shaft.position.y = 1.9;
      pGroup.add(shaft);

      // Teal rings
      const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.15, 12), tealMat);
      ring1.position.y = 1.4;
      pGroup.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.15, 12), tealMat);
      ring2.position.y = 2.8;
      pGroup.add(ring2);

      // Capital
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.3, 0.85), terracottaMat);
      cap.position.y = 3.45;
      pGroup.add(cap);

      pGroup.position.set(px, 0.6, pz);
      group.add(pGroup);

      collisionObstacles.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(px, 2.2, pz),
        new THREE.Vector3(0.9, 3.6, 0.9)
      ));
    });

    // OPEN FRONT ENTRANCE ARCHWAY (Terracotta arch + Teal inner trim)
    // Completely open so you can see right through from the courtyard to the statue
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 3.8, 3.6),
      new THREE.Vector3(-1.4, 4.4, 3.6),
      new THREE.Vector3(0, 4.65, 3.6),
      new THREE.Vector3(1.4, 4.4, 3.6),
      new THREE.Vector3(2.4, 3.8, 3.6),
    ]);
    const frontArch = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 16, 0.22, 8, false), terracottaMat);
    group.add(frontArch);

    const innerArchTrim = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 16, 0.12, 8, false), tealMat);
    group.add(innerArchTrim);

    // Signature Gabled Pediment with Circular Jade-Teal Rosette (Reference styling)
    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-2.8, 0);
    pedimentShape.lineTo(2.8, 0);
    pedimentShape.lineTo(0, 1.8);
    pedimentShape.closePath();

    const pedimentGeo = new THREE.ExtrudeGeometry(pedimentShape, { depth: 0.4, bevelEnabled: false });
    const pedimentMesh = new THREE.Mesh(pedimentGeo, ochreMat);
    pedimentMesh.position.set(0, 4.2, 3.4);
    group.add(pedimentMesh);

    // Sloped Terracotta Eaves
    const pedTrimL = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 0.5), terracottaMat);
    pedTrimL.rotation.z = Math.atan2(1.8, 2.8);
    pedTrimL.position.set(-1.4, 5.1, 3.6);
    group.add(pedTrimL);

    const pedTrimR = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 0.5), terracottaMat);
    pedTrimR.rotation.z = -Math.atan2(1.8, 2.8);
    pedTrimR.position.set(1.4, 5.1, 3.6);
    group.add(pedTrimR);

    // Central Jade-Teal Rosette Medallion
    const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 20), tealMat);
    rosette.rotation.x = Math.PI / 2;
    rosette.position.set(0, 5.0, 3.85);
    group.add(rosette);

    const rosetteGold = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 8, 20), goldMat);
    rosetteGold.position.set(0, 5.0, 3.95);
    group.add(rosetteGold);

    const pedimentKalasha = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.8, 8), goldMat);
    pedimentKalasha.position.set(0, 6.4, 3.6);
    group.add(pedimentKalasha);

    // Porch Floor (Smooth Sandstone)
    const porchFloor = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.1, 4.0), sandstoneMat);
    porchFloor.position.set(0, 0.65, 2.2);
    porchFloor.receiveShadow = true;
    group.add(porchFloor);

    // Porch Ceiling
    const porchCeiling = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.25, 4.2), sandstoneMat);
    porchCeiling.position.set(0, 4.15, 2.2);
    group.add(porchCeiling);

    // ==========================================
    // 4. INTIMATE SANCTUM SANCTORUM (GARBHAGRIHA)
    // Directly accessible, deeply atmospheric, glowing with warmth
    // ==========================================
    // Sanctum Floor (Dark Polished Granite with Golden Mandala)
    const sanctumFloor = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.1, 6.2), sanctumFloorMat);
    sanctumFloor.position.set(0, 0.65, -3.2);
    sanctumFloor.receiveShadow = true;
    group.add(sanctumFloor);

    // Sanctum Doorway Frame (z = 0.2)
    // Left doorpost
    const sanctumDoorL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.6, 0.6), terracottaMat);
    sanctumDoorL.position.set(-1.8, 2.4, 0.2);
    group.add(sanctumDoorL);
    collisionObstacles.push(new THREE.Box3().setFromObject(sanctumDoorL));

    // Right doorpost
    const sanctumDoorR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.6, 0.6), terracottaMat);
    sanctumDoorR.position.set(1.8, 2.4, 0.2);
    group.add(sanctumDoorR);
    collisionObstacles.push(new THREE.Box3().setFromObject(sanctumDoorR));

    // Lintel (Leaves 3.4m high clearance so the idol's crown and face are 100% visible!)
    const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 0.6), terracottaMat);
    doorLintel.position.set(0, 3.95, 0.2);
    group.add(doorLintel);

    const doorTealBand = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 0.65), tealMat);
    doorTealBand.position.set(0, 4.25, 0.2);
    group.add(doorTealBand);

    // Front partition walls flanking the doorway
    const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.8, 0.5), ochreMat);
    frontWallL.position.set(-2.8, 2.5, 0.2);
    group.add(frontWallL);
    collisionObstacles.push(new THREE.Box3().setFromObject(frontWallL));

    const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.8, 0.5), ochreMat);
    frontWallR.position.set(2.8, 2.5, 0.2);
    group.add(frontWallR);
    collisionObstacles.push(new THREE.Box3().setFromObject(frontWallR));

    // Sanctum Exterior & Enclosure Walls
    // Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.6, 4.2, 0.6), ochreMat);
    backWall.position.set(0, 2.7, -6.5);
    group.add(backWall);
    collisionObstacles.push(new THREE.Box3().setFromObject(backWall));

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 7.2), ochreMat);
    leftWall.position.set(-3.8, 2.7, -3.2);
    group.add(leftWall);
    collisionObstacles.push(new THREE.Box3().setFromObject(leftWall));

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 7.2), ochreMat);
    rightWall.position.set(3.8, 2.7, -3.2);
    group.add(rightWall);
    collisionObstacles.push(new THREE.Box3().setFromObject(rightWall));

    // Sanctum Ceiling
    const sanctumCeiling = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.3, 7.2), sandstoneMat);
    sanctumCeiling.position.set(0, 4.65, -3.2);
    group.add(sanctumCeiling);

    // Exterior Roof Cornice & Teal Moldings
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.22, 7.8), tealMat);
    cornice.position.set(0, 4.85, -3.2);
    group.add(cornice);

    // Sacred Deep Royal Maroon Sanctum Backdrop (Mandir Parda)
    // Provides rich, dramatic contrast so the white marble Lord Hanuman statue stands out with divine clarity
    const sanctumBackdrop = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 3.9, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x450a17, // Deep royal maroon / crimson velvet
        roughness: 0.94,
        metalness: 0.02,
      })
    );
    sanctumBackdrop.position.set(0, 2.7, -6.15);
    group.add(sanctumBackdrop);

    const goldBackdropBorder = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 4.1, 0.04),
      goldMat
    );
    goldBackdropBorder.position.set(0, 2.7, -6.18);
    group.add(goldBackdropBorder);

    // ==========================================
    // 5. CAREFULLY PROPORTIONED ALTAR & SCULPTED LORD HANUMAN
    // Head and crown are 100% visible, framed, and illuminated
    // Altar sits at z = -4.5, directly facing the entrance
    // ==========================================
    const altarBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 2.4), terracottaMat);
    altarBase.position.set(0, 0.85, -4.5);
    altarBase.receiveShadow = true;
    group.add(altarBase);

    const altarRunner = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.04, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.9 })
    );
    altarRunner.position.set(0, 1.09, -4.5);
    group.add(altarRunner);

    // Double Lotus Pedestal (Padmasana)
    const lowerLotus = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.18, 18), goldMat);
    lowerLotus.position.set(0, 1.2, -4.5);
    group.add(lowerLotus);

    const upperLotus = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.2, 0.18, 18), goldMat);
    upperLotus.position.set(0, 1.38, -4.5);
    group.add(upperLotus);

    collisionObstacles.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(0, 1.5, -4.5),
      new THREE.Vector3(3.6, 2.0, 2.4)
    ));

    // ==========================================
    // 5. CAREFULLY PROPORTIONED ALTAR & NATIVELY SCULPTED LORD HANUMAN
    // Modeled with Three.js geometry matching user's 360° reference screenshots:
    // Antique white carved marble, Abhaya mudra blessing, vertical fluted Gada,
    // crown with 24-ray serrated solar disc halo, layered jewelry and dhoti drapery.
    // ==========================================
    const hanumanGroup = HanumanSculptor.buildStatue();

    // DEDICATED WARM SANCTUM SPOTLIGHT ON LORD HANUMAN
    const idolLight = new THREE.PointLight(0xfffae8, 3.4, 8.5, 1.5);
    idolLight.position.set(0, 2.3, 1.4);
    hanumanGroup.add(idolLight);

    hanumanGroup.position.set(0, 1.48, -4.5);
    group.add(hanumanGroup);

    // ==========================================
    // 6. TOWERING SHIKHARA SPIRE & GOLD KALASHA
    // Crown of the temple
    // ==========================================
    const shikharaTiers = 5;
    const shikharaGroup = new THREE.Group();
    for (let t = 0; t < shikharaTiers; t++) {
      const sW = 6.8 - t * 0.95;
      const sH = 0.9;
      const sY = 4.85 + t * sH;

      const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(sW, sH, sW), terracottaMat);
      tierMesh.position.y = sY + sH / 2;
      shikharaGroup.add(tierMesh);

      // Chaitya window projections in ochre
      const projW = sW * 0.6;
      const projH = sH * 0.75;
      const projD = sW * 0.2;

      const projN = new THREE.Mesh(new THREE.BoxGeometry(projW, projH, projD), ochreMat);
      projN.position.set(0, sY + sH / 2, sW / 2 + projD / 3);
      shikharaGroup.add(projN);

      const projS = new THREE.Mesh(new THREE.BoxGeometry(projW, projH, projD), ochreMat);
      projS.position.set(0, sY + sH / 2, -sW / 2 - projD / 3);
      shikharaGroup.add(projS);
    }

    // Apex Amalaka (Ribbed Disc)
    const amalakaY = 4.85 + shikharaTiers * 0.9 + 0.35;
    const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.6, 16), terracottaMat);
    amalaka.position.y = amalakaY;
    shikharaGroup.add(amalaka);

    // Golden Kalasha Finial
    const kalasha = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 12), goldMat);
    kalasha.position.y = amalakaY + 0.85;
    shikharaGroup.add(kalasha);

    const spireCone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 12), goldMat);
    spireCone.position.y = amalakaY + 1.8;
    shikharaGroup.add(spireCone);

    // Flagpole & Red Sacred Banner
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.8, 8), brassMat);
    flagPole.position.set(0, amalakaY + 2.8, 0);
    shikharaGroup.add(flagPole);

    const flagMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.2, 6, 4),
      new THREE.MeshStandardMaterial({
        map: flagTexture,
        side: THREE.DoubleSide,
        roughness: 0.5,
      })
    );
    flagMesh.position.set(1.1, amalakaY + 3.2, 0);
    shikharaGroup.add(flagMesh);
    clothFlags.push(flagMesh);

    shikharaGroup.position.set(0, 0, -3.2);
    group.add(shikharaGroup);

    // ==========================================
    // 7. VIRTUAL DIYA OIL LAMPS
    // Naturally illuminating steps, porch, and altar with warm flickering fire
    // ==========================================
    const diyaCoords: [number, number, number][] = [
      // Altar steps
      [-1.4, 1.15, -4.0],
      [1.4, 1.15, -4.0],
      [-0.7, 0.95, -3.8],
      [0.7, 0.95, -3.8],
      // Sanctum doorway threshold
      [-1.4, 0.72, 0.2],
      [1.4, 0.72, 0.2],
      // Porch columns
      [-2.4, 0.72, 3.6],
      [2.4, 0.72, 3.6],
      [-2.4, 0.72, 0.8],
      [2.4, 0.72, 0.8],
      // Entrance Steps
      [-2.6, 0.48, 5.0],
      [2.6, 0.48, 5.0],
      [-2.6, 0.25, 5.5],
      [2.6, 0.25, 5.5],
    ];

    diyaCoords.forEach(([dx, dy, dz]) => {
      const dGroup = new THREE.Group();
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.07, 8), brassMat);
      bowl.position.y = 0.035;
      dGroup.add(bowl);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.14, 6), new THREE.MeshBasicMaterial({ color: 0xffaa22 }));
      flame.position.y = 0.14;
      dGroup.add(flame);
      diyaFlames.push(flame);

      const spriteMat = new THREE.SpriteMaterial({
        map: glowSprite,
        color: 0xff8800,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.85,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.65, 0.65, 1.0);
      sprite.position.y = 0.17;
      dGroup.add(sprite);

      const dLight = new THREE.PointLight(0xff9922, 1.2, 4.0, 1.8);
      dLight.position.y = 0.2;
      dGroup.add(dLight);
      diyaLights.push(dLight);

      dGroup.position.set(dx, dy, dz);
      group.add(dGroup);
    });

    return {
      sceneGroup: group,
      hanumanIdolGroup: hanumanGroup,
      diyaLights,
      diyaFlames,
      clothFlags,
      collisionObstacles,
    };
  }
}
