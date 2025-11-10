import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { Subject } from "@/types/academic";
import { initializeSubjects } from "@/utils/subjectsData";

interface Department {
  id: string;
  name: string;
  code: string;
}

export const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    department: "",
    semester: 1,
    credits: 3,
    type: "Theory" as "Theory" | "Practical" | "Lab"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    
    if (savedSubjects.length === 0) {
      const initialized = initializeSubjects();
      setSubjects(initialized);
    } else {
      setSubjects(savedSubjects);
    }
    
    setDepartments(savedDepartments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectForm.department) {
      toast.error("Please select a department");
      return;
    }

    if (editingSubject) {
      const updated = subjects.map(s =>
        s.id === editingSubject.id ? { ...editingSubject, ...subjectForm } : s
      );
      setSubjects(updated);
      localStorage.setItem("subjects", JSON.stringify(updated));
      toast.success("Subject updated successfully");
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...subjectForm
      };
      const updated = [...subjects, newSubject];
      setSubjects(updated);
      localStorage.setItem("subjects", JSON.stringify(updated));
      toast.success("Subject added successfully");
    }

    resetForm();
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      semester: subject.semester,
      credits: subject.credits,
      type: subject.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
    toast.success("Subject deleted");
  };

  const resetForm = () => {
    setSubjectForm({
      name: "",
      code: "",
      department: "",
      semester: 1,
      credits: 3,
      type: "Theory"
    });
    setEditingSubject(null);
    setIsDialogOpen(false);
  };

  const handleLoadSampleSubjects = () => {
    const initialized = initializeSubjects();
    setSubjects(initialized);
    toast.success("Sample subjects loaded successfully");
  };

  const filteredSubjects = selectedDept === "all" 
    ? subjects 
    : subjects.filter(s => s.department === selectedDept);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Subject Management</CardTitle>
            <CardDescription>Manage subjects for each department and semester</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLoadSampleSubjects}>
              <BookOpen className="mr-2 h-4 w-4" />
              Load Sample Subjects
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                  <DialogDescription>Fill in the subject details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input 
                      value={subjectForm.name} 
                      onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject Code</Label>
                    <Input 
                      value={subjectForm.code} 
                      onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={subjectForm.department} 
                      onValueChange={(v) => setSubjectForm({...subjectForm, department: v})}
                    >
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Semester</Label>
                      <Select 
                        value={String(subjectForm.semester)} 
                        onValueChange={(v) => setSubjectForm({...subjectForm, semester: Number(v)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Credits</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="6" 
                        value={subjectForm.credits} 
                        onChange={(e) => setSubjectForm({...subjectForm, credits: Number(e.target.value)})} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select 
                      value={subjectForm.type} 
                      onValueChange={(v: any) => setSubjectForm({...subjectForm, type: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Practical">Practical</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingSubject ? "Update" : "Add"} Subject
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label>Filter by Department</Label>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.code}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.map(subject => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.code}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.department}</TableCell>
                <TableCell>Sem {subject.semester}</TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>
                  <Badge variant={subject.type === "Lab" ? "secondary" : "default"}>
                    {subject.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(subject)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(subject.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredSubjects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No subjects found</p>
        )}
      </CardContent>
    </Card>
  );
};
