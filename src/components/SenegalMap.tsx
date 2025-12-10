import { mockCouvertureGeo, mockRisquesIA, mockPatients } from "@/data/mockData";

interface SenegalMapProps {
  mode: 'structures' | 'risks';
}

// Coordinates for Senegal regions (simplified)
const REGION_PATHS: Record<string, { path: string; center: { x: number; y: number } }> = {
  "Dakar": {
    path: "M80,180 L95,175 L100,185 L90,195 L75,190 Z",
    center: { x: 87, y: 185 }
  },
  "Thiès": {
    path: "M100,165 L130,155 L145,175 L135,195 L100,190 L95,175 Z",
    center: { x: 118, y: 175 }
  },
  "Diourbel": {
    path: "M130,155 L160,145 L175,165 L165,185 L145,175 Z",
    center: { x: 155, y: 165 }
  },
  "Fatick": {
    path: "M135,195 L165,185 L180,210 L150,230 L120,215 Z",
    center: { x: 150, y: 207 }
  },
  "Kaolack": {
    path: "M165,185 L200,175 L220,200 L200,225 L180,210 Z",
    center: { x: 193, y: 200 }
  },
  "Kaffrine": {
    path: "M200,175 L250,165 L270,190 L250,215 L220,200 Z",
    center: { x: 238, y: 190 }
  },
  "Tambacounda": {
    path: "M270,190 L350,180 L380,220 L340,260 L280,240 L250,215 Z",
    center: { x: 315, y: 220 }
  },
  "Kédougou": {
    path: "M340,260 L380,250 L400,290 L370,310 L340,290 Z",
    center: { x: 365, y: 280 }
  },
  "Kolda": {
    path: "M220,260 L280,240 L310,270 L280,300 L230,290 Z",
    center: { x: 265, y: 270 }
  },
  "Sédhiou": {
    path: "M170,270 L220,260 L230,290 L200,310 L165,295 Z",
    center: { x: 197, y: 285 }
  },
  "Ziguinchor": {
    path: "M120,280 L170,270 L165,295 L140,310 L110,295 Z",
    center: { x: 140, y: 290 }
  },
  "Saint-Louis": {
    path: "M100,80 L180,60 L200,100 L175,140 L130,155 L100,130 Z",
    center: { x: 150, y: 105 }
  },
  "Matam": {
    path: "M200,100 L300,80 L330,130 L280,160 L200,175 L175,140 Z",
    center: { x: 250, y: 125 }
  },
  "Louga": {
    path: "M100,130 L130,155 L160,145 L175,140 L200,175 L200,130 L175,140 Z",
    center: { x: 155, y: 145 }
  }
};

// Structure positions on map
const STRUCTURE_POSITIONS: Record<string, { x: number; y: number }> = {
  "Poste de Santé Dakar Nord": { x: 82, y: 180 },
  "Poste de Santé Dakar Sud": { x: 90, y: 190 },
  "Centre de Santé Pikine": { x: 95, y: 183 },
  "Poste de Santé Guédiawaye": { x: 88, y: 177 },
  "Poste de Santé Rufisque": { x: 98, y: 188 },
  "Centre de Santé Thiès": { x: 115, y: 170 },
  "Poste de Santé Mbour": { x: 125, y: 185 },
  "Centre de Santé Tivaouane": { x: 110, y: 165 },
  "Poste de Santé Diourbel": { x: 155, y: 160 },
  "Centre de Santé Bambey": { x: 150, y: 168 },
  "Poste de Santé Fatick": { x: 145, y: 205 },
  "Centre de Santé Kaolack": { x: 190, y: 198 },
  "Poste de Santé Tambacounda": { x: 310, y: 215 },
  "Centre de Santé Saint-Louis": { x: 145, y: 100 },
  "Poste de Santé Ziguinchor": { x: 135, y: 288 }
};

