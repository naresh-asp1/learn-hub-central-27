import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, UserCog, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const CredentialsViewer = () => {
  const [credentials, setCredentials] = useState<any>(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u: any) => u.role === "student");
    const staff = users.filter((u: any) => u.role === "staff");
    const parents = users.filter((u: any) => u.role === "parent");
    const admins = users.filter((u: any) => u.role.includes("admin"));

    setCredentials({ admins, students, staff, parents });
  }, []);

  if (!credentials) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Login Credentials</CardTitle>
        <CardDescription>
          Complete list of login credentials for all users organized by role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admins">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admins">
              <UserCog className="mr-2 h-4 w-4" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="students">
              <GraduationCap className="mr-2 h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="staff">
              <UserCircle className="mr-2 h-4 w-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="parents">
              <Users className="mr-2 h-4 w-4" />
              Parents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admins" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Admin Accounts</h3>
                <Badge>{credentials.admins.length}</Badge>
              </div>
              {credentials.admins.map((admin: any) => (
                <Card key={admin.id} className="bg-muted/50">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{admin.role.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm"><strong>Name:</strong> {admin.name}</p>
                    <p className="text-sm"><strong>Email:</strong> <code className="bg-muted px-2 py-1 rounded">{admin.email}</code></p>
                    <p className="text-sm"><strong>Password:</strong> <code className="bg-muted px-2 py-1 rounded">{admin.password}</code></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Student Accounts</h3>
              <Badge>{credentials.students.length}</Badge>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {credentials.students.map((student: any) => (
                  <Card key={student.id} className="bg-muted/30">
                    <CardContent className="pt-3 space-y-1 text-sm">
                      <p><strong>Name:</strong> {student.name}</p>
                      <p><strong>Email:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{student.email}</code></p>
                      <p><strong>Password:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{student.password}</code></p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="staff" className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Staff Accounts</h3>
              <Badge>{credentials.staff.length}</Badge>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {credentials.staff.map((staff: any) => (
                  <Card key={staff.id} className="bg-muted/30">
                    <CardContent className="pt-3 space-y-1 text-sm">
                      <p><strong>Name:</strong> {staff.name}</p>
                      <p><strong>Email:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{staff.email}</code></p>
                      <p><strong>Password:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{staff.password}</code></p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="parents" className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Parent Accounts</h3>
              <Badge>{credentials.parents.length}</Badge>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {credentials.parents.map((parent: any) => (
                  <Card key={parent.id} className="bg-muted/30">
                    <CardContent className="pt-3 space-y-1 text-sm">
                      <p><strong>Name:</strong> {parent.name}</p>
                      <p><strong>Child:</strong> {parent.childName} ({parent.childRollNumber})</p>
                      <p><strong>Email:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{parent.email}</code></p>
                      <p><strong>Password:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{parent.password}</code></p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
