import { useParams, useNavigate } from "react-router-dom";
import { mockPatients, mockVisites, mockRisquesIA, mockVaccins, mockReferencesSonu, mockVisitesCPoN } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Phone, Calendar, MapPin, User, AlertTriangle, Share2, CheckCircle2, Clock, Bell } from "lucide-react";
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
  const visitesCPoN = mockVisitesCPoN.filter(v => v.patient_id === patientId);
  
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{patient.prenom} {patient.nom}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span>{patient.age} ans</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {patient.telephone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {patient.structure}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                ASC: {patient.agent}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button 
            onClick={handleAlertSonu}
            disabled={risque?.niveau !== 'rouge'}
            className="bg-[hsl(var(--status-rouge))] hover:bg-[hsl(var(--status-rouge))]/90 text-white disabled:opacity-50"
            size="sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerte Rouge
          </Button>
        </div>
      </div>

      {/* Info rapide */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Grossesse</p>
            <p className="text-xl font-bold">{patient.semaines} SA</p>
            <p className="text-xs text-muted-foreground">DDR: {patient.ddr}</p>
            <p className="text-xs text-muted-foreground">Terme: {patient.terme_prevu}</p>
          </CardContent>
        </Card>
        
        {risque && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Risque</p>
              <p className="text-xl font-bold">{risque.niveau === 'rouge' ? 'Rouge' : risque.niveau === 'orange' ? 'Orange' : 'Vert'}</p>
              <p className="text-xs text-muted-foreground">Score: {risque.score}/100</p>
              <p className="text-xs text-muted-foreground">Règle: {risque.regle_ia}</p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Statut CSU</p>
            <div className="mt-1">{getStatusBadge(patient.statut_csu)}</div>
            <p className="text-xs text-muted-foreground mt-1">{patient.qr_code}</p>
            <p className="text-xs text-muted-foreground">Renouvellement: {patient.date_renouvellement}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Enrôlement</p>
            <p className="text-sm font-semibold">{patient.date_enrolement}</p>
            {patient.plan_naissance && (
              <>
                <p className="text-xs text-muted-foreground mt-2">Plan naissance:</p>
                <p className="text-xs font-medium">{patient.plan_naissance}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="cpn" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="cpn">CPN</TabsTrigger>
          <TabsTrigger value="cpon">CPoN</TabsTrigger>
          <TabsTrigger value="fdr">FDR</TabsTrigger>
          <TabsTrigger value="csu">CSU</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="pev">PEV</TabsTrigger>
          <TabsTrigger value="references">Références</TabsTrigger>
        </TabsList>

        {/* Onglet CPN */}
        <TabsContent value="cpn">
          <Card>
            <CardHeader>
              <CardTitle>Consultations Prénatales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {visites.map((visite) => (
                <div key={visite.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">{visite.type}</Badge>
                      <span className="font-semibold">{visite.date}</span>
                      {visite.checklist_ok && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-vert))]" />}
                      {visite.rappel_envoye && <Bell className="h-4 w-4 text-[hsl(var(--status-orange))]" />}
                      {visite.statut === 'planifie' && <Clock className="h-4 w-4 text-[hsl(var(--status-orange))]" />}
                    </div>
                    <Badge className={
                      visite.statut === 'realise' ? 'bg-[hsl(var(--status-vert))] text-white' :
                      visite.statut === 'planifie' ? 'bg-[hsl(var(--status-orange))] text-white' :
                      'bg-muted'
                    }>
                      {visite.statut === 'realise' ? 'Réalisé' : visite.statut === 'planifie' ? 'Planifié' : 'À planifier'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Poids</p>
                      <p className="font-medium">{visite.poids} kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tension</p>
                      <p className="font-medium">{visite.tension}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">PB/MUAC</p>
                      <p className="font-medium">{visite.pb} cm</p>
                    </div>
                    {visite.hemoglobine && (
                      <div>
                        <p className="text-muted-foreground">Hb</p>
                        <p className="font-medium">{visite.hemoglobine} g/dl</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">IMC</p>
                      <p className="font-medium">{visite.imc}</p>
                    </div>
                  </div>
                  {visite.statut === 'planifie' && visite.rappel_envoye && (
                    <p className="text-xs text-[hsl(var(--status-orange))]">✓ Rappel SMS envoyé</p>
                  )}
                </div>
              ))}
              {patient.plan_naissance && (
                <div className="p-4 bg-[hsl(var(--status-vert)/0.1)] border border-[hsl(var(--status-vert)/0.3)] rounded-lg">
                  <p className="text-sm font-semibold text-[hsl(var(--status-vert))]">Plan de naissance documenté</p>
                  <p className="text-sm mt-1">{patient.plan_naissance}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet CPoN */}
        <TabsContent value="cpon">
          <Card>
            <CardHeader>
              <CardTitle>Consultations Post-Natales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {visitesCPoN.length > 0 ? (
                visitesCPoN.map((visite) => (
                  <div key={visite.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{visite.type}</Badge>
                        <span className="text-sm">({visite.jours_postpartum} jours post-partum)</span>
                      </div>
                      <Badge className={
                        visite.statut === 'realise' ? 'bg-[hsl(var(--status-vert))] text-white' :
                        visite.statut === 'rappel_envoye' ? 'bg-[hsl(var(--status-orange))] text-white' :
                        'bg-muted'
                      }>
                        {visite.statut === 'realise' ? 'Réalisé' :
                         visite.statut === 'rappel_envoye' ? 'Rappel envoyé' :
                         'Planifié'}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Date prévue: <span className="font-medium text-foreground">{visite.date_prevue}</span></p>
                      {visite.date_realisee && (
                        <p className="text-muted-foreground">Date réalisée: <span className="font-medium text-foreground">{visite.date_realisee}</span></p>
                      )}
                    </div>
                    {visite.statut === 'rappel_envoye' && (
                      <p className="text-xs text-[hsl(var(--status-orange))] mt-2">✓ Rappel WhatsApp envoyé</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">Aucune consultation post-natale prévue</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet FDR */}
        <TabsContent value="fdr">
          <Card>
            <CardHeader>
              <CardTitle>Facteurs de Risque</CardTitle>
            </CardHeader>
            <CardContent>
              {risque ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Niveau de risque</p>
                      <p className="text-2xl font-bold">{getRiskBadge()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Score IA</p>
                      <p className="text-3xl font-bold">{risque.score}/100</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold">Facteurs déclenchés:</p>
                    {risque.facteurs.map((facteur, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-[hsl(var(--status-orange)/0.1)] border border-[hsl(var(--status-orange)/0.3)] rounded">
                        <AlertTriangle className="h-4 w-4 text-[hsl(var(--status-orange))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{facteur}</span>
                      </div>
                    ))}
                  </div>

                  {risque.prediction && (
                    <div className="p-4 bg-[hsl(var(--status-rouge)/0.1)] border border-[hsl(var(--status-rouge)/0.3)] rounded-lg">
                      <p className="text-sm font-semibold text-[hsl(var(--status-rouge))] mb-1">Prédiction IA</p>
                      <p className="text-sm">{risque.prediction}</p>
                    </div>
                  )}

                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold mb-2">Actions recommandées:</p>
                    <p className="text-sm text-[hsl(var(--status-orange))]">
                      {risque.niveau === 'rouge' ? '🔴 Référence prioritaire vers structure SONU' :
                       risque.niveau === 'orange' ? '🟠 Surveillance renforcée - CPN rapprochées' :
                       '🟢 Suivi normal'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Aucune évaluation de risque disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet CSU */}
        <TabsContent value="csu">
          <Card>
            <CardHeader>
              <CardTitle>Couverture Santé Universelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Code QR</p>
                  <p className="text-lg font-bold">{patient.qr_code}</p>
                  <div className="mt-4 p-8 bg-muted rounded flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">QR Code affichable ici</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <div className="mt-2">{getStatusBadge(patient.statut_csu)}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Date d'enrôlement</p>
                    <p className="font-semibold">{patient.date_enrolement}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Date de renouvellement</p>
                    <p className="font-semibold">{patient.date_renouvellement}</p>
                  </div>
                </div>
              </div>
              {patient.photo_piece && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Pièce d'identité (CNI)</p>
                  <div className="p-8 bg-muted rounded flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Photo de la pièce d'identité</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Nutrition */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Suivi Nutritionnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {patient.imc && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">IMC</p>
                    <p className="text-2xl font-bold">{patient.imc}</p>
                    <p className="text-xs text-[hsl(var(--status-vert))]">Cible atteinte</p>
                  </div>
                )}
                {patient.pb_muac && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">PB/MUAC</p>
                    <p className="text-2xl font-bold">{patient.pb_muac} cm</p>
                    <p className="text-xs text-[hsl(var(--status-orange))]">Risque malnutrition</p>
                  </div>
                )}
                {patient.prise_ponderale && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Prise pondérale</p>
                    <p className="text-2xl font-bold">+{patient.prise_ponderale} kg</p>
                    <p className="text-xs text-[hsl(var(--status-vert))]">Normal</p>
                  </div>
                )}
              </div>
              
              {patient.hemoglobine && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Hémoglobine</p>
                  <p className="text-xl font-semibold">{patient.hemoglobine} g/dl</p>
                  {patient.hemoglobine < 11 && (
                    <p className="text-xs text-[hsl(var(--status-rouge))] mt-1">⚠️ Anémie détectée</p>
                  )}
                </div>
              )}

              <div className="p-4 bg-[hsl(var(--status-vert)/0.1)] border border-[hsl(var(--status-vert)/0.3)] rounded-lg">
                <p className="text-sm font-semibold text-[hsl(var(--status-vert))] mb-2">Conseils nutritionnels (audio en wolof)</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Alimentation riche en fer et folates</li>
                  <li>Consommation de légumes verts</li>
                  <li>Protéines animales (poisson, viande)</li>
                  <li>Supplémentation recommandée</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet PEV */}
        <TabsContent value="pev">
          <Card>
            <CardHeader>
              <CardTitle>Programme Élargi de Vaccination (Enfant)</CardTitle>
            </CardHeader>
            <CardContent>
              {vaccins.length > 0 ? (
                <div className="space-y-3">
                  {vaccins.map((vaccin) => (
                    <div key={vaccin.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{vaccin.vaccin}</p>
                        <p className="text-sm text-muted-foreground">Date prévue: {vaccin.date_prevue}</p>
                        {vaccin.date_realisee && (
                          <p className="text-sm text-[hsl(var(--status-vert))]">✓ Réalisé le {vaccin.date_realisee}</p>
                        )}
                      </div>
                      <Badge className={
                        vaccin.statut === 'realise' ? 'bg-[hsl(var(--status-vert))] text-white' :
                        vaccin.statut === 'retard' ? 'bg-[hsl(var(--status-rouge))] text-white' :
                        'bg-[hsl(var(--status-orange))] text-white'
                      }>
                        {vaccin.statut === 'realise' ? 'Réalisé' :
                         vaccin.statut === 'retard' ? 'Retard' :
                         'Prévu'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Aucun vaccin programmé</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Références */}
        <TabsContent value="references">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Références SONU</CardTitle>
            </CardHeader>
            <CardContent>
              {references.length > 0 ? (
                <div className="space-y-4">
                  {references.map((ref) => (
                    <div key={ref.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-[hsl(var(--status-rouge))]">{ref.type_alerte}</p>
                          <p className="text-sm text-muted-foreground">Alerte #{ref.id}</p>
                        </div>
                        <Badge className={
                          ref.statut === 'resolu' ? 'bg-[hsl(var(--status-vert))] text-white' :
                          ref.statut === 'admis' ? 'bg-[hsl(var(--status-orange))] text-white' :
                          'bg-[hsl(var(--status-rouge))] text-white'
                        }>
                          {ref.statut === 'resolu' ? 'Résolu' :
                           ref.statut === 'admis' ? 'Admis' :
                           ref.statut === 'en_route' ? 'En route' :
                           'Alerte'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Structure origine:</span> {ref.structure_origine}</p>
                        <p><span className="text-muted-foreground">Structure SONU:</span> {ref.structure_sonu}</p>
                      </div>

                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="font-semibold mb-2">Timeline:</p>
                        <div className="space-y-1">
                          <p>🔔 Alerte: {new Date(ref.alerte_heure).toLocaleString('fr-FR')}</p>
                          {ref.transport_heure && (
                            <p>🚗 Transport: {new Date(ref.transport_heure).toLocaleString('fr-FR')}</p>
                          )}
                          {ref.admission_heure && (
                            <p>🏥 Admission: {new Date(ref.admission_heure).toLocaleString('fr-FR')}</p>
                          )}
                          {ref.contre_ref_heure && (
                            <p>✅ Contre-référence: {new Date(ref.contre_ref_heure).toLocaleString('fr-FR')}</p>
                          )}
                        </div>
                        {ref.delai_minutes && (
                          <p className="text-xs text-muted-foreground mt-2">Délai total: {ref.delai_minutes} minutes</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Aucune référence SONU enregistrée</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
