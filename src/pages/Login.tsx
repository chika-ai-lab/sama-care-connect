import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.id === selectedUserId);
    if (user) {
      login(user);
      navigate("/dashboard");
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      sage_femme: "Sage-femme",
      responsable_structure: "Responsable Structure",
      responsable_district: "Responsable District",
      partenaire_ong: "Partenaire ONG",
      partenaire_regional: "Partenaire Régional",
      partenaire_gouvernemental: "Partenaire Gouvernemental"
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-tekhe p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--tekhe-red))] via-[hsl(var(--tekhe-orange))] to-[hsl(var(--tekhe-green))] bg-clip-text text-transparent">
            TEKHE
          </CardTitle>
          <CardDescription>
            Plateforme de suivi district/région
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sélectionner un utilisateur</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un profil..." />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.prenom} {user.nom} - {getRoleLabel(user.role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!selectedUserId}>
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
