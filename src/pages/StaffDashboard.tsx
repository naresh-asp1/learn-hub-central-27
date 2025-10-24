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
import { toast } from "sonner";
import { LogOut, Plus } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

interface StudentRecord {
  studentId: string;
  studentName: string;
  marks?: { [subject: string]: number };
  attendance?: number;
  performance?: string;
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [recordType, setRecordType] = useState<"marks" | "attendance" | "performance">("marks");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [attendance, setAttendance] = useState("");
  const [performance, setPerformance] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "staff") {
      navigate("/auth");
      return;
    }

    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedRecords = JSON.parse(localStorage.getItem("studentRecords") || "[]");
    setStudents(savedStudents);
    setRecords(savedRecords);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
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
      
      if (existingRecord) {
        updatedRecords = records.map(r => r.studentId === selectedStudent ? newRecord : r);
      } else {
        updatedRecords = [...records, newRecord];
      }
    } else if (recordType === "attendance") {
      const newRecord: StudentRecord = existingRecord || {
        studentId: student.id,
        studentName: student.name
      };
      newRecord.attendance = parseFloat(attendance);
      
      if (existingRecord) {
        updatedRecords = records.map(r => r.studentId === selectedStudent ? newRecord : r);
      } else {
        updatedRecords = [...records, newRecord];
      }
    } else {
      const newRecord: StudentRecord = existingRecord || {
        studentId: student.id,
        studentName: student.name
      };
      newRecord.performance = performance;
      
      if (existingRecord) {
        updatedRecords = records.map(r => r.studentId === selectedStudent ? newRecord : r);
      } else {
        updatedRecords = [...records, newRecord];
      }
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
    setAttendance("");
    setPerformance("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
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
                <CardTitle>Student Performance Management</CardTitle>
                <CardDescription>Update marks, attendance, and performance reports</CardDescription>
              </div>
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
                          <SelectItem value="attendance">Attendance</SelectItem>
                          <SelectItem value="performance">Performance Report</SelectItem>
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
                    
                    {recordType === "attendance" && (
                      <div className="space-y-2">
                        <Label>Attendance Percentage</Label>
                        <Input type="number" min="0" max="100" value={attendance} onChange={(e) => setAttendance(e.target.value)} required />
                      </div>
                    )}
                    
                    {recordType === "performance" && (
                      <div className="space-y-2">
                        <Label>Annual Performance Report</Label>
                        <Textarea value={performance} onChange={(e) => setPerformance(e.target.value)} rows={5} required />
                      </div>
                    )}
                    
                    <Button type="submit" className="w-full">Submit</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="marks">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="marks">Marks</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="marks" className="space-y-4">
                {records.filter(r => r.marks).map((record) => (
                  <Card key={record.studentId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{record.studentName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(record.marks || {}).map(([subject, mark]) => (
                          <>
                            <span className="text-muted-foreground">{subject}:</span>
                            <span className="font-medium">{mark}</span>
                          </>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {records.filter(r => r.marks).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No marks records</p>
                )}
              </TabsContent>
              
              <TabsContent value="attendance" className="space-y-4">
                {records.filter(r => r.attendance !== undefined).map((record) => (
                  <Card key={record.studentId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{record.studentName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{record.attendance}%</div>
                      <p className="text-sm text-muted-foreground">Attendance</p>
                    </CardContent>
                  </Card>
                ))}
                {records.filter(r => r.attendance !== undefined).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No attendance records</p>
                )}
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                {records.filter(r => r.performance).map((record) => (
                  <Card key={record.studentId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{record.studentName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{record.performance}</p>
                    </CardContent>
                  </Card>
                ))}
                {records.filter(r => r.performance).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No performance reports</p>
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