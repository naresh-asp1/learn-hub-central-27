import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, FileEdit } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  department: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [field, setField] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "student") {
      navigate("/auth");
      return;
    }

    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(savedStudents);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return;

    const oldValue = student[field as keyof Student] as string;
    
    const requests = JSON.parse(localStorage.getItem("changeRequests") || "[]");
    const newRequest = {
      id: Date.now().toString(),
      studentId: student.id,
      studentName: student.name,
      field,
      oldValue,
      newValue,
      status: "pending"
    };
    
    requests.push(newRequest);
    localStorage.setItem("changeRequests", JSON.stringify(requests));
    
    toast.success("Change request submitted");
    setIsRequestOpen(false);
    setSelectedStudent("");
    setField("");
    setNewValue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
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
              <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogTrigger asChild>
                  <Button>
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
                      <Label>Select Student</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.rollNumber})
                            </SelectItem>
                          ))}
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
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="class">Class</SelectItem>
                          <SelectItem value="department">Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>New Value</Label>
                      <Input 
                        value={newValue} 
                        onChange={(e) => setNewValue(e.target.value)} 
                        required 
                      />
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
                      <span className="text-muted-foreground">Class:</span>
                      <span>{student.class}</span>
                      <span className="text-muted-foreground">Department:</span>
                      <span>{student.department}</span>
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