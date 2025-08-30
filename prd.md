# Placement Preparation Tracker – Product Requirements Document (PRD)

## 1. Overview
The Placement Preparation Tracker is a web application designed to streamline campus placement workflows for **Students**, **Training & Placement Officers (TPO/Admin)**, and **Company Recruiters (HR)**.

**Tech Stack:**
- **Frontend:** React JS, Next.js, JavaScript
- **Backend:** Node.js, Express, Supabase (PostgreSQL + Auth)
- **Notifications:** In-app alerts only (no SMS/email)

The system focuses on:
- High performance (fast loading, minimal latency)
- Secure access (role-based, row-level security)
- Seamless user experience across roles

---

## 2. User Roles
### 2.1 Student
- Build and maintain resume
- Apply for jobs/internships
- Track applications, offers, and placement status
- Take practice tests (aptitude, coding, reasoning)
- View analytics of scores and skills
- Receive in-app alerts (deadlines, status updates)

### 2.2 TPO/Admin
- Manage student records and eligibility rules
- Approve company sign-ups and job postings
- Schedule exams/interviews and send announcements
- Monitor placement metrics via dashboards
- Generate and export reports

### 2.3 Company (Recruiter/HR)
- Post job and internship openings
- View and shortlist student applications
- Schedule interviews/tests
- Manage offers and hiring outcomes
- Access analytics on applicant pool and success rates

---

## 3. Functional Modules
### 3.1 Authentication & Profiles
- Role-based login (Student, TPO, Company)
- JWT-based authentication with Supabase Auth
- User profile completion prompts post-login

### 3.2 Resume Builder
- Multi-section guided form (education, skills, projects)
- Live preview and PDF export
- Multiple template options with saved versions

### 3.3 Job Application Tracking
- Students: Browse, filter, and apply to eligible jobs
- Status tracking: Applied → Shortlisted → Interview → Offer → Joined
- Recruiters: View and manage applicant pool

### 3.4 Placement Rules Enforcement
- Rules configured by TPO (CGPA, backlogs, department, package tiers)
- Automatic eligibility checks during job browsing and application

### 3.5 Practice & Tests
- Aptitude, reasoning, coding, and English mock tests
- Real-time scoring and analytics
- Leaderboards for motivation

### 3.6 Notifications
- In-app alerts for deadlines, test schedules, application status changes
- Admin announcements displayed on dashboard

### 3.7 Analytics & Reporting
- Placement rate charts, student performance insights
- Exportable reports (CSV, PDF)

### 3.8 Offer Management
- Recruiters send offers with role and CTC details
- Students accept/decline offers in-app
- Automatic placement status updates

---

## 4. Use Cases
### Student
- Register, complete profile, create resume
- Browse and apply to jobs
- Take mock exams and review scores
- Accept or decline offers

### TPO/Admin
- Approve job postings and student eligibility
- Send announcements to student groups
- View placement statistics and generate reports

### Company
- Post jobs with eligibility details
- View applicant data, shortlist candidates
- Schedule interviews and issue offers

---

## 5. Data Model
Key tables:
- **Users:** user_id, name, email, role, password_hash
- **Students:** student_id, cgpa, department, resume_id
- **Companies:** company_id, company_name, contact_person, verified
- **Jobs:** job_id, company_id, title, description, criteria, deadline
- **Applications:** application_id, student_id, job_id, status, timestamps
- **Exams:** exam_id, student_id, type, score
- **Notifications:** notification_id, user_id, message, is_read
- **Offers:** offer_id, application_id, company_id, student_id, ctc, status
- **PlacementRules:** rule_id, config (JSON), active

---

## 6. System Architecture
- **Frontend:** Next.js for SSR/ISR and static optimization. React components for dynamic views.
- **Backend:** Node.js/Express APIs for CRUD operations.
- **Database:** Supabase (PostgreSQL) with Row-Level Security (RLS).
- **Realtime:** Supabase Realtime for notifications and live dashboards.

---

## 7. UI/UX Flow
- **Authentication Flow:**  
  - User registers or logs in → Dashboard based on role.
- **Resume Builder:**  
  - Stepwise form → Live preview → PDF export.
- **Job Application:**  
  - Browse jobs → View details → Apply → Track status.
- **Offer Management:**  
  - Notification → Review → Accept/Decline → Status update.

*(Wireframes or mockups can be linked as separate documents.)*

---

## 8. Performance Requirements
- API response time < 200 ms
- Page load time < 2 seconds
- Use CDN for static assets
- Database queries indexed and optimized
- Gzip compression enabled

---

## 9. Security Requirements
- HTTPS for all communications
- Input validation and sanitization
- JWT authentication with expiry and refresh mechanism
- Row-Level Security (RLS) for PostgreSQL
- Secure HTTP headers via Helmet
- Encrypted password storage (bcrypt)

---

## 10. Non-Functional Requirements
- Scalable to handle concurrent user load
- Responsive UI (desktop and mobile)
- Modular code structure for easy maintenance
- Detailed logging and error handling

---

## 11. Future Enhancements
- AI-based resume scoring
- Interview scheduling integration (calendar sync)
- Company review and feedback module

---

## 12. References
- [Next.js Performance Optimization](https://nextjs.org/docs)
- [Supabase Security & RLS](https://supabase.com/docs)
- [Node.js Best Practices](https://expressjs.com/)
