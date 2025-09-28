// src/components/RumtekWalkthrough.tsx
import React, { useRef, useEffect } from 'react';
import { useAppContext } from 'src/context/AppContext.tsx';

const LANGUAGES = [
  { code: 'en', label: 'English', audio: 'src/assets/rumtek-audio-en.mp3' },
  { code: 'hi', label: 'Hindi', audio: 'src/assets/rumtek-audio-hi.mp3' },
  { code: 'fr', label: 'French', audio: 'src/assets/rumtek-audio-fr.mp3' },
  { code: 'it', label: 'Italian', audio: 'src/assets/rumtek-audio-it.mp3' },
  { code: 'jap', label: 'Japanese', audio: 'src/assets/rumtek-audio-jap.mp3' },
  { code: 'sp', label: 'Spanish', audio: 'src/assets/rumtek-audio-sp.mp3' },
];

const RumtekWalkthrough: React.FC = () => {
  const { state, stopWalkthrough, startWalkthrough } = useAppContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle language change
  useEffect(() => {
    if (state.walkthroughLanguage && audioRef.current) {
      const selectedLang = LANGUAGES.find(l => l.code === state.walkthroughLanguage);
      if (selectedLang) {
        audioRef.current.src = selectedLang.audio;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [state.walkthroughLanguage]);

  const handleLanguageClick = (lang: string) => {
    startWalkthrough(lang);
  };

  if (!state.isWalkthroughActive || state.selectedMonastery?.id !== '1') {
    return null; // Only show for Rumtek Monastery walkthrough
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Narrated Walkthrough - Rumtek Monastery</h2>

      {/* Video Player */}
      <video
        ref={videoRef}
        controls
        className="w-full max-h-[400px] rounded-xl mb-4"
      >
        <source src="src/assets/rumtek-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Language Options */}
      <div className="flex flex-wrap gap-3 mb-4">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageClick(lang.code)}
            className={`px-4 py-2 rounded-lg ${
              state.walkthroughLanguage === lang.code
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Audio Player (hidden, controlled by useEffect) */}
      <audio ref={audioRef} hidden />

      {/* Close button */}
      <button
        onClick={stopWalkthrough}
        className="mt-4 px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500"
      >
        Close Walkthrough
      </button>
    </div>
  );
};

export default RumtekWalkthrough;
