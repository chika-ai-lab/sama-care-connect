import { KPICard } from "@/components/KPICard";
import { mockKPIData } from "@/data/mockData";
import { 
  Users, 
  Calendar, 
  Baby,
  AlertTriangle,
  Ambulance,
  Shield,
  Syringe,
  Activity,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord TEKHE</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Date range</Button>
          <Button variant="outline" size="sm">District ↓</Button>
          <Button variant="outline" size="sm">Structure ↓</Button>
          <Button size="sm">Export CSV/JSON</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Patientes totales"
          value={mockKPIData.patientes_totales.toLocaleString()}
          icon={Users}
          color="default"
          trend="+12%"
        />
        
        <KPICard
          title="CPN1 réalisées"
          value={`${mockKPIData.cpn1_realisees} / ${mockKPIData.cpn1_cible}`}
          icon={Calendar}
          color="green"
          subtitle="Cible atteinte"
          progress={Math.round((mockKPIData.cpn1_realisees / mockKPIData.cpn1_cible) * 100)}
        />
        
        <KPICard
          title="CPN4 réalisées"
          value={`${mockKPIData.cpn4_realisees} / ${mockKPIData.cpn4_cible}`}
          icon={Calendar}
          color="orange"
          subtitle="En progression"
          progress={Math.round((mockKPIData.cpn4_realisees / mockKPIData.cpn4_cible) * 100)}
        />
        
        <KPICard
          title="CPON 6-42j"
          value={`${mockKPIData.cpon_pourcentage}%`}
          icon={Baby}
          color="green"
          progress={mockKPIData.cpon_pourcentage}
        />
        
        <KPICard
          title="Risques Rouge"
          value={mockKPIData.risques_rouge}
          icon={AlertTriangle}
          color="red"
          subtitle="Nécessitent attention immédiate"
        />
        
        <KPICard
          title="Risques Orange"
          value={mockKPIData.risques_orange}
          icon={AlertTriangle}
          color="orange"
          subtitle="Surveillance renforcée"
        />
        
        <KPICard
          title="Risques Vert"
          value={mockKPIData.risques_vert}
          icon={AlertTriangle}
          color="green"
          subtitle="Suivi normal"
        />
        
        <KPICard
          title="Délai SONU moyen"
          value={`${mockKPIData.references_delai_moyen} min`}
          icon={Ambulance}
          color="orange"
          subtitle="Références urgentes"
        />
        
        <KPICard
          title="CSU Enrôlés"
          value={mockKPIData.csu_enrolled.toLocaleString()}
          icon={Shield}
          color="default"
          trend="+8%"
        />
        
        <KPICard
          title="CSU Actifs"
          value={mockKPIData.csu_actifs.toLocaleString()}
          icon={Shield}
          color="green"
          subtitle={`${mockKPIData.csu_a_renouveler} à renouveler`}
        />
        
        <KPICard
          title="PEV doses complètes"
          value={`${mockKPIData.pev_complet_pourcentage}%`}
          icon={Syringe}
          color="green"
          progress={mockKPIData.pev_complet_pourcentage}
        />
        
        <KPICard
          title="Létalité obstétricale"
          value={`${mockKPIData.letalite_taux}‰`}
          icon={Activity}
          color="orange"
          subtitle="Pour 1000 naissances"
        />
      </div>

      {/* Qualité des données */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Qualité des données
            </CardTitle>
            <div className="text-2xl font-bold">{mockKPIData.qualite_score}/100</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Complétude</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Cohérence</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Opportunité</span>
                <span className="font-medium">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Synchronisation</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Alertes incohérences</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-rouge))]"></span>
                3 DDR supérieures à la date de visite
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-orange))]"></span>
                7 âges manquants
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-rouge))]"></span>
                2 tensions invalides
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
