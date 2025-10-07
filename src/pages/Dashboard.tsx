import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Users, 
  Smartphone, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Lock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const accessData = [
  { time: "00:00", attempts: 45, allowed: 42, denied: 3 },
  { time: "04:00", attempts: 32, allowed: 30, denied: 2 },
  { time: "08:00", attempts: 120, allowed: 115, denied: 5 },
  { time: "12:00", attempts: 150, allowed: 142, denied: 8 },
  { time: "16:00", attempts: 98, allowed: 94, denied: 4 },
  { time: "20:00", attempts: 67, allowed: 65, denied: 2 },
];

const trustScoreData = [
  { name: "High Trust", value: 68, color: "hsl(142 76% 36%)" },
  { name: "Medium Trust", value: 24, color: "hsl(38 92% 50%)" },
  { name: "Low Trust", value: 8, color: "hsl(0 84% 60%)" },
];

const recentActivity = [
  { user: "Alice Johnson", action: "Login Success", device: "MacBook Pro", time: "2 min ago", status: "success" },
  { user: "Bob Smith", action: "Access Denied", device: "iPhone 14", time: "5 min ago", status: "denied" },
  { user: "Carol White", action: "MFA Verified", device: "Windows PC", time: "8 min ago", status: "success" },
  { user: "David Lee", action: "Policy Violation", device: "Android Tab", time: "12 min ago", status: "warning" },
  { user: "Emma Davis", action: "Device Registered", device: "iPad Pro", time: "15 min ago", status: "success" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Security Dashboard</h1>
        <p className="text-muted-foreground">Real-time zero-trust security monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value="1,247"
          change="+12% this week"
          trend="up"
          icon={Users}
          variant="default"
        />
        <MetricCard
          title="Verified Devices"
          value="3,892"
          change="+8% this week"
          trend="up"
          icon={Smartphone}
          variant="success"
        />
        <MetricCard
          title="Active Policies"
          value="156"
          change="3 pending review"
          trend="neutral"
          icon={Shield}
          variant="default"
        />
        <MetricCard
          title="Security Alerts"
          value="23"
          change="-15% this week"
          trend="down"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Access Attempts (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="allowed" 
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={2}
                  name="Allowed"
                />
                <Line 
                  type="monotone" 
                  dataKey="denied" 
                  stroke="hsl(0 84% 60%)" 
                  strokeWidth={2}
                  name="Denied"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              User Trust Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trustScoreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trustScoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.status === "success" 
                      ? "bg-success/10 text-success" 
                      : activity.status === "denied"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {activity.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{activity.device}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
