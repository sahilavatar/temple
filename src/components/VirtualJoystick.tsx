import React, { useState, useEffect, useRef, useCallback } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
  visible?: boolean;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  visible = true,
}) => {
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const [isEngaged, setIsEngaged] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  // Max displacement radius for the thumb stick (dynamically computed on pointer down)
  const maxRadiusRef = useRef<number>(28);

  const processPointer = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const distance = Math.hypot(dx, dy);

    const maxRadius = maxRadiusRef.current;
    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPosition({ x: knobX, y: knobY });

    // Normalized vector from -1 to 1
    // x = strafe left/right (-1 to 1), y = forward/backward (-1 to 1)
    const normX = knobX / maxRadius;
    const normY = knobY / maxRadius;

    // Deadzone (8%) so resting touch doesn't cause unintentional player drift
    if (Math.hypot(normX, normY) < 0.08) {
      onMoveRef.current({ x: 0, y: 0 });
    } else {
      onMoveRef.current({ x: normX, y: normY });
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (activePointerIdRef.current !== null) return;

    const el = containerRef.current;
    if (!el) return;

    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // safe fallback for older browsers
    }

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Stick moves up to ~32% of base radius
    maxRadiusRef.current = Math.max(24, rect.width * 0.32);
    centerRef.current = { x: centerX, y: centerY };
    activePointerIdRef.current = e.pointerId;
    setIsEngaged(true);

    processPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId) {
      e.stopPropagation();
      processPointer(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId) {
      e.stopPropagation();
      const el = containerRef.current;
      if (el) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // safe fallback
        }
      }
      activePointerIdRef.current = null;
      setIsEngaged(false);
      setKnobPosition({ x: 0, y: 0 });
      onMoveRef.current({ x: 0, y: 0 });
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      id="mobile-virtual-joystick"
      className="fixed z-50 select-none touch-none pointer-events-auto"
      style={{
        left: 'max(14px, env(safe-area-inset-left, 14px))',
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
      }}
      aria-label="Virtual Joystick for walking and exploring temple"
    >
      {/* Outer Joystick Base Ring */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          isEngaged
            ? 'bg-stone-950/90 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-105'
            : 'bg-stone-950/80 border-2 border-amber-500/70 shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:border-amber-400'
        }`}
      >
        {/* Subtle WALK Helper Badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500/90 text-stone-950 text-[9px] font-bold tracking-wider uppercase pointer-events-none shadow-sm">
          Walk
        </div>

        {/* Directional Arrow Indicators */}
        <span className="absolute top-1 text-[10px] font-bold text-amber-300 drop-shadow-[0_0_3px_rgba(245,158,11,0.8)] pointer-events-none">▲</span>
        <span className="absolute bottom-1 text-[10px] font-bold text-amber-300 drop-shadow-[0_0_3px_rgba(245,158,11,0.8)] pointer-events-none">▼</span>
        <span className="absolute left-1.5 text-[10px] font-bold text-amber-300 drop-shadow-[0_0_3px_rgba(245,158,11,0.8)] pointer-events-none">◀</span>
        <span className="absolute right-1.5 text-[10px] font-bold text-amber-300 drop-shadow-[0_0_3px_rgba(245,158,11,0.8)] pointer-events-none">▶</span>

        {/* Concentric Guide Ring */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-amber-500/30 pointer-events-none flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
        </div>

        {/* Movable Thumb Stick */}
        <div
          className={`absolute w-9 h-9 sm:w-11 sm:h-11 rounded-full pointer-events-none flex items-center justify-center transition-transform ${
            isEngaged ? 'duration-75 scale-110' : 'duration-150 scale-100 ease-out'
          }`}
          style={{
            transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
          }}
        >
          {/* Sacred Golden Om Stick Finish */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 border-2 border-amber-200 shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <span className="font-serif text-xs sm:text-sm font-bold text-stone-950 select-none">ॐ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
