// Sample data initialization utility
export const initializeSampleData = () => {
  // Clear all existing data
  localStorage.removeItem("students");
  localStorage.removeItem("departments");
  localStorage.removeItem("staff");
  localStorage.removeItem("users");
  localStorage.removeItem("changeRequests");

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

  // Student names pool
  const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Arnav", "Ayaan", "Krishna", "Ishaan", "Diya", "Ananya", "Saanvi", "Aadhya", "Navya", "Pari", "Sara", "Kavya", "Priya", "Riya"];
  const lastNames = ["Sharma", "Kumar", "Patel", "Singh", "Reddy", "Nair", "Iyer", "Verma", "Gupta", "Rao", "Mehta", "Joshi", "Shah", "Agarwal", "Pillai", "Menon", "Desai", "Krishnan", "Bhat", "Shetty"];

  // Generate students for each department
  const students: any[] = [];
  const users: any[] = [];
  let studentIdCounter = 1000;

  departments.forEach((dept, deptIndex) => {
    for (let i = 1; i <= 20; i++) {
      const firstName = firstNames[(deptIndex * 20 + i - 1) % firstNames.length];
      const lastName = lastNames[(deptIndex * 20 + i - 1) % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const rollNumber = `${dept.code}${String(i).padStart(3, '0')}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.npv.edu`;
      const password = `student${rollNumber}`;
      
      const totalFees = dept.code === "MCA" ? 150000 : 200000;
      const feesPaid = Math.floor(Math.random() * totalFees);
      const feesBalance = totalFees - feesPaid;
      const paymentStatus = feesBalance <= 0 ? "Paid" : "Pending";

      students.push({
        id: String(studentIdCounter++),
        name,
        rollNumber,
        email,
        department: dept.code,
        courseCode: dept.code,
        totalFees,
        feesPaid,
        feesBalance,
        paymentStatus,
        parentId: ""
      });

      // Create user account for student
      users.push({
        id: String(studentIdCounter + 10000),
        email,
        password,
        name,
        role: "student"
      });
    }
  });

  // Generate staff for each department
  const staff: any[] = [];
  const staffTitles = ["Dr.", "Prof.", "Mr.", "Ms.", "Mrs."];
  const staffFirstNames = ["Rajesh", "Suresh", "Ramesh", "Mahesh", "Dinesh", "Lakshmi", "Priya", "Kavitha", "Deepa", "Divya"];
  const staffLastNames = ["Kumar", "Rao", "Reddy", "Sharma", "Nair", "Iyer", "Menon", "Patel", "Singh", "Gupta"];
  let staffIdCounter = 2000;

  departments.forEach((dept, deptIndex) => {
    for (let i = 1; i <= 3; i++) {
      const title = staffTitles[i % staffTitles.length];
      const firstName = staffFirstNames[(deptIndex * 3 + i - 1) % staffFirstNames.length];
      const lastName = staffLastNames[(deptIndex * 3 + i - 1) % staffLastNames.length];
      const name = `${title} ${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${deptIndex + 1}@staff.npv.edu`;
      const password = `staff${dept.code}${i}`;

      staff.push({
        id: String(staffIdCounter++),
        name,
        email,
        department: dept.code
      });

      // Create user account for staff
      users.push({
        id: String(staffIdCounter + 10000),
        email,
        password,
        name,
        role: "staff"
      });
    }
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

  return {
    departments,
    students,
    staff,
    users: users.filter(u => !u.role.includes("admin")) // Don't return admin credentials in the list
  };
};

// Function to generate login credentials document
export const generateLoginCredentials = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const students = users.filter((u: any) => u.role === "student");
  const staffMembers = users.filter((u: any) => u.role === "staff");
  const admins = users.filter((u: any) => u.role.includes("admin"));

  return {
    admins,
    students,
    staff: staffMembers
  };
};
