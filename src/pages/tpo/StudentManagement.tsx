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
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Eye,
  Download,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  status: 'active' | 'placed' | 'inactive';
  applications: number;
  interviews: number;
  registered_date: string;
  placement_status: 'seeking' | 'placed' | 'not_seeking';
  resume_uploaded: boolean;
}

const StudentManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Mock data - replace with actual API calls
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@college.edu",
      phone: "+91 9876543210",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Computer Science",
      year: "2024",
      cgpa: "8.5",
      skills: ["React", "Node.js", "Python", "MongoDB"],
      status: "active",
      applications: 5,
      interviews: 2,
      registered_date: "2024-01-15",
      placement_status: "seeking",
      resume_uploaded: true
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      phone: "+91 9876543211",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Information Technology",
      year: "2024",
      cgpa: "9.2",
      skills: ["Java", "Spring Boot", "MySQL", "Angular"],
      status: "placed",
      applications: 8,
      interviews: 4,
      registered_date: "2024-01-10",
      placement_status: "placed",
      resume_uploaded: true
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit.kumar@college.edu",
      phone: "+91 9876543212",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Electronics",
      year: "2024",
      cgpa: "7.8",
      skills: ["C++", "Embedded Systems", "Arduino", "MATLAB"],
      status: "active",
      applications: 3,
      interviews: 1,
      registered_date: "2024-01-12",
      placement_status: "seeking",
      resume_uploaded: false
    },
    {
      id: "4",
      name: "Sneha Reddy",
      email: "sneha.reddy@college.edu",
      phone: "+91 9876543213",
      college: "ABC Engineering College",
      degree: "B.Tech",
      branch: "Computer Science",
      year: "2024",
      cgpa: "8.9",
      skills: ["Python", "Data Science", "Machine Learning", "SQL"],
      status: "active",
      applications: 6,
      interviews: 3,
      registered_date: "2024-01-08",
      placement_status: "seeking",
      resume_uploaded: true
    }
  ]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'tpo') {
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
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'placed': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlacementStatusColor = (status: string) => {
    switch (status) {
      case 'seeking': return 'bg-yellow-100 text-yellow-800';
      case 'placed': return 'bg-green-100 text-green-800';
      case 'not_seeking': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'placed': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleSendNotification = (studentId: string) => {
    toast({
      title: "Notification sent",
      description: "The student has been notified.",
    });
  };

  const handleDownloadResume = (studentId: string) => {
    toast({
      title: "Resume download",
      description: "Resume download will be available soon.",
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.branch.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student management...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
                <p className="text-muted-foreground">Manage student profiles and placement status</p>
              </div>
            </div>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placed Students</p>
                  <p className="text-2xl font-bold text-foreground">
                    {students.filter(s => s.status === 'placed').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Seeking Placement</p>
                  <p className="text-2xl font-bold text-foreground">
                    {students.filter(s => s.placement_status === 'seeking').length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placement Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round((students.filter(s => s.status === 'placed').length / students.length) * 100)}%
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name, email, or branch..."
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
              <option value="active">Active</option>
              <option value="placed">Placed</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Students List */}
        <div className="grid gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <Badge className={getStatusColor(student.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(student.status)}
                          <span className="capitalize">{student.status}</span>
                        </div>
                      </Badge>
                      <Badge className={getPlacementStatusColor(student.placement_status)}>
                        <span className="capitalize">{student.placement_status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {student.degree} {student.branch}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Class of {student.year}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        CGPA: {student.cgpa}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {student.resume_uploaded ? "Resume uploaded" : "No resume"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium">Applications:</span> {student.applications}
                  </div>
                  <div>
                    <span className="font-medium">Interviews:</span> {student.interviews}
                  </div>
                  <div>
                    <span className="font-medium">Registered:</span> {new Date(student.registered_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {student.college}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    
                    {student.resume_uploaded && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadResume(student.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    
                    <Button 
                      size="sm"
                      onClick={() => handleSendNotification(student.id)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Notify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" 
                  ? "No students match your search criteria." 
                  : "No students have registered yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StudentManagement;