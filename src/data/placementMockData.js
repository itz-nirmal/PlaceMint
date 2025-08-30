import { UserRole, ApplicationStatus, TestType, OfferStatus, NotificationType, JobType, Department } from './enums';

// Mock data for global state store
export const mockStore = {
  currentUser: {
    id: "user_001",
    name: "Rahul Sharma",
    email: "rahul.sharma@college.edu",
    role: UserRole.STUDENT,
    profileComplete: true
  },
  notifications: [
    {
      id: "notif_001",
      type: NotificationType.APPLICATION_STATUS,
      message: "Your application for Software Engineer at TCS has been shortlisted",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "notif_002",
      type: NotificationType.TEST_REMINDER,
      message: "Aptitude test for Infosys starts in 2 hours",
      isRead: false,
      createdAt: "2024-01-15T08:00:00Z"
    },
    {
      id: "notif_003",
      type: NotificationType.DEADLINE,
      message: "Application deadline for Microsoft Software Engineer position is tomorrow",
      isRead: false,
      createdAt: "2024-01-14T16:00:00Z"
    },
    {
      id: "notif_004",
      type: NotificationType.ANNOUNCEMENT,
      message: "New placement drive by Google scheduled for next week. Register now!",
      isRead: true,
      createdAt: "2024-01-13T10:00:00Z"
    },
    {
      id: "notif_005",
      type: NotificationType.OFFER_RECEIVED,
      message: "Congratulations! You have received an offer from Amazon for SDE role",
      isRead: false,
      createdAt: "2024-01-12T14:30:00Z"
    }
  ]
};

