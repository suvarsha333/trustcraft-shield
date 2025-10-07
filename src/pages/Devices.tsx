import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Monitor, Tablet, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Device {
  id: string;
  name: string;
  type: "mobile" | "desktop" | "tablet";
  owner: string;
  os: string;
  status: "compliant" | "warning" | "non-compliant";
  lastSeen: string;
  location: string;
}

const initialDevices: Device[] = [
  { id: "1", name: "MacBook Pro", type: "desktop", owner: "Alice Johnson", os: "macOS 14.2", status: "compliant", lastSeen: "2 min ago", location: "New York, US" },
  { id: "2", name: "iPhone 14 Pro", type: "mobile", owner: "Bob Smith", os: "iOS 17.2", status: "warning", lastSeen: "1 hour ago", location: "San Francisco, US" },
  { id: "3", name: "Windows PC", type: "desktop", owner: "Carol White", os: "Windows 11", status: "compliant", lastSeen: "30 min ago", location: "London, UK" },
  { id: "4", name: "Android Tab", type: "tablet", owner: "David Lee", os: "Android 13", status: "non-compliant", lastSeen: "2 days ago", location: "Singapore" },
];

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "mobile", owner: "", os: "" });

  const handleAddDevice = () => {
    if (!formData.name || !formData.owner || !formData.os) {
      toast.error("Please fill in all fields");
      return;
    }

    const newDevice: Device = {
      id: (devices.length + 1).toString(),
      name: formData.name,
      type: formData.type as "mobile" | "desktop" | "tablet",
      owner: formData.owner,
      os: formData.os,
      status: "compliant",
      lastSeen: "Just now",
      location: "Unknown",
    };

    setDevices([...devices, newDevice]);
    setFormData({ name: "", type: "mobile", owner: "", os: "" });
    setOpen(false);
    toast.success("Device registered successfully");
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile": return <Smartphone className="h-5 w-5" />;
      case "desktop": return <Monitor className="h-5 w-5" />;
      case "tablet": return <Tablet className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <Badge className="bg-success gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-warning text-warning-foreground gap-1">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        );
      case "non-compliant":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Non-Compliant
          </Badge>
        );
    }
  };

  const complianceStats = {
    compliant: devices.filter(d => d.status === "compliant").length,
    warning: devices.filter(d => d.status === "warning").length,
    nonCompliant: devices.filter(d => d.status === "non-compliant").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Device Management</h1>
          <p className="text-muted-foreground">Monitor and manage all registered devices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90">
              <Smartphone className="mr-2 h-4 w-4" />
              Register Device
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Register New Device</DialogTitle>
              <DialogDescription>Add a new device to the zero-trust network</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  id="deviceName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., MacBook Pro"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Enter owner name"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="os">Operating System</Label>
                <Input
                  id="os"
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  placeholder="e.g., macOS 14.2"
                  className="bg-background border-border"
                />
              </div>
              <Button onClick={handleAddDevice} className="w-full bg-gradient-to-r from-primary to-blue-500">
                Register Device
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Compliant Devices</p>
                <h3 className="text-3xl font-bold text-foreground">{complianceStats.compliant}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warning Status</p>
                <h3 className="text-3xl font-bold text-foreground">{complianceStats.warning}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Non-Compliant</p>
                <h3 className="text-3xl font-bold text-foreground">{complianceStats.nonCompliant}</h3>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>All Devices ({devices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 text-primary">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{device.name}</p>
                      {getStatusBadge(device.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{device.os}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Owner</p>
                    <p className="text-sm font-medium text-foreground">{device.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-sm text-foreground">{device.location}</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs text-muted-foreground mb-1">Last Seen</p>
                    <p className="text-sm text-foreground">{device.lastSeen}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
