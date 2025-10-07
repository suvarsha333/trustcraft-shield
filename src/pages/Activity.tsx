import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity as ActivityIcon, CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "denied" | "warning";
  ip: string;
  device: string;
}

const generateMockLog = (id: number): ActivityLog => {
  const users = ["Alice Johnson", "Bob Smith", "Carol White", "David Lee", "Emma Davis"];
  const actions = ["Login", "Access Request", "File Upload", "Database Query", "API Call", "Policy Check"];
  const resources = ["Dashboard", "User Database", "File Storage", "API Gateway", "Admin Panel"];
  const statuses: ("success" | "denied" | "warning")[] = ["success", "success", "success", "denied", "warning"];
  const devices = ["MacBook Pro", "iPhone 14", "Windows PC", "Android Tab", "iPad Pro"];
  
  return {
    id: id.toString(),
    timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
    user: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: resources[Math.floor(Math.random() * resources.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    device: devices[Math.floor(Math.random() * devices.length)],
  };
};

export default function Activity() {
  const [logs, setLogs] = useState<ActivityLog[]>(
    Array.from({ length: 15 }, (_, i) => generateMockLog(i))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [generateMockLog(Date.now()), ...prev.slice(0, 49)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "denied":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-success">Success</Badge>;
      case "denied":
        return <Badge variant="destructive">Denied</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === "success").length,
    denied: logs.filter(l => l.status === "denied").length,
    warning: logs.filter(l => l.status === "warning").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Activity Logs</h1>
        <p className="text-muted-foreground">Real-time monitoring of all access attempts and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Events</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.total}</h3>
              </div>
              <ActivityIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Successful</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.success}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Denied</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.denied}</h3>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warnings</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.warning}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Live Activity Stream
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-muted">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{log.user}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{log.action}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Resource: <span className="text-foreground">{log.resource}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Device</p>
                    <p className="text-sm text-foreground">{log.device}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                    <p className="text-sm font-mono text-foreground">{log.ip}</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-xs text-muted-foreground mb-1">Time</p>
                    <p className="text-sm text-foreground">{formatTime(log.timestamp)}</p>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
