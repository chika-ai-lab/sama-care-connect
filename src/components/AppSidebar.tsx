import { 
  Home,
  Activity,
  AlertTriangle,
  Ambulance,
  Shield,
  Syringe,
  Database,
  LogOut,
  User
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const menuItems = [
  { title: "Accueil KPI", url: "/dashboard", icon: Home },
  { title: "Suivi CPN", url: "/dashboard/suivi", icon: Activity },
  { title: "Risques IA", url: "/dashboard/risques", icon: AlertTriangle },
  { title: "Références SONU", url: "/dashboard/sonu", icon: Ambulance },
  { title: "Enrôlement CSU", url: "/dashboard/csu", icon: Shield },
  { title: "PEV & Nutrition", url: "/dashboard/pev", icon: Syringe },
  { title: "Export DHIS2", url: "/dashboard/dhis2", icon: Database },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-xl font-bold gradient-tekhe bg-clip-text text-transparent">
            TEKHE
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: active }) =>
                        active || isActive(item.url)
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard/profil")}
          >
            <User className="h-4 w-4" />
            <span>Profil</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
