import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockCouvertureGeo, mockRisquesIA, mockPatients } from "@/data/mockData";

interface SenegalMapProps {
  mode: 'structures' | 'risks';
}

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Senegal center coordinates
const SENEGAL_CENTER: [number, number] = [14.4974, -14.4524];
const SENEGAL_BOUNDS: [[number, number], [number, number]] = [
  [12.3, -17.6], // Southwest
  [16.7, -11.4]  // Northeast
];

// Structure coordinates in Senegal
const STRUCTURE_COORDS: Record<string, { lat: number; lng: number; region: string }> = {
  "Poste de Santé Dakar Nord": { lat: 14.7167, lng: -17.4677, region: "Dakar" },
  "Poste de Santé Dakar Sud": { lat: 14.6937, lng: -17.4441, region: "Dakar" },
  "Centre de Santé Pikine": { lat: 14.7645, lng: -17.3907, region: "Dakar" },
  "Poste de Santé Guédiawaye": { lat: 14.7772, lng: -17.3939, region: "Dakar" },
  "Poste de Santé Rufisque": { lat: 14.7167, lng: -17.2667, region: "Dakar" },
  "Centre de Santé Thiès": { lat: 14.7886, lng: -16.9260, region: "Thiès" },
  "Poste de Santé Mbour": { lat: 14.4167, lng: -16.9667, region: "Thiès" },
  "Centre de Santé Tivaouane": { lat: 14.9500, lng: -16.8167, region: "Thiès" },
  "Poste de Santé Diourbel": { lat: 14.6500, lng: -16.2333, region: "Diourbel" },
  "Centre de Santé Bambey": { lat: 14.7000, lng: -16.4500, region: "Diourbel" },
  "Poste de Santé Fatick": { lat: 14.3333, lng: -16.4000, region: "Fatick" },
  "Centre de Santé Kaolack": { lat: 14.1500, lng: -16.0667, region: "Kaolack" },
  "Poste de Santé Tambacounda": { lat: 13.7667, lng: -13.6667, region: "Tambacounda" },
  "Centre de Santé Saint-Louis": { lat: 16.0333, lng: -16.5000, region: "Saint-Louis" },
  "Poste de Santé Ziguinchor": { lat: 12.5667, lng: -16.2667, region: "Ziguinchor" }
};

// Region centers for risk display
const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "Dakar": { lat: 14.7167, lng: -17.4677 },
  "Thiès": { lat: 14.7886, lng: -16.9260 },
  "Diourbel": { lat: 14.6500, lng: -16.2333 },
  "Fatick": { lat: 14.3333, lng: -16.4000 },
  "Kaolack": { lat: 14.1500, lng: -16.0667 },
  "Kaffrine": { lat: 14.1000, lng: -15.5500 },
  "Tambacounda": { lat: 13.7667, lng: -13.6667 },
  "Kédougou": { lat: 12.5500, lng: -12.1833 },
  "Kolda": { lat: 12.8833, lng: -14.9500 },
  "Sédhiou": { lat: 12.7000, lng: -15.5500 },
  "Ziguinchor": { lat: 12.5667, lng: -16.2667 },
  "Saint-Louis": { lat: 16.0333, lng: -16.5000 },
  "Matam": { lat: 15.6500, lng: -13.2500 },
  "Louga": { lat: 15.6167, lng: -16.2167 }
};

// Custom blueprint-style CSS for the map
const MapStyle = () => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(SENEGAL_BOUNDS);
  }, [map]);
  
  return null;
};

