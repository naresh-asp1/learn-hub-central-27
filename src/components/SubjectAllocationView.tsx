import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SubjectAllocation {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  subjectCode: string;
  type: "primary" | "cross-department";
}

interface StudentAllocation {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  advisorId: string;
  advisorName: string;
  department: string;
}

export const SubjectAllocationView = () => {
  const [subjectAllocations, setSubjectAllocations] = useState<SubjectAllocation[]>([]);
  const [studentAllocations, setStudentAllocations] = useState<StudentAllocation[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [selectedDepartment, selectedStaff]);

  const loadData = () => {
    const subjectAllocs: SubjectAllocation[] = JSON.parse(localStorage.getItem("subjectAllocations") || "[]");
    const studentAllocs: StudentAllocation[] = JSON.parse(localStorage.getItem("studentAllocations") || "[]");
    const depts = JSON.parse(localStorage.getItem("departments") || "[]");
    const staffList = JSON.parse(localStorage.getItem("staff") || "[]");

    setDepartments(depts);
    setStaff(staffList);

    // Filter subject allocations
    let filteredSubjectAllocs = subjectAllocs;
    if (selectedDepartment !== "all") {
      filteredSubjectAllocs = filteredSubjectAllocs.filter(
        a => a.department === selectedDepartment
      );
    }
    if (selectedStaff !== "all") {
      filteredSubjectAllocs = filteredSubjectAllocs.filter(
        a => a.staffId === selectedStaff
      );
    }

    // Filter student allocations
    let filteredStudentAllocs = studentAllocs;
    if (selectedDepartment !== "all") {
      filteredStudentAllocs = filteredStudentAllocs.filter(
        a => a.department === selectedDepartment
      );
    }
    if (selectedStaff !== "all") {
      filteredStudentAllocs = filteredStudentAllocs.filter(
        a => a.advisorId === selectedStaff
      );
    }

    setSubjectAllocations(filteredSubjectAllocs);
    setStudentAllocations(filteredStudentAllocs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Allocations</CardTitle>
        <CardDescription>View subject and student allocations to staff</CardDescription>
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

          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staff.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subjects">Subject Allocation</TabsTrigger>
            <TabsTrigger value="students">Student Advisors</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Allocation Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectAllocations.map(alloc => (
                  <TableRow key={alloc.id}>
                    <TableCell className="font-medium">{alloc.staffName}</TableCell>
                    <TableCell>{alloc.department}</TableCell>
                    <TableCell>{alloc.subjectCode}</TableCell>
                    <TableCell>
                      {alloc.type === "primary" ? (
                        <Badge>Primary Department</Badge>
                      ) : (
                        <Badge variant="secondary">Cross Department</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {subjectAllocations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No subject allocations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="students">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Advisor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentAllocations.map(alloc => (
                  <TableRow key={alloc.id}>
                    <TableCell className="font-medium">{alloc.rollNumber}</TableCell>
                    <TableCell>{alloc.studentName}</TableCell>
                    <TableCell>{alloc.department}</TableCell>
                    <TableCell>{alloc.advisorName}</TableCell>
                  </TableRow>
                ))}
                {studentAllocations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No student allocations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
