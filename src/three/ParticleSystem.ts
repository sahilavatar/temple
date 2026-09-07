import * as THREE from 'three';

export interface FlowerPetal {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotSpeed: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  life: number;
  maxLife: number;
}

export class TempleParticleSystem {
  private scene: THREE.Scene;

  // Dhoop (Incense) Smoke
  private smokeGeometry!: THREE.BufferGeometry;
  private smokeMaterial!: THREE.PointsMaterial;
  private smokeParticles!: THREE.Points;
  private smokePositions!: Float32Array;
  private smokeVelocities: THREE.Vector3[] = [];

  // Flower Petals (Pushpanjali)
  private petals: FlowerPetal[] = [];
  private petalMeshGroup: THREE.Group = new THREE.Group();
  private petalGeometries: THREE.BufferGeometry[] = [];
  private petalMaterials: THREE.MeshStandardMaterial[] = [];

  // Diya Embers
  private emberGeometry!: THREE.BufferGeometry;
  private emberMaterial!: THREE.PointsMaterial;
  private emberParticles!: THREE.Points;
  private emberPositions!: Float32Array;
  private emberCount = 60;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initIncenseSmoke();
    this.initFlowerPetalPool();
    this.initDiyaEmbers();
    this.scene.add(this.petalMeshGroup);
  }

  private initIncenseSmoke() {
    const count = 75;
    this.smokePositions = new Float32Array(count * 3);
    this.smokeVelocities = [];

    // Origin near altar incense burner [0, 1.3, -12.5]
    for (let i = 0; i < count; i++) {
      this.smokePositions[i * 3] = 0.8 + (Math.random() - 0.5) * 0.1;
      this.smokePositions[i * 3 + 1] = 1.35 + Math.random() * 2.0;
      this.smokePositions[i * 3 + 2] = -12.2 + (Math.random() - 0.5) * 0.1;

      this.smokeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          0.15 + Math.random() * 0.15,
          (Math.random() - 0.5) * 0.04
        )
      );
    }

    this.smokeGeometry = new THREE.BufferGeometry();
    this.smokeGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.smokePositions, 3)
    );

    this.smokeMaterial = new THREE.PointsMaterial({
      color: 0xd4cfc9,
      size: 0.18,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    this.smokeParticles = new THREE.Points(this.smokeGeometry, this.smokeMaterial);
    this.scene.add(this.smokeParticles);
  }

  private initDiyaEmbers() {
    this.emberPositions = new Float32Array(this.emberCount * 3);
    for (let i = 0; i < this.emberCount; i++) {
      this.emberPositions[i * 3] = (Math.random() - 0.5) * 4;
      this.emberPositions[i * 3 + 1] = 0.5 + Math.random() * 1.5;
      this.emberPositions[i * 3 + 2] = -10 + (Math.random() - 0.5) * 4;
    }

    this.emberGeometry = new THREE.BufferGeometry();
    this.emberGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.emberPositions, 3)
    );

    this.emberMaterial = new THREE.PointsMaterial({
      color: 0xffaa33,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.emberParticles = new THREE.Points(this.emberGeometry, this.emberMaterial);
    this.scene.add(this.emberParticles);
  }

  private initFlowerPetalPool() {
    // Curved marigold and rose petal geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.08, 0.08, 0, 0.18);
    petalShape.quadraticCurveTo(-0.08, 0.08, 0, 0);

    const geom = new THREE.ShapeGeometry(petalShape);
    this.petalGeometries.push(geom);

    // Warm saffron marigold, yellow marigold, and sacred red rose materials
    this.petalMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xf97316, side: THREE.DoubleSide, roughness: 0.6 }), // Saffron Orange Marigold
      new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide, roughness: 0.6 }), // Golden Yellow Marigold
      new THREE.MeshStandardMaterial({ color: 0xdc2626, side: THREE.DoubleSide, roughness: 0.6 }), // Red Rose
      new THREE.MeshStandardMaterial({ color: 0xfb923c, side: THREE.DoubleSide, roughness: 0.6 }), // Light Marigold
    ];
  }

  /**
   * Spawn a shower of fragrant flower petals (Pushpanjali)
   */
  public triggerPushpanjali(count = 80) {
    const center = new THREE.Vector3(0, 4.2, -13.2);

    for (let i = 0; i < count; i++) {
      const mat = this.petalMaterials[Math.floor(Math.random() * this.petalMaterials.length)];
      const geom = this.petalGeometries[0];
      const mesh = new THREE.Mesh(geom, mat);

      const spawnPos = new THREE.Vector3(
        center.x + (Math.random() - 0.5) * 3.2,
        center.y + Math.random() * 1.5,
        center.z + (Math.random() - 0.5) * 2.2
      );

      mesh.position.copy(spawnPos);
      mesh.scale.setScalar(0.7 + Math.random() * 0.6);
      this.petalMeshGroup.add(mesh);

      this.petals.push({
        position: spawnPos,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          -(0.6 + Math.random() * 0.8),
          (Math.random() - 0.5) * 0.4
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 3.0,
          (Math.random() - 0.5) * 3.0,
          (Math.random() - 0.5) * 3.0
        ),
        color: mat.color,
        scale: mesh.scale.x,
        life: 0,
        maxLife: 6.0 + Math.random() * 4.0,
      });
    }
  }

  public update(delta: number, diyasLit: boolean) {
    // 1. Update Incense Smoke
    const smokePos = this.smokePositions;
    for (let i = 0; i < this.smokeVelocities.length; i++) {
      const idx = i * 3;
      smokePos[idx] += this.smokeVelocities[i].x * delta;
      smokePos[idx + 1] += this.smokeVelocities[i].y * delta;
      smokePos[idx + 2] += this.smokeVelocities[i].z * delta;

      // Gentle wobble
      smokePos[idx] += Math.sin(smokePos[idx + 1] * 4 + i) * 0.003;

      // Reset when too high
      if (smokePos[idx + 1] > 4.5) {
        smokePos[idx] = 0.8 + (Math.random() - 0.5) * 0.1;
        smokePos[idx + 1] = 1.35;
        smokePos[idx + 2] = -12.2 + (Math.random() - 0.5) * 0.1;
      }
    }
    this.smokeGeometry.attributes.position.needsUpdate = true;

    // 2. Update Diya embers
    this.emberParticles.visible = diyasLit;
    if (diyasLit) {
      const emberPos = this.emberPositions;
      for (let i = 0; i < this.emberCount; i++) {
        const idx = i * 3;
        emberPos[idx + 1] += (0.4 + Math.random() * 0.3) * delta;
        emberPos[idx] += Math.sin(emberPos[idx + 1] * 6 + i) * 0.01;

        if (emberPos[idx + 1] > 2.8) {
          emberPos[idx + 1] = 0.4 + Math.random() * 0.2;
        }
      }
      this.emberGeometry.attributes.position.needsUpdate = true;
    }

    // 3. Update Flower Petals
    const groundLevel = 0.8; // Altar top / floor
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      const mesh = this.petalMeshGroup.children[i] as THREE.Mesh;

      p.life += delta;

      if (p.position.y > groundLevel) {
        // Falling with gentle flutter
        p.position.x += (p.velocity.x + Math.sin(p.life * 5 + i) * 0.3) * delta;
        p.position.y += p.velocity.y * delta;
        p.position.z += (p.velocity.z + Math.cos(p.life * 4 + i) * 0.3) * delta;

        p.rotation.x += p.rotSpeed.x * delta;
        p.rotation.y += p.rotSpeed.y * delta;
        p.rotation.z += p.rotSpeed.z * delta;

        mesh.position.copy(p.position);
        mesh.rotation.copy(p.rotation);
      } else {
        // Resting gently on the ground/altar
        p.position.y = groundLevel + 0.02;
        mesh.position.copy(p.position);
        mesh.rotation.x = -Math.PI / 2 + 0.1;
      }

      // Fade out after lifetime
      if (p.life > p.maxLife) {
        this.petalMeshGroup.remove(mesh);
        this.petals.splice(i, 1);
      }
    }
  }

  public dispose() {
    this.smokeGeometry.dispose();
    this.smokeMaterial.dispose();
    this.emberGeometry.dispose();
    this.emberMaterial.dispose();
    this.petalGeometries.forEach(g => g.dispose());
    this.petalMaterials.forEach(m => m.dispose());
  }
}
