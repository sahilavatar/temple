import React, { useState } from 'react';
import { AtmospherePreset, CameraViewpoint } from '../types';
import {
  Flame,
  Bell,
  Sparkles,
  Compass,
  Sun,
  Sunset,
  Cloud,
  HelpCircle,
  X,
} from 'lucide-react';

interface ControlsOverlayProps {
  diyasLit: boolean;
  onToggleDiyas: () => void;
  atmosphere: AtmospherePreset;
  onSelectAtmosphere: (atm: AtmospherePreset) => void;
  onRingBell: () => void;
  onOfferFlowers: () => void;
  onPerformAarti: () => void;
  onSelectViewpoint: (viewpoint: CameraViewpoint) => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
}

export const VIEWPOINTS: CameraViewpoint[] = [
  {
    id: 'entrance',
    name: 'Mountain Terrace & Entrance',
    description: 'Mountain vista plinth overlooking alpine summits and guardian elephants',
    position: [0, 1.7, 18],
    yaw: 0,
    pitch: 0.05,
  },
  {
    id: 'mandapa',
    name: 'Mandapa Pillared Hall',
    description: 'Carved sandstone colonnade with lotus ceiling rosette and bronze bell',
    position: [0, 2.65, 5.8],
    yaw: 0,
    pitch: 0.1,
  },
  {
    id: 'garbhagriha',
    name: 'Sanctum Sanctorum',
    description: 'Sacred inner womb chamber threshold with dark marble mandala floor',
    position: [0, 2.65, -7.5],
    yaw: 0,
    pitch: 0.05,
  },
  {
    id: 'altar_darshan',
    name: 'Lord Hanuman Darshan',
    description: 'Close reverence before sculpted Lord Hanuman, golden mace, and altar flame',
    position: [0, 2.65, -11.0],
    yaw: 0,
    pitch: 0.15,
  },
];

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  diyasLit,
  onToggleDiyas,
  atmosphere,
  onSelectAtmosphere,
  onRingBell,
  onOfferFlowers,
  onPerformAarti,
  onSelectViewpoint,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showViewpoints, setShowViewpoints] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4">
      {/* Top Header & Brand Bar */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Temple Brand Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-stone-900/90 border border-amber-500/40 shadow-2xl backdrop-blur-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-md">
            <Sun className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-cinzel text-amber-300 tracking-wide">
              Virtual Hanuman Temple
            </h1>
            <p className="text-[11px] text-stone-400">
              Sunny Mountain Summit Sanctuary • Ancient Indian Architecture
            </p>
          </div>
        </div>

        {/* Top Control Tools (Atmosphere, Viewpoints, Guide) */}
        <div className="flex items-center gap-2">
          {/* Atmosphere Selector */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900/90 border border-stone-800 backdrop-blur-xl">
            <button
              onClick={() => onSelectAtmosphere('sunny')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                atmosphere === 'sunny'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Sunny Mountain Top Atmosphere"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectAtmosphere('golden_hour')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                atmosphere === 'golden_hour'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Golden Hour Summit Atmosphere"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectAtmosphere('mountain_mist')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                atmosphere === 'mountain_mist'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Morning Mountain Mist & Valley Clouds"
            >
              <Cloud className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Teleport Menu Toggle */}
          <button
            onClick={() => setShowViewpoints(!showViewpoints)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs font-medium backdrop-blur-xl transition-all"
            title="Temple Teleportation Bookmarks"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Viewpoints</span>
          </button>

          {/* Help Modal Toggle */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors backdrop-blur-xl"
            title="POV Controls & Temple Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewpoint Bookmarks Dropdown */}
      {showViewpoints && (
        <div className="pointer-events-auto absolute top-20 right-4 w-72 rounded-2xl bg-stone-900/95 border border-amber-500/40 p-3 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-1.5">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-stone-800 text-xs font-cinzel font-bold text-amber-400">
            <span>Temple Navigation Bookmarks</span>
            <button onClick={() => setShowViewpoints(false)}>
              <X className="w-4 h-4 text-stone-400 hover:text-stone-200" />
            </button>
          </div>
          {VIEWPOINTS.map((vp) => (
            <button
              key={vp.id}
              onClick={() => {
                onSelectViewpoint(vp);
                setShowViewpoints(false);
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-amber-950/40 border border-transparent hover:border-amber-500/30 transition-all text-xs"
            >
              <div className="font-semibold text-amber-200">{vp.name}</div>
              <div className="text-[11px] text-stone-400 line-clamp-1">{vp.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Bar: Interactive Sacred Ritual Actions & Master Diya Toggle */}
      <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-3 w-full">
        {/* Primary Interactive Diya Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-virtual-diyas-btn"
            onClick={onToggleDiyas}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-cinzel font-bold text-xs sm:text-sm transition-all duration-300 shadow-2xl backdrop-blur-xl active:scale-95 ${
              diyasLit
                ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-amber-50 ring-2 ring-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                : 'bg-stone-900/90 hover:bg-stone-800/90 text-amber-300 border border-amber-500/40'
            }`}
          >
            <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${diyasLit ? 'animate-pulse text-yellow-200' : 'text-amber-400'}`} />
            <span>{diyasLit ? 'Diya Lamps Glowing (Click to Dim)' : 'Light Virtual Diya Lamps'}</span>
          </button>
        </div>

        {/* Quick Sacred Ritual Toolbar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl">
          {/* Ring Bell */}
          <button
            onClick={onRingBell}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-amber-500 hover:text-stone-950 text-amber-300 font-medium text-xs transition-all active:scale-90"
            title="Ring Sacred Bronze Temple Bell"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Ring Bell</span>
          </button>

          {/* Offer Flowers */}
          <button
            onClick={onOfferFlowers}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-orange-500 hover:text-stone-950 text-orange-300 font-medium text-xs transition-all active:scale-90"
            title="Offer Fresh Marigold Petals (Pushpanjali)"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Offer Flowers</span>
          </button>

          {/* Perform Aarti */}
          <button
            onClick={onPerformAarti}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-amber-500 hover:text-stone-950 text-yellow-300 font-medium text-xs transition-all active:scale-90"
            title="Wave Sacred Aarti Lamp"
          >
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">Wave Aarti</span>
          </button>
        </div>
      </div>

      {/* Help Modal Guide */}
      {showHelp && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-amber-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
              <h3 className="text-base font-bold font-cinzel text-amber-300">
                Temple Exploration & Controls
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  W A S D / Arrows
                </span>
                <span>Walk through the sunny mountain temple courtyard, hall, and sanctum</span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  Mouse Drag / Click
                </span>
                <span>Look around in full 360° point-of-view; click canvas to lock pointer</span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  E Key / Click
                </span>
                <span>Interact with sacred artifacts (Lord Hanuman statue, mace, diyas, bell, offerings)</span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  F Key
                </span>
                <span>Quick trigger: Shower fresh marigold petals</span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  L Key
                </span>
                <span>Toggle all virtual diya oil lamps on or off</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-cinzel text-xs transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
