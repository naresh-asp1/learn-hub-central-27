import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { initializeSampleData } from "@/utils/sampleData";
import { Info, RefreshCw, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Auth = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerRole, setRegisterRole] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [sampleUsers, setSampleUsers] = useState<any[]>([]);

  // Auto-initialize sample data on first load if no users exist
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("users") || "[]");
      if (!existing || existing.length === 0) {
        initializeSampleData();
      }
      loadSampleUsers();
    } catch {
      initializeSampleData();
      loadSampleUsers();
    }
  }, []);

  const loadSampleUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const samples = [
        users.find((u: any) => u.role === "admin1"),
        users.find((u: any) => u.role === "admin2"),
        users.find((u: any) => u.role === "student"),
        users.find((u: any) => u.role === "staff"),
        users.find((u: any) => u.role === "parent")
      ].filter(Boolean);
      setSampleUsers(samples);
    } catch (error) {
      console.error("Error loading sample users:", error);
    }
  };

  const handleReinitialize = () => {
    initializeSampleData();
    loadSampleUsers();
    toast.success("Sample data reinitialized! Please try logging in again.");
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    toast.success("Credentials copied to clipboard!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success("Login successful!");
      navigate(`/${user.role}`);
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerRole) {
      toast.error("Please select a role");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.find((u: any) => u.email === registerEmail)) {
      toast.error("Email already exists");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      role: registerRole
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    toast.success("Registration successful! Please login.");
    
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterName("");
    setRegisterRole("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Having trouble logging in? View sample credentials below or reinitialize data.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReinitialize}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset Data
            </Button>
          </AlertDescription>
        </Alert>

        <Collapsible open={showCredentials} onOpenChange={setShowCredentials}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                  <CardTitle className="text-base">Sample Login Credentials</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {showCredentials ? "Hide" : "Show"}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {sampleUsers.map((user, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold capitalize">{user.role.replace(/\d/, ' ')}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCredentials(user.email, user.password)}
                        className="h-7 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-xs"><span className="font-medium">Password:</span> {user.password}</p>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Student Management System</CardTitle>
          <CardDescription>Login or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select value={registerRole} onValueChange={setRegisterRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin1">Admin 1</SelectItem>
                      <SelectItem value="admin2">Admin 2</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Register</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Auth;