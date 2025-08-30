import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { testStore } from "@/lib/testStore";
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
  Timer,
  Award
} from "lucide-react";

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
  isTPOTest?: boolean;
  status?: string;
}

const PracticeTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [allTests, setAllTests] = useState<Test[]>([]);
  
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

  useEffect(() => {
    const initializeTests = async () => {
      // Initialize test store
      await testStore.initialize();
      
      const tpoTests = testStore.getActiveTests();
      const combinedTests = tpoTests.map(test => ({
        id: test.id,
        title: test.title,
        category: test.category,
        difficulty: test.difficulty,
        duration: test.duration,
        questions: test.totalQuestions,
        description: test.description,
        topics: [test.subject],
        completed: false,
        attempts: 0,
        maxScore: 0,
        isTPOTest: true,
        status: test.status
      }));
      setAllTests(combinedTests);
    };

    initializeTests();

    // Subscribe to test store changes
    const unsubscribe = testStore.subscribe(() => {
      const tpoTests = testStore.getActiveTests();
      const combinedTests = tpoTests.map(test => ({
        id: test.id,
        title: test.title,
        category: test.category,
        difficulty: test.difficulty,
        duration: test.duration,
        questions: test.totalQuestions,
        description: test.description,
        topics: [test.subject],
        completed: false,
        attempts: 0,
        maxScore: 0,
        isTPOTest: true,
        status: test.status
      }));
      setAllTests(combinedTests);
    });

    return unsubscribe;
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aptitude': return <Brain className="h-4 w-4" />;
      case 'coding': return <Code className="h-4 w-4" />;
      case 'technical': return <BookOpen className="h-4 w-4" />;
      case 'mathematics': return <Calculator className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleStartTest = (testId: string) => {
    navigate(`/student/test/${testId}`);
  };

  const filteredTests = activeCategory === "all" 
    ? allTests 
    : allTests.filter(test => test.category === activeCategory);

  const totalCompleted = allTests.filter(test => test.completed).length;
  const averageScore = allTests.filter(test => test.completed).reduce((sum, test) => sum + (test.score || 0), 0) / totalCompleted || 0;

  // Get unique categories from available tests
  const availableCategories = [...new Set(allTests.map(test => test.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tests...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Available Tests</h1>
                <p className="text-muted-foreground">Take tests published by your TPO</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Available Tests</p>
                  <p className="text-2xl font-bold text-foreground">{allTests.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
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
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{availableCategories.length}</p>
                </div>
                <Brain className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        {availableCategories.length > 0 && (
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 w-fit">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Tests ({allTests.length})
            </Button>
            {availableCategories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category} ({allTests.filter(t => t.category === category).length})
              </Button>
            ))}
          </div>
        )}

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
                      <Badge className="bg-purple-100 text-purple-800">
                        <Brain className="h-3 w-3 mr-1" />
                        TPO Test
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
                        {getCategoryIcon(test.category)}
                        <span className="ml-2 capitalize">{test.category}</span>
                      </div>
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

                {test.completed && test.score && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-800">Last Score: {test.score}%</p>
                        <p className="text-sm text-green-600">
                          Completed on {test.completedAt && new Date(test.completedAt).toLocaleDateString()}
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
                    TPO Assessment • {test.status}
                  </div>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleStartTest(test.id)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {test.completed ? 'Retake Test' : 'Start Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tests Available</h3>
              <p className="text-muted-foreground">
                {activeCategory === "all" 
                  ? "Your TPO hasn't published any tests yet. Check back later!"
                  : `No tests available in the ${activeCategory} category.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PracticeTests;