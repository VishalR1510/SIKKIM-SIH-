import React from 'react';

const DanceSikkim: React.FC = () => {
  const sikkimDances = [
    {
      name: 'Chham Dance',
      description: 'Sacred masked dance performed by monks during religious festivals, representing various deities and demons in elaborate costumes',
      image: '/src/assets/dance/dance_chham.jpg',
      origin: 'Tibetan Buddhist tradition',
      occasion: 'Religious festivals and ceremonies'
    },
    {
      name: 'Maruni Dance',
      description: 'Traditional folk dance performed by women, characterized by graceful movements, colorful costumes, and rhythmic footwork',
      image: '/src/assets/dance/dance_maruni.jpg',
      origin: 'Nepali community',
      occasion: 'Weddings and cultural celebrations'
    },
    {
      name: 'Tamang Selo Dance',
      description: 'Energetic dance accompanied by traditional instruments, expressing joy and community spirit with synchronized movements',
      image: '/src/assets/dance/dance_tamang_selo_dance.jpg',
      origin: 'Tamang community',
      occasion: 'Social gatherings and festivals'
    },
    {
      name: 'Yak Chham Dance',
      description: 'Playful dance mimicking the movements of yaks, performed during harvest festivals with animal-inspired costumes',
      image: '/src/assets/dance/dance_yak_chham.jpg',
      origin: 'Agricultural communities',
      occasion: 'Harvest celebrations'
    },
    {
      name: 'Rechungma Dance',
      description: 'Devotional dance performed in honor of spiritual masters, featuring intricate hand movements and meditative poses',
      image: '/src/assets/dance/dance_rechungma.jpg',
      origin: 'Buddhist tradition',
      occasion: 'Guru Purnima and religious observances'
    },
    {
      name: 'Lu Khangthamo Dance',
      description: 'Indigenous dance of the Lepcha people, celebrating nature and their deep connection to the mountains and forests',
      image: '/src/assets/dance/dance_lu_khangthamo.jpg',
      origin: 'Lepcha indigenous community',
      occasion: 'Nature festivals and cultural events'
    },
    {
      name: 'Limboo Dance',
      description: 'Traditional dance of the Limboo community, showcasing their cultural heritage through rhythmic movements and traditional attire',
      image: '/src/assets/dance/dance_limboo.jpg',
      origin: 'Limboo community',
      occasion: 'Community celebrations and festivals'
    },
    {
      name: 'Chutkay Dance',
      description: 'Dramatic dance with elaborate masks representing various characters from Buddhist mythology and local folklore',
      image: '/src/assets/dance/dance_chutkay.jpg',
      origin: 'Monastic tradition',
      occasion: 'Losar and other major festivals'
    },
    {
      name: 'Chu Faat Dance',
      description: 'Water-themed dance celebrating the life-giving properties of water, performed with flowing movements and blue costumes',
      image: '/src/assets/dance/dance_chu_faat_dance.jpg',
      origin: 'Environmental celebration',
      occasion: 'Monsoon festivals and water ceremonies'
    },
    {
      name: 'Kagyed Dance',
      description: 'Sacred dance performed during the Kagyed festival, featuring elaborate costumes and representing the eight manifestations of Guru Padmasambhava',
      image: '/src/assets/dance/dance_kagyed.jpg',
      origin: 'Buddhist monastic tradition',
      occasion: 'Kagyed festival and religious ceremonies'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="pt-20 px-4 py-16">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-monastery-gold mb-6">
              Sikkim's Dance Heritage
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-200 mb-8">
              Experience the vibrant world of Sikkim's traditional dances, where every movement tells a story of culture, spirituality, and community. From sacred monastic performances to joyful folk celebrations, discover the rhythmic soul of the Himalayas.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-monastery-gold to-transparent mx-auto"></div>
          </div>

          {/* Dance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sikkimDances.map((dance, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-[0_0_20px_4px_rgba(212,175,55,0.3)] transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dance.image}
                    alt={dance.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{dance.name}</h3>
                    <p className="text-sm text-monastery-gold/80 font-medium">{dance.origin}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {dance.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-monastery-gold/60 font-medium">Occasion:</span>
                    <span className="text-xs text-slate-400">{dance.occasion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cultural Note */}
          <div className="mt-16 bg-gradient-to-r from-monastery-gold/10 to-transparent border border-monastery-gold/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-monastery-gold mb-4">
              The Rhythm of Tradition
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Dance in Sikkim is more than entertainment—it's a living expression of the region's diverse cultural heritage. Each dance form carries deep spiritual significance, connecting communities to their ancestors, deities, and the natural world. From the solemn Cham dances of the monasteries to the joyful folk dances of the villages, these movements preserve centuries of tradition while celebrating the vibrant spirit of Sikkim's people.
            </p>
          </div>

          {/* Performance Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border-transparent">
              <h4 className="text-lg font-bold text-monastery-gold mb-3">Sacred Dances</h4>
              <p className="text-slate-300 text-sm">
                Monastic dances like Chham, Kagyed, and Chutkay are performed during religious festivals, 
                serving as both spiritual practice and community celebration.
              </p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border-transparent">
              <h4 className="text-lg font-bold text-monastery-gold mb-3">Folk Traditions</h4>
              <p className="text-slate-300 text-sm">
                Community dances like Maruni, Tamang Selo, and Limboo bring people together, 
                celebrating life's milestones and seasonal changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DanceSikkim; 