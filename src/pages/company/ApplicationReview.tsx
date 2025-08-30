import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Users, 
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Send
} from "lucide-react";

interface Application {
  id: string;
  student_id: string;
  job_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  job_title: string;
  applied_date: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'selected';
  resume_url?: string;
  cover_letter?: string;
  rating?: number;
  notes?: string;
}

const ApplicationReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJob, setFilterJob] = useState<string>("all");
  
  // Mock data - replace with actual API calls
  const [applications] = useState<Application[]>([
    {
      id: "1",
      student_id: "s1",
      job_id: "j1",
      student_name: "Rahul Sharma",
      student_email: "rahul.sharma@college.edu",
      student_phone: "+91 9876543210",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Computer Science",
      year: "2024",
      cgpa: "8.5",
      skills: ["React", "Node.js", "Python", "MongoDB"],
      job_title: "Senior Software Developer",
      applied_date: "2024-01-16",
      status: "pending",
      resume_url: "/resumes/rahul-sharma.pdf",
      cover_letter: "I am excited to apply for this position...",
      rating: 4
    },
    {
      id: "2",
      student_id: "s2",
      job_id: "j1",
      student_name: "Priya Patel",
      student_email: "priya.patel@college.edu",
      student_phone: "+91 9876543211",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Information Technology",
      year: "2024",
      cgpa: "9.2",
      skills: ["Java", "Spring Boot", "MySQL", "Angular"],
      job_title: "Senior Software Developer",
      applied_date: "2024-01-17",
      status: "shortlisted",
      resume_url: "/resumes/priya-patel.pdf",
      cover_letter: "With my strong background in software development...",
      rating: 5,
      notes: "Excellent candidate with strong technical skills"
    },
    {
      id: "3",
      student_id: "s3",
      job_id: "j2",
      student_name: "Amit Kumar",
      student_email: "amit.kumar@college.edu",
      student_phone: "+91 9876543212",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Electronics",
      year: "2024",
      cgpa: "7.8",
      skills: ["C++", "Embedded Systems", "Arduino", "MATLAB"],
      job_title: "Frontend Developer Intern",
      applied_date: "2024-01-18",
      status: "reviewed",
      resume_url: "/resumes/amit-kumar.pdf",
      rating: 3,
      notes: "Good potential but needs more frontend experience"
    },
    {
      id: "4",
      student_id: "s4",
      job_id: "j3",
      student_name: "Sneha Reddy",
      student_email: "sneha.reddy@college.edu",
      student_phone: "+91 9876543213",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Computer Science",
      year: "2024",
      cgpa: "8.9",
      skills: ["Python", "Data Science", "Machine Learning", "SQL"],
      job_title: "Data Analyst",
      applied_date: "2024-01-19",
      status: "selected",
      resume_url: "/resumes/sneha-reddy.pdf",
      cover_letter: "I am passionate about data analysis...",
      rating: 5,
      notes: "Perfect fit for the role. Strong analytical skills."
    }
  ]);

  const jobTitles = [...new Set(applications.map(app => app.job_title))];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'company') {
        navigate("/auth");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'selected': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'selected': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: Application['status']) => {
    toast({
      title: "Status updated",
      description: `Application status changed to ${newStatus}.`,
    });
  };

  const handleDownloadResume = (applicationId: string) => {
    toast({
      title: "Resume download",
      description: "Resume download will be available soon.",
    });
  };

  const handleSendMessage = (applicationId: string) => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to the student.",
    });
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesJob = filterJob === "all" || app.job_title === filterJob;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Application Review</h1>
                <p className="text-muted-foreground">Review and manage job applications</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter(a => a.status === 'shortlisted').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selected</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter(a => a.status === 'selected').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter(a => a.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications by student name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="selected">Selected</option>
            </select>
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Jobs</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{application.student_name}</CardTitle>
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </Badge>
                      {application.rating && renderStars(application.rating)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {application.job_title}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {application.degree} {application.branch}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        CGPA: {application.cgpa}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Applied: {new Date(application.applied_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{application.student_email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{application.student_phone}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {application.cover_letter && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Cover Letter:</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {application.cover_letter}
                    </p>
                  </div>
                )}

                {application.notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Internal Notes:</h4>
                    <p className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                      {application.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {application.college} • Class of {application.year}
                  </div>
                  
                  <div className="flex space-x-2">
                    {application.resume_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadResume(application.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendMessage(application.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    
                    {application.status === 'pending' && (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(application.id, 'shortlisted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Shortlist
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(application.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {application.status === 'shortlisted' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusChange(application.id, 'selected')}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterJob !== "all"
                  ? "No applications match your search criteria."
                  : "No applications have been received yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ApplicationReview;