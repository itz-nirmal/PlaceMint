import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Briefcase,
  FileText,
  Users,
  Star,
  Activity,
  BookOpen
} from "lucide-react";

interface AnalyticsData {
  applications: {
    total: number;
    pending: number;
    shortlisted: number;
    rejected: number;
    selected: number;
    trend: number;
  };
  tests: {
    completed: number;
    averageScore: number;
    bestScore: number;
    totalTime: number;
    trend: number;
  };
  profile: {
    completeness: number;
    views: number;
    lastUpdated: string;
  };
  skills: {
    name: string;
    level: number;
    assessments: number;
  }[];
  monthlyActivity: {
    month: string;
    applications: number;
    tests: number;
    score: number;
  }[];
  recentActivity: {
    id: string;
    type: 'application' | 'test' | 'profile';
    title: string;
    description: string;
    date: string;
    status?: string;
  }[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Mock analytics data - replace with actual API calls
  const [analyticsData] = useState<AnalyticsData>({
    applications: {
      total: 12,
      pending: 5,
      shortlisted: 3,
      rejected: 3,
      selected: 1,
      trend: 15.2
    },
    tests: {
      completed: 8,
      averageScore: 76,
      bestScore: 92,
      totalTime: 420, // minutes
      trend: 8.5
    },
    profile: {
      completeness: 85,
      views: 34,
      lastUpdated: "2024-01-15"
    },
    skills: [
      { name: "JavaScript", level: 85, assessments: 3 },
      { name: "React", level: 78, assessments: 2 },
      { name: "Python", level: 72, assessments: 4 },
      { name: "SQL", level: 68, assessments: 2 },
      { name: "Node.js", level: 65, assessments: 1 }
    ],
    monthlyActivity: [
      { month: "Oct", applications: 2, tests: 1, score: 72 },
      { month: "Nov", applications: 4, tests: 3, score: 78 },
      { month: "Dec", applications: 3, tests: 2, score: 74 },
      { month: "Jan", applications: 3, tests: 2, score: 82 }
    ],
    recentActivity: [
      {
        id: "1",
        type: "application",
        title: "Applied to Software Developer",
        description: "TechCorp Solutions",
        date: "2024-01-15",
        status: "pending"
      },
      {
        id: "2",
        type: "test",
        title: "Completed JavaScript Fundamentals",
        description: "Scored 85%",
        date: "2024-01-14",
        status: "completed"
      },
      {
        id: "3",
        type: "profile",
        title: "Updated Resume",
        description: "Added new project",
        date: "2024-01-12"
      },
      {
        id: "4",
        type: "application",
        title: "Shortlisted for Frontend Developer",
        description: "Digital Innovations",
        date: "2024-01-10",
        status: "shortlisted"
      }
    ]
  });

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return <Briefcase className="h-4 w-4" />;
      case 'test': return <BookOpen className="h-4 w-4" />;
      case 'profile': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application': return 'text-blue-600 bg-blue-100';
      case 'test': return 'text-green-600 bg-green-100';
      case 'profile': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'selected': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const applicationSuccessRate = ((analyticsData.applications.shortlisted + analyticsData.applications.selected) / analyticsData.applications.total * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Track your progress and performance insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.applications.total}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+{analyticsData.applications.trend}%</span>
                  </div>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(applicationSuccessRate)}%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+5.2%</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Test Score</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.tests.averageScore}%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+{analyticsData.tests.trend}%</span>
                  </div>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.profile.views}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12.3%</span>
                  </div>
                </div>
                <Eye className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Application Status Breakdown */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Application Status
              </CardTitle>
              <CardDescription>Breakdown of your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold">{analyticsData.applications.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Shortlisted</span>
                  </div>
                  <span className="font-semibold">{analyticsData.applications.shortlisted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">Rejected</span>
                  </div>
                  <span className="font-semibold">{analyticsData.applications.rejected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <span className="font-semibold">{analyticsData.applications.selected}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Performance */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Test Performance
              </CardTitle>
              <CardDescription>Your practice test statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tests Completed</span>
                    <span>{analyticsData.tests.completed}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Score</span>
                    <span>{analyticsData.tests.averageScore}%</span>
                  </div>
                  <Progress value={analyticsData.tests.averageScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Best Score</span>
                    <span>{analyticsData.tests.bestScore}%</span>
                  </div>
                  <Progress value={analyticsData.tests.bestScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Total Time Spent</span>
                    <span>{Math.round(analyticsData.tests.totalTime / 60)}h {analyticsData.tests.totalTime % 60}m</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completeness */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Profile Insights
              </CardTitle>
              <CardDescription>Your profile performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completeness</span>
                    <span>{analyticsData.profile.completeness}%</span>
                  </div>
                  <Progress value={analyticsData.profile.completeness} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete your profile to increase visibility
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Views</span>
                    <span>{analyticsData.profile.views}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span>{new Date(analyticsData.profile.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Assessment */}
        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Skills Assessment
            </CardTitle>
            <CardDescription>Your skill levels based on test performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="outline">{skill.assessments} tests</Badge>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Level: {skill.level}%</span>
                    <span>
                      {skill.level >= 80 ? 'Expert' : 
                       skill.level >= 60 ? 'Intermediate' : 'Beginner'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity Chart */}
        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Monthly Activity
            </CardTitle>
            <CardDescription>Your activity trends over the past months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyActivity.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold text-lg w-12">{month.month}</div>
                    <div className="flex space-x-6 text-sm">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{month.applications} apps</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1 text-green-500" />
                        <span>{month.tests} tests</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{month.score}%</div>
                    <div className="text-xs text-muted-foreground">avg score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{activity.title}</h4>
                      {activity.status && (
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;