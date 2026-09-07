import React from 'react';
import { TempleArtifact } from '../types';
import { TEMPLE_LORE } from '../data/templeLore';
import {
  X,
  Bell,
  Flame,
  Sparkles,
  Info,
  Shield,
  Heart,
  BookOpen,
} from 'lucide-react';

interface ArtifactModalProps {
  artifact: TempleArtifact | null;
  onClose: () => void;
  diyasLit: boolean;
  onToggleDiyas: () => void;
  onOfferFlowers: () => void;
  onPerformAarti: () => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({
  artifact,
  onClose,
  diyasLit,
  onToggleDiyas,
  onOfferFlowers,
  onPerformAarti,
}) => {
  if (!artifact) return null;

  // Fetch detailed lore if available
  let loreKey = 'garbhagriha';
  if (artifact.type === 'bell') loreKey = 'bell';
  else if (artifact.type === 'diya') loreKey = 'diya';
  else if (artifact.type === 'gada') loreKey = 'gada';
  else if (artifact.type === 'flowers') loreKey = 'pushpanjali';
  else if (artifact.type === 'aarti') loreKey = 'aarti';
  else if (artifact.id === 'mandapa_lore') loreKey = 'mandapa';
  else if (artifact.id === 'shikhara_lore') loreKey = 'shikhara';
  else if (artifact.type === 'murti') loreKey = 'sindoor';

  const lore = TEMPLE_LORE[loreKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-stone-900/95 border border-amber-500/40 p-6 shadow-2xl overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 rounded-tr-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Sacred Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            {artifact.type === 'bell' && <Bell className="w-6 h-6 animate-bounce" />}
            {artifact.type === 'diya' && <Flame className="w-6 h-6" />}
            {artifact.type === 'flowers' && <Sparkles className="w-6 h-6" />}
            {artifact.type === 'aarti' && <Flame className="w-6 h-6" />}
            {artifact.type === 'gada' && <Shield className="w-6 h-6" />}
            {artifact.type === 'murti' && <Heart className="w-6 h-6 text-orange-400" />}
            {artifact.type === 'lore' && <BookOpen className="w-6 h-6" />}
            {artifact.type === 'sanctum' && <Info className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold font-cinzel text-amber-300">
              {artifact.name}
            </h3>
            {artifact.traditionalTitle && (
              <p className="text-xs text-amber-200/90 font-medium">
                {artifact.traditionalTitle}
              </p>
            )}
          </div>
        </div>

        {/* Description / Significance */}
        <p className="text-sm text-stone-300 mb-4 leading-relaxed bg-stone-950/40 p-3.5 rounded-xl border border-stone-800/80">
          {lore ? lore.summary : artifact.description}
        </p>

        {/* Sacred Devotional Meaning / Prayer if available */}
        {(lore?.mantra || artifact.mantra) && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/30">
            <span className="text-[11px] font-cinzel font-semibold uppercase tracking-wider text-amber-400 block mb-1">
              Sacred Devotional Inscription & Meaning
            </span>
            <p className="text-sm font-serif italic text-amber-100 font-medium leading-relaxed">
              "{lore?.mantra || artifact.mantra}"
            </p>
          </div>
        )}

        {/* Detailed Architectural & Spiritual Lore */}
        {lore && lore.details && (
          <div className="space-y-2 mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Spiritual & Architectural Lore:
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {lore.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons for Interactive Rituals */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
          {artifact.type === 'diya' && (
            <button
              onClick={onToggleDiyas}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold font-cinzel transition-all shadow-lg ${
                diyasLit
                  ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40'
              }`}
            >
              <Flame className="w-4 h-4" />
              {diyasLit ? 'Extinguish Diya Lamps' : 'Light All Virtual Diyas'}
            </button>
          )}

          {artifact.type === 'flowers' && (
            <button
              onClick={onOfferFlowers}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-bold font-cinzel transition-all shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Shower Marigold Petals
            </button>
          )}

          {artifact.type === 'aarti' && (
            <button
              onClick={onPerformAarti}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-stone-950 font-bold font-cinzel transition-all shadow-lg active:scale-95"
            >
              <Flame className="w-4 h-4" />
              Wave Sacred Aarti Flame
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
