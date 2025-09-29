import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Route, 
  MapPin, 
  Clock, 
  DollarSign,
  Car,
  Bus,
  Plane,
  Train,
  Navigation,
  Fuel,
  Calendar,
  Users,
  Mountain,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Compass,
  Map,
  Calculator,
  Info
} from 'lucide-react';

const MONASTERIES = {
  'Rumtek Monastery': { lat: 27.3331, lng: 88.6200 },
  'Pemayangtse Monastery': { lat: 27.3005, lng: 88.2336 },
  'Tashiding Monastery': { lat: 27.2852, lng: 88.2832 }
};

const RoutePlanner: React.FC = () => {
  const [startLocation, setStartLocation] = useState('');
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [endLocation, setEndLocation] = useState('Rumtek Monastery');
  const [travelMode, setTravelMode] = useState('car');
  const [travelers, setTravelers] = useState(2);
  const [activeTab, setActiveTab] = useState('planner');
  const [routeData, setRouteData] = useState<{distance: string, duration: string, steps: any[]} | null>(null);
  const [cityNames, setCityNames] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState('');

  // ...existing code...
  const transportOptions = [
    {
      mode: 'car',
      name: 'Private Car',
      icon: Car,
      costPerKm: '₹12-15',
      pros: ['Flexible timing', 'Comfortable', 'Scenic stops', 'Luggage space'],
      cons: ['Driving fatigue', 'Fuel costs', 'Parking challenges'],
      suitableFor: 'Families, Groups, Flexible travelers',
      bookingInfo: 'Self-drive or hire driver'
    },
    {
      mode: 'bus',
      name: 'Public Bus',
      icon: Bus,
      costPerKm: '₹3-5',
      pros: ['Economical', 'No driving stress', 'Local experience', 'Frequent services'],
      cons: ['Fixed schedule', 'Crowded', 'Limited luggage', 'Longer journey'],
      suitableFor: 'Budget travelers, Solo travelers',
      bookingInfo: 'Book at bus stations or online'
    },
    {
      mode: 'taxi',
      name: 'Shared Taxi',
      icon: Car,
      costPerKm: '₹8-10',
      pros: ['Faster than bus', 'Shared cost', 'Door pickup', 'Local insights'],
      cons: ['Shared space', 'Fixed route', 'Wait for passengers'],
      suitableFor: 'Budget-conscious groups, Social travelers',
      bookingInfo: 'Book from taxi stands'
    }
  ];

  // Use API data for cost estimation (example logic)
  const calculateTotalCost = () => {
    if (!routeData) return 0;
    // Example: ₹15/km for car, ₹5/km for bus, ₹10/km for taxi, ₹50/km for flight
    const modeRates: any = { car: 15, bus: 5, taxi: 10, flight: 50 };
    const rate = modeRates[travelMode] || 15;
    const distanceNum = routeData.distance ? parseFloat(routeData.distance.replace(/[^0-9.]/g, '')) : 0;
    const baseCost = Math.round(distanceNum * rate);
    const additionalCost = (travelers - 1) * 500;
    return baseCost + additionalCost;
  };

  // Get user's current location
  const handleGetLocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStartLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
      },
      () => setError('Unable to retrieve your location.')
    );
  };

  // Fetch route from Google Maps Directions API and then city names and amenities
  const handleFindRoute = async () => {
    setLoadingRoute(true);
    setError('');
    setCityNames([]);
    setAmenities([]);
    try {
      const origin = userCoords ? `${userCoords.lat},${userCoords.lng}` : startLocation;
      const destination = MONASTERIES[endLocation];
      if (!origin || !destination) {
        setError('Please provide both start and end locations.');
        setLoadingRoute(false);
        return;
      }
      const travelModeMap: any = { car: 'driving', bus: 'transit', taxi: 'driving', flight: 'driving' };
      const mode = travelModeMap[travelMode] || 'driving';
      const apiKey = 'AIzaSyA78JAuOdbNS5EI5XLqpCuPJ8JayIlk4is'; // Replace with your actual API key
      const url = `http://localhost:5000/api/directions?origin=${origin}&destination=${destination.lat},${destination.lng}&mode=${mode}&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        setError(`Network error: ${response.status} ${response.statusText}`);
        setLoadingRoute(false);
        return;
      }
      const data = await response.json();
      if (data.status === 'OK') {
        const leg = data.routes[0].legs[0];
        setRouteData({
          distance: leg.distance.text,
          duration: leg.duration.text,
          steps: leg.steps
        });

        // Extract city names using Nominatim
        const cityPromises = leg.steps.map(async (step: any) => {
          const lat = step.start_location.lat;
          const lon = step.start_location.lng;
          const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
          try {
            const res = await fetch(nominatimUrl);
            const json = await res.json();
            return json.address.city || json.address.town || json.address.village || '';
          } catch {
            return '';
          }
        });
        // Filter and deduplicate city names, keep order
        const rawCities = await Promise.all(cityPromises);
        const cities = rawCities.filter((c, i, arr) => c && arr.indexOf(c) === i);
        setCityNames(cities);

        // Find amenities (food, fuel, attractions) using Overpass API
        // Use first, middle, last step for demo, but limit results per location
        const stepCoords = [leg.steps[0], leg.steps[Math.floor(leg.steps.length/2)], leg.steps[leg.steps.length-1]]
          .map(s => ({lat: s.start_location.lat, lon: s.start_location.lng}));
        const overpassQueries = stepCoords.map(({lat, lon}) => `
          [out:json][timeout:25];
          (
            node["amenity"~"restaurant|fuel|cafe"](around:1000,${lat},${lon});
            node["tourism"~"attraction"](around:1000,${lat},${lon});
          );
          out body;
        `);
        const amenityPromises = overpassQueries.map(async (query) => {
          const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'text/plain' }
          });
          const json = await res.json();
          // Group by type and take top 2 unique per type
          const grouped = { food: [], fuel: [], attraction: [] };
          for (const el of json.elements || []) {
            if (el.tags.amenity === 'restaurant' || el.tags.amenity === 'cafe') {
              if (grouped.food.length < 2 && !grouped.food.some(f => f.tags.name === el.tags.name)) grouped.food.push(el);
            } else if (el.tags.amenity === 'fuel') {
              if (grouped.fuel.length < 2 && !grouped.fuel.some(f => f.tags.name === el.tags.name)) grouped.fuel.push(el);
            } else if (el.tags.tourism === 'attraction') {
              if (grouped.attraction.length < 2 && !grouped.attraction.some(a => a.tags.name === el.tags.name)) grouped.attraction.push(el);
            }
          }
          return [...grouped.food, ...grouped.fuel, ...grouped.attraction];
        });
        const amenityResults = await Promise.all(amenityPromises);
        // Deduplicate by name/location
        const allAmenities = amenityResults.flat();
        const uniqueAmenities = allAmenities.filter((a, i, arr) => a.tags.name && arr.findIndex(b => b.tags.name === a.tags.name && b.lat === a.lat && b.lon === a.lon) === i);
        setAmenities(uniqueAmenities);
      } else {
        setError(`API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`);
        console.error('Directions API response:', data);
      }
    } catch (err: any) {
      setError(`Error fetching route: ${err.message || err}`);
      console.error('Fetch error:', err);
    }
    setLoadingRoute(false);
  };

  const getWeatherAlert = () => {
    const currentSeason = 'spring'; // This would be dynamic in real implementation
    const alerts = {
      spring: { message: 'Pleasant weather, ideal for travel', type: 'success' },
      summer: { message: 'Monsoon season - check road conditions', type: 'warning' },
      autumn: { message: 'Perfect travel weather', type: 'success' },
      winter: { message: 'Cold weather - carry warm clothes', type: 'info' }
    };
    return alerts[currentSeason] || alerts.spring;
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-monastery-gold mb-4 flex items-center justify-center gap-3">
            <Route className="w-10 h-10 text-green-600" />
            Smart Route Planner
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Plan your perfect journey to the monasteries with optimized routes, 
            cost estimation, travel time calculation, and personalized recommendations.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 max-w-2xl mx-auto bg-black/70 border border-monastery-gold/40 rounded-xl p-1">
            <TabsTrigger value="planner" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">
              <Map className="w-4 h-4 mr-1" />
              Plan
            </TabsTrigger>
            <TabsTrigger value="routes" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">
              <Route className="w-4 h-4 mr-1" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="transport" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">
              <Car className="w-4 h-4 mr-1" />
              Transport
            </TabsTrigger>
            <TabsTrigger value="costs" className="text-monastery-gold font-semibold bg-black/40 rounded-xl data-[state=active]:bg-monastery-gold data-[state=active]:text-black transition-all">
              <Calculator className="w-4 h-4 mr-1" />
              Costs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planner">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Planning Form */}
              <div className="lg:col-span-1">
                <Card className="bg-black/60 border-transparent rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-monastery-gold">
                      <Compass className="w-5 h-5 text-monastery-gold" />
                      Plan Your Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Start Location */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-monastery-gold">From</label>
                      <Input className ="bg-black/60 border-monastery-gold text-white placeholder-white focus:ring-2 focus:ring-monastery-gold focus:border-monastery-gold rounded-md"
                        placeholder="Enter starting location or use current location"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                      />
                      <Button type="button" className="mt-2 bg-monastery-gold text-black" onClick={handleGetLocation}>
                        Use My Location
                      </Button>
                      {userCoords && (
                        <div className="text-xs text-green-400 mt-1">Location set: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}</div>
                      )}
                    </div>

                    {/* End Location */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-monastery-gold">To</label>
                      <select 
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-monastery-gold text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Rumtek Monastery">Rumtek Monastery</option>
                        <option value="Pemayangtse Monastery">Pemayangtse Monastery</option>
                        <option value="Tashiding Monastery">Tashiding Monastery</option>
                      </select>
                    </div>

                    {/* Transport Mode */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-monastery-gold">Transport Mode</label>
                      <select 
                        value={travelMode}
                        onChange={(e) => setTravelMode(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-monastery-gold text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="car">Private Car</option>
                        <option value="bus">Public Bus</option>
                        <option value="taxi">Shared Taxi</option>
                      </select>
                    </div>

                    {/* Number of Travelers */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-monastery-gold">Number of Travelers</label>
                      <Input className ="bg-black/60 border-monastery-gold text-white placeholder-white focus:ring-2 focus:ring-monastery-gold focus:border-monastery-gold rounded-md"
                        type="number"
                        min="1"
                        max="8"
                        value={travelers}
                        onChange={(e) => setTravelers(parseInt(e.target.value))}
                      />
                    </div>

                    {/* Travel Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-monastery-gold">Travel Date</label>
                      <Input type="date" className ="bg-black/60 border-monastery-gold text-white placeholder-white focus:ring-2 focus:ring-monastery-gold focus:border-monastery-gold rounded-md" />
                    </div>

                    <Button className="w-full bg-monastery-gold text-black font-semibold rounded-xl border border-monastery-gold hover:bg-monastery-gold hover:text-black hover:shadow-[0_0_8px_2px_rgba(255,221,51,0.5)] transition-all" onClick={handleFindRoute} disabled={loadingRoute}>
                      <Navigation className="w-4 h-4 mr-2" />
                      {loadingRoute ? 'Finding Route...' : 'Find Best Route'}
                    </Button>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                  </CardContent>
                </Card>

                {/* Weather Alert */}
                <Card className="mt-4 bg-black/60 border-transparent rounded-xl">
                  <CardContent className="pt-4">
                    <div className={`flex items-center gap-2 p-3 rounded-lg  ${
                      getWeatherAlert().type === 'success' ? 'bg-green-50 text-green-800' :
                      getWeatherAlert().type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      <Info className="w-4 h-4" />
                      <span className="text-sm">{getWeatherAlert().message}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Route Summary */}
              <div className="lg:col-span-2">
                <Card className ="bg-black/60 border-transparent rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-monastery-gold">
                        <Route className="w-5 h-5 text-green-600" />
                        Recommended Route
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Route Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm text-slate-600">Distance</div>
                        <div className="font-semibold">{routeData?.distance || 'N/A'}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Clock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="text-sm text-slate-600">Duration</div>
                        <div className="font-semibold">{routeData?.duration || 'N/A'}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <div className="text-sm text-slate-600">Est. Cost</div>
                        <div className="font-semibold">₹{calculateTotalCost().toLocaleString()}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Star className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                        <div className="text-sm text-slate-600">Best Time</div>
                        <div className="font-semibold text-xs">N/A</div>
                      </div>
                    </div>

                    {/* Route Path - Only Important Cities */}
                    <div>
                      <h3 className="font-semibold mb-3 text-monastery-gold">Route Path (Major Cities)</h3>
                      <div className="flex flex-col gap-2">
                        {cityNames.length ? (
                          cityNames.map((city, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-600" />
                              <span className="text-sm text-white">{city}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-400">No major cities found</div>
                        )}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="font-semibold mb-3 text-monastery-gold">Route Highlights</h3>
                      <div className="flex flex-wrap gap-2 bg-transparent border-white text-white">
                        <span className="text-xs text-gray-400">No highlights available</span>
                      </div>
                    </div>

                    {/* Planned Stops - Food, Fuel, Attractions */}
                    <div>
                      <h3 className="font-semibold mb-3 text-monastery-gold">Planned Stops (Food, Fuel, Attractions)</h3>
                      <div className="space-y-2">
                        {amenities.length ? (
                          amenities.map((a, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-black">{a.tags.name || a.tags.amenity || a.tags.tourism || 'Stop'}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {a.tags.amenity ? (a.tags.amenity === 'fuel' ? 'Fuel' : a.tags.amenity === 'restaurant' ? 'Food' : a.tags.amenity) : (a.tags.tourism ? 'Attraction' : 'Stop')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-black">
                                {a.lat && a.lon && (
                                  <span className="text-xs">({a.lat.toFixed(3)}, {a.lon.toFixed(3)})</span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No planned stops found</span>
                        )}
                      </div>
                    </div>

                    {/* Warnings */}
                    {/* No warnings available from API */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <div className="space-y-6">
              {routeData ? (
                <Card className="bg-black/60 border-transparent rounded-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-monastery-gold">
                          <Route className="w-5 h-5 text-green-600" />
                          Dynamic Route
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-white">
                          <span className="flex items-center gap-1 text-white">
                            <Navigation className="w-4 h-4" />
                            {routeData.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {routeData.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ₹{calculateTotalCost().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-monastery-gold">Route Steps</h4>
                        <div className="flex flex-col gap-1">
                          {routeData.steps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-600" />
                              <span className="text-sm text-white" dangerouslySetInnerHTML={{__html: step.html_instructions}} />
                              <span className="text-xs text-white">({step.distance.text})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-white">Overview</h4>
                        <div className="text-sm text-white">Mode: {travelMode}</div>
                        <div className="text-sm text-white">Travelers: {travelers}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-gray-400">No route data. Please plan a route.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transport">
            <div className="grid md:grid-cols-2 gap-6">
              {transportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card key={option.mode} className= "bg-black/60 border-transparent rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-monastery-gold">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        {option.name}
                      </CardTitle>
                      <div className="text-sm text-white">
                        Cost: {option.costPerKm} per km
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-monastery-gold">Advantages</h4>
                        <ul className="text-sm space-y-1">
                          {option.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2 text-white">
                              <CheckCircle className="w-3 h-3 text-green-600 mt-1" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-monastery-gold">Considerations</h4>
                        <ul className="text-sm space-y-1">
                          {option.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2 text-white">
                              <AlertCircle className="w-3 h-3 text-orange-600 mt-1" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-white"><strong>Best for:</strong> {option.suitableFor}</div>
                        <div className="text-sm text-white mt-1">{option.bookingInfo}</div>
                      </div>
                      <Button 
                        className="w-full bg-monastery-gold text-black font-semibold rounded-xl border border-monastery-gold hover:bg-monastery-gold hover:text-black hover:shadow-[0_0_8px_2px_rgba(255,221,51,0.5)] transition-all" 
                        size="sm"
                        onClick={() => setTravelMode(option.mode)}
                      >
                        Choose {option.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="costs">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cost Breakdown */}
              <Card className="bg-black/60 border-transparent rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-monastery-gold">
                    <Calculator className="w-5 h-5 text-green-600" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-white">
                      <span>Base Transportation Cost</span> 
                      <span className="font-semibold">₹{calculateTotalCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span>Fuel Cost</span>
                      <span className="font-semibold">N/A</span>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span>Toll Charges</span>
                      <span className="font-semibold">N/A</span>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span>Parking Fees</span>
                      <span className="font-semibold">N/A</span>
                    </div>
                    {travelers > 1 && (
                      <div className="flex justify-between items-center text-white">
                        <span>Additional Travelers ({travelers - 1})</span>
                        <span className="font-semibold">₹{((travelers - 1) * 500).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center text-lg font-bold text-monastery-gold">
                        <span>Total Estimated Cost</span>
                        <span className="text-green-600">₹{calculateTotalCost().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Cost-Saving Tips</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Travel in groups to share costs</li>
                      <li>• Book accommodation in advance</li>
                      <li>• Choose shared transportation</li>
                      <li>• Visit during off-peak seasons</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Comparison */}
              <Card className="bg-black/60 border-transparent rounded-xl">
                <CardHeader>
                  <CardTitle className='text-monastery-gold'>Transport Mode Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transportOptions.map((option) => {
                      const estimatedCost = option.mode === 'car' ? 2400 :
                                          option.mode === 'bus' ? 800 :
                                          option.mode === 'taxi' ? 1600 : 8000;
                      return (
                        <div key={option.mode} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4 text-slate-600" />
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{estimatedCost.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">{option.costPerKm}/km</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">Budget Planning</h4>
                    <div className="text-sm space-y-1">
                      <div>💰 Budget: ₹800 - ₹1,600</div>
                      <div>💳 Mid-range: ₹1,600 - ₹3,000</div>
                      <div>🏆 Premium: ₹3,000+</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoutePlanner;