import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Globe, MapPin, Clock, Users, BookOpen, Mic 
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  audioFile: string;
  duration: number;
  location: string;
  image: string;
  narrator: string;
  culturalContext: string[];
  interactionPoints: string[];
}

interface NarratedWalkthrough {
  id: string;
  title: string;
  monastery: string;
  description: string;
  totalDuration: number;
  languages: { code: string; name: string; narrator: string }[];
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  steps: WalkthroughStep[];
  coverImage: string;
  expertNarrator: {
    name: string;
    credentials: string;
    bio: string;
    photo: string;
  };
}

const NarratedWalkthroughs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const walkthroughs: NarratedWalkthrough[] = [
    {
      id: 'rumtek-heritage',
      title: 'Sacred Heritage of Rumtek',
      monastery: 'Rumtek Monastery',
      description: 'Expert-guided exploration of Sikkim\'s most significant Buddhist monastery',
      totalDuration: 45,
      languages: [
        { code: 'en', name: 'English', narrator: 'Dr. Sarah Chen' },
        { code: 'hi', name: 'Hindi', narrator: 'पंडित राज कुमार' },
        { code: 'fr', name: 'French', narrator: 'Prof. Marie Dubois' },
        { code: 'sp', name: 'Spanish', narrator: 'Dr. Carlos Mendez' }
      ],
      difficulty: 'Moderate',
      coverImage: '/src/assets/rumtek-monastery.jpg',
      expertNarrator: {
        name: 'Dr. Sarah Chen',
        credentials: 'PhD in Buddhist Studies, Harvard University',
        bio: 'Leading expert on Himalayan Buddhism with 20+ years of research experience',
        photo: '/src/assets/narrator-placeholder.jpg'
      },
      steps: [
        {
          id: 'entrance',
          title: 'Monastery Entrance & History',
          description: 'Understanding the significance of Rumtek\'s establishment',
          audioFile: '/src/assets/rumtek-audio-en.mp3',
          duration: 8,
          location: 'Main Entrance Gate',
          image: '/src/assets/rumtek-monastery.jpg',
          narrator: 'Dr. Sarah Chen',
          culturalContext: ['16th Karmapa legacy', 'Tibetan exile history', 'Architectural significance'],
          interactionPoints: ['Prayer wheels', 'Gate inscriptions', 'Guardian statues']
        },
        {
          id: 'main-hall',
          title: 'Golden Stupa & Prayer Hall',
          description: 'Sacred relics and meditation practices',
          audioFile: '/src/assets/rumtek-audio-en.mp3',
          duration: 12,
          location: 'Main Prayer Hall',
          image: '/src/assets/rumtek-monastery.jpg',
          narrator: 'Dr. Sarah Chen',
          culturalContext: ['Stupa symbolism', 'Daily prayers', 'Monastic life'],
          interactionPoints: ['Golden Stupa', 'Prayer cushions', 'Ritual instruments']
        },
        {
          id: 'artifacts',
          title: 'Sacred Artifacts & Treasures',
          description: 'Ancient manuscripts and religious objects',
          audioFile: '/src/assets/rumtek-audio-en.mp3',
          duration: 10,
          location: 'Artifact Hall',
          image: '/src/assets/ritual-artifacts.jpg',
          narrator: 'Dr. Sarah Chen',
          culturalContext: ['Historical preservation', 'Ritual significance', 'Cultural heritage'],
          interactionPoints: ['Ancient texts', 'Ritual vessels', 'Ceremonial items']
        }
      ]
    },
    {
      id: 'pemayangtse-journey',
      title: 'Pemayangtse Spiritual Journey',
      monastery: 'Pemayangtse Monastery',
      description: 'Immersive walk through Sikkim\'s second oldest monastery',
      totalDuration: 35,
      languages: [
        { code: 'en', name: 'English', narrator: 'Lama Tenzin' },
        { code: 'hi', name: 'Hindi', narrator: 'लामा तेनज़िन' },
        { code: 'ne', name: 'Nepali', narrator: 'लामा तेनज़िन' }
      ],
      difficulty: 'Easy',
      coverImage: '/src/assets/pemayangtse-monastery.jpg',
      expertNarrator: {
        name: 'Lama Tenzin',
        credentials: 'Senior Monk, 30 years at Pemayangtse',
        bio: 'Authentic voice of monastic tradition and local cultural practices',
        photo: '/src/assets/narrator-placeholder.jpg'
      },
      steps: [
        {
          id: 'history',
          title: 'Foundation & Legends',
          description: 'The birth of Pemayangtse Monastery',
          audioFile: '/src/assets/rumtek-audio-hi.mp3',
          duration: 15,
          location: 'Monastery Grounds',
          image: '/src/assets/pemayangtse-monastery.jpg',
          narrator: 'Lama Tenzin',
          culturalContext: ['17th century origins', 'Nyingma tradition', 'Royal patronage'],
          interactionPoints: ['Foundation stone', 'Ancient trees', 'Mountain views']
        }
      ]
    }
  ];

  // Removed unused walkthrough experience state and handlers

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-monastery-gold mb-4 drop-shadow-lg">
            Expert Narrated Walkthroughs
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Journey through sacred spaces with expert guides sharing deep cultural insights 
            and authentic stories in multiple languages
          </p>
        </div>
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search monasteries..."
            className="w-full max-w-2xl px-6 py-3 rounded-full bg-black/60 text-monastery-gold border border-monastery-gold focus:outline-none focus:ring-2 focus:ring-monastery-gold text-lg"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {walkthroughs
            .filter(w => w.monastery.toLowerCase().includes(searchTerm.toLowerCase()) || w.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((walkthrough) => (
          <Card key={walkthrough.id} className="relative overflow-hidden bg-black/60 backdrop-blur-lg border-none shadow-2xl rounded-2xl hover:scale-[1.025] transition-all duration-300 hover:shadow-[0_0_16px_4px_rgba(212,175,55,0.4)] flex flex-col min-h-[340px]">
              <div className="relative">
                <img
                  src={walkthrough.coverImage}
                  alt={walkthrough.title}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-monastery-gold drop-shadow">{walkthrough.title}</CardTitle>
                <p className="text-white/80">{walkthrough.description}</p>
              </CardHeader>
                <CardContent className="space-y-4 flex flex-col flex-1 pb-20">
                  {/* Languages */}
                  <div>
                    <p className="text-sm font-medium text-white mb-2">Available Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {walkthrough.languages.map((lang) => (
                        <Badge key={lang.code} variant="outline" className="text-xs border-white text-white bg-transparent">
                          <Globe className="w-3 h-3 mr-1" />
                          {lang.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* Steps Preview */}
                  <div>
                    <p className="text-sm font-medium text-white mb-2">
                      Walkthrough Steps:
                    </p>
                    <div className="space-y-1">
                      {walkthrough.steps.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-monastery-gold/80 text-black flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-white/80">{step.title}</span>
                        </div>
                      ))}
                      {walkthrough.steps.length > 3 && (
                        <p className="text-xs text-monastery-gold/60 ml-7">
                          +{walkthrough.steps.length - 3} more steps
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute left-0 bottom-0 w-full px-6 pb-6">
                    <Button 
                      className="w-full bg-monastery-gold text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition-all duration-200 border-2 border-monastery-gold"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Explore Now
                    </Button>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NarratedWalkthroughs;