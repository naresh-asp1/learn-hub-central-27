// Sample data initialization utility
export const initializeSampleData = () => {
  // Clear all existing data
  localStorage.removeItem("students");
  localStorage.removeItem("departments");
  localStorage.removeItem("staff");
  localStorage.removeItem("users");
  localStorage.removeItem("changeRequests");
  localStorage.removeItem("attendance");
  localStorage.removeItem("subjectAllocations");
  localStorage.removeItem("studentAllocations");

  // Define departments
  const departments = [
    { id: "1", name: "Master of Computer Applications", code: "MCA" },
    { id: "2", name: "Computer Science Engineering", code: "BE-CSE" },
    { id: "3", name: "Information Technology", code: "BE-IT" },
    { id: "4", name: "Biomedical Engineering", code: "BE-BME" },
    { id: "5", name: "Mechanical Engineering", code: "BE-MECH" },
    { id: "6", name: "Civil Engineering", code: "BE-CIVIL" },
    { id: "7", name: "Electrical and Electronics Engineering", code: "BE-EEE" },
    { id: "8", name: "Electronics and Communication Engineering", code: "BE-ECE" }
  ];

  // South Indian names
  const studentFirstNames = ["Arjun", "Karthik", "Arun", "Vijay", "Prakash", "Suresh", "Dinesh", "Rajesh", "Ramesh", "Mahesh", 
    "Priya", "Lakshmi", "Deepa", "Kavya", "Divya", "Meera", "Anjali", "Sneha", "Pooja", "Radha"];
  
  const initials = ["K", "R", "S", "V", "M", "P", "L", "D", "N", "A", "B", "C", "G", "H", "J", "T"];
  
  // South Indian parent names
  const fatherNames = ["Krishnan", "Raghavan", "Sundaram", "Venkatesh", "Murugan", "Selvam", "Raman", "Subramaniam", 
    "Narayanan", "Chandran", "Balaji", "Ganesh", "Hari", "Jagannathan", "Thiruvengadam"];
  
  const motherNames = ["Lakshmi", "Saraswathi", "Kamala", "Meenakshi", "Parvathi", "Rukmini", "Savithri", "Uma", 
    "Vasantha", "Chitra", "Geetha", "Janaki", "Kalpana", "Lalitha", "Mythili"];

  // Department subject codes mapping (for cross-allocation)
  const departmentSubjects: Record<string, string[]> = {
    "MCA": ["MCA101", "MCA102", "MCA103", "MCA104"],
    "BE-CSE": ["CSE101", "CSE102", "CSE103", "CSE104"],
    "BE-IT": ["IT101", "IT102", "IT103", "IT104"],
    "BE-BME": ["BME101", "BME102", "BME103", "BME104"],
    "BE-MECH": ["MECH101", "MECH102", "MECH103", "MECH104"],
    "BE-CIVIL": ["CIVIL101", "CIVIL102", "CIVIL103", "CIVIL104"],
    "BE-EEE": ["EEE101", "EEE102", "EEE103", "EEE104"],
    "BE-ECE": ["ECE101", "ECE102", "ECE103", "ECE104"]
  };

  // Generate students for each department
  const students: any[] = [];
  const users: any[] = [];
  const attendance: any[] = [];
  let studentIdCounter = 1000;

  departments.forEach((dept, deptIndex) => {
    for (let i = 1; i <= 20; i++) {
      const firstName = studentFirstNames[(deptIndex * 20 + i - 1) % studentFirstNames.length];
      const initial = initials[(deptIndex * 20 + i - 1) % initials.length];
      const name = `${initial}. ${firstName}`;
      const rollNumber = `${dept.code}${String(i).padStart(3, '0')}`;
      const email = `${firstName.toLowerCase()}${i}.${dept.code.toLowerCase()}@student.npv.edu`;
      const password = `student${rollNumber}`;
      const studentId = String(studentIdCounter++);
      
      // Generate parent names
      const fatherName = fatherNames[(deptIndex * 20 + i - 1) % fatherNames.length];
      const motherName = motherNames[(deptIndex * 20 + i - 1) % motherNames.length];
      const parentEmail = `parent.${firstName.toLowerCase()}${i}@parent.npv.edu`;
      const parentPassword = `parent${rollNumber}`;
      
      const totalFees = dept.code === "MCA" ? 150000 : 200000;
      const feesPaid = Math.floor(Math.random() * totalFees);
      const feesBalance = totalFees - feesPaid;
      const paymentStatus = feesBalance <= 0 ? "Paid" : "Pending";

      students.push({
        id: studentId,
        name,
        rollNumber,
        email,
        department: dept.code,
        courseCode: dept.code,
        totalFees,
        feesPaid,
        feesBalance,
        paymentStatus,
        fatherName,
        motherName,
        parentEmail,
        advisorId: "" // Will be set later
      });

      // Create user account for student
      users.push({
        id: `student_${studentId}`,
        email,
        password,
        name,
        role: "student",
        studentId
      });

      // Create parent account
      users.push({
        id: `parent_${studentId}`,
        email: parentEmail,
        password: parentPassword,
        name: `${fatherName} & ${motherName}`,
        role: "parent",
        studentId,
        childName: name,
        childRollNumber: rollNumber
      });

      // Generate attendance records (last 30 days)
      const attendancePercentage = 70 + Math.floor(Math.random() * 30); // 70-100%
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dateString = date.toISOString().split('T')[0];
        
        attendance.push({
          id: `att_${studentId}_${day}`,
          studentId,
          studentName: name,
          rollNumber,
          department: dept.code,
          date: dateString,
          status: Math.random() * 100 < attendancePercentage ? "present" : "absent"
        });
      }
    }
  });

  // Generate staff for each department
  const staff: any[] = [];
  const subjectAllocations: any[] = [];
  const staffTitles = ["Dr.", "Prof.", "Mr.", "Ms.", "Mrs."];
  const staffFirstNames = ["Rajesh", "Suresh", "Ramesh", "Mahesh", "Dinesh", "Lakshmi", "Priya", "Kavitha", "Deepa", "Divya"];
  const staffLastNames = ["Kumar", "Rao", "Reddy", "Sharma", "Nair", "Iyer", "Menon", "Patel", "Singh", "Gupta"];
  let staffIdCounter = 2000;

  departments.forEach((dept, deptIndex) => {
    const deptStaff: any[] = [];
    
    for (let i = 1; i <= 3; i++) {
      const title = staffTitles[i % staffTitles.length];
      const firstName = staffFirstNames[(deptIndex * 3 + i - 1) % staffFirstNames.length];
      const lastName = staffLastNames[(deptIndex * 3 + i - 1) % staffLastNames.length];
      const name = `${title} ${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${deptIndex + 1}@staff.npv.edu`;
      const password = `staff${dept.code}${i}`;
      const staffId = String(staffIdCounter++);

      const staffMember = {
        id: staffId,
        name,
        email,
        department: dept.code
      };
      
      staff.push(staffMember);
      deptStaff.push(staffMember);

      // Create user account for staff
      users.push({
        id: `staff_${staffId}`,
        email,
        password,
        name,
        role: "staff",
        staffId
      });
    }

    // Allocate subjects to staff (3 from own dept, 1 from related dept)
    const deptSubjects = departmentSubjects[dept.code] || [];
    const relatedDepts = departments.filter(d => d.code !== dept.code);
    const relatedDept = relatedDepts[deptIndex % relatedDepts.length];
    const crossSubjects = departmentSubjects[relatedDept.code] || [];

    deptStaff.forEach((staffMember, idx) => {
      // Allocate 3 subjects from own department
      const ownSubjects = deptSubjects.slice(0, 3);
      ownSubjects.forEach(subjectCode => {
        subjectAllocations.push({
          id: `alloc_${staffMember.id}_${subjectCode}`,
          staffId: staffMember.id,
          staffName: staffMember.name,
          department: dept.code,
          subjectCode,
          type: "primary"
        });
      });

      // Allocate 1 subject from related department
      const crossSubject = crossSubjects[idx % crossSubjects.length];
      if (crossSubject) {
        subjectAllocations.push({
          id: `alloc_${staffMember.id}_${crossSubject}`,
          staffId: staffMember.id,
          staffName: staffMember.name,
          department: relatedDept.code,
          subjectCode: crossSubject,
          type: "cross-department"
        });
      }
    });
  });

  // Allocate students to staff advisors (distribute evenly)
  const studentAllocations: any[] = [];
  departments.forEach(dept => {
    const deptStudents = students.filter(s => s.department === dept.code);
    const deptStaff = staff.filter(s => s.department === dept.code);
    
    deptStudents.forEach((student, idx) => {
      const advisor = deptStaff[idx % deptStaff.length];
      student.advisorId = advisor.id;
      
      studentAllocations.push({
        id: `stud_alloc_${student.id}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        advisorId: advisor.id,
        advisorName: advisor.name,
        department: dept.code
      });
    });
  });

  // Add admin accounts
  users.push(
    {
      id: "admin1",
      email: "admin1@npv.edu",
      password: "admin123",
      name: "Admin One",
      role: "admin1"
    },
    {
      id: "admin2",
      email: "admin2@npv.edu",
      password: "admin123",
      name: "Admin Two",
      role: "admin2"
    }
  );

  // Save to localStorage
  localStorage.setItem("departments", JSON.stringify(departments));
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("staff", JSON.stringify(staff));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("changeRequests", JSON.stringify([]));
  localStorage.setItem("attendance", JSON.stringify(attendance));
  localStorage.setItem("subjectAllocations", JSON.stringify(subjectAllocations));
  localStorage.setItem("studentAllocations", JSON.stringify(studentAllocations));

  return {
    departments,
    students,
    staff,
    users: users.filter(u => !u.role.includes("admin")),
    attendance,
    subjectAllocations,
    studentAllocations
  };
};

// Function to generate login credentials document
export const generateLoginCredentials = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const students = users.filter((u: any) => u.role === "student");
  const staffMembers = users.filter((u: any) => u.role === "staff");
  const parents = users.filter((u: any) => u.role === "parent");
  const admins = users.filter((u: any) => u.role.includes("admin"));

  return {
    admins,
    students,
    staff: staffMembers,
    parents
  };
};
