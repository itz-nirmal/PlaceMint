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
import { testStore, Test, QuestionGroup } from "@/lib/testStore";
import { aiService } from "@/services/aiService";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Users,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  X,
  Brain,
  Code,
  Calculator,
  FileText,
  Loader2
} from "lucide-react";

const TestManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingTest, setCreatingTest] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  
  const [newTest, setNewTest] = useState({
    title: "",
    subject: "",
    description: "",
    category: "aptitude" as const,
    difficulty: "Medium" as const,
    duration: 60,
    passingMarks: 40,
    instructions: "",
    allowRetake: false,
    showResultsImmediately: true,
    startDate: "",
    endDate: ""
  });

  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([
    { id: "1", questionCount: 10, marksPerQuestion: 2, totalMarks: 20 }
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

  useEffect(() => {
    // Subscribe to test store changes
    const unsubscribe = testStore.subscribe(() => {
      setTests(testStore.getAllTests());
    });

    // Initial load
    setTests(testStore.getAllTests());

    return unsubscribe;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'draft': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'archived': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aptitude': return <Brain className="h-4 w-4" />;
      case 'coding': return <Code className="h-4 w-4" />;
      case 'technical': return <BookOpen className="h-4 w-4" />;
      case 'mathematics': return <Calculator className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const addQuestionGroup = () => {
    const newId = Date.now().toString();
    setQuestionGroups([...questionGroups, { 
      id: newId, 
      questionCount: 5, 
      marksPerQuestion: 2, 
      totalMarks: 10 
    }]);
  };

  const removeQuestionGroup = (id: string) => {
    if (questionGroups.length > 1) {
      setQuestionGroups(questionGroups.filter(group => group.id !== id));
    }
  };

  const updateQuestionGroup = (id: string, field: keyof QuestionGroup, value: number) => {
    setQuestionGroups(questionGroups.map(group => {
      if (group.id === id) {
        const updated = { ...group, [field]: value };
        if (field === 'questionCount' || field === 'marksPerQuestion') {
          updated.totalMarks = updated.questionCount * updated.marksPerQuestion;
        }
        return updated;
      }
      return group;
    }));
  };

  const getTotalQuestions = () => {
    return questionGroups.reduce((sum, group) => sum + group.questionCount, 0);
  };

  const getTotalMarks = () => {
    return questionGroups.reduce((sum, group) => sum + group.totalMarks, 0);
  };

  const handleCreateTest = async () => {
    setCreatingTest(true);
    
    try {
      // Generate questions using AI
      const questionRequests = questionGroups.map(group => ({
        subject: newTest.subject,
        category: newTest.category,
        difficulty: newTest.difficulty,
        questionCount: group.questionCount,
        marksPerQuestion: group.marksPerQuestion
      }));

      toast({
        title: "Generating Questions",
        description: "AI is creating questions for your test. This may take a moment...",
      });

      const questions = await aiService.generateQuestions(questionRequests);

      const test: Test = {
        id: Date.now().toString(),
        ...newTest,
        totalQuestions: getTotalQuestions(),
        totalMarks: getTotalMarks(),
        questionGroups: questionGroups,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        studentsAssigned: 0,
        studentsCompleted: 0,
        averageScore: 0,
        createdBy: user?.id || '',
        questions: questions
      };

      testStore.addTest(test);
      setShowCreateForm(false);
      resetForm();

      toast({
        title: "Test created successfully",
        description: `Generated ${questions.length} questions using AI. Test saved as draft.`,
      });
    } catch (error) {
      console.error('Error creating test:', error);
      toast({
        title: "Error creating test",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingTest(false);
    }
  };

  const resetForm = () => {
    setNewTest({
      title: "",
      subject: "",
      description: "",
      category: "aptitude",
      difficulty: "Medium",
      duration: 60,
      passingMarks: 40,
      instructions: "",
      allowRetake: false,
      showResultsImmediately: true,
      startDate: "",
      endDate: ""
    });
    setQuestionGroups([{ id: "1", questionCount: 10, marksPerQuestion: 2, totalMarks: 20 }]);
  };

  const handlePublishTest = (testId: string) => {
    testStore.updateTest(testId, { status: 'active' });
    toast({
      title: "Test published",
      description: "The test is now available for students.",
    });
  };

  const handleArchiveTest = (testId: string) => {
    testStore.updateTest(testId, { status: 'archived' });
    toast({
      title: "Test archived",
      description: "The test has been archived.",
    });
  };

  const handleDeleteTest = (testId: string) => {
    testStore.deleteTest(testId);
    toast({
      title: "Test deleted",
      description: "The test has been permanently deleted.",
    });
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test management...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Test Management</h1>
                <p className="text-muted-foreground">Create and manage AI-powered tests for students</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateForm(true)} disabled={creatingTest}>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
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
                  <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold text-foreground">{tests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Tests</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tests.filter(t => t.status === 'active').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Students Tested</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tests.reduce((sum, test) => sum + test.studentsCompleted, 0)}
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
                  <p className="text-sm font-medium text-muted-foreground">AI Generated</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0)}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Create Test Form */}
        {showCreateForm && (
          <Card className="bg-white border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create New AI-Powered Test</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)} disabled={creatingTest}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                AI will automatically generate questions based on your specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Test Title</Label>
                  <Input
                    id="title"
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                    placeholder="e.g., JavaScript Fundamentals"
                    disabled={creatingTest}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newTest.subject}
                    onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                    placeholder="e.g., JavaScript, DSA, Mathematics"
                    disabled={creatingTest}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newTest.category}
                    onChange={(e) => setNewTest({ ...newTest, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    disabled={creatingTest}
                  >
                    <option value="aptitude">Aptitude</option>
                    <option value="coding">Coding</option>
                    <option value="technical">Technical</option>
                    <option value="mathematics">Mathematics</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={newTest.difficulty}
                    onChange={(e) => setNewTest({ ...newTest, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    disabled={creatingTest}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) })}
                    min="15"
                    max="300"
                    disabled={creatingTest}
                  />
                </div>
                <div>
                  <Label htmlFor="passingMarks">Passing Marks (%)</Label>
                  <Input
                    id="passingMarks"
                    type="number"
                    value={newTest.passingMarks}
                    onChange={(e) => setNewTest({ ...newTest, passingMarks: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    disabled={creatingTest}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  placeholder="Describe what this test covers..."
                  rows={3}
                  disabled={creatingTest}
                />
              </div>

              {/* Question Groups */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Question Groups (AI will generate questions for each group)</Label>
                  <Button size="sm" onClick={addQuestionGroup} disabled={creatingTest}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Group
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {questionGroups.map((group, index) => (
                    <Card key={group.id} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Group {index + 1}</h4>
                        {questionGroups.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeQuestionGroup(group.id)}
                            disabled={creatingTest}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Number of Questions</Label>
                          <Input
                            type="number"
                            value={group.questionCount}
                            onChange={(e) => updateQuestionGroup(group.id, 'questionCount', parseInt(e.target.value) || 0)}
                            min="1"
                            disabled={creatingTest}
                          />
                        </div>
                        <div>
                          <Label>Marks per Question</Label>
                          <Input
                            type="number"
                            value={group.marksPerQuestion}
                            onChange={(e) => updateQuestionGroup(group.id, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                            min="1"
                            disabled={creatingTest}
                          />
                        </div>
                        <div>
                          <Label>Total Marks</Label>
                          <Input
                            value={group.totalMarks}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Total Questions: </span>
                      <span>{getTotalQuestions()}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Total Marks: </span>
                      <span>{getTotalMarks()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newTest.startDate}
                    onChange={(e) => setNewTest({ ...newTest, startDate: e.target.value })}
                    disabled={creatingTest}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newTest.endDate}
                    onChange={(e) => setNewTest({ ...newTest, endDate: e.target.value })}
                    disabled={creatingTest}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newTest.instructions}
                  onChange={(e) => setNewTest({ ...newTest, instructions: e.target.value })}
                  placeholder="Instructions for students taking the test..."
                  rows={3}
                  disabled={creatingTest}
                />
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTest.allowRetake}
                    onChange={(e) => setNewTest({ ...newTest, allowRetake: e.target.checked })}
                    disabled={creatingTest}
                  />
                  <span className="text-sm">Allow Retake</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTest.showResultsImmediately}
                    onChange={(e) => setNewTest({ ...newTest, showResultsImmediately: e.target.checked })}
                    disabled={creatingTest}
                  />
                  <span className="text-sm">Show Results Immediately</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)} disabled={creatingTest}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest} disabled={creatingTest}>
                  {creatingTest ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Test with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
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
                      <Badge className={getStatusColor(test.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(test.status)}
                          <span className="capitalize">{test.status}</span>
                        </div>
                      </Badge>
                      {test.questions && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {getCategoryIcon(test.category)}
                        <span className="ml-2 capitalize">{test.category}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {test.duration} minutes
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {test.totalQuestions} questions
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        {test.totalMarks} marks
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{test.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Question Distribution:</h4>
                    <div className="space-y-1 text-sm">
                      {test.questionGroups.map((group, index) => (
                        <div key={group.id} className="flex justify-between">
                          <span>Group {index + 1}:</span>
                          <span>{group.questionCount} × {group.marksPerQuestion} = {group.totalMarks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Performance:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Assigned:</span>
                        <span>{test.studentsAssigned}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span>{test.studentsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Score:</span>
                        <span>{test.averageScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Settings:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Passing:</span>
                        <span>{test.passingMarks}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retake:</span>
                        <span>{test.allowRetake ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{test.questions?.length || 0} generated</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(test.createdDate).toLocaleDateString()}
                    {test.startDate && ` • Starts: ${new Date(test.startDate).toLocaleDateString()}`}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                    
                    {test.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => handlePublishTest(test.id)}
                      >
                        Publish
                      </Button>
                    )}
                    
                    {test.status === 'active' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchiveTest(test.id)}
                      >
                        Archive
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTest(test.id)}
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

        {filteredTests.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tests Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No tests match your search criteria." : "You haven't created any AI-powered tests yet."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First AI Test
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default TestManagement;