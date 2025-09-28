import React from 'react';
import { X, Play, Pause, Volume2, Globe, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAppContext } from '@/context/AppContext';

interface NarratedWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NarratedWalkthroughModal: React.FC<NarratedWalkthroughModalProps> = ({
  isOpen,
  onClose
}) => {
  const { state } = useAppContext();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(180); // 3 minutes mock duration
  const [volume, setVolume] = React.useState([80]);
  // Remove old useState for selectedLanguage

  // Only show audio options for Rumtek Monastery
  const rumtekAudioLanguages = [
    { value: 'en', label: 'English', flag: 'EN', file: '/src/assets/rumtek-audio-en.mp3' },
    { value: 'fr', label: 'French', flag: 'FR', file: '/src/assets/rumtek-audio-fr.mp3' },
    { value: 'hi', label: 'Hindi', flag: '🇮🇳', file: '/src/assets/rumtek-audio-hi.mp3' },
    { value: 'it', label: 'Italian', flag: 'IT', file: '/src/assets/rumtek-audio-it.mp3' },
    { value: 'jap', label: 'Japanese', flag: 'JAP', file: '/src/assets/rumtek-audio-jap.mp3' },
    { value: 'sp', label: 'Spanish', flag: 'SP', file: '/src/assets/rumtek-audio-sp.mp3' },
  ];
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Video/audio controls
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioRef.current?.pause();
    } else {
      videoRef.current?.play();
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Sync audio and video
  const handleVideoTimeUpdate = () => {
    if (videoRef.current && audioRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    if (videoRef.current && audioRef.current) {
      videoRef.current.currentTime = seekTime;
      audioRef.current.currentTime = seekTime;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current && audioRef.current) {
      let newTime = Math.max(0, Math.min(videoRef.current.duration || duration, (videoRef.current.currentTime || 0) + seconds));
      videoRef.current.currentTime = newTime;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Change audio track when language changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [selectedLanguage]);

  // Sync play/pause state if user interacts with video/audio directly
  React.useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  if (!state.selectedMonastery || state.selectedMonastery.name !== 'Rumtek Monastery') return null;

  // Get selected audio file
  const selectedAudio = rumtekAudioLanguages.find(l => l.value === selectedLanguage)?.file;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-accent" />
            Narrated Walkthrough - Rumtek Monastery
          </DialogTitle>
          <DialogDescription>
            Experience an immersive audio-visual journey through the monastery with narration in six languages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Display */}
          <div className="relative aspect-video bg-gradient-mountain rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={"/src/assets/rumtek-video.mp4"}
              className="w-full h-full object-cover"
              controls={false}
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
            />
            <audio
              ref={audioRef}
              src={selectedAudio}
              preload="auto"
              style={{ display: 'none' }}
            />
            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card shadow-monastery pointer-events-auto"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-primary" />
                ) : (
                  <Play className="h-6 w-6 text-primary ml-1" />
                )}
              </Button>
            </div>

            {/* Language Selector Overlay */}
            <div className="absolute top-4 right-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40 bg-card/90 backdrop-blur-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rumtekAudioLanguages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => skipTime(-15)}
              >
                <SkipBack className="h-4 w-4 mr-1" />
                15s
              </Button>

              <Button
                onClick={togglePlayPause}
                className="bg-gradient-monastery hover:opacity-90"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => skipTime(15)}
              >
                15s
                <SkipForward className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={vals => {
                  setVolume(vals);
                  if (audioRef.current) audioRef.current.volume = vals[0] / 100;
                }}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {volume[0]}%
              </span>
            </div>
          </div>

          {/* Current Content Description */}
          <div className="bg-accent-soft rounded-lg p-4">
            <h3 className="font-semibold text-card-foreground mb-2">
              Currently Playing ({rumtekAudioLanguages.find(l => l.value === selectedLanguage)?.label})
            </h3>
            <p className="text-sm text-muted-foreground">
              Welcome to Rumtek Monastery, located in Gangtok. This sacred monastery has been a center of spiritual learning for centuries. As we begin our journey, you'll discover the rich history, architecture, and daily life of the monks...
            </p>
          </div>

          {/* Chapter Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: 'Introduction & History', time: '0:00' },
              { title: 'Architecture & Art', time: '1:30' },
              { title: 'Daily Monastic Life', time: '2:45' }
            ].map((chapter, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 justify-start text-left"
                onClick={() => {
                  const time = chapter.time.split(':');
                  setCurrentTime(parseInt(time[0]) * 60 + parseInt(time[1]));
                }}
              >
                <div>
                  <div className="font-semibold text-sm">{chapter.title}</div>
                  <div className="text-xs text-muted-foreground">{chapter.time}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NarratedWalkthroughModal;