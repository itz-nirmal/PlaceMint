import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRealtimeSubscriptions } from "@/hooks/useRealtime";
import { useProfile } from "@/hooks/useDatabase";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TPOLogin from "./pages/TPOLogin";
import CompanyLogin from "./pages/CompanyLogin";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentProfile from "./pages/student/StudentProfile";
import JobApplications from "./pages/student/JobApplications";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import PracticeTests from "./pages/student/PracticeTests";
import TestInterface from "./pages/student/TestInterface";
import TestResult from "./pages/student/TestResult";
import Analytics from "./pages/student/Analytics";

// TPO Pages
import CompanyManagement from "./pages/tpo/CompanyManagement";
import StudentManagement from "./pages/tpo/StudentManagement";
import TestManagement from "./pages/tpo/TestManagement";

// Company Pages
import JobPostings from "./pages/company/JobPostings";
import ApplicationReview from "./pages/company/ApplicationReview";

const queryClient = new QueryClient();

// Component to handle real-time subscriptions
const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: profile } = useProfile();
  const { unreadCount } = useRealtimeSubscriptions(profile?.id, profile?.role);

  // You can use unreadCount here for global state management if needed
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RealtimeProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tpo-login" element={<TPOLogin />} />
            <Route path="/company-login" element={<CompanyLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Student Routes */}
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/applications" element={<JobApplications />} />
            <Route path="/student/resume" element={<ResumeBuilder />} />
            <Route path="/student/tests" element={<PracticeTests />} />
            <Route path="/student/test/:testId" element={<TestInterface />} />
            <Route path="/student/test-result/:testId" element={<TestResult />} />
            <Route path="/student/analytics" element={<Analytics />} />
            
            {/* TPO Routes */}
            <Route path="/tpo/companies" element={<CompanyManagement />} />
            <Route path="/tpo/students" element={<StudentManagement />} />
            <Route path="/tpo/tests" element={<TestManagement />} />
            
            {/* Company Routes */}
            <Route path="/company/jobs" element={<JobPostings />} />
            <Route path="/company/applications" element={<ApplicationReview />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RealtimeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;