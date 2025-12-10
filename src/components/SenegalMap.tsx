import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockCouvertureGeo, mockRisquesIA, mockPatients } from "@/data/mockData";

interface SenegalMapProps {
  mode: 'structures' | 'risks';
}

// Senegal center coordinates
const SENEGAL_CENTER: [number, number] = [14.4974, -14.4524];

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

const SenegalMap = ({ mode }: SenegalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: SENEGAL_CENTER,
      zoom: 7,
      scrollWheelZoom: true,
      minZoom: 6,
      maxBounds: [
        [12.3, -17.6],
        [16.7, -11.4]
      ]
    });

    // Add colorful tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers based on mode
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    if (mode === 'structures') {
      // Add structure markers
      mockCouvertureGeo.forEach((geo) => {
        const coords = STRUCTURE_COORDS[geo.structure];
        if (!coords) return;

        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: 10,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.8
        });

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${geo.structure}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${geo.district}</p>
            <div style="font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Patientes:</span>
                <strong>${geo.patientes}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>CPN1:</span>
                <strong>${geo.cpn1}/${geo.cible_cpn1}</strong>
              </div>
            </div>
          </div>
        `);

        marker.addTo(map);
      });
    } else {
      // Add risk circles by region
      Object.entries(regionRisks).forEach(([region, data]) => {
        const center = REGION_CENTERS[region];
        if (!center || (data.rouge + data.orange + data.vert) === 0) return;

        const circle = L.circleMarker([center.lat, center.lng], {
          radius: getRiskRadius(data),
          fillColor: getRiskColor(data),
          color: getRiskColor(data),
          weight: 2,
          opacity: 1,
          fillOpacity: 0.6
        });

        circle.bindPopup(`
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${region}</h3>
            <div style="font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #ef4444;">Risque élevé:</span>
                <strong>${data.rouge}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #f97316;">Risque moyen:</span>
                <strong>${data.orange}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #22c55e;">Risque faible:</span>
                <strong>${data.vert}</strong>
              </div>
            </div>
          </div>
        `);

        circle.addTo(map);
      });
    }
  }, [mode, isMapReady, regionRisks]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }} 
      />

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
