import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, FileSpreadsheet } from "lucide-react";
import { Mark, Subject, calculateGrade } from "@/types/academic";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
}

export const MarksEntry = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedAssessment, setSelectedAssessment] = useState<string>("Internal1");
  const [marksData, setMarksData] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const savedMarks = JSON.parse(localStorage.getItem("marks") || "[]");
    
    setStudents(savedStudents);
    setSubjects(savedSubjects);
    setMarks(savedMarks);
  };

  const filteredStudents = students.filter(s => s.department === selectedDept);
  const filteredSubjects = subjects.filter(
    s => s.department === selectedDept && s.semester === selectedSemester
  );
  
  const selectedSubjectDetails = subjects.find(s => s.id === selectedSubject);

  const getMaxMarks = (assessmentType: string) => {
    switch(assessmentType) {
      case "Internal1": return 20;
      case "Internal2": return 20;
      case "Assignment": return 10;
      case "EndSem": return 50;
      default: return 100;
    }
  };

  const handleMarksChange = (studentId: string, value: string) => {
    const numValue = Number(value);
    const maxMarks = getMaxMarks(selectedAssessment);
    
    if (numValue < 0 || numValue > maxMarks) {
      toast.error(`Marks must be between 0 and ${maxMarks}`);
      return;
    }
    
    setMarksData(prev => ({
      ...prev,
      [studentId]: numValue
    }));
  };

  const handleSaveMarks = () => {
    if (!selectedSubject || !selectedDept || !selectedAssessment) {
      toast.error("Please select all required fields");
      return;
    }

    const maxMarks = getMaxMarks(selectedAssessment);
    const newMarks: Mark[] = [];

    Object.entries(marksData).forEach(([studentId, marksObtained]) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const percentage = (marksObtained / maxMarks) * 100;
      const { grade } = calculateGrade(percentage);

      const mark: Mark = {
        id: `${studentId}-${selectedSubject}-${selectedAssessment}-${Date.now()}`,
        studentId,
        subjectId: selectedSubject,
        subjectCode: selectedSubjectDetails?.code || "",
        subjectName: selectedSubjectDetails?.name || "",
        semester: selectedSemester,
        assessmentType: selectedAssessment as any,
        marksObtained,
        maxMarks,
        percentage,
        grade,
        academicYear: "2024-25"
      };

      newMarks.push(mark);
    });

    // Remove existing marks for same student+subject+assessment
    const filteredMarks = marks.filter(m => {
      const isDuplicate = newMarks.some(nm => 
        nm.studentId === m.studentId && 
        nm.subjectId === m.subjectId && 
        nm.assessmentType === m.assessmentType
      );
      return !isDuplicate;
    });

    const updatedMarks = [...filteredMarks, ...newMarks];
    setMarks(updatedMarks);
    localStorage.setItem("marks", JSON.stringify(updatedMarks));
    
    toast.success(`Marks saved for ${newMarks.length} students`);
    setMarksData({});
  };

  const getExistingMarks = (studentId: string) => {
    return marks.find(m => 
      m.studentId === studentId && 
      m.subjectId === selectedSubject && 
      m.assessmentType === selectedAssessment
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marks Entry</CardTitle>
        <CardDescription>Enter marks for students by subject and assessment type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set(subjects.map(s => s.department))).map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semester</Label>
            <Select value={String(selectedSemester)} onValueChange={(v) => setSelectedSemester(Number(v))}>
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
            <Label>Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubjects.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assessment Type</Label>
            <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internal1">Internal 1 (20)</SelectItem>
                <SelectItem value="Internal2">Internal 2 (20)</SelectItem>
                <SelectItem value="Assignment">Assignment (10)</SelectItem>
                <SelectItem value="EndSem">End Semester (50)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedDept && selectedSubject && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Max Marks: <strong>{getMaxMarks(selectedAssessment)}</strong>
                </p>
              </div>
              <Button onClick={handleSaveMarks}>
                <Save className="mr-2 h-4 w-4" />
                Save All Marks
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(student => {
                  const existing = getExistingMarks(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={getMaxMarks(selectedAssessment)}
                          placeholder={`Enter marks (max ${getMaxMarks(selectedAssessment)})`}
                          value={marksData[student.id] ?? existing?.marksObtained ?? ""}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        {existing && (
                          <Badge variant="secondary">
                            Previously: {existing.marksObtained}/{existing.maxMarks}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No students found for selected department
              </p>
            )}
          </>
        )}

        {!selectedDept && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Select department, semester, subject, and assessment type to begin entering marks
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
