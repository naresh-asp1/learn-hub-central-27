import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, BookOpen } from "lucide-react";
import { Mark, Subject, SubjectPerformance, calculateGrade, calculateCGPA } from "@/types/academic";

interface Props {
  studentId: string;
}

export const StudentPerformanceView = ({ studentId }: Props) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [studentDepartment, setStudentDepartment] = useState<string>("");

  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const savedMarks = JSON.parse(localStorage.getItem("marks") || "[]");
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    
    const student = savedStudents.find((s: any) => s.id === studentId);
    if (student) {
      setStudentDepartment(student.department);
    }
    
    setSubjects(savedSubjects);
    setMarks(savedMarks);
  }, [studentId]);

  const calculatePerformance = (): SubjectPerformance[] => {
    if (!studentDepartment) return [];

    const semesterSubjects = subjects.filter(
      s => s.department === studentDepartment && s.semester === selectedSemester
    );

    return semesterSubjects.map(subject => {
      const studentMarks = marks.filter(
        m => m.studentId === studentId && m.subjectId === subject.id
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Academic Performance</CardTitle>
              <CardDescription>View your semester-wise marks and grades</CardDescription>
            </div>
            <div className="w-48">
              <Label>Select Semester</Label>
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
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-lg font-semibold">{studentDepartment || "N/A"}</p>
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
    </div>
  );
};