const SenegalMap = ({ mode }: SenegalMapProps) => {
  // Calculate risk data per region
  const getRiskDataByRegion = () => {
    const regionData: Record<string, { rouge: number; orange: number; vert: number }> = {};
    
    mockPatients.forEach(patient => {
      const risk = mockRisquesIA.find(r => r.patient_id === patient.id);
      const region = patient.structure?.includes("Dakar") || patient.structure?.includes("Pikine") || patient.structure?.includes("Guédiawaye") || patient.structure?.includes("Rufisque")
        ? "Dakar" 
        : patient.structure?.includes("Thiès") || patient.structure?.includes("Mbour") || patient.structure?.includes("Tivaouane")
        ? "Thiès"
        : patient.structure?.includes("Diourbel") || patient.structure?.includes("Bambey")
        ? "Diourbel"
        : patient.structure?.includes("Saint-Louis")
        ? "Saint-Louis"
        : patient.structure?.includes("Tambacounda")
        ? "Tambacounda"
        : patient.structure?.includes("Ziguinchor")
        ? "Ziguinchor"
        : patient.structure?.includes("Kaolack")
        ? "Kaolack"
        : patient.structure?.includes("Fatick")
        ? "Fatick"
        : "Dakar";
      
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

  const getRegionColor = (region: string) => {
    if (mode === 'structures') {
      return 'hsl(var(--primary) / 0.3)';
    }
    
    const data = regionRisks[region];
    if (!data) return 'hsl(var(--muted) / 0.3)';
    
    const total = data.rouge + data.orange + data.vert;
    if (total === 0) return 'hsl(var(--muted) / 0.3)';
    
    const riskScore = (data.rouge * 3 + data.orange * 2 + data.vert) / total;
    
    if (riskScore > 2) return 'hsl(0 84% 60% / 0.6)'; // Rouge
    if (riskScore > 1.5) return 'hsl(25 95% 53% / 0.6)'; // Orange
    return 'hsl(142 71% 45% / 0.5)'; // Vert
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[hsl(var(--card))] rounded-lg p-4">
      {/* Blueprint grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      <svg 
        viewBox="0 0 450 350" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))' }}
      >
        {/* Senegal outline */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Regions */}
        {Object.entries(REGION_PATHS).map(([region, data]) => (
          <g key={region}>
            <path
              d={data.path}
              fill={getRegionColor(region)}
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              className="transition-all duration-300 hover:opacity-80"
              filter="url(#glow)"
            />
            <text
              x={data.center.x}
              y={data.center.y}
              className="fill-foreground text-[8px] font-medium pointer-events-none"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {region}
            </text>
          </g>
        ))}

        {/* Structure markers (only in structure mode) */}
        {mode === 'structures' && mockCouvertureGeo.map((geo) => {
          const pos = STRUCTURE_POSITIONS[geo.structure];
          if (!pos) return null;
          
          return (
            <g key={geo.structure}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="animate-pulse"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* Risk markers (only in risk mode) */}
        {mode === 'risks' && Object.entries(regionRisks).map(([region, data]) => {
          const regionPath = REGION_PATHS[region];
          if (!regionPath || (data.rouge + data.orange + data.vert) === 0) return null;
          
          return (
            <g key={`risk-${region}`}>
              {data.rouge > 0 && (
                <text
                  x={regionPath.center.x}
                  y={regionPath.center.y + 12}
                  className="fill-destructive text-[7px] font-bold"
                  textAnchor="middle"
                >
                  ⚠ {data.rouge}
                </text>
              )}
            </g>
          );
        })}

        {/* Ocean label */}
        <text x="50" y="250" className="fill-muted-foreground text-[10px] italic">
          Océan Atlantique
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Légende</h4>
        {mode === 'structures' ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Structure de santé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/30 border border-primary" />
              <span className="text-xs text-muted-foreground">Région couverte</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0 84% 60% / 0.6)' }} />
              <span className="text-xs text-muted-foreground">Risque élevé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(25 95% 53% / 0.6)' }} />
              <span className="text-xs text-muted-foreground">Risque moyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(142 71% 45% / 0.5)' }} />
              <span className="text-xs text-muted-foreground">Risque faible</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
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
