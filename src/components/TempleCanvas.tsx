import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TempleBuilder, TempleBuildResult } from '../three/TempleBuilder';
import { MountainEnvironment } from '../three/MountainEnvironment';
import { TempleParticleSystem } from '../three/ParticleSystem';

interface TempleCanvasProps {
  timeOfDay: number; // 0.0 = Day, 0.5 = Golden Dusk, 1.0 = Twilight
  isAutoDayCycle?: boolean;
  onTimeChange?: (newTime: number) => void;
  isSitting: boolean;
  onToggleSitting: () => void;
}

export const TempleCanvas: React.FC<TempleCanvasProps> = ({
  timeOfDay,
  isAutoDayCycle = false,
  onTimeChange,
  isSitting,
  onToggleSitting,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for render loop & cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<TempleParticleSystem | null>(null);
  const templeDataRef = useRef<TempleBuildResult | null>(null);

  // Lighting references for Day-Dusk cycle
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const updateTimeFnRef = useRef<
    ((t: number, sun: THREE.DirectionalLight, hemi: THREE.HemisphereLight) => void) | null
  >(null);
  const currentTimeRef = useRef(timeOfDay);
  const lastAppliedTimeRef = useRef(-1);
  const isAutoCycleRef = useRef(isAutoDayCycle);
  const onTimeChangeRef = useRef(onTimeChange);

  useEffect(() => {
    onTimeChangeRef.current = onTimeChange;
  }, [onTimeChange]);

  // Keep refs in sync with props & apply immediately on manual slider change
  useEffect(() => {
    currentTimeRef.current = timeOfDay;
    if (updateTimeFnRef.current && sunLightRef.current && hemiLightRef.current) {
      updateTimeFnRef.current(timeOfDay, sunLightRef.current, hemiLightRef.current);
      lastAppliedTimeRef.current = timeOfDay;
    }
  }, [timeOfDay]);

  useEffect(() => {
    isAutoCycleRef.current = isAutoDayCycle;
  }, [isAutoDayCycle]);

  // Player state: Starts on the ceremonial approach path facing the temple
  const playerPos = useRef(new THREE.Vector3(0, 1.65, 11.5));
  const playerYaw = useRef(0);
  const playerPitch = useRef(0.04);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const isDraggingMouse = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Seated prayer state synced with props
  const isSittingRef = useRef(isSitting);
  useEffect(() => {
    isSittingRef.current = isSitting;
  }, [isSitting]);

  const onToggleSittingRef = useRef(onToggleSitting);
  useEffect(() => {
    onToggleSittingRef.current = onToggleSitting;
  }, [onToggleSitting]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fog blending seamlessly with the mountain atmosphere
    scene.fog = new THREE.FogExp2(0xcfe2f7, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.copy(playerPos.current);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // 3. Dynamic Sun & Ambient Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff5e6, 0x15803d, 1.1);
    hemiLight.position.set(0, 60, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.9);
    sunLight.position.set(35, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 130;
    const shadowD = 24;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.45);
    scene.add(ambientLight);

    // 4. Create 360° Lush Mountain Environment & Procedural Skybox
    const { cloudMeshes, updateTimeOfDay } = MountainEnvironment.createEnvironment(scene);
    updateTimeFnRef.current = updateTimeOfDay;

    // Apply initial time-of-day configuration
    updateTimeOfDay(currentTimeRef.current, sunLight, hemiLight);

    // 5. Build Compact Sacred Temple Architecture & Walkway
    const templeBuild = TempleBuilder.buildTemple();
    templeDataRef.current = templeBuild;
    scene.add(templeBuild.sceneGroup);

    // 6. Ambient Particle System (Diyas & Sacred Incense)
    const particleSystem = new TempleParticleSystem(scene);
    particlesRef.current = particleSystem;

    // 7. Free Mouse Drag & Touch Controls (NO SCREEN LOCK)
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'shift' && !e.repeat) {
        onToggleSittingRef.current();
      }
      keysPressed.current[key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const canvasEl = renderer.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingMouse.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingMouse.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        playerYaw.current -= dx * 0.0035;
        playerPitch.current -= dy * 0.0035;
        playerPitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, playerPitch.current));
      }
    };

    const handleMouseUp = () => {
      isDraggingMouse.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartPos.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };

      playerYaw.current -= dx * 0.005;
      playerPitch.current -= dy * 0.005;
      playerPitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, playerPitch.current));
    };

    const handleTouchEnd = () => {
      touchStartPos.current = null;
    };

    canvasEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasEl.addEventListener('touchstart', handleTouchStart);
    canvasEl.addEventListener('touchmove', handleTouchMove);
    canvasEl.addEventListener('touchend', handleTouchEnd);

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Render & Physics Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let autoCycleTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Subtle slow movement of mountain valley clouds
      cloudMeshes.forEach((c) => {
        c.rotation.z += delta * 0.003;
      });

      // Handle Procedural Day/Night Cycle Progression
      if (isAutoCycleRef.current) {
        // Full smooth cycle every 180 seconds
        autoCycleTimer += delta * (1.0 / 180.0);
        const osc = 0.5 - 0.5 * Math.cos(autoCycleTimer * Math.PI * 2);
        currentTimeRef.current = osc;
        if (onTimeChangeRef.current) {
          onTimeChangeRef.current(osc);
        }
      }

      // Synchronize sky dome and mountain lighting on time updates
      if (
        updateTimeFnRef.current &&
        sunLightRef.current &&
        hemiLightRef.current &&
        Math.abs(currentTimeRef.current - lastAppliedTimeRef.current) > 0.0005
      ) {
        lastAppliedTimeRef.current = currentTimeRef.current;
        updateTimeFnRef.current(currentTimeRef.current, sunLightRef.current, hemiLightRef.current);
      }

      // Player Sitting & Elevation Physics
      const isSitting = isSittingRef.current;

      // Temple steps & plinth elevation calculation
      let plinthElevation = 0;
      if (playerPos.current.z <= 5.5 && playerPos.current.z >= -6.0 && Math.abs(playerPos.current.x) <= 4.2) {
        if (playerPos.current.z > 3.8) {
          const stepRatio = (5.5 - playerPos.current.z) / 1.7;
          plinthElevation = Math.min(1.0, Math.max(0, stepRatio)) * 0.55;
        } else {
          plinthElevation = 0.55;
        }
      }

      // Base eye level: 1.65m when standing, 0.85m when sitting down in prayer
      const targetEyeY = (isSitting ? 0.85 : 1.65) + plinthElevation;
      playerPos.current.y += (targetEyeY - playerPos.current.y) * 0.16;

      // Player Movement Physics
      const keys = keysPressed.current;
      const moveDir = new THREE.Vector3();
      if (keys['w'] || keys['arrowup']) moveDir.z -= 1;
      if (keys['s'] || keys['arrowdown']) moveDir.z += 1;
      if (keys['a'] || keys['arrowleft']) moveDir.x -= 1;
      if (keys['d'] || keys['arrowright']) moveDir.x += 1;

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        // Shift makes player sit down (slower peaceful movement while seated)
        const moveSpeed = (isSitting ? 0.9 : 2.8) * delta;

        const sinY = Math.sin(playerYaw.current);
        const cosY = Math.cos(playerYaw.current);

        const worldX = moveDir.x * cosY + moveDir.z * sinY;
        const worldZ = -moveDir.x * sinY + moveDir.z * cosY;

        const nextPos = playerPos.current.clone().add(new THREE.Vector3(worldX * moveSpeed, 0, worldZ * moveSpeed));

        let isBlocked = false;
        const playerBox = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(nextPos.x, playerPos.current.y, nextPos.z),
          new THREE.Vector3(0.6, 1.8, 0.6)
        );

        for (const obs of templeBuild.collisionObstacles) {
          if (obs.intersectsBox(playerBox)) {
            isBlocked = true;
            break;
          }
        }

        const distFromCenter = Math.sqrt(nextPos.x * nextPos.x + nextPos.z * nextPos.z);
        if (!isBlocked && distFromCenter < 21.0) {
          playerPos.current.x = nextPos.x;
          playerPos.current.z = nextPos.z;
        }
      }

      // Camera Orientation
      camera.position.copy(playerPos.current);
      const euler = new THREE.Euler(playerPitch.current, playerYaw.current, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // Flag Wave Animation in Mountain Breeze
      const timeSec = now * 0.001;
      templeBuild.clothFlags.forEach((flag, idx) => {
        const geo = flag.geometry;
        if (geo && (geo as THREE.PlaneGeometry).attributes.position) {
          const posAttr = (geo as THREE.PlaneGeometry).attributes.position;
          for (let i = 0; i < posAttr.count; i++) {
            const vx = posAttr.getX(i);
            const wave = Math.sin(timeSec * 4.0 + vx * 2.0 + idx) * 0.14 * (vx / 2.2);
            posAttr.setZ(i, wave);
          }
          posAttr.needsUpdate = true;
        }
      });

      // Diya Flame Flickering
      templeBuild.diyaFlames.forEach((flame, fIdx) => {
        const flicker = 0.94 + Math.sin(timeSec * 7.5 + fIdx * 2.5) * 0.08;
        flame.scale.set(flicker, flicker * 1.05, flicker);
      });

      // Particle update
      particleSystem.update(delta, true);

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvasEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      particleSystem.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-stone-950">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
