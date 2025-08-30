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
  Play, 
  Clock, 
  BookOpen, 
  Code, 
  Calculator,
  Brain,
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  Timer,
  Award,
  TrendingUp
} from "lucide-react";

interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  totalTests: number;
  completedTests: number;
  averageScore: number;
}

interface Test {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  questions: number;
  description: string;
  topics: string[];
  completed: boolean;
  score?: number;
  completedAt?: string;
  attempts: number;
  maxScore: number;
}

const PracticeTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Mock data - replace with actual API calls
  const [categories] = useState<TestCategory[]>([
    {
      id: "aptitude",
      name: "Aptitude",
      description: "Logical reasoning, quantitative aptitude, and verbal ability",
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary-light",
      totalTests: 15,
      completedTests: 8,
      averageScore: 78
    },
    {
      id: "coding",
      name: "Coding",
      description: "Programming problems and algorithmic challenges",
      icon: Code,
      color: "text-accent",
      bgColor: "bg-accent-light",
      totalTests: 20,
      completedTests: 5,
      averageScore: 65
    },
    {
      id: "technical",
      name: "Technical",
      description: "Subject-specific technical knowledge",
      icon: BookOpen,
      color: "text-warning",
      bgColor: "bg-warning-light",
      totalTests: 12,
      completedTests: 3,
      averageScore: 72
    },
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Mathematical concepts and problem solving",
      icon: Calculator,
      color: "text-primary",
      bgColor: "bg-primary-light",
      totalTests: 10,
      completedTests: 6,
      averageScore: 82
    }
  ]);

  const [tests] = useState<Test[]>([
    {
      id: "1",
      title: "Logical Reasoning - Pattern Recognition",
      category: "aptitude",
      difficulty: "Medium",
      duration: 30,
      questions: 25,
      description: "Test your pattern recognition and logical thinking skills",
      topics: ["Sequences", "Analogies", "Classifications"],
      completed: true,
      score: 85,
      completedAt: "2024-01-15",
      attempts: 2,
      maxScore: 85
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      category: "coding",
      difficulty: "Hard",
      duration: 60,
      questions: 15,
      description: "Advanced DSA problems covering trees, graphs, and dynamic programming",
      topics: ["Trees", "Graphs", "Dynamic Programming", "Sorting"],
      completed: true,
      score: 72,
      completedAt: "2024-01-12",
      attempts: 1,
      maxScore: 72
    },
    {
      id: "3",
      title: "Quantitative Aptitude",
      category: "aptitude",
      difficulty: "Easy",
      duration: 45,
      questions: 30,
      description: "Basic mathematical calculations and problem solving",
      topics: ["Percentages", "Ratios", "Time & Work", "Profit & Loss"],
      completed: false,
      attempts: 0,
      maxScore: 0
    },
    {
      id: "4",
      title: "JavaScript Fundamentals",
      category: "coding",
      difficulty: "Medium",
      duration: 40,
      questions: 20,
      description: "Core JavaScript concepts and ES6+ features",
      topics: ["Variables", "Functions", "Objects", "Promises", "Async/Await"],
      completed: false,
      attempts: 0,
      maxScore: 0
    },
    {
      id: "5",
      title: "Database Management Systems",
      category: "technical",
      difficulty: "Medium",
      duration: 50,
      questions: 25,
      description: "SQL queries, normalization, and database design",
      topics: ["SQL", "Normalization", "Indexing", "Transactions"],
      completed: true,
      score: 68,
      completedAt: "2024-01-10",
      attempts: 1,
      maxScore: 68
    },
    {
      id: "6",
      title: "Calculus and Derivatives",
      category: "mathematics",
      difficulty: "Hard",
      duration: 60,
      questions: 20,
      description: "Advanced calculus problems and applications",
      topics: ["Limits", "Derivatives", "Integration", "Applications"],
      completed: false,
      attempts: 0,
      maxScore: 0
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTest = (testId: string) => {
    toast({
      title: "Starting Test",
      description: "Test interface will be available soon!",
    });
  };

  const handleViewResults = (testId: string) => {
    toast({
      title: "View Results",
      description: "Detailed results view will be available soon!",
    });
  };

  const filteredTests = activeCategory === "all" 
    ? tests 
    : tests.filter(test => test.category === activeCategory);

  const totalCompleted = tests.filter(test => test.completed).length;
  const averageScore = tests.filter(test => test.completed).reduce((sum, test) => sum + (test.score || 0), 0) / totalCompleted || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading practice tests...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Practice Tests</h1>
                <p className="text-muted-foreground">Improve your skills with practice tests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                  <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(averageScore)}%</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold text-foreground">{tests.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round((totalCompleted / tests.length) * 100)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Test Categories</CardTitle>
            <CardDescription>Choose a category to focus your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeCategory === category.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${category.bgColor}`}>
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <Badge variant="outline">{category.totalTests} tests</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{category.completedTests}/{category.totalTests}</span>
                      </div>
                      <Progress value={(category.completedTests / category.totalTests) * 100} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Avg Score: {category.averageScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            All Tests ({tests.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name} ({tests.filter(t => t.category === category.id).length})
            </Button>
          ))}
        </div>

        {/* Tests List */}
        <div className="grid gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{test.title}</CardTitle>
                      <Badge className={getDifficultyColor(test.difficulty)}>
                        {test.difficulty}
                      </Badge>
                      {test.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-2" />
                        {test.duration} minutes
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {test.questions} questions
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        {test.attempts} attempts
                      </div>
                      {test.completed && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Best: {test.maxScore}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{test.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {test.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                </div>

                {test.completed && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-800">Last Score: {test.score}%</p>
                        <p className="text-sm text-green-600">
                          Completed on {new Date(test.completedAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-green-800">{test.score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Category: {categories.find(c => c.id === test.category)?.name}
                  </div>
                  
                  <div className="flex space-x-2">
                    {test.completed && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewResults(test.id)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    )}
                    
                    <Button 
                      size="sm"
                      onClick={() => handleStartTest(test.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {test.completed ? 'Retake Test' : 'Start Test'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tests Found</h3>
              <p className="text-muted-foreground">
                No tests available in the selected category.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PracticeTests;