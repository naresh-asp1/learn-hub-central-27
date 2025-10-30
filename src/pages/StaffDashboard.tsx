import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Plus, CheckCircle, XCircle } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  courseCode: string;
  totalFees?: number;
  feesPaid?: number;
  feesBalance?: number;
  paymentStatus?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  courseCode: string;
  date: string;
  status: "present" | "absent";
}

interface StudentRecord {
  studentId: string;
  studentName: string;
  marks?: { [subject: string]: number };
  attendance?: number;
  performance?: string;
  backlogs?: string[];
}

interface StaffRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  field: string;
  newValue: string;
  status: string;
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [recordType, setRecordType] = useState<"marks" | "performance">("marks");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [performance, setPerformance] = useState("");
  const [backlogs, setBacklogs] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "staff") {
      navigate("/auth");
      return;
    }

    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedAttendance = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
    const savedRecords = JSON.parse(localStorage.getItem("studentRecords") || "[]");
    const savedRequests = JSON.parse(localStorage.getItem("staffRequests") || "[]");
    
    setStudents(savedStudents);
    setAttendanceRecords(savedAttendance);
    setRecords(savedRecords);
    setRequests(savedRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const handleMarkAttendance = (studentId: string, status: "present" | "absent") => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      courseCode: student.courseCode,
      date: attendanceDate,
      status
    };

    const updatedAttendance = [...attendanceRecords, newRecord];
    setAttendanceRecords(updatedAttendance);
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedAttendance));

    const studentAttendance = updatedAttendance.filter(a => a.studentId === studentId);
    const presentCount = studentAttendance.filter(a => a.status === "present").length;
    const attendancePercentage = Math.round((presentCount / studentAttendance.length) * 100);

    const existingRecord = records.find(r => r.studentId === studentId);
    const updatedRecord: StudentRecord = existingRecord || {
      studentId: student.id,
      studentName: student.name
    };
    updatedRecord.attendance = attendancePercentage;

    const updatedRecords = existingRecord
      ? records.map(r => r.studentId === studentId ? updatedRecord : r)
      : [...records, updatedRecord];

    setRecords(updatedRecords);
    localStorage.setItem("studentRecords", JSON.stringify(updatedRecords));
    toast.success(`Marked ${status} for ${student.name}`);
  };

  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const existingRecord = records.find(r => r.studentId === request.studentId);
    let updatedRecords;

    if (request.field === "marks") {
      const newRecord: StudentRecord = existingRecord || {
        studentId: request.studentId,
        studentName: request.studentName,
        marks: {}
      };
      const [subject, value] = request.newValue.split(":");
      newRecord.marks = { ...newRecord.marks, [subject]: parseFloat(value) };
      
      updatedRecords = existingRecord
        ? records.map(r => r.studentId === request.studentId ? newRecord : r)
        : [...records, newRecord];
    } else if (request.field === "attendance") {
      const newRecord: StudentRecord = existingRecord || {
        studentId: request.studentId,
        studentName: request.studentName
      };
      newRecord.attendance = parseFloat(request.newValue);
      
      updatedRecords = existingRecord
        ? records.map(r => r.studentId === request.studentId ? newRecord : r)
        : [...records, newRecord];
    } else {
      updatedRecords = records;
    }

    setRecords(updatedRecords);
    localStorage.setItem("studentRecords", JSON.stringify(updatedRecords));

    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: "approved" } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem("staffRequests", JSON.stringify(updatedRequests));
    
    toast.success("Request approved");
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: "rejected" } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem("staffRequests", JSON.stringify(updatedRequests));
    toast.success("Request rejected");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return;

    const existingRecord = records.find(r => r.studentId === selectedStudent);
    let updatedRecords;

    if (recordType === "marks") {
      const newRecord: StudentRecord = existingRecord || {
        studentId: student.id,
        studentName: student.name,
        marks: {}
      };
      newRecord.marks = { ...newRecord.marks, [subject]: parseFloat(marks) };
      
      updatedRecords = existingRecord
        ? records.map(r => r.studentId === selectedStudent ? newRecord : r)
        : [...records, newRecord];
    } else {
      const newRecord: StudentRecord = existingRecord || {
        studentId: student.id,
        studentName: student.name
      };
      newRecord.performance = performance;
      newRecord.backlogs = backlogs.split(",").map(b => b.trim()).filter(b => b);
      
      updatedRecords = existingRecord
        ? records.map(r => r.studentId === selectedStudent ? newRecord : r)
        : [...records, newRecord];
    }

    setRecords(updatedRecords);
    localStorage.setItem("studentRecords", JSON.stringify(updatedRecords));
    toast.success("Record updated successfully");
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedStudent("");
    setSubject("");
    setMarks("");
    setPerformance("");
    setBacklogs("");
  };

  const filteredStudents = students.filter(s => 
    (!selectedCourseCode || s.courseCode === selectedCourseCode) &&
    (!selectedDepartment || s.department === selectedDepartment)
  );

  const uniqueCourseCodes = [...new Set(students.map(s => s.courseCode))];
  const uniqueDepartments = [...new Set(students.map(s => s.department))];
  const pendingRequests = requests.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staff Dashboard - NPV College</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Management</CardTitle>
            <CardDescription>Update marks, attendance, and performance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="attendance">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
                <TabsTrigger value="marks">Marks</TabsTrigger>
                <TabsTrigger value="reports">Generate Report</TabsTrigger>
                <TabsTrigger value="requests">
                  Requests
                  {pendingRequests.length > 0 && (
                    <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="attendance" className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Course Code</Label>
                    <Select value={selectedCourseCode} onValueChange={setSelectedCourseCode}>
                      <SelectTrigger>
                        <SelectValue placeholder="All courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All courses</SelectItem>
                        {uniqueCourseCodes.map(code => (
                          <SelectItem key={code} value={code}>{code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All departments</SelectItem>
                        {uniqueDepartments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Mark Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => {
                      const todayRecord = attendanceRecords.find(
                        a => a.studentId === student.id && a.date === attendanceDate
                      );
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell>{student.courseCode}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant={todayRecord?.status === "present" ? "default" : "outline"}
                                onClick={() => handleMarkAttendance(student.id, "present")}
                              >
                                Present
                              </Button>
                              <Button 
                                size="sm" 
                                variant={todayRecord?.status === "absent" ? "destructive" : "outline"}
                                onClick={() => handleMarkAttendance(student.id, "absent")}
                              >
                                Absent
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="marks" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add/Update Student Record</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
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
                          <Label>Record Type</Label>
                          <Select value={recordType} onValueChange={(v) => setRecordType(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="marks">Marks</SelectItem>
                              <SelectItem value="performance">Performance & Backlogs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {recordType === "marks" && (
                          <>
                            <div className="space-y-2">
                              <Label>Subject</Label>
                              <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Marks</Label>
                              <Input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} required />
                            </div>
                          </>
                        )}
                        
                        {recordType === "performance" && (
                          <>
                            <div className="space-y-2">
                              <Label>Annual Performance Report</Label>
                              <Textarea value={performance} onChange={(e) => setPerformance(e.target.value)} rows={5} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Backlogs (comma-separated)</Label>
                              <Input value={backlogs} onChange={(e) => setBacklogs(e.target.value)} placeholder="Subject1, Subject2" />
                            </div>
                          </>
                        )}
                        
                        <Button type="submit" className="w-full">Submit</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {records.filter(r => r.marks).map((record) => (
                  <Card key={record.studentId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{record.studentName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Marks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(record.marks || {}).map(([subject, mark]) => (
                            <TableRow key={subject}>
                              <TableCell>{subject}</TableCell>
                              <TableCell className="font-medium">{mark}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
                {records.filter(r => r.marks).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No marks records</p>
                )}
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Performance Reports</CardTitle>
                    <CardDescription>Comprehensive view of marks, attendance, performance, and backlogs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {students.map(student => {
                      const record = records.find(r => r.studentId === student.id);
                      if (!record) return null;
                      
                      return (
                        <Card key={student.id}>
                          <CardHeader>
                            <CardTitle className="text-xl">{student.name}</CardTitle>
                            <CardDescription>
                              Roll No: {student.rollNumber} | Department: {student.department} | Course: {student.courseCode}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {record.marks && (
                              <div>
                                <h4 className="font-semibold mb-2">Marks</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Subject</TableHead>
                                      <TableHead>Marks</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {Object.entries(record.marks).map(([subject, mark]) => (
                                      <TableRow key={subject}>
                                        <TableCell>{subject}</TableCell>
                                        <TableCell className="font-medium">{mark}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                            
                            {record.attendance !== undefined && (
                              <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-1">Attendance</h4>
                                <p className="text-2xl font-bold">{record.attendance}%</p>
                              </div>
                            )}
                            
                            {record.performance && (
                              <div>
                                <h4 className="font-semibold mb-2">Performance Report</h4>
                                <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">{record.performance}</p>
                              </div>
                            )}
                            
                            {record.backlogs && record.backlogs.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Backlogs</h4>
                                <div className="flex flex-wrap gap-2">
                                  {record.backlogs.map((backlog, idx) => (
                                    <Badge key={idx} variant="destructive">{backlog}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-3">Fees Information</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Fees</p>
                                  <p className="text-lg font-bold">₹{student.totalFees?.toLocaleString() || 0}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Fees Paid</p>
                                  <p className="text-lg font-bold text-green-600">₹{student.feesPaid?.toLocaleString() || 0}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Balance</p>
                                  <p className="text-lg font-bold text-red-600">₹{student.feesBalance?.toLocaleString() || 0}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  <Badge variant={student.paymentStatus === "Paid" ? "default" : "destructive"}>
                                    {student.paymentStatus || "Pending"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
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
                            <span className="font-medium">New Value:</span> {request.newValue}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApproveRequest(request.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectRequest(request.id)}
                          >
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StaffDashboard;