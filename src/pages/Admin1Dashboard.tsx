import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { SampleDataInitializer } from "@/components/SampleDataInitializer";
import { SubjectManagement } from "@/components/SubjectManagement";
import { PerformanceReport } from "@/components/PerformanceReport";
import { AttendanceView } from "@/components/AttendanceView";
import { SubjectAllocationView } from "@/components/SubjectAllocationView";

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

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
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

const Admin1Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({ 
    name: "", 
    rollNumber: "", 
    email: "", 
    department: "", 
    courseCode: "", 
    totalFees: 0, 
    feesPaid: 0, 
    feesBalance: 0, 
    paymentStatus: "Pending",
    parentId: ""
  });
  const [deptForm, setDeptForm] = useState({ name: "", code: "" });
  const [staffForm, setStaffForm] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "admin1") {
      navigate("/auth");
      return;
    }

    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    const savedStaff = JSON.parse(localStorage.getItem("staff") || "[]");
    const savedRequests = JSON.parse(localStorage.getItem("changeRequests") || "[]");
    
    setStudents(savedStudents);
    setDepartments(savedDepartments);
    setStaff(savedStaff);
    setChangeRequests(savedRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleAddDepartment invoked", deptForm);
    const newDept: Department = {
      id: Date.now().toString(),
      ...deptForm
    };
    const updatedDepts = [...departments, newDept];
    setDepartments(updatedDepts);
    localStorage.setItem("departments", JSON.stringify(updatedDepts));
    toast.success("Department added successfully");
    setDeptForm({ name: "", code: "" });
    setIsDeptDialogOpen(false);
  };

  const handleDeleteDepartment = (id: string) => {
    const updatedDepts = departments.filter(d => d.id !== id);
    setDepartments(updatedDepts);
    localStorage.setItem("departments", JSON.stringify(updatedDepts));
    toast.success("Department deleted");
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleAddStaff invoked", staffForm);
    
    if (!staffForm.department) {
      toast.error("Please select a department");
      return;
    }
    
    const newStaff: Staff = {
      id: Date.now().toString(),
      ...staffForm
    };
    const updatedStaff = [...staff, newStaff];
    setStaff(updatedStaff);
    localStorage.setItem("staff", JSON.stringify(updatedStaff));
    toast.success("Staff added successfully");
    setStaffForm({ name: "", email: "", department: "" });
    setIsStaffDialogOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    const updatedStaff = staff.filter(s => s.id !== id);
    setStaff(updatedStaff);
    localStorage.setItem("staff", JSON.stringify(updatedStaff));
    toast.success("Staff deleted");
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleStudentSubmit invoked", { editing: !!editingStudent, studentForm });
    
    if (!studentForm.department) {
      toast.error("Please select a department");
      return;
    }
    
    if (editingStudent) {
      const updatedStudents = students.map(s => 
        s.id === editingStudent.id ? { ...editingStudent, ...studentForm } : s
      );
      setStudents(updatedStudents);
      localStorage.setItem("students", JSON.stringify(updatedStudents));
      toast.success("Student updated successfully");
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...studentForm
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      localStorage.setItem("students", JSON.stringify(updatedStudents));
      toast.success("Student added successfully");
    }
    
    resetStudentForm();
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      department: student.department,
      courseCode: student.courseCode,
      totalFees: student.totalFees || 0,
      feesPaid: student.feesPaid || 0,
      feesBalance: student.feesBalance || 0,
      paymentStatus: student.paymentStatus || "Pending",
      parentId: student.parentId || ""
    });
    setIsStudentDialogOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    toast.success("Student deleted successfully");
  };

  const resetStudentForm = () => {
    setStudentForm({ 
      name: "", 
      rollNumber: "", 
      email: "", 
      department: "", 
      courseCode: "", 
      totalFees: 0, 
      feesPaid: 0, 
      feesBalance: 0, 
      paymentStatus: "Pending",
      parentId: ""
    });
    setEditingStudent(null);
    setIsStudentDialogOpen(false);
  };

  const handleApproveRequest = (requestId: string) => {
    const request = changeRequests.find(r => r.id === requestId);
    if (!request || !request.verifiedByAdmin2) {
      toast.error("Request must be verified by Admin 2 first");
      return;
    }

    const updatedStudents = students.map(s => {
      if (s.id === request.studentId) {
        return { ...s, [request.field]: request.newValue };
      }
      return s;
    });

    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    const updatedRequests = changeRequests.map(r =>
      r.id === requestId ? { ...r, status: "approved" } : r
    );
    setChangeRequests(updatedRequests);
    localStorage.setItem("changeRequests", JSON.stringify(updatedRequests));
    
    toast.success("Request approved and changes applied");
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = changeRequests.map(r =>
      r.id === requestId ? { ...r, status: "rejected" } : r
    );
    setChangeRequests(updatedRequests);
    localStorage.setItem("changeRequests", JSON.stringify(updatedRequests));
    toast.success("Request rejected");
  };

  const verifiedPendingRequests = changeRequests.filter(r => r.status === "pending" && r.verifiedByAdmin2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin 1 Dashboard - NPV College</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {verifiedPendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">{verifiedPendingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>Add, edit, and manage student records</CardDescription>
                  </div>
                  <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetStudentForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
                          <DialogDescription>Fill in the student details and save your changes.</DialogDescription>
                        </DialogHeader>
                      <form onSubmit={handleStudentSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Roll Number</Label>
                          <Input value={studentForm.rollNumber} onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Department *</Label>
                          <Select value={studentForm.department} onValueChange={(v) => setStudentForm({...studentForm, department: v})} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.code}>{dept.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Course Code</Label>
                          <Input value={studentForm.courseCode} onChange={(e) => setStudentForm({...studentForm, courseCode: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Total Fees (₹)</Label>
                          <Input type="number" value={studentForm.totalFees} onChange={(e) => {
                            const total = Number(e.target.value);
                            const balance = total - studentForm.feesPaid;
                            setStudentForm({...studentForm, totalFees: total, feesBalance: balance});
                          }} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Fees Paid (₹)</Label>
                          <Input type="number" value={studentForm.feesPaid} onChange={(e) => {
                            const paid = Number(e.target.value);
                            const balance = studentForm.totalFees - paid;
                            const status = balance <= 0 ? "Paid" : "Pending";
                            setStudentForm({...studentForm, feesPaid: paid, feesBalance: balance, paymentStatus: status});
                          }} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Parent ID (Optional)</Label>
                          <Input value={studentForm.parentId} onChange={(e) => setStudentForm({...studentForm, parentId: e.target.value})} placeholder="Link to parent account" />
                        </div>
                        <Button type="submit" className="w-full">
                          {editingStudent ? "Update" : "Add"} Student
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
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
                      <TableHead>Fees Status</TableHead>
                      <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <Badge variant={student.paymentStatus === "Paid" ? "default" : "destructive"}>
                            {student.paymentStatus || "Pending"} (₹{student.feesBalance || 0})
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditStudent(student)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Department Management</CardTitle>
                    <CardDescription>Add and manage departments</CardDescription>
                  </div>
                  <Dialog open={isDeptDialogOpen} onOpenChange={setIsDeptDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>Create a department by providing its name and code.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddDepartment} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Department Name</Label>
                          <Input value={deptForm.name} onChange={(e) => setDeptForm({...deptForm, name: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Department Code</Label>
                          <Input value={deptForm.code} onChange={(e) => setDeptForm({...deptForm, code: e.target.value})} required />
                        </div>
                        <Button type="submit" className="w-full">Add Department</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map(dept => (
                      <TableRow key={dept.id}>
                        <TableCell>{dept.name}</TableCell>
                        <TableCell>{dept.code}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteDepartment(dept.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Add staff and assign to departments</CardDescription>
                  </div>
                  <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Staff</DialogTitle>
                        <DialogDescription>Enter staff details and assign a department.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddStaff} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={staffForm.name} onChange={(e) => setStaffForm({...staffForm, name: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={staffForm.email} onChange={(e) => setStaffForm({...staffForm, email: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Assigned Department *</Label>
                          <Select value={staffForm.department} onValueChange={(v) => setStaffForm({...staffForm, department: v})} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.code}>{dept.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Add Staff</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map(s => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.department}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteStaff(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Verified Change Requests</CardTitle>
                <CardDescription>Approve or reject requests verified by Admin 2</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {verifiedPendingRequests.map(request => (
                  <Card key={request.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{request.studentName}</p>
                            <Badge variant="secondary">Verified by Admin 2</Badge>
                          </div>
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
                          <Button size="sm" onClick={() => handleApproveRequest(request.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
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
                {verifiedPendingRequests.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No verified pending requests</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectManagement />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceView />
          </TabsContent>

          <TabsContent value="allocations">
            <SubjectAllocationView />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceReport />
          </TabsContent>

          <TabsContent value="sample-data">
            <SampleDataInitializer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin1Dashboard;