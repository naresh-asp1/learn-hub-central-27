import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Database, Users, GraduationCap, Download } from "lucide-react";
import { initializeSampleData, generateLoginCredentials } from "@/utils/sampleData";
import { useState } from "react";

export const SampleDataInitializer = () => {
  const [credentials, setCredentials] = useState<any>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleInitialize = () => {
    try {
      const result = initializeSampleData();
      const creds = generateLoginCredentials();
      setCredentials(creds);
      setShowCredentials(true);
      toast.success(`Successfully initialized: ${result.departments.length} departments, ${result.students.length} students, ${result.staff.length} staff members`);
    } catch (error) {
      toast.error("Failed to initialize sample data");
      console.error(error);
    }
  };

  const downloadCredentials = () => {
    if (!credentials) return;

    let text = "=== NPV COLLEGE MANAGEMENT SYSTEM - LOGIN CREDENTIALS ===\n\n";
    
    text += "ADMIN ACCOUNTS:\n";
    text += "=" .repeat(80) + "\n";
    credentials.admins.forEach((admin: any) => {
      text += `Role: ${admin.role.toUpperCase()}\n`;
      text += `Name: ${admin.name}\n`;
      text += `Email: ${admin.email}\n`;
      text += `Password: ${admin.password}\n`;
      text += "-".repeat(80) + "\n";
    });

    text += "\n\nSTUDENT ACCOUNTS (80 Total):\n";
    text += "=".repeat(80) + "\n";
    
    const departments = ["MCA", "BE-CSE", "BE-IT", "BE-BME", "BE-MECH", "BE-CIVIL", "BE-EEE", "BE-ECE"];
    departments.forEach(dept => {
      const deptStudents = credentials.students.filter((s: any) => s.email.includes(dept.toLowerCase()));
      text += `\n${dept} DEPARTMENT (${deptStudents.length} students):\n`;
      text += "-".repeat(80) + "\n";
      deptStudents.forEach((student: any) => {
        text += `Name: ${student.name}\n`;
        text += `Email: ${student.email}\n`;
        text += `Password: ${student.password}\n`;
        text += "\n";
      });
    });

    text += "\n\nSTAFF ACCOUNTS (40 Total):\n";
    text += "=".repeat(80) + "\n";
    departments.forEach(dept => {
      const deptStaff = credentials.staff.filter((s: any) => s.email.includes(dept.toLowerCase()));
      text += `\n${dept} DEPARTMENT (${deptStaff.length} staff):\n`;
      text += "-".repeat(80) + "\n";
      deptStaff.forEach((staff: any) => {
        text += `Name: ${staff.name}\n`;
        text += `Email: ${staff.email}\n`;
        text += `Password: ${staff.password}\n`;
        text += "\n";
      });
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "npv-college-login-credentials.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Credentials downloaded!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Initialize Sample Data</CardTitle>
          <CardDescription>
            This will clear all existing data and load sample data including 8 departments,
            80 students (10 per department), and 40 staff (5 per department)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action will delete ALL existing data and cannot be undone.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4">
            <Button onClick={handleInitialize} className="flex-1">
              <Database className="mr-2 h-4 w-4" />
              Initialize Sample Data
            </Button>
            {showCredentials && (
              <Button onClick={downloadCredentials} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Credentials
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showCredentials && credentials && (
        <Card>
          <CardHeader>
            <CardTitle>Login Credentials</CardTitle>
            <CardDescription>Use these credentials to login to different accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Admin Accounts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Admin Accounts</h3>
                    <Badge>{credentials.admins.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {credentials.admins.map((admin: any) => (
                      <Card key={admin.id} className="bg-muted/50">
                        <CardContent className="pt-4 space-y-1 text-sm">
                          <p><strong>Name:</strong> {admin.name}</p>
                          <p><strong>Email:</strong> {admin.email}</p>
                          <p><strong>Password:</strong> {admin.password}</p>
                          <Badge variant="secondary">{admin.role.toUpperCase()}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Student Accounts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Student Accounts</h3>
                    <Badge>{credentials.students.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {["MCA", "BE-CSE", "BE-IT", "BE-BME", "BE-MECH", "BE-CIVIL", "BE-EEE", "BE-ECE"].map(dept => {
                      const deptStudents = credentials.students.filter((s: any) => 
                        s.email.toLowerCase().includes(dept.toLowerCase().replace("-", ""))
                      );
                      return (
                        <div key={dept}>
                          <h4 className="font-medium mb-2">{dept} Department ({deptStudents.length})</h4>
                          <div className="space-y-2">
                            {deptStudents.slice(0, 3).map((student: any, idx: number) => (
                              <Card key={student.id} className="bg-muted/30">
                                <CardContent className="pt-3 space-y-1 text-xs">
                                  <p><strong>Name:</strong> {student.name}</p>
                                  <p><strong>Email:</strong> {student.email}</p>
                                  <p><strong>Password:</strong> {student.password}</p>
                                </CardContent>
                              </Card>
                            ))}
                            {deptStudents.length > 3 && (
                              <p className="text-xs text-muted-foreground pl-2">
                                ... and {deptStudents.length - 3} more students
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Staff Accounts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Staff Accounts</h3>
                    <Badge>{credentials.staff.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {["MCA", "BE-CSE", "BE-IT", "BE-BME", "BE-MECH", "BE-CIVIL", "BE-EEE", "BE-ECE"].map(dept => {
                      const deptStaff = credentials.staff.filter((s: any) => 
                        s.email.toLowerCase().includes(dept.toLowerCase().replace("-", ""))
                      );
                      return (
                        <div key={dept}>
                          <h4 className="font-medium mb-2">{dept} Department ({deptStaff.length})</h4>
                          <div className="space-y-2">
                            {deptStaff.map((staff: any) => (
                              <Card key={staff.id} className="bg-muted/30">
                                <CardContent className="pt-3 space-y-1 text-xs">
                                  <p><strong>Name:</strong> {staff.name}</p>
                                  <p><strong>Email:</strong> {staff.email}</p>
                                  <p><strong>Password:</strong> {staff.password}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
