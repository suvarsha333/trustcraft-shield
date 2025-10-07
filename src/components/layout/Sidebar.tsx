import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  Shield, 
  Activity, 
  AlertTriangle,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Devices", url: "/devices", icon: Smartphone },
  { title: "Policies", url: "/policies", icon: Shield },
  { title: "Activity Logs", url: "/activity", icon: Activity },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-blue-500 rounded-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">ZeroTrust</h1>
            <p className="text-xs text-muted-foreground">Security Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent text-sidebar-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="px-4 py-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-medium text-success-foreground">System Status</span>
          </div>
          <p className="text-xs text-muted-foreground">All systems operational</p>
        </div>
      </div>
    </aside>
  );
}
