import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, CheckCircle, XCircle, FileDown } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  courseCode: string;
  totalFees?: number;
  feesPaid?: number;
  feesBalance?: number;
  paymentStatus?: string;
}

interface ChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  field: string;
  currentValue: string;
  newValue: string;
  status: string;
  verifiedByAdmin2: boolean;
}

const Admin2Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "admin2") {
      navigate("/auth");
      return;
    }

    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedRequests = JSON.parse(localStorage.getItem("changeRequests") || "[]");
    setStudents(savedStudents);
    setChangeRequests(savedRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const handleVerifyRequest = (requestId: string) => {
    const updatedRequests = changeRequests.map(r =>
      r.id === requestId ? { ...r, verifiedByAdmin2: true } : r
    );
    setChangeRequests(updatedRequests);
    localStorage.setItem("changeRequests", JSON.stringify(updatedRequests));
    toast.success("Request verified and forwarded to Admin 1");
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = changeRequests.map(r =>
      r.id === requestId ? { ...r, status: "rejected", verifiedByAdmin2: false } : r
    );
    setChangeRequests(updatedRequests);
    localStorage.setItem("changeRequests", JSON.stringify(updatedRequests));
    toast.success("Request rejected");
  };

  const downloadReport = () => {
    const records = JSON.parse(localStorage.getItem("studentRecords") || "[]");
    
    const csvContent = [
      ["Student Name", "Roll Number", "Department", "Course Code", "Marks", "Attendance", "Performance", "Total Fees", "Fees Paid", "Balance", "Payment Status"],
      ...students.map(student => {
        const record = records.find((r: any) => r.studentId === student.id);
        const marks = record?.marks ? Object.entries(record.marks).map(([subj, mark]) => `${subj}:${mark}`).join("; ") : "N/A";
        const attendance = record?.attendance ? `${record.attendance}%` : "N/A";
        const performance = record?.performance || "N/A";
        
        return [
          student.name,
          student.rollNumber,
          student.department,
          student.courseCode,
          marks,
          attendance,
          performance,
          student.totalFees || 0,
          student.feesPaid || 0,
          student.feesBalance || 0,
          student.paymentStatus || "Pending"
        ];
      })
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_report.csv";
    a.click();
    toast.success("Report downloaded");
  };

  const pendingRequests = changeRequests.filter(r => r.status === "pending" && !r.verifiedByAdmin2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin 2 Dashboard - NPV College</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Student Records</CardTitle>
                <CardDescription>Monitor and verify student data</CardDescription>
              </div>
              <Button onClick={downloadReport}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Course Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.courseCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Change Requests</CardTitle>
                <CardDescription>Verify student change requests before forwarding to Admin 1</CardDescription>
              </div>
              {pendingRequests.length > 0 && (
                <Badge variant="destructive">{pendingRequests.length} Pending</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold">{request.studentName}</p>
                      <p className="text-sm text-muted-foreground">Roll No: {request.rollNumber}</p>
                      <p className="text-sm">
                        <span className="font-medium">Field:</span> {request.field}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Current:</span> {request.currentValue}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">New Value:</span> {request.newValue}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleVerifyRequest(request.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify & Forward
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(request.id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingRequests.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No pending requests</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin2Dashboard;