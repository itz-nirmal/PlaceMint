import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  BarChart3,
  Download,
  Share,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  explanation?: string;
}

interface StudentAnswer {
  questionId: string;
  selectedOption: number | null;
  isMarked: boolean;
  timeSpent: number;
}

interface TestResultData {
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  answers: StudentAnswer[];
  questions: Question[];
  timeSpent?: number;
  rank?: number;
  totalStudents?: number;
}

const TestResult = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [resultData, setResultData] = useState<TestResultData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Get result data from location state or API
      if (location.state) {
        setResultData(location.state as TestResultData);
      } else {
        // Mock data if no state (direct URL access)
        setResultData({
          score: 35,
          totalMarks: 50,
          percentage: 70,
          passed: true,
          correctAnswers: 7,
          totalQuestions: 10,
          answers: [],
          questions: [],
          timeSpent: 45 * 60, // 45 minutes in seconds
          rank: 12,
          totalStudents: 45
        });
      }
      
      setLoading(false);
    };

    getUser();
  }, [navigate, location.state]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-500' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  const getCategoryWiseAnalysis = () => {
    if (!resultData?.questions.length) return [];
    
    const categoryStats: { [key: string]: { correct: number; total: number; marks: number; totalMarks: number } } = {};
    
    resultData.questions.forEach((question, index) => {
      const answer = resultData.answers[index];
      const category = question.category;
      
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0, marks: 0, totalMarks: 0 };
      }
      
      categoryStats[category].total++;
      categoryStats[category].totalMarks += question.marks;
      
      if (answer?.selectedOption === question.correctAnswer) {
        categoryStats[category].correct++;
        categoryStats[category].marks += question.marks;
      }
    });
    
    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100),
      marks: stats.marks,
      totalMarks: stats.totalMarks
    }));
  };

  const handleDownloadResult = () => {
    toast({
      title: "Download Started",
      description: "Your test result is being downloaded as PDF.",
    });
  };

  const handleShareResult = () => {
    toast({
      title: "Result Shared",
      description: "Your test result has been shared successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test results...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Results Not Found</h3>
            <p className="text-muted-foreground mb-4">Unable to load test results.</p>
            <Button onClick={() => navigate("/student/tests")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradeInfo = getGrade(resultData.percentage);
  const categoryAnalysis = getCategoryWiseAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/tests")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Test Results</h1>
                <p className="text-muted-foreground">Your performance summary</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleDownloadResult}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleShareResult}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Result Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Score Card */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                resultData.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {resultData.passed ? (
                  <Trophy className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
              <CardTitle className="text-3xl mb-2">
                {resultData.score}/{resultData.totalMarks}
              </CardTitle>
              <CardDescription className="text-xl">
                <span className={`font-bold ${gradeInfo.color}`}>
                  {resultData.percentage}% ({gradeInfo.grade})
                </span>
              </CardDescription>
              <Badge className={`mt-2 ${resultData.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {resultData.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="font-semibold">{resultData.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <XCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                  <div className="font-semibold">{resultData.totalQuestions - resultData.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="font-semibold">
                    {resultData.timeSpent ? formatTime(resultData.timeSpent) : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <Award className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="font-semibold">
                    {resultData.rank ? `#${resultData.rank}` : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy</span>
                  <span>{Math.round((resultData.correctAnswers / resultData.totalQuestions) * 100)}%</span>
                </div>
                <Progress value={(resultData.correctAnswers / resultData.totalQuestions) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Score</span>
                  <span>{resultData.percentage}%</span>
                </div>
                <Progress value={resultData.percentage} className="h-2" />
              </div>

              {resultData.rank && resultData.totalStudents && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rank</span>
                    <span>{resultData.rank}/{resultData.totalStudents}</span>
                  </div>
                  <Progress value={((resultData.totalStudents - resultData.rank + 1) / resultData.totalStudents) * 100} className="h-2" />
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Questions Attempted:</span>
                    <span className="font-semibold">{resultData.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Score:</span>
                    <span className={`font-semibold ${resultData.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {resultData.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category-wise Analysis */}
        {categoryAnalysis.length > 0 && (
          <Card className="bg-white border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Category-wise Performance</CardTitle>
              <CardDescription>Your performance across different topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryAnalysis.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{category.category}</h4>
                      <Badge variant="outline">{category.percentage}%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Correct:</span>
                        <span>{category.correct}/{category.total}</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Marks:</span>
                        <span>{category.marks}/{category.totalMarks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Answers */}
        {resultData.questions.length > 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Detailed Analysis</CardTitle>
                  <CardDescription>Review your answers and explanations</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowAnswers(!showAnswers)}
                >
                  {showAnswers ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Answers
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Answers
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {showAnswers && (
              <CardContent>
                <div className="space-y-6">
                  {resultData.questions.map((question, index) => {
                    const answer = resultData.answers[index];
                    const isCorrect = answer?.selectedOption === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge className={isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </Badge>
                              <Badge variant="outline">{question.marks} marks</Badge>
                              <Badge variant="outline">{question.difficulty}</Badge>
                            </div>
                            <h4 className="font-semibold">
                              Q{index + 1}. {question.questionText}
                            </h4>
                          </div>
                          {isCorrect ? (
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded border ${
                                optionIndex === question.correctAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : answer?.selectedOption === optionIndex && !isCorrect
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                <div className="flex items-center space-x-2">
                                  {optionIndex === question.correctAnswer && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      Correct Answer
                                    </Badge>
                                  )}
                                  {answer?.selectedOption === optionIndex && (
                                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                                      Your Answer
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <h5 className="font-semibold text-blue-800 mb-1">Explanation:</h5>
                            <p className="text-blue-700 text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => navigate("/student/tests")}>
            Back to Tests
          </Button>
          <Button onClick={() => navigate("/student/analytics")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TestResult;