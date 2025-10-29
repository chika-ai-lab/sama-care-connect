import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'red' | 'orange' | 'green' | 'default';
  subtitle?: string;
  progress?: number;
}

export const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'default',
  subtitle,
  progress
}: KPICardProps) => {
  const colorClasses = {
    red: 'text-[hsl(var(--status-rouge))] bg-[hsl(var(--status-rouge)/0.1)]',
    orange: 'text-[hsl(var(--status-orange))] bg-[hsl(var(--status-orange)/0.1)]',
    green: 'text-[hsl(var(--status-vert))] bg-[hsl(var(--status-vert)/0.1)]',
    default: 'text-primary bg-primary/10'
  };

  return (
    <Card className="hover:shadow-elegant transition-all duration-300 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={cn(
            "text-xs mt-2 font-medium",
            trend.startsWith('+') ? "text-[hsl(var(--status-vert))]" : "text-[hsl(var(--status-rouge))]"
          )}>
            {trend}
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  color === 'green' && "bg-[hsl(var(--status-vert))]",
                  color === 'orange' && "bg-[hsl(var(--status-orange))]",
                  color === 'red' && "bg-[hsl(var(--status-rouge))]",
                  color === 'default' && "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
