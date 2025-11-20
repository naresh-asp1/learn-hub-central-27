import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, FileEdit } from "lucide-react";
import { StudentPerformanceView } from "@/components/StudentPerformanceView";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  courseCode: string;
  totalFees?: number;
  feesPaid?: number;
  feesBalance?: number;
  paymentStatus?: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<"staff" | "admin2">("admin2");
  const [field, setField] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (!roleData || roleData.role !== 'student') {
      navigate("/auth");
      return;
    }

    setCurrentUser({ id: session.user.id, role: 'student' });
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(savedStudents);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const resetForm = () => {
    setField("");
    setCurrentValue("");
    setNewValue("");
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find(s => s.id === currentUser.id);
    if (!student) return;

    const newRequest = {
      id: Date.now().toString(),
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      field,
      currentValue,
      newValue,
      status: "pending",
      verifiedByAdmin2: false
    };

    if (requestType === "staff") {
      const staffRequests = JSON.parse(localStorage.getItem("staffRequests") || "[]");
      staffRequests.push(newRequest);
      localStorage.setItem("staffRequests", JSON.stringify(staffRequests));
    } else {
      const changeRequests = JSON.parse(localStorage.getItem("changeRequests") || "[]");
      changeRequests.push(newRequest);
      localStorage.setItem("changeRequests", JSON.stringify(changeRequests));
    }

    toast.success(`Request submitted to ${requestType === "staff" ? "Staff" : "Admin 2"}`);
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Dashboard - NPV College</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">My Information</TabsTrigger>
            <TabsTrigger value="performance">Academic Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Records</CardTitle>
                    <CardDescription>View all student data and request changes</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Request Change
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Data Change</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitRequest} className="space-y-4">
...
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {students.map((student) => (
                    <Card key={student.id}>
...
                    </Card>
                  ))}
                </div>
                {students.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No student records found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <StudentPerformanceView studentId={currentUser.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;