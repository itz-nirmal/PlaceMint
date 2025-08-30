import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { testStore } from "@/lib/testStore";
import { aiService } from "@/services/aiService";
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Award,
  CheckCircle,
  AlertTriangle,
  Flag,
  SkipForward,
  Save,
  Send,
  Eye,
  EyeOff,
  Loader2
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

interface TestData {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  instructions: string;
  questions: Question[];
}

interface StudentAnswer {
  questionId: string;
  selectedOption: number | null;
  isMarked: boolean;
  timeSpent: number;
}

const TestInterface = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Load test data from store
      if (testId) {
        const test = testStore.getTestById(testId);
        if (test && test.questions) {
          const testData: TestData = {
            id: test.id,
            title: test.title,
            subject: test.subject,
            description: test.description,
            duration: test.duration,
            totalQuestions: test.totalQuestions,
            totalMarks: test.totalMarks,
            passingMarks: test.passingMarks,
            instructions: test.instructions || `
              1. Read all questions carefully before answering
              2. Each question has only one correct answer
              3. You can navigate between questions using the navigation panel
              4. Mark questions for review if you're unsure
              5. Submit the test before time runs out
              6. No negative marking
            `,
            questions: test.questions
          };
          
          setTestData(testData);
          setTimeRemaining(testData.duration * 60); // Convert to seconds
          
          // Initialize answers
          const initialAnswers = testData.questions.map(q => ({
            questionId: q.id,
            selectedOption: null,
            isMarked: false,
            timeSpent: 0
          }));
          setAnswers(initialAnswers);
        } else {
          toast({
            title: "Test not found",
            description: "The requested test could not be found or has no questions.",
            variant: "destructive",
          });
          navigate("/student/tests");
        }
      }
      
      setLoading(false);
    };

    getUser();
  }, [navigate, testId, toast]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (testStarted && !testSubmitted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [testStarted, testSubmitted, timeRemaining]);

  // Track time spent on current question
  useEffect(() => {
    if (testStarted && !testSubmitted) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, testStarted, testSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
    setQuestionStartTime(Date.now());
  };

  const updateTimeSpent = useCallback(() => {
    if (testStarted && !testSubmitted) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      setAnswers(prev => prev.map((answer, index) => 
        index === currentQuestion 
          ? { ...answer, timeSpent: answer.timeSpent + timeSpent }
          : answer
      ));
    }
  }, [currentQuestion, questionStartTime, testStarted, testSubmitted]);

  const handleAnswerSelect = (optionIndex: number) => {
    updateTimeSpent();
    setAnswers(prev => prev.map((answer, index) => 
      index === currentQuestion 
        ? { ...answer, selectedOption: optionIndex }
        : answer
    ));
  };

  const handleMarkForReview = () => {
    setAnswers(prev => prev.map((answer, index) => 
      index === currentQuestion 
        ? { ...answer, isMarked: !answer.isMarked }
        : answer
    ));
  };

  const handleNextQuestion = () => {
    updateTimeSpent();
    if (currentQuestion < testData!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    updateTimeSpent();
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    updateTimeSpent();
    setCurrentQuestion(questionIndex);
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    updateTimeSpent();
    
    try {
      // Use AI service to verify answers and calculate results
      const studentAnswers = answers.map(answer => answer.selectedOption);
      const results = await aiService.verifyAnswers(testData!.questions, studentAnswers);
      
      const percentage = Math.round((results.score / results.totalMarks) * 100);
      const passed = percentage >= testData!.passingMarks;

      setTestSubmitted(true);

      toast({
        title: "Test Submitted Successfully",
        description: `You scored ${results.score}/${results.totalMarks} (${percentage}%)`,
      });

      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate(`/student/test-result/${testId}`, {
          state: {
            score: results.score,
            totalMarks: results.totalMarks,
            percentage,
            passed,
            correctAnswers: results.correctAnswers,
            totalQuestions: testData!.questions.length,
            answers,
            questions: testData!.questions,
            testTitle: testData!.title,
            aiResults: results.results
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: "Error submitting test",
        description: "Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  const getQuestionStatus = (index: number) => {
    const answer = answers[index];
    if (answer.selectedOption !== null) {
      return answer.isMarked ? 'answered-marked' : 'answered';
    }
    return answer.isMarked ? 'marked' : 'not-answered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'answered-marked': return 'bg-orange-500 text-white';
      case 'marked': return 'bg-yellow-500 text-black';
      case 'not-answered': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Test Not Found</h3>
            <p className="text-muted-foreground mb-4">The requested test could not be found.</p>
            <Button onClick={() => navigate("/student/tests")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20 flex items-center justify-center">
        <Card className="max-w-2xl mx-4">
          <CardHeader>
            <CardTitle className="text-2xl">{testData.title}</CardTitle>
            <CardDescription>{testData.description}</CardDescription>
            <Badge className="w-fit bg-purple-100 text-purple-800">
              AI-Generated Questions
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{testData.duration} min</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{testData.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{testData.totalMarks}</div>
                <div className="text-sm text-muted-foreground">Total Marks</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{testData.passingMarks}%</div>
                <div className="text-sm text-muted-foreground">Passing</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Instructions:</h3>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{testData.instructions}</pre>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/student/tests")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Button>
              <Button onClick={handleStartTest} className="bg-green-600 hover:bg-green-700">
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-12">
            {submitting ? (
              <>
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-semibold mb-2">Processing Results...</h3>
                <p className="text-muted-foreground mb-4">
                  AI is analyzing your answers and calculating your score.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Test Submitted!</h3>
                <p className="text-muted-foreground mb-4">
                  Your test has been submitted successfully. Redirecting to results...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = testData.questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{testData.title}</h1>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {testData.questions.length}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                AI Generated
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className={`font-mono font-semibold ${timeRemaining < 300 ? 'text-red-500' : 'text-foreground'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button variant="destructive" onClick={handleSubmitTest} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Test
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {currentQ.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {currentQ.marks} marks
                      </Badge>
                      <Badge variant="outline">
                        {currentQ.category}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-semibold">
                      Q{currentQuestion + 1}. {currentQ.questionText}
                    </h2>
                  </div>
                  <Button
                    variant={currentAnswer.isMarked ? "default" : "outline"}
                    size="sm"
                    onClick={handleMarkForReview}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {currentAnswer.isMarked ? "Unmark" : "Mark for Review"}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        currentAnswer.selectedOption === index
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={currentAnswer.selectedOption === index}
                        onChange={() => handleAnswerSelect(index)}
                        className="mr-3"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleMarkForReview}>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Mark
                    </Button>
                    
                    {currentQuestion === testData.questions.length - 1 ? (
                      <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Test
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        Next
                        <SkipForward className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {testData.questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuestionNavigation(index)}
                        className={`w-10 h-10 rounded text-sm font-semibold transition-all ${
                          getStatusColor(status)
                        } ${currentQuestion === index ? 'ring-2 ring-primary' : ''}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Answered & Marked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Marked for Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Answered:</span>
                      <span className="font-semibold">
                        {answers.filter(a => a.selectedOption !== null).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marked:</span>
                      <span className="font-semibold">
                        {answers.filter(a => a.isMarked).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Not Answered:</span>
                      <span className="font-semibold">
                        {answers.filter(a => a.selectedOption === null).length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;