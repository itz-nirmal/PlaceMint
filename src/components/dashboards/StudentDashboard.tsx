import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Briefcase, 
  BookOpen, 
  BarChart3, 
  Bell, 
  LogOut,
  GraduationCap,
  User as UserIcon,
  Trophy,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const dashboardCards = [
    {
      title: "Resume Builder",
      description: "Create and update your professional resume",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary-light",
      action: () => toast({ title: "Coming Soon", description: "Resume builder will be available soon!" }),
      stats: "0 resumes created"
    },
    {
      title: "Job Applications",
      description: "Browse and apply to available positions",
      icon: Briefcase,
      color: "text-accent",
      bgColor: "bg-accent-light",
      action: () => toast({ title: "Coming Soon", description: "Job applications will be available soon!" }),
      stats: "0 applications submitted"
    },
    {
      title: "Practice Tests",
      description: "Take aptitude and coding practice tests",
      icon: BookOpen,
      color: "text-warning",
      bgColor: "bg-warning-light",
      action: () => toast({ title: "Coming Soon", description: "Practice tests will be available soon!" }),
      stats: "0 tests completed"
    },
    {
      title: "Analytics",
      description: "View your progress and performance insights",
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary-light",
      action: () => toast({ title: "Coming Soon", description: "Analytics dashboard will be available soon!" }),
      stats: "No data yet"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.user_metadata?.full_name || user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <UserIcon className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Test Score</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <Trophy className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile</p>
                  <p className="text-2xl font-bold text-foreground">60%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dashboardCards.map((card, index) => (
            <Card key={card.title} className={`bg-white border-0 shadow-lg hover:shadow-xl transition-smooth animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    <CardDescription className="mt-2">{card.description}</CardDescription>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{card.stats}</p>
                  <Button onClick={card.action} className="bg-gradient-primary hover:shadow-glow transition-smooth">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity to show</p>
              <p className="text-sm text-muted-foreground mt-2">Start using the platform to see your activity here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;