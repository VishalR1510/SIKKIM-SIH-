import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MONASTERIES = {
  'Rumtek Monastery': { lat: 27.3331, lng: 88.6200 },
  'Pemayangtse Monastery': { lat: 27.3005, lng: 88.2336 },
  'Tashiding Monastery': { lat: 27.2852, lng: 88.2832 }
};

const DEFAULT_POSITION = [27.3331, 88.6200];

const InteractiveMap: React.FC = () => {
  const [selectedMonastery, setSelectedMonastery] = useState('Rumtek Monastery');
  const [showDirections, setShowDirections] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(selectedMonastery);
  const [travelMode, setTravelMode] = useState('driving-car');
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [routeDetails, setRouteDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to get coordinates from address using OpenRouteService geocode
  const getCoords = async (address: string) => {
    const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjYyM2MyZTc3OGNlNjQ0MDc5ZjE2ZjQ5YjAxN2ExZThiIiwiaCI6Im11cm11cjY0In0='; // Replace with your OpenRouteService API key
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].geometry.coordinates.reverse(); // [lat, lng]
    }
    throw new Error('Location not found');
  };

  // Fetch route from OpenRouteService
  const fetchRoute = async (fromAddr: string, toAddr: string, mode: string) => {
    setLoading(true);
    setError('');
    try {
      const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjYyM2MyZTc3OGNlNjQ0MDc5ZjE2ZjQ5YjAxN2ExZThiIiwiaCI6Im11cm11cjY0In0='; // Replace with your OpenRouteService API key
      const fromCoords = await getCoords(fromAddr);
      const toCoords = MONASTERIES[toAddr] ? [MONASTERIES[toAddr].lat, MONASTERIES[toAddr].lng] : await getCoords(toAddr);
      const url = `https://api.openrouteservice.org/v2/directions/${mode}?api_key=${apiKey}`;
      const body = {
        coordinates: [fromCoords.reverse(), toCoords.reverse()]
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]); // [lat, lng]
        setRouteCoords(coords);
        setRouteDetails({
          distance: (data.routes[0].summary.distance / 1000).toFixed(2) + ' km',
          duration: Math.round(data.routes[0].summary.duration / 60) + ' min'
        });
      } else {
        setError('No route found');
      }
    } catch (err: any) {
      setError('Error fetching route');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-2/3 h-[500px]">
        <MapContainer
          center={[
            Number(MONASTERIES[selectedMonastery]?.lat ?? DEFAULT_POSITION[0]),
            Number(MONASTERIES[selectedMonastery]?.lng ?? DEFAULT_POSITION[1])
          ] as [number, number]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[
              Number(MONASTERIES[selectedMonastery]?.lat ?? DEFAULT_POSITION[0]),
              Number(MONASTERIES[selectedMonastery]?.lng ?? DEFAULT_POSITION[1])
            ] as [number, number]}
          />
          {routeCoords.length > 0 && <Polyline positions={routeCoords} pathOptions={{ color: 'blue' }} />}
        </MapContainer>
      </div>
      <div className="w-full md:w-1/3">
        <div className="mb-4">
          <label className="block font-bold mb-2">Select Monastery:</label>
          <select value={selectedMonastery} onChange={e => {setSelectedMonastery(e.target.value); setTo(e.target.value); setRouteCoords([]); setRouteDetails(null);}} className="w-full p-2 rounded bg-black text-white">
            {Object.keys(MONASTERIES).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {!showDirections ? (
          <div>
            <h2 className="text-xl font-bold mb-2 text-monastery-gold">{selectedMonastery}</h2>
            <p className="mb-4">Location: {MONASTERIES[selectedMonastery].lat}, {MONASTERIES[selectedMonastery].lng}</p>
            <button className="bg-monastery-gold text-black px-4 py-2 rounded font-bold" onClick={() => setShowDirections(true)}>Get Directions</button>
          </div>
        ) : (
          <div className="bg-black/70 p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-2 text-monastery-gold">Get Directions</h3>
            <div className="mb-2">
              <label className="block mb-1 text-white">From:</label>
              <input className="w-full p-2 rounded bg-black text-white border border-monastery-gold" value={from} onChange={e => setFrom(e.target.value)} placeholder="Enter starting location" />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-white">To:</label>
              <input className="w-full p-2 rounded bg-black text-white border border-monastery-gold" value={to} onChange={e => setTo(e.target.value)} placeholder="Enter destination" />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-white">Travel Mode:</label>
              <select className="w-full p-2 rounded bg-black text-white border border-monastery-gold" value={travelMode} onChange={e => setTravelMode(e.target.value)}>
                <option value="driving-car">Car</option>
                <option value="cycling-regular">Cycle</option>
                <option value="foot-walking">Walk</option>
              </select>
            </div>
            <button className="bg-monastery-gold text-black px-4 py-2 rounded font-bold w-full" onClick={() => fetchRoute(from, to, travelMode)} disabled={loading}>{loading ? 'Finding Route...' : 'Show Route'}</button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {routeDetails && (
              <div className="mt-4 p-2 bg-slate-800 rounded text-white">
                <div><strong>Distance:</strong> {routeDetails.distance}</div>
                <div><strong>Duration:</strong> {routeDetails.duration}</div>
              </div>
            )}
            <button className="mt-4 text-monastery-gold underline" onClick={() => {setShowDirections(false); setRouteCoords([]); setRouteDetails(null);}}>Back to Monastery Info</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;