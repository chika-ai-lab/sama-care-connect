import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  AlertTriangle,
  Shield,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
  content: string;
}

const getStepsByRole = (role: string): OnboardingStep[] => {
  const commonSteps: OnboardingStep[] = [
    {
      title: "Bienvenue sur TEKHE",
      description: "Plateforme de gestion de santé maternelle et infantile",
      icon: Users,
      content: "TEKHE vous permet de suivre et gérer les données de santé maternelle et infantile de manière efficace et sécurisée.",
    },
  ];

  const roleSpecificSteps: Record<string, OnboardingStep[]> = {
    admin_district: [
      ...commonSteps,
      {
        title: "Tableau de bord",
        description: "Vue d'ensemble des indicateurs clés",
        icon: BarChart3,
        content: "Consultez les KPI en temps réel : patientes, CPN, risques, SONU, CSU et PEV. Utilisez les filtres par date et structure.",
      },
      {
        title: "Gestion des risques",
        description: "Surveillance des patientes à risque",
        icon: AlertTriangle,
        content: "Identifiez rapidement les patientes nécessitant une attention immédiate avec le système de classification par couleur (rouge, orange, vert).",
      },
      {
        title: "Suivi des patientes",
        description: "Liste complète et détaillée",
        icon: Calendar,
        content: "Accédez aux fiches détaillées, historiques des visites et planifiez les prochains rendez-vous.",
      },
    ],
    responsable_district: [
      ...commonSteps,
      {
        title: "Vue multi-structures",
        description: "Gestion de plusieurs structures",
        icon: BarChart3,
        content: "Filtrez les données par structure pour analyser les performances de chaque établissement de votre district.",
      },
      {
        title: "Analytics avancés",
        description: "Rapports et tendances",
        icon: BarChart3,
        content: "Consultez les graphiques d'évolution et exportez les données pour vos rapports.",
      },
    ],
    agent_collecte: [
      ...commonSteps,
      {
        title: "Collecte de données",
        description: "Enregistrement sur le terrain",
        icon: Users,
        content: "Enregistrez les visites CPN et les données des patientes directement depuis votre appareil.",
      },
      {
        title: "Suivi des patientes",
        description: "Vos patientes assignées",
        icon: Calendar,
        content: "Consultez la liste des patientes qui vous sont assignées et planifiez vos visites.",
      },
    ],
    partenaire_ong: [
      ...commonSteps,
      {
        title: "Analytics partenaire",
        description: "Rapports agrégés",
        icon: BarChart3,
        content: "Accédez aux statistiques agrégées et aux indicateurs de performance de vos zones d'intervention.",
      },
    ],
  };

  return roleSpecificSteps[role] || commonSteps;
};

export function Onboarding() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = user ? getStepsByRole(user.role) : [];
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding_seen_${user?.id}`);
    if (!hasSeenOnboarding && user) {
      setOpen(true);
    }
  }, [user]);

  const handleComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_seen_${user.id}`, "true");
    }
    setOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!user || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="h-2" />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Passer
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            <Button onClick={handleNext}>
              {isLastStep ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Terminer
                </>
              ) : (
                <>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Étape {currentStep + 1} sur {steps.length}
        </p>
      </DialogContent>
    </Dialog>
  );
}
