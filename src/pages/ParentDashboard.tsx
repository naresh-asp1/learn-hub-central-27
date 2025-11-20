import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  courseCode: string;
  totalFees: number;
  feesPaid: number;
  feesBalance: number;
  paymentStatus: string;
  parentId?: string;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  courseCode: string;
  department: string;
  status: string;
}

interface PerformanceReport {
  studentId: string;
  courseCode: string;
  marks: number;
  attendance: number;
  performance: string;
  backlogs: number;
}

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [performanceReports, setPerformanceReports] = useState<PerformanceReport[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

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

    if (!roleData || roleData.role !== 'parent') {
      navigate("/auth");
      return;
    }

    setCurrentUserId(session.user.id);

    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const myChildren = allStudents.filter((s: Student) => s.parentId === session.user.id);
    setStudents(myChildren);

    // Auto-select the first child if available
    if (myChildren.length > 0 && !selectedStudent) {
      setSelectedStudent(myChildren[0].id);
    }

    const attendance = JSON.parse(localStorage.getItem("attendance") || "[]");
    setAttendanceRecords(attendance);

    const reports = JSON.parse(localStorage.getItem("performanceReports") || "[]");
    setPerformanceReports(reports);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);
  const studentAttendance = attendanceRecords.filter(a => a.studentId === selectedStudent);
  const studentReport = performanceReports.find(r => r.studentId === selectedStudent);

  const calculateAttendancePercentage = () => {
    if (studentAttendance.length === 0) return 0;
    const present = studentAttendance.filter(a => a.status === "present").length;
    return Math.round((present / studentAttendance.length) * 100);
  };

  const downloadReport = () => {
    if (!selectedStudentData) {
      toast.error("Please select a student");
      return;
    }

    const reportData = [
      ["NPV College - Student Report"],
      [""],
      ["Student Information"],
      ["Name", selectedStudentData.name],
      ["Roll Number", selectedStudentData.rollNumber],
      ["Department", selectedStudentData.department],
      ["Course Code", selectedStudentData.courseCode],
      [""],
      ["Academic Performance"],
      ["Marks", studentReport?.marks || "N/A"],
      ["Attendance", `${calculateAttendancePercentage()}%`],
      ["Performance", studentReport?.performance || "N/A"],
      ["Backlogs", studentReport?.backlogs || 0],
      [""],
      ["Fees Information"],
      ["Total Fees", `₹${selectedStudentData.totalFees}`],
      ["Fees Paid", `₹${selectedStudentData.feesPaid}`],
      ["Balance", `₹${selectedStudentData.feesBalance}`],
      ["Payment Status", selectedStudentData.paymentStatus],
    ];

    const csv = reportData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedStudentData.name}_report.csv`;
    a.click();
    toast.success("Report downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Parent Dashboard - NPV College</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {students.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Children Found</CardTitle>
              <CardDescription>No student records are linked to your account.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          selectedStudentData && (
            <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>{selectedStudentData.name}</CardDescription>
                  </div>
                  <Button onClick={downloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{selectedStudentData.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStudentData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedStudentData.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Course Code</p>
                    <p className="font-medium">{selectedStudentData.courseCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fees Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Fees</p>
                      <p className="text-2xl font-bold">₹{selectedStudentData.totalFees?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fees Paid</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedStudentData.feesPaid?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Balance Due</p>
                      <p className="text-2xl font-bold text-red-600">₹{selectedStudentData.feesBalance?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                      <Badge 
                        variant={selectedStudentData.paymentStatus === "Paid" ? "default" : "destructive"}
                        className="text-lg px-4 py-2"
                      >
                        {selectedStudentData.paymentStatus || "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {studentReport && (
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Backlogs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{studentReport.courseCode}</TableCell>
                        <TableCell>{studentReport.marks}</TableCell>
                        <TableCell>{calculateAttendancePercentage()}%</TableCell>
                        <TableCell>
                          <Badge variant={studentReport.performance === "Excellent" ? "default" : "secondary"}>
                            {studentReport.performance}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={studentReport.backlogs > 0 ? "destructive" : "default"}>
                            {studentReport.backlogs}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                {studentAttendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentAttendance.slice(-10).reverse().map((record, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.courseCode}</TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>
                            <Badge variant={record.status === "present" ? "default" : "destructive"}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No attendance records available</p>
                )}
              </CardContent>
            </Card>
          </>
        ))}
      </main>
    </div>
  );
};

export default ParentDashboard;
