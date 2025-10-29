import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, FileEdit } from "lucide-react";

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
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (user.role !== "student") {
      navigate("/auth");
      return;
    }

    setCurrentUser(user);
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(savedStudents);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
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
                    <div className="space-y-2">
                      <Label>Request Type</Label>
                      <Select value={requestType} onValueChange={(v: "staff" | "admin2") => {
                        setRequestType(v);
                        setField("");
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin2">Admin 2 (General Data)</SelectItem>
                          <SelectItem value="staff">Staff (Marks/Attendance)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Field to Change</Label>
                      <Select value={field} onValueChange={setField}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {requestType === "staff" ? (
                            <>
                              <SelectItem value="marks">Marks</SelectItem>
                              <SelectItem value="attendance">Attendance</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="department">Department</SelectItem>
                              <SelectItem value="courseCode">Course Code</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Value</Label>
                      <Input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>New Value</Label>
                      <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full">Submit Request</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>Roll No: {student.rollNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{student.email}</span>
                      <span className="text-muted-foreground">Department:</span>
                      <span>{student.department}</span>
                      <span className="text-muted-foreground">Course Code:</span>
                      <span>{student.courseCode}</span>
                      <span className="text-muted-foreground">Total Fees:</span>
                      <span>₹{student.totalFees?.toLocaleString() || 0}</span>
                      <span className="text-muted-foreground">Fees Paid:</span>
                      <span className="text-green-600 font-medium">₹{student.feesPaid?.toLocaleString() || 0}</span>
                      <span className="text-muted-foreground">Balance Due:</span>
                      <span className="text-red-600 font-medium">₹{student.feesBalance?.toLocaleString() || 0}</span>
                      <span className="text-muted-foreground">Payment Status:</span>
                      <span>
                        <Badge variant={student.paymentStatus === "Paid" ? "default" : "destructive"}>
                          {student.paymentStatus || "Pending"}
                        </Badge>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {students.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No student records found</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;