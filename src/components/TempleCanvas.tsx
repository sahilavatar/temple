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
  joystickVectorRef?: React.RefObject<{ x: number; y: number }>;
}

export const TempleCanvas: React.FC<TempleCanvasProps> = ({
  timeOfDay,
  isAutoDayCycle = false,
  onTimeChange,
  isSitting,
  onToggleSitting,
  joystickVectorRef,
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
  const playerPos = useRef(new THREE.Vector3(0, 1.65, 13.5));
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

  const joystickRef = useRef(joystickVectorRef);
  useEffect(() => {
    joystickRef.current = joystickVectorRef;
  }, [joystickVectorRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fog blending seamlessly with the mountain atmosphere
    scene.fog = new THREE.FogExp2(0xcfe2f7, 0.0035);

    // Calculate dynamic FOV so portrait mobile view has a wide, comfortable horizontal perspective (~72°)
    // instead of the suffocatingly zoomed-in ~29° view caused by a fixed vertical FOV
    const updateCameraProjection = (cam: THREE.PerspectiveCamera, w: number, h: number) => {
      if (w <= 0 || h <= 0) return;
      const aspect = w / h;
      cam.aspect = aspect;

      if (aspect < 1.0) {
        // Portrait phone/tablet: calculate vertical FOV to preserve horizontal field of view
        const targetHFOVRad = 74 * (Math.PI / 180);
        const vFOVRad = 2 * Math.atan(Math.tan(targetHFOVRad / 2) / aspect);
        cam.fov = Math.min(88, Math.max(60, (vFOVRad * 180) / Math.PI));
      } else {
        // Landscape / Desktop wide perspective
        cam.fov = 60;
      }
      cam.updateProjectionMatrix();
    };

    const initialW = container.clientWidth || window.innerWidth;
    const initialH = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, initialW / initialH, 0.1, 1000);
    updateCameraProjection(camera, initialW, initialH);
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

    let lookTouchId: number | null = null;
    const lastLookPos = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      if (lookTouchId === null && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        lookTouchId = touch.identifier;
        lastLookPos.x = touch.clientX;
        lastLookPos.y = touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === lookTouchId) {
          const dx = touch.clientX - lastLookPos.x;
          const dy = touch.clientY - lastLookPos.y;
          lastLookPos.x = touch.clientX;
          lastLookPos.y = touch.clientY;

          playerYaw.current -= dx * 0.004;
          playerPitch.current -= dy * 0.004;
          playerPitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, playerPitch.current));
          break;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouchId) {
          lookTouchId = null;
          break;
        }
      }
    };

    canvasEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasEl.addEventListener('touchstart', handleTouchStart);
    canvasEl.addEventListener('touchmove', handleTouchMove);
    canvasEl.addEventListener('touchend', handleTouchEnd);

    // Responsive Canvas Resize & Orientation Observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      updateCameraProjection(camera, width, height);
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

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

      // Virtual joystick vector from mobile/tablet touch
      const joy = joystickRef.current?.current;
      if (joy && (joy.x !== 0 || joy.y !== 0)) {
        moveDir.x += joy.x;
        moveDir.z += joy.y;
      }

      const inputLen = moveDir.length();
      if (inputLen > 0.005) {
        const speedScale = Math.min(1.0, inputLen);
        moveDir.normalize();
        // Slower peaceful movement while seated in prayer
        const baseSpeed = isSitting ? 0.9 : 2.8;
        const moveSpeed = baseSpeed * speedScale * delta;

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
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver.disconnect();

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
