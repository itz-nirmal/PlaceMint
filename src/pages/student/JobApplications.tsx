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
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building,
  Calendar,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted_date: string;
  deadline: string;
  status: 'open' | 'closed';
}

interface Application {
  id: string;
  job_id: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'selected';
  applied_date: string;
  job: JobPosting;
}

const JobApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'applied'>('available');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - replace with actual API calls
  const [availableJobs] = useState<JobPosting[]>([
    {
      id: "1",
      title: "Software Developer",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹6-8 LPA",
      description: "We are looking for a passionate software developer to join our team...",
      requirements: ["React", "Node.js", "JavaScript", "MongoDB"],
      posted_date: "2024-01-15",
      deadline: "2024-02-15",
      status: "open"
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "Digital Innovations",
      location: "Mumbai, India",
      type: "Full-time",
      salary: "₹5-7 LPA",
      description: "Join our frontend team to build amazing user experiences...",
      requirements: ["React", "TypeScript", "CSS", "HTML"],
      posted_date: "2024-01-10",
      deadline: "2024-02-10",
      status: "open"
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Pune, India",
      type: "Full-time",
      salary: "₹4-6 LPA",
      description: "Analyze data to drive business decisions...",
      requirements: ["Python", "SQL", "Excel", "Tableau"],
      posted_date: "2024-01-12",
      deadline: "2024-02-12",
      status: "open"
    }
  ]);

  const [applications] = useState<Application[]>([
    {
      id: "1",
      job_id: "1",
      status: "pending",
      applied_date: "2024-01-16",
      job: availableJobs[0]
    }
  ]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleApply = async (jobId: string) => {
    // Mock application logic
    toast({
      title: "Application submitted!",
      description: "Your application has been sent to the company.",
    });
  };

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
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'selected': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredJobs = availableJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job applications...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Job Applications</h1>
                <p className="text-muted-foreground">Browse and apply to available positions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
          <Button
            variant={activeTab === 'available' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('available')}
          >
            Available Jobs ({availableJobs.length})
          </Button>
          <Button
            variant={activeTab === 'applied' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('applied')}
          >
            My Applications ({applications.length})
          </Button>
        </div>

        {activeTab === 'available' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Available Jobs */}
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {job.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Posted: {new Date(job.posted_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApply(job.id)}
                          disabled={applications.some(app => app.job_id === job.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {applications.some(app => app.job_id === job.id) ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'applied' && (
          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't applied to any jobs yet. Browse available positions to get started.
                  </p>
                  <Button onClick={() => setActiveTab('available')}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => (
                <Card key={application.id} className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{application.job.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {application.job.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.job.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied: {new Date(application.applied_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{application.job.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {application.job.salary}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {application.job.type}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Application
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobApplications;