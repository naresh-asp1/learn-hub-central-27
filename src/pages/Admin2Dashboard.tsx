import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Download, CheckCircle, XCircle } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  department: string;
}

interface Request {
  id: string;
  studentId: string;
  studentName: string;
  field: string;
  oldValue: string;
  newValue: string;
  status: "pending" | "approved" | "rejected";
}

const Admin2Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [classFilter, setClassFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "admin2") {
      navigate("/auth");
      return;
    }

    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedRequests = JSON.parse(localStorage.getItem("changeRequests") || "[]");
    setStudents(savedStudents);
    setRequests(savedRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const handleApproveRequest = (requestId: string) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, status: "approved" as const } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem("changeRequests", JSON.stringify(updatedRequests));
    toast.success("Request approved");
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, status: "rejected" as const } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem("changeRequests", JSON.stringify(updatedRequests));
    toast.success("Request rejected");
  };

  const filteredStudents = students.filter(student => {
    if (classFilter !== "all" && student.class !== classFilter) return false;
    if (deptFilter !== "all" && student.department !== deptFilter) return false;
    return true;
  });

  const classes = [...new Set(students.map(s => s.class))];
  const departments = [...new Set(students.map(s => s.department))];

  const downloadReport = () => {
    const csvContent = [
      ["Roll Number", "Name", "Email", "Class", "Department"],
      ...filteredStudents.map(s => [s.rollNumber, s.name, s.email, s.class, s.department])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-report.csv";
    a.click();
    toast.success("Report downloaded");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin 2 Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Student Data Monitoring</CardTitle>
                <CardDescription>Monitor and verify all student records</CardDescription>
              </div>
              <Button onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStudents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No students found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Requests</CardTitle>
            <CardDescription>Review and approve student data change requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.studentName}</TableCell>
                    <TableCell className="capitalize">{request.field}</TableCell>
                    <TableCell>{request.oldValue}</TableCell>
                    <TableCell>{request.newValue}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === "approved" ? "default" : 
                        request.status === "rejected" ? "destructive" : 
                        "secondary"
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {requests.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No change requests</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin2Dashboard;