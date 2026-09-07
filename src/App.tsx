import React, { useState, useEffect } from 'react';
import { TempleCanvas } from './components/TempleCanvas';
import { ChalisaPlayer } from './components/ChalisaPlayer';
import { Sun, Moon, Wind, Volume2, VolumeX } from 'lucide-react';
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
      />

      {/* Top Header: Temple Title on Left & Chalisa Quick Bar on Right */}
      <header className="pointer-events-none absolute top-0 inset-x-0 z-30 p-2.5 sm:p-4 md:p-5 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
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

      {/* Bottom Footer: Coordinated Atmosphere Dock & Posture Controls (Never Overlaps) */}
      <footer className="pointer-events-none absolute bottom-0 inset-x-0 z-30 p-2.5 sm:p-4 md:p-5 flex flex-col md:flex-row items-center md:items-end justify-between gap-2 sm:gap-3">
        {/* Atmosphere & Ambience Dock */}
        <div
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md text-stone-200 select-none max-w-full"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Day Button */}
          <button
            onClick={() => setTimeOfDay(0.0)}
            className="flex items-center gap-1 text-xs text-stone-300 hover:text-amber-300 transition-colors cursor-pointer p-1"
            title="Jump to Full Day"
          >
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] font-medium hidden sm:inline">Day</span>
          </button>

          {/* Day/Night Slider */}
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
            className="w-16 sm:w-24 md:w-28 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            title="Day / Night Atmosphere Slider"
          />

          {/* Night Button */}
          <button
            onClick={() => setTimeOfDay(1.0)}
            className="flex items-center gap-1 text-xs text-stone-300 hover:text-indigo-300 transition-colors cursor-pointer p-1"
            title="Jump to Starry Night"
          >
            <span className="text-[11px] font-medium hidden sm:inline">Night</span>
            <Moon className="w-4 h-4 text-indigo-300 shrink-0" />
          </button>

          <div className="h-4 w-px bg-stone-700/80 mx-0.5" />

          {/* Mountain Ambience Audio */}
          <button
            onClick={() => {
              const muted = mountainAmbience.toggleMute();
              setIsAmbienceMuted(muted);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
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
            <span className="text-[11px] whitespace-nowrap">
              {isAmbienceMuted ? 'Muted' : 'Ambience'}
            </span>
          </button>
        </div>

        {/* Seated Prayer & Exploration Guidance Dock */}
        <div
          className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md text-xs text-stone-300 select-none"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Sit in Prayer / Stand Toggle Button */}
          <button
            id="sit-stand-prayer-btn"
            onClick={handleToggleSitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-95 ${
              isSitting
                ? 'bg-amber-500 text-stone-950 font-bold ring-2 ring-amber-400/50'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="Toggle seated prayer posture (or press Shift on keyboard)"
          >
            <span className="font-cinzel">{isSitting ? 'Seated in Prayer' : 'Sit in Prayer'}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Shift)</span>
          </button>

          <div className="h-4 w-px bg-stone-700/80 mx-0.5 hidden sm:block" />

          {/* Movement Guidance */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-400">
            <span>Drag to look</span>
            <span className="text-stone-600">•</span>
            <span>WASD / Touch to walk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
