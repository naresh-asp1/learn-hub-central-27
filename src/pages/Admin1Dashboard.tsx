import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  department: string;
}

const Admin1Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    class: "",
    department: ""
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role !== "admin1") {
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rollNumber: "",
      class: "",
      department: ""
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Date.now().toString(),
      ...formData
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    toast.success("Student added successfully");
    setIsAddOpen(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    const updatedStudents = students.map(s => 
      s.id === editingStudent.id ? { ...editingStudent, ...formData } : s
    );
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    toast.success("Student updated successfully");
    setEditingStudent(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    toast.success("Student deleted successfully");
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      class: student.class,
      department: student.department
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin 1 Dashboard</h1>
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
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Add, edit, and delete student records</CardDescription>
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Roll Number</Label>
                      <Input value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Input value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
                    </div>
                    <Button type="submit" className="w-full">Add Student</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => !open && setEditingStudent(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => openEditDialog(student)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Student</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEdit} className="space-y-4">
                              <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Roll Number</Label>
                                <Input value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Class</Label>
                                <Input value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Department</Label>
                                <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
                              </div>
                              <Button type="submit" className="w-full">Update Student</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(student.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {students.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No students found. Add your first student!</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin1Dashboard;