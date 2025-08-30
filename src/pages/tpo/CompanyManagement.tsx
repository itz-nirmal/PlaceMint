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
  Plus, 
  Building, 
  MapPin, 
  Users, 
  Briefcase,
  Mail,
  Phone,
  Globe,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  industry: string;
  size: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  registered_date: string;
  total_jobs: number;
  active_jobs: number;
}

const CompanyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - replace with actual API calls
  const [companies] = useState<Company[]>([
    {
      id: "1",
      name: "TechCorp Solutions",
      email: "hr@techcorp.com",
      phone: "+91 9876543210",
      website: "https://techcorp.com",
      location: "Bangalore, India",
      industry: "Information Technology",
      size: "500-1000",
      description: "Leading software development company specializing in web and mobile applications.",
      status: "active",
      registered_date: "2024-01-15",
      total_jobs: 12,
      active_jobs: 8
    },
    {
      id: "2",
      name: "Digital Innovations",
      email: "careers@digitalinnovations.com",
      phone: "+91 9876543211",
      website: "https://digitalinnovations.com",
      location: "Mumbai, India",
      industry: "Digital Marketing",
      size: "100-500",
      description: "Creative digital marketing agency helping brands grow online.",
      status: "active",
      registered_date: "2024-01-10",
      total_jobs: 6,
      active_jobs: 4
    },
    {
      id: "3",
      name: "Analytics Pro",
      email: "jobs@analyticspro.com",
      phone: "+91 9876543212",
      website: "https://analyticspro.com",
      location: "Pune, India",
      industry: "Data Analytics",
      size: "50-100",
      description: "Data analytics consultancy providing insights for business growth.",
      status: "pending",
      registered_date: "2024-01-20",
      total_jobs: 3,
      active_jobs: 0
    },
    {
      id: "4",
      name: "StartupXYZ",
      email: "team@startupxyz.com",
      phone: "+91 9876543213",
      website: "https://startupxyz.com",
      location: "Hyderabad, India",
      industry: "FinTech",
      size: "10-50",
      description: "Innovative fintech startup revolutionizing digital payments.",
      status: "inactive",
      registered_date: "2024-01-05",
      total_jobs: 2,
      active_jobs: 0
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApprove = (companyId: string) => {
    toast({
      title: "Company approved",
      description: "The company has been approved and can now post jobs.",
    });
  };

  const handleReject = (companyId: string) => {
    toast({
      title: "Company rejected",
      description: "The company registration has been rejected.",
    });
  };

  const handleDeactivate = (companyId: string) => {
    toast({
      title: "Company deactivated",
      description: "The company has been deactivated.",
    });
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company management...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Company Management</h1>
                <p className="text-muted-foreground">Manage registered companies and their status</p>
              </div>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
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
                  <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold text-foreground">{companies.length}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold text-foreground">
                    {companies.filter(c => c.status === 'active').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold text-foreground">
                    {companies.filter(c => c.status === 'pending').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Total Job Posts</p>
                  <p className="text-2xl font-bold text-foreground">
                    {companies.reduce((sum, c) => sum + c.total_jobs, 0)}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Companies List */}
        <div className="grid gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <Badge className={getStatusColor(company.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(company.status)}
                          <span className="capitalize">{company.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        {company.industry}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {company.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {company.size} employees
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {company.active_jobs} active jobs
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{company.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Website
                    </a>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Registered: {new Date(company.registered_date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {company.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(company.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(company.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {company.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeactivate(company.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No companies match your search criteria." : "No companies have registered yet."}
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Company
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CompanyManagement;