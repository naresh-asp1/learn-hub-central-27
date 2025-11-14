import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  date: string;
  status: "present" | "absent";
}

interface StudentAttendance {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  totalClasses: number;
  present: number;
  absent: number;
  percentage: number;
}

export const AttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [selectedDepartment]);

  const loadData = () => {
    const attendance: AttendanceRecord[] = JSON.parse(localStorage.getItem("attendance") || "[]");
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const depts = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(depts);

    // Calculate attendance percentage for each student
    const studentAttendanceMap = new Map<string, StudentAttendance>();

    attendance.forEach(record => {
      if (selectedDepartment !== "all" && record.department !== selectedDepartment) {
        return;
      }

      if (!studentAttendanceMap.has(record.studentId)) {
        studentAttendanceMap.set(record.studentId, {
          studentId: record.studentId,
          studentName: record.studentName,
          rollNumber: record.rollNumber,
          department: record.department,
          totalClasses: 0,
          present: 0,
          absent: 0,
          percentage: 0
        });
      }

      const studentAtt = studentAttendanceMap.get(record.studentId)!;
      studentAtt.totalClasses++;
      if (record.status === "present") {
        studentAtt.present++;
      } else {
        studentAtt.absent++;
      }
    });

    // Calculate percentages
    const attendanceArray = Array.from(studentAttendanceMap.values()).map(att => ({
      ...att,
      percentage: att.totalClasses > 0 ? Math.round((att.present / att.totalClasses) * 100) : 0
    }));

    // Sort by roll number
    attendanceArray.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    setAttendanceData(attendanceArray);
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 85) return <Badge className="bg-green-500">Excellent</Badge>;
    if (percentage >= 75) return <Badge className="bg-blue-500">Good</Badge>;
    if (percentage >= 65) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>View student attendance percentages</CardDescription>
        <div className="flex gap-4 mt-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.code}>
                  {dept.name} ({dept.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Total Classes</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map(att => (
              <TableRow key={att.studentId}>
                <TableCell className="font-medium">{att.rollNumber}</TableCell>
                <TableCell>{att.studentName}</TableCell>
                <TableCell>{att.department}</TableCell>
                <TableCell>{att.totalClasses}</TableCell>
                <TableCell className="text-green-600">{att.present}</TableCell>
                <TableCell className="text-red-600">{att.absent}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={att.percentage} className="w-20" />
                    <span className="text-sm font-medium">{att.percentage}%</span>
                  </div>
                </TableCell>
                <TableCell>{getAttendanceBadge(att.percentage)}</TableCell>
              </TableRow>
            ))}
            {attendanceData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
