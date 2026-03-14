import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Hotspot {
  position: [number, number];
  name: string;
  risk: string;
  incidents: number;
}

interface GeographicMapProps {
  hotspots: Hotspot[];
}

const GeographicMap = ({ hotspots }: GeographicMapProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  const getRiskOpacity = (risk: string) => {
    switch (risk) {
      case 'High':
        return 0.4;
      case 'Medium':
        return 0.3;
      default:
        return 0.2;
    }
  };

  // Create custom marker icon
  const createCustomIcon = (risk: string) => {
    const color = getRiskColor(risk);
    return new DivIcon({
      html: `
        <div style="position: relative;">
          <div style="
            position: absolute;
            width: 40px;
            height: 40px;
            background: ${color};
            border-radius: 50%;
            opacity: 0.3;
            animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            background: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Center of Nigeria
  const center: [number, number] = [9.0820, 8.6753];

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border shadow-glass">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hotspots.map((hotspot, idx) => (
          <React.Fragment key={idx}>
            <Circle
              center={hotspot.position}
              radius={50000}
              pathOptions={{
                color: getRiskColor(hotspot.risk),
                fillColor: getRiskColor(hotspot.risk),
                fillOpacity: getRiskOpacity(hotspot.risk),
                weight: 2,
              }}
            />
            
            <Marker
              position={hotspot.position}
              icon={createCustomIcon(hotspot.risk)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">{hotspot.name}</h3>
                  <p className="text-xs mb-1">
                    Risk Level:{' '}
                    <span 
                      className="font-semibold"
                      style={{ color: getRiskColor(hotspot.risk) }}
                    >
                      {hotspot.risk}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Incidents: {hotspot.incidents}
                  </p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-3 shadow-lg z-[1000]">
        <h4 className="text-xs font-semibold mb-2">Risk Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Low Risk</span>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GeographicMap;
