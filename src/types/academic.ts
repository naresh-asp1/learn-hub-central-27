// Academic data types

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: number;
  credits: number;
  type: 'Theory' | 'Practical' | 'Lab';
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  assessmentType: 'Internal1' | 'Internal2' | 'Assignment' | 'EndSem';
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  academicYear: string;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: number;
  subjects: SubjectPerformance[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  cgpa: number;
  grade: string;
}

export interface SubjectPerformance {
  subjectCode: string;
  subjectName: string;
  credits: number;
  internal1: number;
  internal2: number;
  assignment: number;
  endSem: number;
  total: number;
  maxTotal: number;
  percentage: number;
  grade: string;
  gradePoint: number;
}

// Grade calculation utility
export const calculateGrade = (percentage: number): { grade: string; gradePoint: number } => {
  if (percentage >= 90) return { grade: 'O', gradePoint: 10 };
  if (percentage >= 80) return { grade: 'A+', gradePoint: 9 };
  if (percentage >= 70) return { grade: 'A', gradePoint: 8 };
  if (percentage >= 60) return { grade: 'B+', gradePoint: 7 };
  if (percentage >= 50) return { grade: 'B', gradePoint: 6 };
  if (percentage >= 40) return { grade: 'C', gradePoint: 5 };
  return { grade: 'F', gradePoint: 0 };
};

// Calculate CGPA from subject performances
export const calculateCGPA = (subjects: SubjectPerformance[]): number => {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const weightedGradePoints = subjects.reduce((sum, s) => sum + (s.gradePoint * s.credits), 0);
  return totalCredits > 0 ? Number((weightedGradePoints / totalCredits).toFixed(2)) : 0;
};
