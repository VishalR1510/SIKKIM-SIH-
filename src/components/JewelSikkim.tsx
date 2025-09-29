import React from 'react';

const JewelSikkim: React.FC = () => {
  const sikkimJewellery = [
    {
      name: 'Yencho',
      description: 'Traditional Sikkimese necklace made of coral and turquoise beads, symbolizing prosperity and protection',
      image: '/src/assets/Jewellery/Jewellery_yencho.jpg',
      origin: 'Tibetan-Sikkimese tradition',
      significance: 'Spiritual protection and wealth'
    },
    {
      name: 'Tilhari',
      description: 'Elegant gold necklace with intricate filigree work, often worn during special occasions and festivals',
      image: '/src/assets/Jewellery/jewellery_tilhari.jpg',
      origin: 'Nepali-Sikkimese craft',
      significance: 'Status symbol and celebration'
    },
    {
      name: 'Naugedi',
      description: 'Traditional silver earrings with traditional motifs, representing cultural heritage and feminine beauty',
      image: '/src/assets/Jewellery/Jewellery_naugedi.jpg',
      origin: 'Indigenous Sikkimese',
      significance: 'Cultural identity and tradition'
    },
    {
      name: 'Kilips',
      description: 'Delicate silver anklets with traditional patterns, worn by women during cultural ceremonies and dances',
      image: '/src/assets/Jewellery/Jewellery_kilips.jpg',
      origin: 'Lepcha community',
      significance: 'Rhythmic movement and grace'
    },
    {
      name: 'Khao Pendant',
      description: 'Sacred pendant with religious symbols, often blessed by monks and worn for spiritual protection',
      image: '/src/assets/Jewellery/Jewellery_khao_pendant.jpg',
      origin: 'Buddhist tradition',
      significance: 'Divine protection and blessings'
    },
    {
      name: 'Kantha',
      description: 'Traditional silver necklace with coral and turquoise stones, representing the harmony of earth and sky',
      image: '/src/assets/Jewellery/Jewellery_kantha.jpg',
      origin: 'Tibetan influence',
      significance: 'Natural balance and harmony'
    },
    {
      name: 'Joko Ring',
      description: 'Intricate silver ring with traditional Sikkimese motifs, often passed down through generations',
      image: '/src/assets/Jewellery/Jewellery_joko_ring.jpg',
      origin: 'Family heirloom tradition',
      significance: 'Heritage and continuity'
    },
    {
      name: 'Diu Sikkim Bangle',
      description: 'Traditional silver bangle with unique Sikkimese designs, symbolizing strength and cultural pride',
      image: '/src/assets/Jewellery/Jewellery_diu_sikkim_bangle.jpg',
      origin: 'Sikkimese artisan tradition',
      significance: 'Cultural strength and identity'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="pt-20 px-4 py-16">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-monastery-gold mb-6">
              Sikkim's Jewellery Heritage
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-200 mb-8">
              Discover the exquisite world of Sikkim's traditional jewellery, where every piece tells a story of culture, spirituality, and craftsmanship. From sacred pendants to ornate necklaces, explore the precious metals and stones that adorn the people of the Himalayas.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-monastery-gold to-transparent mx-auto"></div>
          </div>

          {/* Jewellery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sikkimJewellery.map((jewel, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-[0_0_20px_4px_rgba(212,175,55,0.3)] transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={jewel.image}
                    alt={jewel.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{jewel.name}</h3>
                    <p className="text-sm text-monastery-gold/80 font-medium">{jewel.origin}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {jewel.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-monastery-gold/60 font-medium">Significance:</span>
                    <span className="text-xs text-slate-400">{jewel.significance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cultural Note */}
          <div className="mt-16 bg-gradient-to-r from-monastery-gold/10 to-transparent border border-monastery-gold/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-monastery-gold mb-4">
              The Art of Adornment
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Jewellery in Sikkim is more than decoration—it's a sacred art form that carries deep cultural and spiritual meaning. Each piece is crafted with intention, using traditional techniques passed down through generations. From the protective amulets blessed by monks to the ornate pieces worn during festivals, Sikkim's jewellery reflects the region's rich tapestry of Tibetan, Nepali, and indigenous influences, creating a unique aesthetic that celebrates both beauty and belief.
            </p>
          </div>

          {/* Craftsmanship Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border-transparent">
              <h4 className="text-lg font-bold text-monastery-gold mb-3">Sacred Jewellery</h4>
              <p className="text-slate-300 text-sm">
                Religious pieces like Khao pendants and blessed amulets serve as spiritual protection, 
                often crafted by skilled artisans following ancient traditions.
              </p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border-transparent">
              <h4 className="text-lg font-bold text-monastery-gold mb-3">Cultural Heritage</h4>
              <p className="text-slate-300 text-sm">
                Traditional pieces like Yencho and Naugedi represent cultural identity, 
                with each community contributing unique designs and techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelSikkim; 