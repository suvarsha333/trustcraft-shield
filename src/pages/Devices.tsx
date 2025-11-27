import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Monitor, Tablet, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface Device {
  id: string;
  user_id: string;
  name: string;
  type: string;
  os: string | null;
  status: string | null;
  last_seen: string | null;
  location: string | null;
  created_at: string | null;
}

export default function Devices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "mobile", os: "", location: "" });

  useEffect(() => {
    fetchDevices();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('devices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        () => fetchDevices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDevices = async () => {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching devices:', error);
    } else {
      setDevices(data || []);
    }
    setLoading(false);
  };

  const handleAddDevice = async () => {
    if (!formData.name || !formData.os) {
      toast.error("Please fill in device name and OS");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to register a device");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('devices')
      .insert({
        user_id: user.id,
        name: formData.name,
        type: formData.type,
        os: formData.os,
        location: formData.location || null,
        status: 'compliant',
      });

    if (error) {
      console.error('Error adding device:', error);
      toast.error("Failed to register device");
    } else {
      setFormData({ name: "", type: "mobile", os: "", location: "" });
      setOpen(false);
      toast.success("Device registered successfully");
    }
    setSubmitting(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile": return <Smartphone className="h-5 w-5" />;
      case "desktop": return <Monitor className="h-5 w-5" />;
      case "tablet": return <Tablet className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
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
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return "Never";
    try {
      return formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const complianceStats = {
    compliant: devices.filter(d => d.status === "compliant").length,
    warning: devices.filter(d => d.status === "warning").length,
    nonCompliant: devices.filter(d => d.status === "non-compliant").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Label htmlFor="os">Operating System</Label>
                <Input
                  id="os"
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  placeholder="e.g., macOS 14.2"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., New York, US"
                  className="bg-background border-border"
                />
              </div>
              <Button 
                onClick={handleAddDevice} 
                className="w-full bg-gradient-to-r from-primary to-blue-500"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
          {devices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No devices registered yet. Register a device to see it appear here.</p>
          ) : (
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
                      <p className="text-sm text-muted-foreground">{device.os || "Unknown OS"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm text-foreground">{device.location || "Unknown"}</p>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-xs text-muted-foreground mb-1">Last Seen</p>
                      <p className="text-sm text-foreground">{formatLastSeen(device.last_seen)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
