import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role) {
      navigate(`/${currentUser.role}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Student Management System</CardTitle>
          <CardDescription className="text-base mt-2">
            Comprehensive platform for managing student data, academic records, and administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">Admin 1</h3>
              <p className="text-sm text-muted-foreground">Manage student data with full CRUD operations</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">Admin 2</h3>
              <p className="text-sm text-muted-foreground">Monitor records, verify data, and generate reports</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">Student</h3>
              <p className="text-sm text-muted-foreground">View records and request data changes</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">Staff</h3>
              <p className="text-sm text-muted-foreground">Update marks, attendance, and performance reports</p>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;