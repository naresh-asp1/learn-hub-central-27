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
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-primary/10 rounded-full">
              <GraduationCap className="h-20 w-20 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold">NPV College</CardTitle>
            <CardDescription className="text-base mt-3">
              Student Management System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;