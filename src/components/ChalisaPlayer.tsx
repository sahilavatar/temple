import React, { useState, useEffect, useRef } from 'react';
import { HANUMAN_CHALISA_VERSES } from '../data/chalisaData';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  BookOpen,
  X,
  Tv,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ChalisaPlayerProps {
  onRingBell?: () => void;
  className?: string;
}

declare global {
  interface Window {
    YT?: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const ChalisaPlayer: React.FC<ChalisaPlayerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentVerseIdx, setCurrentVerseIdx] = useState<number>(0);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isVideoDockOpen, setIsVideoDockOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(580); // ~9:40 typical length

  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    // If YouTube script isn't on the page, inject it
    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('youtube-hanuman-chalisa-iframe', {
          events: {
            onStateChange: (event: any) => {
              if (event.data === window.YT?.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT?.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT?.PlayerState.ENDED) {
                setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    // Interval to track playback time and synchronize verse
    const syncInterval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const time = playerRef.current.getCurrentTime();
          if (typeof time === 'number') {
            setCurrentTime(time);
            // Match corresponding verse by timestamp
            for (let i = HANUMAN_CHALISA_VERSES.length - 1; i >= 0; i--) {
              if (time >= HANUMAN_CHALISA_VERSES[i].timestamp) {
                setCurrentVerseIdx(i);
                break;
              }
            }
          }
          const dur = playerRef.current.getDuration();
          if (typeof dur === 'number' && dur > 0) {
            setVideoDuration(dur);
          }
        } catch (e) {
          // ignore if player not ready
        }
      }
    }, 800);

    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  const sendIframeCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      } else {
        sendIframeCommand('pauseVideo');
      }
      setIsPlaying(false);
    } else {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      } else {
        sendIframeCommand('playVideo');
      }
      setIsPlaying(true);
    }
  };

  const handleSeekVerse = (verseIdx: number) => {
    const verse = HANUMAN_CHALISA_VERSES[verseIdx];
    if (!verse) return;
    const targetSeconds = verse.timestamp;
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(targetSeconds, true);
      playerRef.current.playVideo();
    } else {
      sendIframeCommand('seekTo', [targetSeconds, true]);
      sendIframeCommand('playVideo');
    }
    setCurrentVerseIdx(verseIdx);
    setIsPlaying(true);
  };

  const handlePrevVerse = () => {
    const newIdx = Math.max(0, currentVerseIdx - 1);
    handleSeekVerse(newIdx);
  };

  const handleNextVerse = () => {
    const newIdx = Math.min(HANUMAN_CHALISA_VERSES.length - 1, currentVerseIdx + 1);
    handleSeekVerse(newIdx);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (playerRef.current) {
      if (nextMute && typeof playerRef.current.mute === 'function') {
        playerRef.current.mute();
      } else if (!nextMute && typeof playerRef.current.unMute === 'function') {
        playerRef.current.unMute();
      }
    }
    sendIframeCommand(nextMute ? 'mute' : 'unMute');
  };

  const currentVerse = HANUMAN_CHALISA_VERSES[currentVerseIdx] || HANUMAN_CHALISA_VERSES[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Hidden/Docked Official YouTube Embed for Audio & Video */}
      <div
        className={`fixed transition-all duration-300 z-40 ${
          isVideoDockOpen
            ? 'bottom-24 sm:bottom-20 right-2 sm:right-4 w-[calc(100vw-1.5rem)] max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-amber-500/50 bg-stone-900/95 backdrop-blur-xl'
            : 'top-[-9999px] left-[-9999px] w-1 h-1 opacity-0 pointer-events-none'
        }`}
      >
        {isVideoDockOpen && (
          <div className="flex items-center justify-between px-3 py-2 bg-stone-950/80 border-b border-stone-800 text-xs text-amber-300 font-semibold font-cinzel">
            <span>Official Video • Shri Hanuman Chalisa</span>
            <button
              onClick={() => setIsVideoDockOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="aspect-video w-full bg-black">
          <iframe
            ref={iframeRef}
            id="youtube-hanuman-chalisa-iframe"
            title="Hanuman Chalisa Official Recording"
            src="https://www.youtube-nocookie.com/embed/AETFvQonfV8?enablejsapi=1&playsinline=1&rel=0&modestbranding=1"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {isVideoDockOpen && (
          <div className="p-2.5 bg-stone-950/90 text-[11px] text-stone-300 flex items-center justify-between">
            <span className="font-cinzel text-amber-400 font-medium truncate max-w-[160px]">
              {currentVerse.title}
            </span>
            <span className="text-stone-400">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </span>
          </div>
        )}
      </div>

      {/* Floating Hanuman Chalisa Devotional Quick Bar */}
      <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
        <div className="flex items-center rounded-2xl bg-stone-900/90 border border-amber-500/40 p-1 sm:p-1.5 shadow-2xl backdrop-blur-xl">
          {/* Primary Play/Pause Hanuman Chalisa Button */}
          <button
            id="play-hanuman-chalisa-btn"
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 shadow-md ${
              isPlaying
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-amber-50 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-stone-800/80 hover:bg-stone-700/80 text-amber-300 border border-amber-500/30'
            }`}
            title={isPlaying ? 'Pause Hanuman Chalisa' : 'Play Hanuman Chalisa'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current animate-pulse" />
                <span className="tracking-wide font-cinzel font-semibold whitespace-nowrap">
                  Pause Chalisa
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-amber-400" />
                <span className="tracking-wide font-cinzel font-semibold whitespace-nowrap">
                  <span className="hidden sm:inline">Play </span>Chalisa
                </span>
              </>
            )}
          </button>

          {/* Verse Reader Toggle */}
          <button
            onClick={() => setIsLyricsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-stone-300 hover:text-amber-300 transition-colors border-l border-stone-800 ml-1"
            title="Open Hymns Reader & English Meaning"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden md:inline font-medium max-w-[110px] truncate">
              {currentVerse.title}
            </span>
            <span className="hidden sm:inline md:hidden font-medium text-[11px]">
              Hymns
            </span>
          </button>

          {/* Toggle Video Dock */}
          <button
            onClick={() => setIsVideoDockOpen(!isVideoDockOpen)}
            className={`p-1.5 sm:p-2 rounded-lg text-xs transition-colors ml-0.5 sm:ml-1 ${
              isVideoDockOpen
                ? 'text-amber-300 bg-amber-950/60 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={isVideoDockOpen ? 'Hide Video Window' : 'Show Video Window'}
          >
            <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Mute/Unmute Audio */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 sm:p-2 rounded-lg text-stone-400 hover:text-stone-200 text-xs transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Mini Live Verse Card (When playing and modal closed) */}
      {isPlaying && !isLyricsOpen && (
        <div
          onClick={() => setIsLyricsOpen(true)}
          className="pointer-events-auto absolute top-16 sm:top-20 right-2 sm:right-4 z-20 w-[calc(100vw-1.5rem)] max-w-xs sm:max-w-sm cursor-pointer rounded-2xl bg-stone-900/90 border border-amber-500/30 p-3 sm:p-3.5 shadow-xl backdrop-blur-md hover:border-amber-400/60 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-cinzel mb-1">
            <span className="font-semibold truncate pr-2">{currentVerse.title}</span>
            <span className="text-[10px] text-stone-400 shrink-0">Click for reader</span>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-amber-100 font-medium whitespace-pre-line leading-relaxed mb-1.5">
            "{currentVerse.transliteration}"
          </p>
          <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-2 leading-normal">
            {currentVerse.meaning}
          </p>
        </div>
      )}

      {/* Comprehensive Hanuman Chalisa Reader & Verse Navigator Modal */}
      {isLyricsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-stone-900/95 border border-amber-500/40 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
              <div>
                <h2 className="text-lg font-bold font-cinzel text-amber-300 tracking-wide">
                  Shri Hanuman Chalisa • 40 Hymns of Devotion
                </h2>
                <p className="text-xs text-stone-400">
                  Composed by Sage Tulsidas • Pure English Translation & Meaning
                </p>
              </div>
              <button
                onClick={() => setIsLyricsOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Verse Spotlight Card */}
            <div className="p-6 border-b border-stone-800/80 bg-gradient-to-b from-amber-950/20 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider font-cinzel">
                  {currentVerse.title} ({currentVerseIdx + 1} of {HANUMAN_CHALISA_VERSES.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevVerse}
                    disabled={currentVerseIdx === 0}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300"
                    title="Previous Verse"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleTogglePlay}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={handleNextVerse}
                    disabled={currentVerseIdx === HANUMAN_CHALISA_VERSES.length - 1}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300"
                    title="Next Verse"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Romanized Chanting text */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-amber-500/20 mb-3 shadow-inner">
                <p className="text-base sm:text-lg font-serif italic text-amber-200 font-semibold leading-relaxed tracking-wide text-center whitespace-pre-line">
                  "{currentVerse.transliteration}"
                </p>
              </div>

              {/* Spiritual Translation in English */}
              <div className="text-xs sm:text-sm text-stone-200 bg-stone-800/50 p-3.5 rounded-xl border border-stone-700/60 leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-1">Spiritual Meaning:</span>
                {currentVerse.meaning}
              </div>
            </div>

            {/* Scrollable Verse List Navigator */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-60">
              <div className="text-xs uppercase tracking-wider text-stone-400 px-2 font-medium">
                Select Any Verse to Seek in Audio Video:
              </div>
              {HANUMAN_CHALISA_VERSES.map((verse, idx) => (
                <div
                  key={verse.id}
                  onClick={() => handleSeekVerse(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between text-left ${
                    idx === currentVerseIdx
                      ? 'bg-amber-950/50 border border-amber-500/50 text-amber-200 shadow-md'
                      : 'bg-stone-950/40 hover:bg-stone-800/60 border border-stone-800/60 text-stone-300'
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <span className="text-[11px] font-cinzel text-amber-400/80 font-bold block mb-0.5">
                      {verse.title} ({formatTime(verse.timestamp)})
                    </span>
                    <p className="font-serif italic text-xs text-stone-300 line-clamp-1">
                      {verse.transliteration}
                    </p>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                      {verse.meaning}
                    </p>
                  </div>
                  {idx === currentVerseIdx && isPlaying && (
                    <span className="flex h-2.5 w-2.5 relative mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400">
              <span>Recited with devotion and righteous courage</span>
              <button
                onClick={() => setIsLyricsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors font-medium"
              >
                Close & Return to Temple
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
