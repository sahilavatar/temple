import React, { useState, useEffect, useRef } from 'react';
import { TempleCanvas } from './components/TempleCanvas';
import { ChalisaPlayer } from './components/ChalisaPlayer';
import { VirtualJoystick } from './components/VirtualJoystick';
import { Sun, Moon, Wind, Volume2, VolumeX, Gamepad2 } from 'lucide-react';
import { mountainAmbience } from './audio/MountainAmbience';

export default function App() {
  // Day-Dusk Cycle State: 0.0 = Crisp Day, 0.55 = Golden Dusk / Sunset, 1.0 = Twilight Night
  const [timeOfDay, setTimeOfDay] = useState<number>(0.0);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(false);

  // Mountain Ambience Audio State (Procedural Mountain Wind & Alpine Birds)
  const [isAmbienceMuted, setIsAmbienceMuted] = useState<boolean>(false);

  // Seated prayer posture state (synced with camera & 3D space)
  const [isSitting, setIsSitting] = useState<boolean>(false);
  const handleToggleSitting = () => setIsSitting((prev) => !prev);

  // Virtual joystick visibility (defaults to true so it is immediately visible on mobile, tablet, and desktop)
  const [isJoystickVisible, setIsJoystickVisible] = useState<boolean>(true);

  // Virtual joystick vector for mobile/tablet touchscreen walking
  const joystickVectorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleJoystickMove = (vec: { x: number; y: number }) => {
    joystickVectorRef.current = vec;
  };

  useEffect(() => {
    // Start ambient mountain soundscape on mount / gesture
    mountainAmbience.start();
    return () => {
      mountainAmbience.stop();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* 3D Virtual Hanuman Temple Canvas */}
      <TempleCanvas
        timeOfDay={timeOfDay}
        isAutoDayCycle={isAutoCycle}
        onTimeChange={(t) => setTimeOfDay(t)}
        isSitting={isSitting}
        onToggleSitting={handleToggleSitting}
        joystickVectorRef={joystickVectorRef}
      />

      {/* Mini Joystick Controller for Mobile, Tablet & Touchscreen Walking */}
      <VirtualJoystick onMove={handleJoystickMove} visible={isJoystickVisible} />

      {/* Top Header: Temple Title on Left & Chalisa Quick Bar on Right */}
      <header className="pointer-events-none fixed top-0 inset-x-0 z-30 p-2.5 sm:p-4 md:p-5 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Sacred Temple Badge */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-stone-900/90 border border-amber-500/35 shadow-2xl backdrop-blur-md">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 font-bold shadow-md shrink-0">
            <span className="font-serif text-sm sm:text-base select-none">ॐ</span>
          </div>
          <div>
            <h1 className="text-xs sm:text-sm md:text-base font-bold font-cinzel text-amber-300 tracking-wider whitespace-nowrap">
              Virtual Hanuman Temple
            </h1>
          </div>
        </div>

        {/* Hanuman Chalisa Devotional Quick Bar */}
        <div className="pointer-events-auto">
          <ChalisaPlayer />
        </div>
      </header>

      {/* Bottom Floating Control Dock (Positioned on the bottom-right so it never touches the Joystick on bottom-left) */}
      <div
        className="pointer-events-none fixed z-40 flex items-center gap-2 select-none"
        style={{
          right: 'max(12px, env(safe-area-inset-right, 12px))',
          bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        }}
      >
        <div
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-stone-900/92 border border-amber-500/30 shadow-2xl backdrop-blur-md text-xs text-stone-200"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Day / Night Atmospheric Cycle Controls */}
          {/* Mobile compact Day/Night quick toggle (< 640px) */}
          <button
            onClick={() => {
              setIsAutoCycle(false);
              setTimeOfDay((prev) => (prev > 0.5 ? 0.0 : 1.0));
            }}
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-xl bg-stone-800/90 hover:bg-stone-700/80 text-amber-300 transition-all cursor-pointer border border-stone-700"
            title={timeOfDay > 0.5 ? 'Switch to Day' : 'Switch to Night'}
            aria-label="Toggle Day and Night"
          >
            {timeOfDay > 0.5 ? (
              <Moon className="w-4 h-4 text-indigo-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Desktop/Tablet Day/Night slider (>= 640px) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setTimeOfDay(0.0)}
              className="flex items-center gap-1 text-xs text-stone-300 hover:text-amber-300 transition-colors cursor-pointer p-0.5"
              title="Jump to Full Day"
            >
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] font-medium">Day</span>
            </button>

            <input
              id="day-night-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeOfDay}
              onChange={(e) => {
                setIsAutoCycle(false);
                setTimeOfDay(parseFloat(e.target.value));
              }}
              className="w-16 md:w-24 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              title="Day / Night Atmosphere Slider"
            />

            <button
              onClick={() => setTimeOfDay(1.0)}
              className="flex items-center gap-1 text-xs text-stone-300 hover:text-indigo-300 transition-colors cursor-pointer p-0.5"
              title="Jump to Starry Night"
            >
              <Moon className="w-4 h-4 text-indigo-300 shrink-0" />
              <span className="text-[11px] font-medium">Night</span>
            </button>
          </div>

          <div className="h-4 w-px bg-stone-700/80 mx-0.5" />

          {/* Mountain Ambience Audio Toggle */}
          <button
            onClick={() => {
              const muted = mountainAmbience.toggleMute();
              setIsAmbienceMuted(muted);
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              !isAmbienceMuted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-sm'
                : 'bg-stone-800/90 text-stone-400 hover:text-stone-300 border border-stone-700'
            }`}
            title={isAmbienceMuted ? 'Unmute Mountain Wind & Birds' : 'Mute Mountain Wind & Birds'}
          >
            <Wind className={`w-3.5 h-3.5 ${!isAmbienceMuted ? 'text-emerald-400 animate-pulse' : 'text-stone-500'}`} />
            {!isAmbienceMuted ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="text-[11px] hidden md:inline whitespace-nowrap">
              {isAmbienceMuted ? 'Muted' : 'Sound'}
            </span>
          </button>

          <div className="h-4 w-px bg-stone-700/80 mx-0.5" />

          {/* Sit in Prayer / Stand Toggle Button */}
          <button
            id="sit-stand-prayer-btn"
            onClick={handleToggleSitting}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-95 ${
              isSitting
                ? 'bg-amber-500 text-stone-950 font-bold ring-2 ring-amber-400/50'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="Toggle seated prayer posture"
          >
            <span className="font-cinzel text-[11px] sm:text-xs">{isSitting ? 'Seated' : 'Prayer'}</span>
            <span className="text-[10px] opacity-75 hidden lg:inline">(Shift)</span>
          </button>

          <div className="h-4 w-px bg-stone-700/80 mx-0.5" />

          {/* Joystick Toggle Button */}
          <button
            onClick={() => setIsJoystickVisible((prev) => !prev)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isJoystickVisible
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:bg-amber-500/35'
                : 'bg-stone-800/90 text-stone-400 hover:text-stone-300 border border-stone-700'
            }`}
            title={isJoystickVisible ? 'Hide Virtual Joystick' : 'Show Virtual Joystick'}
            aria-label="Toggle Joystick"
          >
            <Gamepad2 className={`w-3.5 h-3.5 ${isJoystickVisible ? 'text-amber-400' : 'text-stone-500'}`} />
            <span className="text-[11px] hidden sm:inline">
              Joy: {isJoystickVisible ? 'On' : 'Off'}
            </span>
          </button>

          {/* Look hint on larger screens */}
          <div className="hidden lg:flex items-center text-[11px] text-stone-400 pl-1 border-l border-stone-700/80">
            <span>Drag to look</span>
          </div>
        </div>
      </div>
    </div>
  );
}
