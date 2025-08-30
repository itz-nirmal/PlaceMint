import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  X
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary_range: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  posted_date: string;
  deadline: string;
  status: 'draft' | 'active' | 'closed' | 'expired';
  applications_count: number;
  views_count: number;
}

const JobPostings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time" as const,
    salary_range: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    deadline: ""
  });

  // Mock data - replace with actual API calls
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: "1",
      title: "Senior Software Developer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "full-time",
      salary_range: "₹12-18 LPA",
      description: "We are looking for an experienced software developer to join our engineering team...",
      requirements: ["5+ years experience", "React", "Node.js", "TypeScript", "AWS"],
      responsibilities: ["Lead development projects", "Mentor junior developers", "Code reviews"],
      benefits: ["Health insurance", "Flexible working hours", "Learning budget"],
      posted_date: "2024-01-15",
      deadline: "2024-02-15",
      status: "active",
      applications_count: 45,
      views_count: 234
    },
    {
      id: "2",
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "Mumbai, India",
      type: "internship",
      salary_range: "₹25,000/month",
      description: "Great opportunity for students to gain hands-on experience in frontend development...",
      requirements: ["React", "JavaScript", "HTML/CSS", "Git"],
      responsibilities: ["Build user interfaces", "Collaborate with design team", "Write clean code"],
      benefits: ["Mentorship", "Certificate", "Potential full-time offer"],
      posted_date: "2024-01-10",
      deadline: "2024-02-10",
      status: "active",
      applications_count: 78,
      views_count: 456
    },
    {
      id: "3",
      title: "Data Analyst",
      department: "Analytics",
      location: "Pune, India",
      type: "full-time",
      salary_range: "₹8-12 LPA",
      description: "Join our analytics team to help drive data-driven decisions...",
      requirements: ["Python", "SQL", "Excel", "Tableau", "Statistics"],
      responsibilities: ["Analyze business data", "Create reports", "Present insights"],
      benefits: ["Health insurance", "Performance bonus", "Remote work options"],
      posted_date: "2024-01-12",
      deadline: "2024-02-12",
      status: "closed",
      applications_count: 32,
      views_count: 189
    }
  ]);

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'draft': return <AlertCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCreateJob = () => {
    // Mock job creation
    const job: JobPosting = {
      id: Date.now().toString(),
      ...newJob,
      requirements: newJob.requirements.split(',').map(r => r.trim()),
      responsibilities: newJob.responsibilities.split(',').map(r => r.trim()),
      benefits: newJob.benefits.split(',').map(b => b.trim()),
      posted_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      applications_count: 0,
      views_count: 0
    };

    setJobPostings([job, ...jobPostings]);
    setShowCreateForm(false);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "full-time",
      salary_range: "",
      description: "",
      requirements: "",
      responsibilities: "",
      benefits: "",
      deadline: ""
    });

    toast({
      title: "Job posting created",
      description: "Your job posting has been created successfully.",
    });
  };

  const handleDeleteJob = (jobId: string) => {
    setJobPostings(jobPostings.filter(job => job.id !== jobId));
    toast({
      title: "Job posting deleted",
      description: "The job posting has been removed.",
    });
  };

  const handleStatusChange = (jobId: string, newStatus: JobPosting['status']) => {
    setJobPostings(jobPostings.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    toast({
      title: "Status updated",
      description: `Job posting status changed to ${newStatus}.`,
    });
  };

  const filteredJobs = jobPostings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job postings...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
                <p className="text-muted-foreground">Manage your job postings and applications</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Job Posting
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{jobPostings.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobPostings.filter(j => j.status === 'active').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobPostings.reduce((sum, job) => sum + job.applications_count, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobPostings.reduce((sum, job) => sum + job.views_count, 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search job postings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Create Job Form */}
        {showCreateForm && (
          <Card className="bg-white border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create New Job Posting</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g., Senior Software Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    placeholder="e.g., Engineering"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g., Bangalore, India"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <select
                    id="type"
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="salary_range">Salary Range</Label>
                  <Input
                    id="salary_range"
                    value={newJob.salary_range}
                    onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                    placeholder="e.g., ₹12-18 LPA"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe the role and what you're looking for..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                  <Textarea
                    id="requirements"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    placeholder="e.g., React, Node.js, 3+ years experience"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="responsibilities">Responsibilities (comma-separated)</Label>
                  <Textarea
                    id="responsibilities"
                    value={newJob.responsibilities}
                    onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                    placeholder="e.g., Lead projects, Code reviews, Mentoring"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                  <Textarea
                    id="benefits"
                    value={newJob.benefits}
                    onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                    placeholder="e.g., Health insurance, Flexible hours"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateJob}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Job Posting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Postings List */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge className={getStatusColor(job.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {job.department}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary_range}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{req}</Badge>
                      ))}
                      {job.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{job.requirements.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Benefits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{benefit}</Badge>
                      ))}
                      {job.benefits.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{job.benefits.length - 2} more</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Applications:</span>
                      <span className="font-medium">{job.applications_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span className="font-medium">{job.views_count}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Posted: {new Date(job.posted_date).toLocaleDateString()} • 
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Applications
                    </Button>
                    
                    {job.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusChange(job.id, 'active')}
                      >
                        Publish
                      </Button>
                    )}
                    
                    {job.status === 'active' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(job.id, 'closed')}
                      >
                        Close
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Job Postings Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No job postings match your search criteria." : "You haven't created any job postings yet."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Job Posting
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default JobPostings;