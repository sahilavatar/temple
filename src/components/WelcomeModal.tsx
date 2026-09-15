import React from 'react';
import { ArrowRight, Monitor, Smartphone } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onEnter }) => {
  if (!isOpen) return null;

  return (
    <div
      id="welcome-landing-screen"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-stone-950/20 backdrop-blur-[2px] transition-all duration-500 select-none pointer-events-auto"
    >
      {/* Sacred Floating Card - Ultra-compact, fits landscape/portrait without scrolling */}
      <div
        id="welcome-card"
        className="relative w-full max-w-[500px] max-h-[92dvh] rounded-2xl sm:rounded-3xl bg-stone-900/60 border border-amber-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 text-stone-100 flex flex-col justify-between gap-2.5 sm:gap-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luminous Golden Aura behind the card */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 text-center flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/30">
              <span className="font-serif text-sm sm:text-base leading-none select-none">ॐ</span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold font-cinzel text-amber-300 tracking-wider">
              Virtual Hanuman Temple
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-200/90 max-w-sm leading-tight">
            A peaceful 3D sanctuary dedicated to Lord Hanuman. Explore freely, listen to the sacred Chalisa, pray, and meditate.
          </p>
        </div>

        {/* Side-by-Side Dual Column Controls (Compact & Scannable) */}
        <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
          {/* Desktop Column */}
          <div className="flex flex-col gap-1 p-2 sm:p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-amber-400 font-semibold pb-0.5 border-b border-stone-800/60">
              <Monitor className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-cinzel text-[10px] sm:text-xs">Desktop</span>
            </div>
            <ul className="flex flex-col gap-1 text-stone-300 text-[10px] sm:text-[11px] leading-tight pt-0.5">
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Move:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">WASD</span>
              </li>
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Look:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Drag</span>
              </li>
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Meditate:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Prayer</span>
              </li>
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Full Screen:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Full</span>
              </li>
            </ul>
          </div>

          {/* Mobile Column */}
          <div className="flex flex-col gap-1 p-2 sm:p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-amber-400 font-semibold pb-0.5 border-b border-stone-800/60">
              <Smartphone className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-cinzel text-[10px] sm:text-xs">Touchscreen</span>
            </div>
            <ul className="flex flex-col gap-1 text-stone-300 text-[10px] sm:text-[11px] leading-tight pt-0.5">
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Move:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Joystick</span>
              </li>
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Look:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Swipe</span>
              </li>
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Meditate:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Prayer</span>
              </li>
              <li className="flex items-center justify-between gap-1">
                <span className="text-stone-400">Full Screen:</span>
                <span className="font-mono bg-stone-900/80 text-amber-200 px-1 py-0.2 rounded border border-stone-700/60 text-[9px] sm:text-[10px]">Full</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Prominent Glowing Amber-Gold "Enter Temple" Button */}
        <div className="relative z-10 flex flex-col items-center gap-1 pt-0.5">
          <button
            id="enter-temple-btn"
            onClick={onEnter}
            className="group relative w-full sm:w-auto min-w-[200px] px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-stone-950 font-bold font-cinzel text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_28px_rgba(245,158,11,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Enter Temple</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-950 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
