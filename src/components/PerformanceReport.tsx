import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, BookOpen } from "lucide-react";
import { Mark, Subject, SubjectPerformance, calculateGrade, calculateCGPA } from "@/types/academic";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
}

export const PerformanceReport = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const savedMarks = JSON.parse(localStorage.getItem("marks") || "[]");
    
    setStudents(savedStudents);
    setSubjects(savedSubjects);
    setMarks(savedMarks);
  }, []);

  const selectedStudentData = students.find(s => s.id === selectedStudent);
  
  const calculatePerformance = (): SubjectPerformance[] => {
    if (!selectedStudentData) return [];

    const semesterSubjects = subjects.filter(
      s => s.department === selectedStudentData.department && s.semester === selectedSemester
    );

    return semesterSubjects.map(subject => {
      const studentMarks = marks.filter(
        m => m.studentId === selectedStudent && m.subjectId === subject.id
      );

      const internal1 = studentMarks.find(m => m.assessmentType === "Internal1")?.marksObtained || 0;
      const internal2 = studentMarks.find(m => m.assessmentType === "Internal2")?.marksObtained || 0;
      const assignment = studentMarks.find(m => m.assessmentType === "Assignment")?.marksObtained || 0;
      const endSem = studentMarks.find(m => m.assessmentType === "EndSem")?.marksObtained || 0;

      const total = internal1 + internal2 + assignment + endSem;
      const maxTotal = 100;
      const percentage = (total / maxTotal) * 100;
      const { grade, gradePoint } = calculateGrade(percentage);

      return {
        subjectCode: subject.code,
        subjectName: subject.name,
        credits: subject.credits,
        internal1,
        internal2,
        assignment,
        endSem,
        total,
        maxTotal,
        percentage: Number(percentage.toFixed(2)),
        grade,
        gradePoint
      };
    });
  };

  const performance = calculatePerformance();
  const cgpa = calculateCGPA(performance);
  const totalMarks = performance.reduce((sum, p) => sum + p.total, 0);
  const maxTotalMarks = performance.reduce((sum, p) => sum + p.maxTotal, 0);
  const overallPercentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;
  const overallGrade = calculateGrade(overallPercentage).grade;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Report</CardTitle>
          <CardDescription>View detailed semester-wise performance of students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.rollNumber} - {student.name}
                    </SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {selectedStudent && selectedStudentData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="text-lg font-semibold">{selectedStudentData.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">CGPA</p>
                    <p className="text-2xl font-bold">{cgpa}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Percentage</p>
                    <p className="text-2xl font-bold">{overallPercentage.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <Badge variant="default" className="text-xl">{overallGrade}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance - Semester {selectedSemester}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead className="text-center">Internal 1</TableHead>
                    <TableHead className="text-center">Internal 2</TableHead>
                    <TableHead className="text-center">Assignment</TableHead>
                    <TableHead className="text-center">End Sem</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">%</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.map(perf => (
                    <TableRow key={perf.subjectCode}>
                      <TableCell className="font-medium">{perf.subjectCode}</TableCell>
                      <TableCell>{perf.subjectName}</TableCell>
                      <TableCell>{perf.credits}</TableCell>
                      <TableCell className="text-center">{perf.internal1}/20</TableCell>
                      <TableCell className="text-center">{perf.internal2}/20</TableCell>
                      <TableCell className="text-center">{perf.assignment}/10</TableCell>
                      <TableCell className="text-center">{perf.endSem}/50</TableCell>
                      <TableCell className="text-center font-semibold">{perf.total}/{perf.maxTotal}</TableCell>
                      <TableCell className="text-center">{perf.percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={perf.grade === 'F' ? 'destructive' : 'default'}>
                          {perf.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {performance.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No marks data available for this semester
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!selectedStudent && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Select a student to view their performance report
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
