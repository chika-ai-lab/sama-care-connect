import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockPatients, mockRisquesIA, mockCPNMonthly, mockCouvertureGeo } from "@/data/mockData";
import { Users, AlertTriangle, TrendingUp, MapPin } from "lucide-react";

const PartenaireAnalytics = () => {
  // Anonymized statistics
  const stats = {
    totalPatients: mockPatients.length,
    risquesRouge: mockRisquesIA.filter(r => r.niveau === 'rouge').length,
    risquesOrange: mockRisquesIA.filter(r => r.niveau === 'orange').length,
    cpn1Coverage: Math.round((mockPatients.filter(p => p.semaines && p.semaines >= 12).length / mockPatients.length) * 100)
  };

  // Data for risk distribution
  const riskData = [
    { name: 'Risque Élevé', value: stats.risquesRouge, color: '#ef4444' },
    { name: 'Risque Moyen', value: stats.risquesOrange, color: '#f97316' },
    { name: 'Risque Faible', value: mockPatients.length - stats.risquesRouge - stats.risquesOrange, color: '#22c55e' }
  ];

  // Age distribution (anonymized)
  const ageDistribution = [
    { tranche: '<18 ans', count: mockPatients.filter(p => p.age < 18).length },
    { tranche: '18-25 ans', count: mockPatients.filter(p => p.age >= 18 && p.age <= 25).length },
    { tranche: '26-35 ans', count: mockPatients.filter(p => p.age > 25 && p.age <= 35).length },
    { tranche: '>35 ans', count: mockPatients.filter(p => p.age > 35).length }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Analytique</h1>
        <p className="text-muted-foreground">
          Données anonymisées pour l'analyse et la prise de décision
        </p>
      </div>

      {/* Key Indicators */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Suivies actuellement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risques Élevés</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.risquesRouge}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Couverture CPN1</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cpn1Coverage}%</div>
            <p className="text-xs text-muted-foreground">Objectif: 95%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Structures</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCouvertureGeo.length}</div>
            <p className="text-xs text-muted-foreground">Points de service</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CPN Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle CPN</CardTitle>
            <CardDescription>Tendances des consultations prénatales</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCPNMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpn1" stroke="#3b82f6" name="CPN1" />
                <Line type="monotone" dataKey="cpn2" stroke="#10b981" name="CPN2" />
                <Line type="monotone" dataKey="cpn3" stroke="#f59e0b" name="CPN3" />
                <Line type="monotone" dataKey="cpn4" stroke="#ef4444" name="CPN4" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Risques</CardTitle>
            <CardDescription>Répartition par niveau de risque IA</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution par Âge</CardTitle>
            <CardDescription>Répartition démographique anonymisée</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tranche" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Nombre" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographical Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Couverture Géographique</CardTitle>
            <CardDescription>Répartition par structure de santé</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockCouvertureGeo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="structure" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="patientes" fill="#10b981" name="Patientes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Anonymized Patient List Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé Anonymisé par Structure</CardTitle>
          <CardDescription>Vue d'ensemble des indicateurs clés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCouvertureGeo.map((geo) => {
              const structureRisks = mockRisquesIA.filter(r => 
                mockPatients.find(p => p.id === r.patient_id && p.structure === geo.structure)
              );
              const risquesRouge = structureRisks.filter(r => r.niveau === 'rouge').length;
              
              return (
                <div key={geo.structure} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{geo.structure}</h3>
                    <p className="text-sm text-muted-foreground">{geo.district}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{geo.patientes}</div>
                      <div className="text-xs text-muted-foreground">Patientes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{geo.cpn1}/{geo.cible_cpn1}</div>
                      <div className="text-xs text-muted-foreground">CPN1</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={risquesRouge > 0 ? "destructive" : "secondary"}>
                        {risquesRouge} risques élevés
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartenaireAnalytics;
