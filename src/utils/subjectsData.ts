// Sample subjects for each department
import { Subject } from "@/types/academic";

export const departmentSubjects: Record<string, Subject[]> = {
  "MCA": [
    // Semester 1
    { id: "mca-1", name: "Data Structures and Algorithms", code: "MCA101", department: "MCA", semester: 1, credits: 4, type: "Theory" },
    { id: "mca-2", name: "Database Management Systems", code: "MCA102", department: "MCA", semester: 1, credits: 4, type: "Theory" },
    { id: "mca-3", name: "Computer Networks", code: "MCA103", department: "MCA", semester: 1, credits: 3, type: "Theory" },
    { id: "mca-4", name: "Programming Lab", code: "MCA104", department: "MCA", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "mca-5", name: "Advanced Java Programming", code: "MCA201", department: "MCA", semester: 2, credits: 4, type: "Theory" },
    { id: "mca-6", name: "Machine Learning", code: "MCA202", department: "MCA", semester: 2, credits: 4, type: "Theory" },
    { id: "mca-7", name: "Cloud Computing", code: "MCA203", department: "MCA", semester: 2, credits: 3, type: "Theory" },
    { id: "mca-8", name: "AI Lab", code: "MCA204", department: "MCA", semester: 2, credits: 2, type: "Lab" },
  ],
  "BE-CSE": [
    // Semester 1
    { id: "cse-1", name: "Programming for Problem Solving", code: "CSE101", department: "BE-CSE", semester: 1, credits: 4, type: "Theory" },
    { id: "cse-2", name: "Engineering Mathematics I", code: "CSE102", department: "BE-CSE", semester: 1, credits: 4, type: "Theory" },
    { id: "cse-3", name: "Engineering Physics", code: "CSE103", department: "BE-CSE", semester: 1, credits: 3, type: "Theory" },
    { id: "cse-4", name: "Basic Electrical Engineering", code: "CSE104", department: "BE-CSE", semester: 1, credits: 3, type: "Theory" },
    { id: "cse-5", name: "Programming Lab", code: "CSE105", department: "BE-CSE", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "cse-6", name: "Data Structures", code: "CSE201", department: "BE-CSE", semester: 2, credits: 4, type: "Theory" },
    { id: "cse-7", name: "Digital Logic Design", code: "CSE202", department: "BE-CSE", semester: 2, credits: 4, type: "Theory" },
    { id: "cse-8", name: "Engineering Mathematics II", code: "CSE203", department: "BE-CSE", semester: 2, credits: 4, type: "Theory" },
    { id: "cse-9", name: "Object Oriented Programming", code: "CSE204", department: "BE-CSE", semester: 2, credits: 3, type: "Theory" },
  ],
  "BE-IT": [
    // Semester 1
    { id: "it-1", name: "Programming in C", code: "IT101", department: "BE-IT", semester: 1, credits: 4, type: "Theory" },
    { id: "it-2", name: "Mathematics for IT", code: "IT102", department: "BE-IT", semester: 1, credits: 4, type: "Theory" },
    { id: "it-3", name: "Digital Electronics", code: "IT103", department: "BE-IT", semester: 1, credits: 3, type: "Theory" },
    { id: "it-4", name: "Communication Skills", code: "IT104", department: "BE-IT", semester: 1, credits: 3, type: "Theory" },
    { id: "it-5", name: "Programming Lab", code: "IT105", department: "BE-IT", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "it-6", name: "Web Technologies", code: "IT201", department: "BE-IT", semester: 2, credits: 4, type: "Theory" },
    { id: "it-7", name: "Database Systems", code: "IT202", department: "BE-IT", semester: 2, credits: 4, type: "Theory" },
    { id: "it-8", name: "Computer Networks", code: "IT203", department: "BE-IT", semester: 2, credits: 4, type: "Theory" },
    { id: "it-9", name: "Software Engineering", code: "IT204", department: "BE-IT", semester: 2, credits: 3, type: "Theory" },
  ],
  "BE-BME": [
    // Semester 1
    { id: "bme-1", name: "Human Anatomy and Physiology", code: "BME101", department: "BE-BME", semester: 1, credits: 4, type: "Theory" },
    { id: "bme-2", name: "Engineering Mathematics", code: "BME102", department: "BE-BME", semester: 1, credits: 4, type: "Theory" },
    { id: "bme-3", name: "Basic Electrical Engineering", code: "BME103", department: "BE-BME", semester: 1, credits: 3, type: "Theory" },
    { id: "bme-4", name: "Engineering Physics", code: "BME104", department: "BE-BME", semester: 1, credits: 3, type: "Theory" },
    { id: "bme-5", name: "Biology Lab", code: "BME105", department: "BE-BME", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "bme-6", name: "Medical Electronics", code: "BME201", department: "BE-BME", semester: 2, credits: 4, type: "Theory" },
    { id: "bme-7", name: "Biomaterials", code: "BME202", department: "BE-BME", semester: 2, credits: 4, type: "Theory" },
    { id: "bme-8", name: "Signal Processing", code: "BME203", department: "BE-BME", semester: 2, credits: 4, type: "Theory" },
    { id: "bme-9", name: "Medical Instrumentation", code: "BME204", department: "BE-BME", semester: 2, credits: 3, type: "Theory" },
  ],
  "BE-MECH": [
    // Semester 1
    { id: "mech-1", name: "Engineering Mechanics", code: "MECH101", department: "BE-MECH", semester: 1, credits: 4, type: "Theory" },
    { id: "mech-2", name: "Engineering Graphics", code: "MECH102", department: "BE-MECH", semester: 1, credits: 4, type: "Theory" },
    { id: "mech-3", name: "Mathematics I", code: "MECH103", department: "BE-MECH", semester: 1, credits: 4, type: "Theory" },
    { id: "mech-4", name: "Basic Electrical Engineering", code: "MECH104", department: "BE-MECH", semester: 1, credits: 3, type: "Theory" },
    { id: "mech-5", name: "Workshop Practice", code: "MECH105", department: "BE-MECH", semester: 1, credits: 2, type: "Practical" },
    // Semester 2
    { id: "mech-6", name: "Thermodynamics", code: "MECH201", department: "BE-MECH", semester: 2, credits: 4, type: "Theory" },
    { id: "mech-7", name: "Strength of Materials", code: "MECH202", department: "BE-MECH", semester: 2, credits: 4, type: "Theory" },
    { id: "mech-8", name: "Manufacturing Processes", code: "MECH203", department: "BE-MECH", semester: 2, credits: 4, type: "Theory" },
    { id: "mech-9", name: "Fluid Mechanics", code: "MECH204", department: "BE-MECH", semester: 2, credits: 3, type: "Theory" },
  ],
  "BE-CIVIL": [
    // Semester 1
    { id: "civil-1", name: "Engineering Mechanics", code: "CIVIL101", department: "BE-CIVIL", semester: 1, credits: 4, type: "Theory" },
    { id: "civil-2", name: "Building Materials", code: "CIVIL102", department: "BE-CIVIL", semester: 1, credits: 4, type: "Theory" },
    { id: "civil-3", name: "Engineering Mathematics", code: "CIVIL103", department: "BE-CIVIL", semester: 1, credits: 4, type: "Theory" },
    { id: "civil-4", name: "Surveying", code: "CIVIL104", department: "BE-CIVIL", semester: 1, credits: 3, type: "Theory" },
    { id: "civil-5", name: "Surveying Lab", code: "CIVIL105", department: "BE-CIVIL", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "civil-6", name: "Structural Analysis", code: "CIVIL201", department: "BE-CIVIL", semester: 2, credits: 4, type: "Theory" },
    { id: "civil-7", name: "Concrete Technology", code: "CIVIL202", department: "BE-CIVIL", semester: 2, credits: 4, type: "Theory" },
    { id: "civil-8", name: "Geotechnical Engineering", code: "CIVIL203", department: "BE-CIVIL", semester: 2, credits: 4, type: "Theory" },
    { id: "civil-9", name: "Hydraulics", code: "CIVIL204", department: "BE-CIVIL", semester: 2, credits: 3, type: "Theory" },
  ],
  "BE-EEE": [
    // Semester 1
    { id: "eee-1", name: "Circuit Theory", code: "EEE101", department: "BE-EEE", semester: 1, credits: 4, type: "Theory" },
    { id: "eee-2", name: "Electromagnetic Fields", code: "EEE102", department: "BE-EEE", semester: 1, credits: 4, type: "Theory" },
    { id: "eee-3", name: "Engineering Mathematics", code: "EEE103", department: "BE-EEE", semester: 1, credits: 4, type: "Theory" },
    { id: "eee-4", name: "Electronic Devices", code: "EEE104", department: "BE-EEE", semester: 1, credits: 3, type: "Theory" },
    { id: "eee-5", name: "Electrical Lab", code: "EEE105", department: "BE-EEE", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "eee-6", name: "Power Systems", code: "EEE201", department: "BE-EEE", semester: 2, credits: 4, type: "Theory" },
    { id: "eee-7", name: "Electrical Machines", code: "EEE202", department: "BE-EEE", semester: 2, credits: 4, type: "Theory" },
    { id: "eee-8", name: "Control Systems", code: "EEE203", department: "BE-EEE", semester: 2, credits: 4, type: "Theory" },
    { id: "eee-9", name: "Power Electronics", code: "EEE204", department: "BE-EEE", semester: 2, credits: 3, type: "Theory" },
  ],
  "BE-ECE": [
    // Semester 1
    { id: "ece-1", name: "Signals and Systems", code: "ECE101", department: "BE-ECE", semester: 1, credits: 4, type: "Theory" },
    { id: "ece-2", name: "Electronic Circuits", code: "ECE102", department: "BE-ECE", semester: 1, credits: 4, type: "Theory" },
    { id: "ece-3", name: "Engineering Mathematics", code: "ECE103", department: "BE-ECE", semester: 1, credits: 4, type: "Theory" },
    { id: "ece-4", name: "Network Theory", code: "ECE104", department: "BE-ECE", semester: 1, credits: 3, type: "Theory" },
    { id: "ece-5", name: "Electronics Lab", code: "ECE105", department: "BE-ECE", semester: 1, credits: 2, type: "Lab" },
    // Semester 2
    { id: "ece-6", name: "Digital Signal Processing", code: "ECE201", department: "BE-ECE", semester: 2, credits: 4, type: "Theory" },
    { id: "ece-7", name: "Communication Systems", code: "ECE202", department: "BE-ECE", semester: 2, credits: 4, type: "Theory" },
    { id: "ece-8", name: "Microprocessors", code: "ECE203", department: "BE-ECE", semester: 2, credits: 4, type: "Theory" },
    { id: "ece-9", name: "VLSI Design", code: "ECE204", department: "BE-ECE", semester: 2, credits: 3, type: "Theory" },
  ],
};

export const initializeSubjects = () => {
  const allSubjects: Subject[] = [];
  Object.values(departmentSubjects).forEach(subjects => {
    allSubjects.push(...subjects);
  });
  localStorage.setItem("subjects", JSON.stringify(allSubjects));
  return allSubjects;
};
