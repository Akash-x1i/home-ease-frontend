import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTrackingSocket } from '../services/socket';
import { MapPin, Navigation, Compass, CheckCircle, Radio, Clock } from 'lucide-react';

// Custom Map center update component
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Leaflet custom HTML markers
const createCustomIcon = (color, emoji) =>
  L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${color};
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      border: 3px solid white;
      font-size: 18px;
    ">${emoji}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

const customerIcon = createCustomIcon('#10B981', '🏠');
const providerIcon = createCustomIcon('#F59E0B', '👨‍🔧');

export default function LiveTracking({ jobId, initialCustomerCoords, initialProviderCoords, jobStatus }) {
  const [providerCoords, setProviderCoords] = useState(
    initialProviderCoords || { lat: 12.9716, lng: 77.5946 }
  );
  const [customerCoords] = useState(
    initialCustomerCoords || { lat: 12.9352, lng: 77.6245 }
  );
  const [status, setStatus] = useState(jobStatus || 'in-progress');
  const [speed, setSpeed] = useState(25);
  const [address, setAddress] = useState('En route to destination...');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const socket = getTrackingSocket();

    socket.emit('join_job', { jobId, role: 'client' });
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onLocationUpdated = (data) => {
      console.log('📍 Live location update received:', data);
      if (data.lat && data.lng) {
        setProviderCoords({ lat: data.lat, lng: data.lng });
        if (data.speed !== undefined) setSpeed(data.speed);
        if (data.address) setAddress(data.address);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    };

    const onStatusUpdated = (data) => {
      if (data.status) setStatus(data.status);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('location_updated', onLocationUpdated);
    socket.on('status_updated', onStatusUpdated);

    // Simulate provider Movement for smooth demonstration if offline socket
    const simInterval = setInterval(() => {
      setProviderCoords((prev) => {
        const dLat = (customerCoords.lat - prev.lat) * 0.05;
        const dLng = (customerCoords.lng - prev.lng) * 0.05;
        if (Math.abs(dLat) < 0.0001 && Math.abs(dLng) < 0.0001) {
          return prev;
        }
        return {
          lat: prev.lat + dLat,
          lng: prev.lng + dLng,
        };
      });
      setLastUpdated(new Date().toLocaleTimeString());
    }, 4000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('location_updated', onLocationUpdated);
      socket.off('status_updated', onStatusUpdated);
      clearInterval(simInterval);
    };
  }, [jobId, customerCoords]);

  const mapCenter = [providerCoords.lat, providerCoords.lng];
  const polylinePositions = [
    [providerCoords.lat, providerCoords.lng],
    [customerCoords.lat, customerCoords.lng],
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Live Status Header */}
      <div className="bg-gray-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Live Provider Tracking
            </h3>
            <p className="text-xs text-gray-400">Job #{jobId ? jobId.slice(-6) : 'LIVE-101'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Updated {lastUpdated}
          </span>
          <span className={`px-2.5 py-1 rounded-full font-semibold ${
            isConnected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {isConnected ? 'Socket Active' : 'Simulating Live'}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 w-full relative">
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Provider Marker */}
          <Marker position={[providerCoords.lat, providerCoords.lng]} icon={providerIcon}>
            <Popup>
              <div className="text-sm font-semibold p-1">
                👨‍🔧 Provider Location
                <br />
                <span className="text-xs font-normal text-gray-600">{address}</span>
              </div>
            </Popup>
          </Marker>

          {/* Customer Destination Marker */}
          <Marker position={[customerCoords.lat, customerCoords.lng]} icon={customerIcon}>
            <Popup>
              <div className="text-sm font-semibold p-1">
                🏠 Service Destination
              </div>
            </Popup>
          </Marker>

          {/* Connecting Line */}
          <Polyline positions={polylinePositions} color="#059669" weight={4} dashArray="8, 8" />
        </MapContainer>
      </div>

      {/* Telemetry Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-2xs border border-gray-100">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Provider Address</p>
            <p className="font-semibold text-gray-800 truncate max-w-48">{address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-2xs border border-gray-100">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Estimated Speed</p>
            <p className="font-semibold text-gray-800">{speed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-2xs border border-gray-100">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Job Status</p>
            <p className="font-semibold text-emerald-600 capitalize">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
