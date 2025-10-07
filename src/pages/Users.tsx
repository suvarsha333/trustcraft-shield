import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  trustScore: number;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  devices: number;
}

const initialUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@company.com", role: "Admin", trustScore: 95, status: "active", lastLogin: "2 min ago", devices: 3 },
  { id: "2", name: "Bob Smith", email: "bob@company.com", role: "User", trustScore: 78, status: "active", lastLogin: "1 hour ago", devices: 2 },
  { id: "3", name: "Carol White", email: "carol@company.com", role: "Manager", trustScore: 88, status: "active", lastLogin: "30 min ago", devices: 4 },
  { id: "4", name: "David Lee", email: "david@company.com", role: "User", trustScore: 45, status: "suspended", lastLogin: "2 days ago", devices: 1 },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "User" });

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      trustScore: 100,
      status: "active",
      lastLogin: "Just now",
      devices: 0,
    };

    setUsers([...users, newUser]);
    setFormData({ name: "", email: "", role: "User" });
    setOpen(false);
    toast.success("User added successfully");
  };

  const getTrustBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-success">High Trust</Badge>;
    if (score >= 50) return <Badge className="bg-warning text-warning-foreground">Medium Trust</Badge>;
    return <Badge variant="destructive">Low Trust</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge variant="outline" className="border-success text-success">Active</Badge>;
    if (status === "suspended") return <Badge variant="destructive">Suspended</Badge>;
    return <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage users and their access privileges</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with initial trust verification</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full bg-gradient-to-r from-primary to-blue-500">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Trust Score</p>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-foreground">{user.trustScore}</div>
                      {getTrustBadge(user.trustScore)}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Devices</p>
                    <p className="text-sm font-medium text-foreground">{user.devices}</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs text-muted-foreground mb-1">Last Login</p>
                    <p className="text-sm text-foreground">{user.lastLogin}</p>
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