const SenegalMap = ({ mode }: SenegalMapProps) => {
  // Calculate risk data per region
  const getRiskDataByRegion = () => {
    const regionData: Record<string, { rouge: number; orange: number; vert: number }> = {};
    
    Object.keys(REGION_CENTERS).forEach(region => {
      regionData[region] = { rouge: 0, orange: 0, vert: 0 };
    });
    
    mockPatients.forEach(patient => {
      const risk = mockRisquesIA.find(r => r.patient_id === patient.id);
      const structureCoords = STRUCTURE_COORDS[patient.structure || ""];
      const region = structureCoords?.region || "Dakar";
      
      if (!regionData[region]) {
        regionData[region] = { rouge: 0, orange: 0, vert: 0 };
      }
      
      if (risk?.niveau === 'rouge') regionData[region].rouge++;
      else if (risk?.niveau === 'orange') regionData[region].orange++;
      else regionData[region].vert++;
    });
    
    return regionData;
  };

  const regionRisks = getRiskDataByRegion();

  const getRiskColor = (data: { rouge: number; orange: number; vert: number }) => {
    const total = data.rouge + data.orange + data.vert;
    if (total === 0) return '#6b7280';
    
    const riskScore = (data.rouge * 3 + data.orange * 2 + data.vert) / total;
    
    if (riskScore > 2) return '#ef4444';
    if (riskScore > 1.5) return '#f97316';
    return '#22c55e';
  };

  const getRiskRadius = (data: { rouge: number; orange: number; vert: number }) => {
    const total = data.rouge + data.orange + data.vert;
    return Math.max(15, Math.min(40, total * 3));
  };

  // Create custom icon for structures
  const structureIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background: linear-gradient(135deg, hsl(221, 83%, 53%), hsl(221, 83%, 40%));
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      {/* Blueprint overlay effect */}
      <style>{`
        .leaflet-container {
          background: hsl(var(--card));
          font-family: inherit;
        }
        .leaflet-tile {
          filter: saturate(0.3) brightness(0.9) hue-rotate(200deg);
        }
        .custom-marker div {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .leaflet-popup-content-wrapper {
          background: hsl(var(--popover));
          color: hsl(var(--popover-foreground));
          border-radius: 8px;
        }
        .leaflet-popup-tip {
          background: hsl(var(--popover));
        }
      `}</style>
      
      <MapContainer
        center={SENEGAL_CENTER}
        zoom={7}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
        scrollWheelZoom={true}
        maxBounds={SENEGAL_BOUNDS}
        minZoom={6}
      >
        <MapStyle />
        
        {/* CartoDB Positron for blueprint-like appearance */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Structure markers */}
        {mode === 'structures' && mockCouvertureGeo.map((geo) => {
          const coords = STRUCTURE_COORDS[geo.structure];
          if (!coords) return null;
          
          return (
            <Marker 
              key={geo.structure} 
              position={[coords.lat, coords.lng]}
              icon={structureIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm">{geo.structure}</h3>
                  <p className="text-xs text-muted-foreground">{geo.district}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Patientes:</span>
                      <span className="font-bold">{geo.patientes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPN1:</span>
                      <span className="font-bold">{geo.cpn1}/{geo.cible_cpn1}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Risk circles by region */}
        {mode === 'risks' && Object.entries(regionRisks).map(([region, data]) => {
          const center = REGION_CENTERS[region];
          if (!center || (data.rouge + data.orange + data.vert) === 0) return null;
          
          return (
            <CircleMarker
              key={region}
              center={[center.lat, center.lng]}
              radius={getRiskRadius(data)}
              pathOptions={{
                fillColor: getRiskColor(data),
                fillOpacity: 0.6,
                color: getRiskColor(data),
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm">{region}</h3>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-red-500">Risque élevé:</span>
                      <span className="font-bold">{data.rouge}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-orange-500">Risque moyen:</span>
                      <span className="font-bold">{data.orange}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-green-500">Risque faible:</span>
                      <span className="font-bold">{data.vert}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Légende</h4>
        {mode === 'structures' ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Structure de santé</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Cliquez sur un marqueur pour les détails
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">Risque élevé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-muted-foreground">Risque moyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Risque faible</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
        <h4 className="text-xs font-semibold mb-2 text-foreground">
          {mode === 'structures' ? 'Structures' : 'Distribution'}
        </h4>
        {mode === 'structures' ? (
          <div className="text-2xl font-bold text-primary">{mockCouvertureGeo.length}</div>
        ) : (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-destructive">Élevé:</span>
              <span className="font-bold">{mockRisquesIA.filter(r => r.niveau === 'rouge').length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-orange-500">Moyen:</span>
              <span className="font-bold">{mockRisquesIA.filter(r => r.niveau === 'orange').length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-500">Faible:</span>
              <span className="font-bold">{mockRisquesIA.filter(r => r.niveau === 'vert').length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SenegalMap;
