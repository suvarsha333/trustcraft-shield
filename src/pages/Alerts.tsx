import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Bell, XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  source: string;
  status: "active" | "resolved";
}

const generateMockAlert = (id: number): Alert => {
  const alerts = [
    {
      title: "Unauthorized Access Attempt",
      description: "Multiple failed login attempts detected from unknown IP address",
      severity: "critical" as const,
      source: "Authentication Service",
    },
    {
      title: "Policy Violation Detected",
      description: "User attempted to access restricted resource without proper clearance",
      severity: "high" as const,
      source: "Policy Engine",
    },
    {
      title: "Non-Compliant Device Connection",
      description: "Device with outdated security patches attempted network access",
      severity: "medium" as const,
      source: "Device Management",
    },
    {
      title: "Suspicious Activity Pattern",
      description: "Unusual data transfer volume detected during off-hours",
      severity: "high" as const,
      source: "Monitoring System",
    },
  ];

  const alert = alerts[Math.floor(Math.random() * alerts.length)];
  
  return {
    id: id.toString(),
    ...alert,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    status: Math.random() > 0.3 ? "active" : "resolved",
  };
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(
    Array.from({ length: 12 }, (_, i) => generateMockAlert(i))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setAlerts(prev => [generateMockAlert(Date.now()), ...prev]);
        toast.error("New security alert detected!", {
          description: "Check the alerts dashboard for details",
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleResolve = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, status: "resolved" as const } : alert
      )
    );
    toast.success("Alert resolved successfully");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-destructive/50 bg-destructive/5";
      case "high":
        return "border-destructive/30 bg-destructive/5";
      case "medium":
        return "border-warning/30 bg-warning/5";
      case "low":
        return "border-primary/30 bg-primary/5";
      default:
        return "";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive" className="uppercase">Critical</Badge>;
      case "high":
        return <Badge variant="destructive" className="uppercase bg-destructive/80">High</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground uppercase">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="uppercase">Low</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    active: alerts.filter(a => a.status === "active").length,
    critical: alerts.filter(a => a.severity === "critical" && a.status === "active").length,
    resolved: alerts.filter(a => a.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Security Alerts</h1>
        <p className="text-muted-foreground">Monitor and respond to security incidents in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.active}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Critical</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.critical}</h3>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.resolved}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            All Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 transition-all ${getSeverityColor(alert.severity)} ${
                  alert.status === "resolved" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-background mt-1">
                      <Shield className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        {getSeverityBadge(alert.severity)}
                        {alert.status === "resolved" && (
                          <Badge variant="outline" className="border-success text-success">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Source: <span className="text-foreground">{alert.source}</span></span>
                        <span>•</span>
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  {alert.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      className="ml-4"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
