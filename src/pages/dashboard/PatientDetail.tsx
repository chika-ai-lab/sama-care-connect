import { useParams, useNavigate } from "react-router-dom";
import { mockPatients, mockVisites, mockRisquesIA, mockVaccins, mockReferencesSonu } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Calendar, MapPin, User, AlertTriangle, Share2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const patient = mockPatients.find(p => p.id === patientId);
  const visites = mockVisites.filter(v => v.patient_id === patientId);
  const risque = mockRisquesIA.find(r => r.patient_id === patientId);
  const vaccins = mockVaccins.filter(v => v.patient_id === patientId);
  const references = mockReferencesSonu.filter(r => r.patient_id === patientId);
  
  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient non trouvé</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    toast.success("Lien de partage copié dans le presse-papiers");
  };

  const handleAlertSonu = () => {
    if (risque?.niveau === 'rouge') {
      toast.success(`Alerte SONU envoyée pour ${patient.prenom} ${patient.nom}`);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge className="bg-[hsl(var(--status-vert))] text-white">Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-[hsl(var(--status-orange))] text-white">En attente</Badge>;
      case 'a_renouveler':
        return <Badge className="bg-[hsl(var(--status-rouge))] text-white">À renouveler</Badge>;
      default:
        return null;
    }
  };

  const getRiskBadge = () => {
    if (!risque) return null;
    switch (risque.niveau) {
      case 'rouge':
        return <Badge className="bg-[hsl(var(--status-rouge))] text-white">Risque Rouge</Badge>;
      case 'orange':
        return <Badge className="bg-[hsl(var(--status-orange))] text-white">Risque Orange</Badge>;
      case 'vert':
        return <Badge className="bg-[hsl(var(--status-vert))] text-white">Risque Vert</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{patient.prenom} {patient.nom}</h1>
            <p className="text-muted-foreground">{patient.age} ans • {patient.semaines} SA</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          {risque?.niveau === 'rouge' && (
            <Button 
              onClick={handleAlertSonu}
              className="bg-[hsl(var(--status-rouge))] hover:bg-[hsl(var(--status-rouge))]/90 text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerte SONU
            </Button>
          )}
        </div>
      </div>

      {/* Info principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-semibold">{patient.prenom} {patient.nom}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Âge</p>
                <p className="font-semibold">{patient.age} ans</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {patient.telephone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DDR</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {patient.ddr}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terme prévu</p>
                <p className="font-semibold">{patient.terme_prevu}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Semaines d'aménorrhée</p>
                <p className="font-semibold">{patient.semaines} SA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Structure</p>
                <p className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {patient.structure}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent responsable</p>
                <p className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {patient.agent}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut CSU</p>
                <div className="mt-1">{getStatusBadge(patient.statut_csu)}</div>
              </div>
              {patient.date_enrolement && (
                <div>
                  <p className="text-sm text-muted-foreground">Date d'enrôlement</p>
                  <p className="font-semibold">{patient.date_enrolement}</p>
                </div>
              )}
              {patient.qr_code && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Code QR</p>
                  <p className="font-semibold">{patient.qr_code}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risque actuel */}
        {risque && (
          <Card>
            <CardHeader>
              <CardTitle>Évaluation IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{risque.score}/100</div>
                {getRiskBadge()}
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    risque.niveau === 'rouge' ? 'bg-[hsl(var(--status-rouge))]' :
                    risque.niveau === 'orange' ? 'bg-[hsl(var(--status-orange))]' :
                    'bg-[hsl(var(--status-vert))]'
                  }`}
                  style={{ width: `${risque.score}%` }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Facteurs de risque</p>
                <div className="space-y-1">
                  {risque.facteurs.map((facteur, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-[hsl(var(--status-orange))] mt-0.5 flex-shrink-0" />
                      <span>{facteur}</span>
                    </div>
                  ))}
                </div>
              </div>
              {risque.prediction && (
                <div className="p-3 bg-[hsl(var(--status-rouge)/0.1)] rounded-lg border border-[hsl(var(--status-rouge)/0.3)]">
                  <p className="text-sm font-semibold text-[hsl(var(--status-rouge))] mb-1">Prédiction</p>
                  <p className="text-sm">{risque.prediction}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Historique des visites */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des visites CPN</CardTitle>
        </CardHeader>
        <CardContent>
          {visites.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Poids (kg)</TableHead>
                  <TableHead>Tension</TableHead>
                  <TableHead>PB (cm)</TableHead>
                  <TableHead>IMC</TableHead>
                  <TableHead>Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visites.map((visite) => (
                  <TableRow key={visite.id}>
                    <TableCell>
                      <Badge variant="outline">{visite.type}</Badge>
                    </TableCell>
                    <TableCell>{visite.date}</TableCell>
                    <TableCell>{visite.poids}</TableCell>
                    <TableCell>{visite.tension}</TableCell>
                    <TableCell>{visite.pb}</TableCell>
                    <TableCell>{visite.imc}</TableCell>
                    <TableCell className="text-sm">{visite.agent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucune visite enregistrée</p>
          )}
        </CardContent>
      </Card>

      {/* Vaccinations */}
      {vaccins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Plan de vaccination</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccin</TableHead>
                  <TableHead>Date prévue</TableHead>
                  <TableHead>Date réalisée</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaccins.map((vaccin) => (
                  <TableRow key={vaccin.id}>
                    <TableCell className="font-medium">{vaccin.vaccin}</TableCell>
                    <TableCell>{vaccin.date_prevue}</TableCell>
                    <TableCell>{vaccin.date_realisee || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          vaccin.statut === 'realise' ? 'bg-[hsl(var(--status-vert))] text-white' :
                          vaccin.statut === 'retard' ? 'bg-[hsl(var(--status-rouge))] text-white' :
                          'bg-[hsl(var(--status-orange))] text-white'
                        }
                      >
                        {vaccin.statut === 'realise' ? 'Réalisé' : 
                         vaccin.statut === 'retard' ? 'Retard' : 'Prévu'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Références SONU */}
      {references.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des références SONU</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type d'alerte</TableHead>
                  <TableHead>Heure alerte</TableHead>
                  <TableHead>Structure origine</TableHead>
                  <TableHead>Structure SONU</TableHead>
                  <TableHead>Délai (min)</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {references.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell className="font-medium">{ref.type_alerte}</TableCell>
                    <TableCell>{new Date(ref.alerte_heure).toLocaleString('fr-FR')}</TableCell>
                    <TableCell className="text-sm">{ref.structure_origine}</TableCell>
                    <TableCell className="text-sm">{ref.structure_sonu}</TableCell>
                    <TableCell>{ref.delai_minutes || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          ref.statut === 'resolu' ? 'bg-[hsl(var(--status-vert))] text-white' :
                          ref.statut === 'admis' ? 'bg-[hsl(var(--status-orange))] text-white' :
                          ref.statut === 'en_route' ? 'bg-[hsl(var(--status-orange))] text-white' :
                          'bg-[hsl(var(--status-rouge))] text-white'
                        }
                      >
                        {ref.statut === 'resolu' ? 'Résolu' :
                         ref.statut === 'admis' ? 'Admis' :
                         ref.statut === 'en_route' ? 'En route' :
                         'Alerte'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
