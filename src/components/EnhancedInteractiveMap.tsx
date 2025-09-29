import React, { useState } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Camera, 
  Mountain, 
  Compass,
  Route,
  Info,
  Phone,
  Globe
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA78JAuOdbNS5EI5XLqpCuPJ8JayIlk4is'; // <-- Replace with your key
const center = { lat: 27.3011, lng: 88.55 };

const EnhancedInteractiveMap: React.FC = () => {
  // Track searched monastery for marker and title
  const [searchedMonastery, setSearchedMonastery] = useState<string | null>(null);
  // Map center and zoom state for search
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(13);
  // Use current location for 'From' input
  function handleUseCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setFromInput(`${latitude},${longitude}`);
        },
        error => {
          alert('Unable to fetch your location. Please allow location access and try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }
  const [selectedMonastery, setSelectedMonastery] = useState<string | null>('rumtek');
  const [activeView, setActiveView] = useState('map');
  const [showDirections, setShowDirections] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Enchey Monastery coordinates (Gangtok, Sikkim): 27.3456° N, 88.6131° E
  const ENCHEY_MONASTERY: [number, number] = [27.3456, 88.6131];
  const [directions, setDirections] = useState(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [showDirectionsForm, setShowDirectionsForm] = useState(false);
  const [fromInput, setFromInput] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  const monasteries = [
    {
      id: 'rumtek',
      name: 'Rumtek Monastery',
      location: 'East Sikkim',
      coordinates: '27.3011° N, 88.5500° E',
      distance: '24 km from Gangtok',
      elevation: '1,550m',
      established: '1966',
      significance: 'Seat of the Karmapa',
      bestTime: 'March to May, October to December',
      visitDuration: '2-3 hours',
      rating: 4.8,
      highlights: ['Golden Stupa', 'Prayer Wheels', 'Monastery Museum', 'Scenic Views'],
      nearbyAttractions: ['Lingdum Monastery', 'Ranka Monastery', 'Kyongnosla Alpine Sanctuary'],
      travelTips: [
        'Photography permitted in courtyard only',
        'Dress modestly and remove shoes before entering',
        'Carry warm clothing due to altitude'
      ],
      transportation: {
        byTaxi: '45 minutes from Gangtok',
        byBus: 'Regular buses available from Gangtok',
        parking: 'Available near monastery entrance'
      },
      facilities: ['Parking', 'Restroom', 'Cafeteria', 'Gift Shop', 'Guided Tours'],
      contact: {
        phone: '+91-3592-251234',
        website: 'www.rumtek.org',
        email: 'info@rumtek.org'
      }
    },
    {
      id: 'pemayangtse',
      name: 'Pemayangtse Monastery',
      location: 'West Sikkim',
      coordinates: '27.2167° N, 88.2500° E',
      distance: '110 km from Gangtok',
      elevation: '2,085m',
      established: '1705',
      significance: 'Oldest monastery in Sikkim',
      bestTime: 'October to March',
      visitDuration: '1-2 hours',
      rating: 4.7,
      highlights: ['Wooden Sculptures', 'Ancient Murals', '7-tier Model', 'Panoramic Views'],
      nearbyAttractions: ['Rabdentse Ruins', 'Khecheopalri Lake', 'Yuksom'],
      travelTips: [
        'Early morning visits recommended',
        'Carry oxygen spray due to high altitude',
        'Photography charges may apply'
      ],
      transportation: {
        byTaxi: '3 hours from Gangtok',
        byBus: 'Shared jeeps available from Pelling',
        parking: 'Limited parking available'
      },
      facilities: ['Basic Parking', 'Restroom', 'Local Guide', 'Small Shop'],
      contact: {
        phone: '+91-3595-250567',
        website: 'www.pemayangtse.org',
        email: 'contact@pemayangtse.org'
      }
    },
    {
      id: 'tashiding',
      name: 'Tashiding Monastery',
      location: 'West Sikkim',
      coordinates: '27.2833° N, 88.2667° E',
      distance: '118 km from Gangtok',
      elevation: '1,465m',
      established: '1717',
      significance: 'Sacred heart of Sikkim',
      bestTime: 'October to April',
      visitDuration: '1.5-2 hours',
      rating: 4.6,
      highlights: ['Sacred Stupa', 'River Confluence', 'Annual Festival', 'Spiritual Atmosphere'],
      nearbyAttractions: ['Yuksom', 'Dubdi Monastery', 'Norbugang Park'],
      travelTips: [
        'Visit during Bumchu festival for unique experience',
        'Steep climb to reach monastery',
        'Respect local customs and traditions'
      ],
      transportation: {
        byTaxi: '3.5 hours from Gangtok',
        byBus: 'Local transport from Yuksom',
        parking: 'Basic parking at base'
      },
      facilities: ['Parking', 'Basic Restroom', 'Local Guides', 'Prayer Flags'],
      contact: {
        phone: '+91-3595-241890',
        website: 'www.tashiding.org',
        email: 'info@tashiding.org'
      }
    }
  ];

  const selectedPlace = monasteries.find(m => m.id === selectedMonastery);
  const displayedMonastery = searchedMonastery
    ? monasteries.find(m => m.name === searchedMonastery)
    : selectedPlace;
  // Helper: get coordinates for selected monastery
  function getMonasteryCoords() {
    if (searchedMonastery) {
      const found = monasteries.find(m => m.name === searchedMonastery);
      if (found) {
        switch (found.id) {
          case 'rumtek': return { lat: 27.3011, lng: 88.55 };
          case 'pemayangtse': return { lat: 27.2167, lng: 88.25 };
          case 'tashiding': return { lat: 27.2833, lng: 88.2667 };
          default: return center;
        }
      }
    }
    if (!selectedPlace) return center;
    switch (selectedPlace.id) {
      case 'rumtek': return { lat: 27.3011, lng: 88.55 };
      case 'pemayangtse': return { lat: 27.2167, lng: 88.25 };
      case 'tashiding': return { lat: 27.2833, lng: 88.2667 };
      default: return center;
    }
  }

  // Get Directions handler
  function handleGetDirections() {
    setShowDirectionsForm(true);
    setShowDirections(false);
  }

  function handleDirectionsSubmit(e: React.FormEvent) {
    e.preventDefault();
  setDirectionsLoading(true);
  setShowDirectionsForm(false);
  setShowDirections(true);
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-monastery-gold mb-4 flex items-center justify-center gap-3">
            <MapPin className="w-10 h-10 text-blue-600" />
            Enhanced Interactive Map
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Discover sacred monasteries with detailed location information, travel guidance, 
            and comprehensive visitor resources for your spiritual journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <form
            className="flex w-full max-w-md"
            onSubmit={e => {
              e.preventDefault();
              const query = searchQuery.trim().toLowerCase();
              const found = monasteries.find(m => m.name.toLowerCase().includes(query));
              if (found) {
                const coords = (() => {
                  switch (found.id) {
                    case 'rumtek': return { lat: 27.3011, lng: 88.55 };
                    case 'pemayangtse': return { lat: 27.2167, lng: 88.25 };
                    case 'tashiding': return { lat: 27.2833, lng: 88.2667 };
                    default: return center;
                  }
                })();
                setMapCenter(coords);
                setMapZoom(15);
                setSearchedMonastery(found.name);
              } else {
                alert('Monastery not found. Please check your spelling.');
                setSearchedMonastery(null);
              }
            }}
          >
            <input
              type="text"
              placeholder="Search for monasteries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l-full text-white bg-black/40 border border-monastery-gold focus:outline-none focus:ring-2 focus:ring-monastery-gold placeholder:text-monastery-gold h-12"
            />
            <Button
              type="submit"
              className="rounded-r-full bg-monastery-gold text-black font-semibold border-l-0 border border-monastery-gold px-6 h-12"
              style={{ minWidth: '120px' }}
            >
              Search
            </Button>
          </form>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-3xl mx-auto bg-black/70 border border-monastery-gold/40 rounded-xl p-1">
            <TabsTrigger value="map" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">Map View</TabsTrigger>
            <TabsTrigger value="routes" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">Routes</TabsTrigger>
            <TabsTrigger value="nearby" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">Nearby</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Real Map Visualization */}
              <div className="lg:col-span-2">
                <Card className="h-[500px] bg-black/70 border-none shadow-xl backdrop-blur-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-monastery-gold">
                      <Compass className="w-5 h-5 text-monastery-gold" />
                      {(searchedMonastery ? searchedMonastery : selectedPlace?.name) + ' Location Map'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex items-center justify-center bg-black/60 rounded-lg relative">
                    <div className="w-full h-full">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={{ height: "400px", width: "100%" }}
                          center={mapCenter}
                          zoom={mapZoom}
                          options={{
                            zoomControl: true,
                            scrollwheel: true,
                            gestureHandling: "greedy"
                          }}
                        >
                          <Marker
                            position={getMonasteryCoords()}
                            label={searchedMonastery ? searchedMonastery : selectedPlace?.name}
                            title={searchedMonastery ? searchedMonastery : selectedPlace?.name}
                          />
                          {showDirections && (
                            <DirectionsService
                              options={{
                                origin: fromInput,
                                destination: getMonasteryCoords(),
                                travelMode: travelMode as google.maps.TravelMode,
                              }}
                              callback={result => {
                                setDirectionsLoading(false);
                                if (result && result) {
                                  setDirections(result);
                                } else {
                                  alert('Could not find a route!');
                                  setShowDirections(false);
                                }
                              }}
                            />
                          )}
                          {directions && (
                            <DirectionsRenderer directions={directions} />
                          )}
                        </GoogleMap>
                      ) : (
                        <div>Loading Map...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Monastery Details */}
              <div>
                <Card className="bg-black/70 border-none shadow-xl backdrop-blur-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-monastery-gold flex items-center gap-2">
                      {displayedMonastery?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showDirectionsForm ? (
                      <form className="space-y-4" onSubmit={handleDirectionsSubmit}>
                        <div>
                          <label className="block text-monastery-gold font-semibold mb-1">From</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={fromInput}
                              onChange={e => setFromInput(e.target.value)}
                              placeholder="Enter your starting location"
                              className="w-full px-4 py-2 rounded-full text-white bg-black/40 border border-monastery-gold focus:outline-none focus:ring-2 focus:ring-monastery-gold placeholder:text-monastery-gold"
                              required
                            />
                            <Button
                              type="button"
                              className="bg-monastery-gold text-black font-semibold rounded-full border-2 border-monastery-gold px-4"
                              onClick={handleUseCurrentLocation}
                            >
                              Use Current Location
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-monastery-gold font-semibold mb-1">To</label>
                          <input
                            type="text"
                            value={displayedMonastery?.name || ''}
                            readOnly
                            className="w-full px-4 py-2 rounded-full text-white bg-black/40 border border-monastery-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-monastery-gold font-semibold mb-1">Travel Mode</label>
                          <select
                            value={travelMode}
                            onChange={e => setTravelMode(e.target.value)}
                            className="w-full px-4 py-2 rounded-full text-white bg-black/40 border border-monastery-gold"
                          >
                            <option value="DRIVING">Driving</option>
                            <option value="WALKING">Walking</option>
                            <option value="TRANSIT">Transit</option>
                          </select>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-monastery-gold text-black font-semibold rounded-full border-2 border-monastery-gold"
                          disabled={directionsLoading}
                        >
                          {directionsLoading ? 'Loading...' : 'Show Route'}
                        </Button>
                      </form>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white">
                            <MapPin className="w-4 h-4 text-monastery-gold" />
                            {displayedMonastery?.location}
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <Mountain className="w-4 h-4 text-monastery-gold" />
                            Elevation: {displayedMonastery?.elevation}
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <Route className="w-4 h-4 text-monastery-gold" />
                            {displayedMonastery?.distance}
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <Clock className="w-4 h-4 text-monastery-gold" />
                            Visit Duration: {displayedMonastery?.visitDuration}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-monastery-gold mb-2">Highlights</h4>
                          <div className="flex flex-wrap gap-2">
                            {displayedMonastery?.highlights.map((h) => (
                              <Badge key={h} className="bg-monastery-gold/20 text-white border-white text-xs">{h}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-monastery-gold mb-2">Contact Information</h4>
                          <div className="flex flex-col gap-1 text-white">
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-monastery-gold" />{displayedMonastery?.contact.phone}</span>
                            <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-monastery-gold" /><a href={`https://${displayedMonastery?.contact.website}`} className="underline text-white">{displayedMonastery?.contact.website}</a></span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          <Button
                            className="w-full bg-monastery-gold text-black font-semibold rounded-full border-2 border-monastery-gold transition-all duration-200 hover:shadow-[0_0_8px_2px_rgba(255,221,51,0.4)] focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                            onClick={handleGetDirections}
                            disabled={directionsLoading}
                          >
                            {directionsLoading ? 'Loading Directions...' : 'Get Directions'}
                          </Button>
                          <Button className="w-full bg-black/40 text-monastery-gold font-semibold rounded-full border border-monastery-gold transition-all duration-200 hover:shadow-[0_0_8px_2px_rgba(255,221,51,0.4)] focus:ring-2 focus:ring-yellow-300 focus:outline-none">
                            Virtual Tour
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="bg-black/70 border-none  ">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-monastery-gold">
                  <Route className="w-5 h-5 text-monastery-gold" />
                  Travel Routes & Transportation
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-monastery-gold mb-3">Transportation Options</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-black/40 rounded-xl transition-shadow duration-200 hover:shadow-[0_0_12px_2px_rgba(255,221,51,0.25)]">
                      <div className="font-medium text-monastery-gold">By Taxi</div>
                      <div className="text-sm text-white">{selectedPlace.transportation.byTaxi}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl transition-shadow duration-200 hover:shadow-[0_0_12px_2px_rgba(255,221,51,0.25)]">
                      <div className="font-medium text-monastery-gold">By Bus</div>
                      <div className="text-sm text-white">{selectedPlace.transportation.byBus}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl transition-shadow duration-200 hover:shadow-[0_0_12px_2px_rgba(255,221,51,0.25)]">
                      <div className="font-medium text-monastery-gold">Parking</div>
                      <div className="text-sm text-white">{selectedPlace.transportation.parking}</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold text-monastery-gold mb-3">Available Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.facilities.map((facility, index) => (
                        <Badge key={index} className="bg-transparent text-white border-white text-xs ">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-monastery-gold mb-3">Travel Tips</h3>
                  <div className="space-y-3">
                    {selectedPlace.travelTips.map((tip, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-black/40 rounded-xl transition-shadow duration-200 hover:shadow-[0_0_12px_2px_rgba(255,221,51,0.25)]">
                        <Info className="w-4 h-4 text-monastery-gold flex-shrink-0" />
                        <span className="text-sm text-white">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nearby">
            <Card className="bg-black/70 border-none shadow-xl backdrop-blur-lg rounded-2xl mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-monastery-gold">
                  <Compass className="w-5 h-5 text-monastery-gold" />
                  Nearby Attractions & Places
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPlace && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-monastery-gold">Near {selectedPlace.name}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPlace.nearbyAttractions.map((attraction, index) => (
                        <div key={index} className="p-4 bg-black/40 rounded-xl transition-shadow duration-200 hover:shadow-[0_0_12px_2px_rgba(255,221,51,0.25)]">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-prayer-blue" />
                            <span className="font-medium text-monastery-gold">{attraction}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white">
                            <Navigation className="w-3 h-3 text-monastery-gold" />
                            <span>Click to explore route</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-black/40 rounded-xl transition-shadow duration-200 hover:shadow-[0_0_12px_2px_rgba(255,221,51,0.25)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-monastery-gold" />
                        <span className="font-semibold text-monastery-gold">Best Time to Visit</span>
                      </div>
                      <p className="text-white">{selectedPlace.bestTime}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedInteractiveMap;