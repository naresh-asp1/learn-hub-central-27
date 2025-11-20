import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Database, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { initializeSampleData, generateLoginCredentials } from "@/utils/sampleData";

export const SupabaseSampleDataInitializer = () => {
  const [credentials, setCredentials] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      // Initialize localStorage data first
      const result = initializeSampleData();
      const creds = generateLoginCredentials();

      // Create Supabase users for admins
      const adminPromises = creds.admins.map(async (admin: any) => {
        const { data, error } = await supabase.auth.signUp({
          email: admin.email,
          password: admin.password,
          options: {
            data: {
              name: admin.name,
              role: admin.role,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) console.error(`Failed to create admin ${admin.email}:`, error);
        return data;
      });

      // Create sample students (first 5 from each department for demo)
      const studentPromises = creds.students.slice(0, 20).map(async (student: any) => {
        const { data, error } = await supabase.auth.signUp({
          email: student.email,
          password: student.password,
          options: {
            data: {
              name: student.name,
              role: 'student',
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) console.error(`Failed to create student ${student.email}:`, error);
        return data;
      });

      // Create sample staff (first 6 for demo)
      const staffPromises = creds.staff.slice(0, 6).map(async (staff: any) => {
        const { data, error } = await supabase.auth.signUp({
          email: staff.email,
          password: staff.password,
          options: {
            data: {
              name: staff.name,
              role: 'staff',
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) console.error(`Failed to create staff ${staff.email}:`, error);
        return data;
      });

      // Create sample parents (first 5 for demo)
      const parentPromises = creds.parents.slice(0, 5).map(async (parent: any) => {
        const { data, error } = await supabase.auth.signUp({
          email: parent.email,
          password: parent.password,
          options: {
            data: {
              name: parent.name,
              role: 'parent',
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) console.error(`Failed to create parent ${parent.email}:`, error);
        return data;
      });

      await Promise.all([...adminPromises, ...studentPromises, ...staffPromises, ...parentPromises]);

      setCredentials(creds);
      toast.success(`Successfully initialized sample data with users in Supabase!`);
    } catch (error) {
      toast.error("Failed to initialize sample data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCredentials = () => {
    if (!credentials) return;

    let text = "=== NPV COLLEGE MANAGEMENT SYSTEM - LOGIN CREDENTIALS ===\n\n";
    text += "IMPORTANT: Auto-confirm email is enabled for testing.\n";
    text += "All accounts are created and ready to use!\n\n";
    
    text += "ADMIN ACCOUNTS:\n";
    text += "=".repeat(80) + "\n";
    credentials.admins.forEach((admin: any) => {
      text += `Role: ${admin.role.toUpperCase()}\n`;
      text += `Name: ${admin.name}\n`;
      text += `Email: ${admin.email}\n`;
      text += `Password: ${admin.password}\n`;
      text += "-".repeat(80) + "\n";
    });

    text += `\n\nSAMPLE STUDENT ACCOUNTS (20 created, showing all):\n`;
    text += "=".repeat(80) + "\n";
    credentials.students.slice(0, 20).forEach((student: any) => {
      text += `Name: ${student.name}\n`;
      text += `Email: ${student.email}\n`;
      text += `Password: ${student.password}\n`;
      text += `Roll Number: ${student.rollNumber}\n`;
      text += "\n";
    });

    text += `\n\nSAMPLE STAFF ACCOUNTS (6 created, showing all):\n`;
    text += "=".repeat(80) + "\n";
    credentials.staff.slice(0, 6).forEach((staff: any) => {
      text += `Name: ${staff.name}\n`;
      text += `Email: ${staff.email}\n`;
      text += `Password: ${staff.password}\n`;
      text += "\n";
    });

    text += `\n\nSAMPLE PARENT ACCOUNTS (5 created, showing all):\n`;
    text += "=".repeat(80) + "\n";
    credentials.parents.slice(0, 5).forEach((parent: any) => {
      text += `Name: ${parent.name}\n`;
      text += `Child: ${parent.childName} (${parent.childRollNumber})\n`;
      text += `Email: ${parent.email}\n`;
      text += `Password: ${parent.password}\n`;
      text += "\n";
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
    <Card>
      <CardHeader>
        <CardTitle>Initialize Sample Users</CardTitle>
        <CardDescription>
          Create sample users in Supabase for testing (Admins, 20 Students, 6 Staff, 5 Parents)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This will create user accounts in Supabase. You can login immediately with the generated credentials.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-4">
          <Button onClick={handleInitialize} disabled={loading} className="flex-1">
            <Database className="mr-2 h-4 w-4" />
            {loading ? 'Creating Users...' : 'Initialize Sample Users'}
          </Button>
          
          {credentials && (
            <Button onClick={downloadCredentials} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Credentials
            </Button>
          )}
        </div>

        {credentials && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Quick Login Credentials</h3>
              
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admin 1:</p>
                  <p className="font-mono text-sm">Email: admin1@npv.edu</p>
                  <p className="font-mono text-sm">Password: admin123</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admin 2:</p>
                  <p className="font-mono text-sm">Email: admin2@npv.edu</p>
                  <p className="font-mono text-sm">Password: admin123</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sample Student:</p>
                  <p className="font-mono text-sm">Email: {credentials.students[0].email}</p>
                  <p className="font-mono text-sm">Password: {credentials.students[0].password}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sample Staff:</p>
                  <p className="font-mono text-sm">Email: {credentials.staff[0].email}</p>
                  <p className="font-mono text-sm">Password: {credentials.staff[0].password}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sample Parent:</p>
                  <p className="font-mono text-sm">Email: {credentials.parents[0].email}</p>
                  <p className="font-mono text-sm">Password: {credentials.parents[0].password}</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Download the full credentials file for all test accounts.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