// Mock data for API queries
export const mockQuery = {
  jobs: [
    {
      id: "job_001",
      title: "Software Engineer",
      companyName: "Tata Consultancy Services",
      location: "Bangalore",
      salary: 350000,
      type: JobType.FULL_TIME,
      deadline: "2024-02-15T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: [Department.CSE, Department.IT],
        maxBacklogs: 0
      },
      description: "Join our team as a Software Engineer and work on cutting-edge technologies.",
      requirements: ["Java", "Spring Boot", "MySQL", "REST APIs"],
      postedDate: "2024-01-10T00:00:00Z"
    },
    {
      id: "job_002",
      title: "Data Analyst Intern",
      companyName: "Infosys Limited",
      location: "Pune",
      salary: 25000,
      type: JobType.INTERNSHIP,
      deadline: "2024-02-20T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 6.5,
        allowedDepartments: [Department.CSE, Department.ECE, Department.IT],
        maxBacklogs: 1
      },
      description: "6-month internship program focusing on data analysis and visualization.",
      requirements: ["Python", "SQL", "Tableau", "Statistics"],
      postedDate: "2024-01-12T00:00:00Z"
    },
    {
      id: "job_003",
      title: "Frontend Developer",
      companyName: "Microsoft Corporation",
      location: "Hyderabad",
      salary: 800000,
      type: JobType.FULL_TIME,
      deadline: "2024-02-25T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 8.0,
        allowedDepartments: [Department.CSE, Department.IT],
        maxBacklogs: 0
      },
      description: "Build amazing user experiences with modern web technologies.",
      requirements: ["React", "TypeScript", "HTML/CSS", "JavaScript", "Git"],
      postedDate: "2024-01-08T00:00:00Z"
    },
    {
      id: "job_004",
      title: "DevOps Engineer",
      companyName: "Amazon Web Services",
      location: "Mumbai",
      salary: 1200000,
      type: JobType.FULL_TIME,
      deadline: "2024-02-18T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 7.5,
        allowedDepartments: [Department.CSE, Department.IT, Department.ECE],
        maxBacklogs: 0
      },
      description: "Manage cloud infrastructure and deployment pipelines at scale.",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
      postedDate: "2024-01-05T00:00:00Z"
    },
    {
      id: "job_005",
      title: "Machine Learning Intern",
      companyName: "Google India",
      location: "Bangalore",
      salary: 50000,
      type: JobType.INTERNSHIP,
      deadline: "2024-02-28T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 8.5,
        allowedDepartments: [Department.CSE, Department.IT],
        maxBacklogs: 0
      },
      description: "Work on cutting-edge ML projects with world-class researchers.",
      requirements: ["Python", "TensorFlow", "PyTorch", "Statistics", "Mathematics"],
      postedDate: "2024-01-03T00:00:00Z"
    },
    {
      id: "job_006",
      title: "Business Analyst",
      companyName: "Accenture",
      location: "Chennai",
      salary: 450000,
      type: JobType.FULL_TIME,
      deadline: "2024-02-22T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: [Department.CSE, Department.IT, Department.ECE, Department.EEE],
        maxBacklogs: 1
      },
      description: "Analyze business processes and drive digital transformation initiatives.",
      requirements: ["SQL", "Excel", "PowerBI", "Business Process", "Communication"],
      postedDate: "2024-01-07T00:00:00Z"
    },
    {
      id: "job_007",
      title: "Quality Assurance Engineer",
      companyName: "Wipro Technologies",
      location: "Pune",
      salary: 320000,
      type: JobType.FULL_TIME,
      deadline: "2024-02-16T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 6.5,
        allowedDepartments: [Department.CSE, Department.IT, Department.ECE],
        maxBacklogs: 2
      },
      description: "Ensure software quality through comprehensive testing strategies.",
      requirements: ["Manual Testing", "Selenium", "Java", "API Testing", "Agile"],
      postedDate: "2024-01-09T00:00:00Z"
    },
    {
      id: "job_008",
      title: "UI/UX Designer",
      companyName: "Adobe Systems",
      location: "Bangalore",
      salary: 600000,
      type: JobType.FULL_TIME,
      deadline: "2024-02-24T23:59:59Z",
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: [Department.CSE, Department.IT],
        maxBacklogs: 0
      },
      description: "Create intuitive and beautiful user experiences for millions of users.",
      requirements: ["Figma", "Adobe XD", "Photoshop", "User Research", "Prototyping"],
      postedDate: "2024-01-06T00:00:00Z"
    }
  ],
  applications: [
    {
      id: "app_001",
      jobId: "job_001",
      jobTitle: "Software Engineer",
      companyName: "Tata Consultancy Services",
      status: ApplicationStatus.SHORTLISTED,
      appliedDate: "2024-01-11T14:30:00Z",
      lastUpdated: "2024-01-14T16:45:00Z"
    },
    {
      id: "app_002",
      jobId: "job_002",
      jobTitle: "Data Analyst Intern",
      companyName: "Infosys Limited",
      status: ApplicationStatus.APPLIED,
      appliedDate: "2024-01-13T09:15:00Z",
      lastUpdated: "2024-01-13T09:15:00Z"
    },
    {
      id: "app_003",
      jobId: "job_003",
      jobTitle: "Frontend Developer",
      companyName: "Microsoft Corporation",
      status: ApplicationStatus.INTERVIEW,
      appliedDate: "2024-01-09T11:20:00Z",
      lastUpdated: "2024-01-15T10:30:00Z"
    },
    {
      id: "app_004",
      jobId: "job_004",
      jobTitle: "DevOps Engineer",
      companyName: "Amazon Web Services",
      status: ApplicationStatus.OFFER,
      appliedDate: "2024-01-06T16:45:00Z",
      lastUpdated: "2024-01-12T14:30:00Z"
    },
    {
      id: "app_005",
      jobId: "job_006",
      jobTitle: "Business Analyst",
      companyName: "Accenture",
      status: ApplicationStatus.REJECTED,
      appliedDate: "2024-01-08T13:15:00Z",
      lastUpdated: "2024-01-10T09:20:00Z"
    },
    {
      id: "app_006",
      jobId: "job_007",
      jobTitle: "Quality Assurance Engineer",
      companyName: "Wipro Technologies",
      status: ApplicationStatus.APPLIED,
      appliedDate: "2024-01-14T10:30:00Z",
      lastUpdated: "2024-01-14T10:30:00Z"
    }
  ],
  testResults: [
    {
      id: "test_001",
      type: TestType.APTITUDE,
      score: 85,
      maxScore: 100,
      completedDate: "2024-01-10T15:30:00Z",
      duration: 60,
      rank: 12
    },
    {
      id: "test_002",
      type: TestType.CODING,
      score: 78,
      maxScore: 100,
      completedDate: "2024-01-08T11:20:00Z",
      duration: 120,
      rank: 25
    },
    {
      id: "test_003",
      type: TestType.REASONING,
      score: 92,
      maxScore: 100,
      completedDate: "2024-01-05T14:45:00Z",
      duration: 45,
      rank: 8
    },
    {
      id: "test_004",
      type: TestType.ENGLISH,
      score: 88,
      maxScore: 100,
      completedDate: "2024-01-03T16:15:00Z",
      duration: 30,
      rank: 15
    },
    {
      id: "test_005",
      type: TestType.APTITUDE,
      score: 76,
      maxScore: 100,
      completedDate: "2023-12-28T10:30:00Z",
      duration: 60,
      rank: 32
    },
    {
      id: "test_006",
      type: TestType.CODING,
      score: 82,
      maxScore: 100,
      completedDate: "2023-12-25T13:20:00Z",
      duration: 120,
      rank: 18
    }
  ],
  placementStats: {
    totalStudents: 450,
    placedStudents: 320,
    placementRate: 71.1,
    averagePackage: 450000,
    highestPackage: 1200000,
    totalCompanies: 45,
    departmentWiseStats: [
      { department: Department.CSE, placed: 85, total: 120, rate: 70.8 },
      { department: Department.IT, placed: 78, total: 100, rate: 78.0 },
      { department: Department.ECE, placed: 65, total: 90, rate: 72.2 },
      { department: Department.EEE, placed: 45, total: 70, rate: 64.3 },
      { department: Department.MECH, placed: 32, total: 50, rate: 64.0 },
      { department: Department.CIVIL, placed: 15, total: 20, rate: 75.0 }
    ],
    salaryDistribution: [
      { range: "0-3 LPA", count: 45 },
      { range: "3-5 LPA", count: 120 },
      { range: "5-8 LPA", count: 85 },
      { range: "8-12 LPA", count: 45 },
      { range: "12+ LPA", count: 25 }
    ],
    topRecruiters: [
      { company: "TCS", hires: 35 },
      { company: "Infosys", hires: 28 },
      { company: "Wipro", hires: 22 },
      { company: "Accenture", hires: 18 },
      { company: "Microsoft", hires: 12 }
    ]
  },
  offers: [
    {
      id: "offer_001",
      applicationId: "app_004",
      jobId: "job_004",
      companyName: "Amazon Web Services",
      jobTitle: "DevOps Engineer",
      ctc: 1200000,
      status: OfferStatus.PENDING,
      offerDate: "2024-01-12T14:30:00Z",
      expiryDate: "2024-01-19T23:59:59Z",
      joinDate: "2024-07-01T00:00:00Z"
    },
    {
      id: "offer_002",
      applicationId: "app_001",
      jobId: "job_001",
      companyName: "Tata Consultancy Services",
      jobTitle: "Software Engineer",
      ctc: 350000,
      status: OfferStatus.ACCEPTED,
      offerDate: "2024-01-10T11:20:00Z",
      expiryDate: "2024-01-17T23:59:59Z",
      joinDate: "2024-06-15T00:00:00Z",
      acceptedDate: "2024-01-11T09:30:00Z"
    }
  ],
  companies: [
    {
      id: "comp_001",
      name: "Tata Consultancy Services",
      industry: "Information Technology",
      website: "https://www.tcs.com",
      description: "Leading global IT services, consulting and business solutions organization.",
      verified: true,
      activeJobs: 3,
      totalHires: 35
    },
    {
      id: "comp_002",
      name: "Infosys Limited",
      industry: "Information Technology",
      website: "https://www.infosys.com",
      description: "Global leader in next-generation digital services and consulting.",
      verified: true,
      activeJobs: 2,
      totalHires: 28
    },
    {
      id: "comp_003",
      name: "Microsoft Corporation",
      industry: "Technology",
      website: "https://www.microsoft.com",
      description: "Empowering every person and organization on the planet to achieve more.",
      verified: true,
      activeJobs: 1,
      totalHires: 12
    }
  ],
  students: [
    {
      id: "stud_001",
      name: "Rahul Sharma",
      email: "rahul.sharma@college.edu",
      department: Department.CSE,
      cgpa: 8.5,
      graduationYear: 2024,
      backlogs: 0,
      skills: ["Java", "React", "Node.js", "MongoDB", "Python"],
      applications: 6,
      offers: 2,
      placementStatus: "Placed"
    },
    {
      id: "stud_002",
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      department: Department.IT,
      cgpa: 9.2,
      graduationYear: 2024,
      backlogs: 0,
      skills: ["Python", "Machine Learning", "Data Science", "SQL"],
      applications: 4,
      offers: 3,
      placementStatus: "Placed"
    },
    {
      id: "stud_003",
      name: "Amit Kumar",
      email: "amit.kumar@college.edu",
      department: Department.ECE,
      cgpa: 7.8,
      graduationYear: 2024,
      backlogs: 1,
      skills: ["C++", "Embedded Systems", "VLSI", "Digital Signal Processing"],
      applications: 8,
      offers: 1,
      placementStatus: "Placed"
    }
  ]
};

// Mock data for root component props
export const mockRootProps = {
  initialRoute: "/dashboard",
  userRole: UserRole.STUDENT
};