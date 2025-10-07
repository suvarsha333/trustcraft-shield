import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Plus, Lock, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Policy {
  id: string;
  name: string;
  description: string;
  type: "access" | "device" | "network" | "time";
  status: "active" | "inactive";
  appliesTo: string;
  createdAt: string;
}

const initialPolicies: Policy[] = [
  {
    id: "1",
    name: "MFA Required for Admin Access",
    description: "All admin users must complete multi-factor authentication before accessing sensitive resources",
    type: "access",
    status: "active",
    appliesTo: "Admin users",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Compliant Devices Only",
    description: "Only devices with latest security patches and approved OS versions can connect",
    type: "device",
    status: "active",
    appliesTo: "All devices",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Geographic Restrictions",
    description: "Block access attempts from high-risk geographic locations",
    type: "network",
    status: "active",
    appliesTo: "All users",
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    name: "Business Hours Only",
    description: "Restrict database access to business hours (9 AM - 6 PM)",
    type: "time",
    status: "inactive",
    appliesTo: "Database users",
    createdAt: "2024-01-05",
  },
];

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", appliesTo: "" });

  const handleAddPolicy = () => {
    if (!formData.name || !formData.description || !formData.appliesTo) {
      toast.error("Please fill in all fields");
      return;
    }

    const newPolicy: Policy = {
      id: (policies.length + 1).toString(),
      name: formData.name,
      description: formData.description,
      type: "access",
      status: "active",
      appliesTo: formData.appliesTo,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPolicies([...policies, newPolicy]);
    setFormData({ name: "", description: "", appliesTo: "" });
    setOpen(false);
    toast.success("Policy created successfully");
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case "access": return <Lock className="h-5 w-5" />;
      case "device": return <Shield className="h-5 w-5" />;
      case "network": return <MapPin className="h-5 w-5" />;
      case "time": return <Clock className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const activeCount = policies.filter(p => p.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Access Policies</h1>
          <p className="text-muted-foreground">Define and manage zero-trust access policies</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>Define a new access control policy for your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="policyName">Policy Name</Label>
                <Input
                  id="policyName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Require MFA for Finance Team"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this policy enforces"
                  className="bg-background border-border"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="appliesTo">Applies To</Label>
                <Input
                  id="appliesTo"
                  value={formData.appliesTo}
                  onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                  placeholder="e.g., Finance team, All users"
                  className="bg-background border-border"
                />
              </div>
              <Button onClick={handleAddPolicy} className="w-full bg-gradient-to-r from-primary to-blue-500">
                Create Policy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Policies</p>
                <h3 className="text-3xl font-bold text-foreground">{activeCount}</h3>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Policies</p>
                <h3 className="text-3xl font-bold text-foreground">{policies.length}</h3>
              </div>
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>All Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 text-primary mt-1">
                      {getPolicyIcon(policy.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{policy.name}</h4>
                        <Badge 
                          variant={policy.status === "active" ? "outline" : "secondary"}
                          className={policy.status === "active" ? "border-success text-success" : ""}
                        >
                          {policy.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{policy.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-14">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Applies to: </span>
                      <span className="text-foreground font-medium">{policy.appliesTo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created: </span>
                      <span className="text-foreground">{policy.createdAt}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Policy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
