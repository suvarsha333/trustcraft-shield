import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  icon: Icon,
  variant = "default" 
}: MetricCardProps) {
  const variantStyles = {
    default: "border-primary/20 bg-gradient-to-br from-card to-card/50",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
    destructive: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10",
  };

  const iconColors = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  return (
    <Card className={cn("border-2 transition-all hover:shadow-lg", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {change && (
              <p className={cn(
                "text-sm mt-2",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground"
              )}>
                {change}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg bg-background/50", iconColors[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
