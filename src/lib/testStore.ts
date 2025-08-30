import { supabase } from "@/integrations/supabase/client";

// Shared test store to manage tests across TPO and Student interfaces
interface QuestionGroup {
  id: string;
  questionCount: number;
  marksPerQuestion: number;
  totalMarks: number;
}

interface Test {
  id: string;
  title: string;
  subject: string;
  description: string;
  category: 'aptitude' | 'coding' | 'technical' | 'mathematics';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  questionGroups: QuestionGroup[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdDate: string;
  startDate?: string;
  endDate?: string;
  studentsAssigned: number;
  studentsCompleted: number;
  averageScore: number;
  passingMarks: number;
  instructions: string;
  allowRetake: boolean;
  showResultsImmediately: boolean;
  createdBy: string; // TPO ID
  questions?: Question[];
}

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

// Database-backed store with Supabase
class TestStore {
  private tests: Test[] = [];
  private listeners: (() => void)[] = [];
  private initialized = false;

  // Initialize store by loading tests from database
  async initialize() {
    if (this.initialized) return;
    
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tests:', error);
        return;
      }

      this.tests = (data || []).map(this.mapDatabaseToTest);
      this.initialized = true;
      this.notifyListeners();
    } catch (error) {
      console.error('Error initializing test store:', error);
    }
  }

  // Map database record to Test interface
  private mapDatabaseToTest(dbTest: any): Test {
    return {
      id: dbTest.id,
      title: dbTest.title,
      subject: dbTest.subject,
      description: dbTest.description,
      category: dbTest.category,
      difficulty: dbTest.difficulty,
      duration: dbTest.duration,
      totalQuestions: dbTest.total_questions,
      totalMarks: dbTest.total_marks,
      questionGroups: dbTest.question_groups || [],
      status: dbTest.status,
      createdDate: dbTest.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      startDate: dbTest.start_date,
      endDate: dbTest.end_date,
      studentsAssigned: dbTest.students_assigned || 0,
      studentsCompleted: dbTest.students_completed || 0,
      averageScore: dbTest.average_score || 0,
      passingMarks: dbTest.passing_marks,
      instructions: dbTest.instructions || '',
      allowRetake: dbTest.allow_retake || false,
      showResultsImmediately: dbTest.show_results_immediately || true,
      createdBy: dbTest.created_by,
      questions: dbTest.questions || []
    };
  }

  // Map Test interface to database record
  private mapTestToDatabase(test: Test) {
    return {
      id: test.id,
      title: test.title,
      subject: test.subject,
      description: test.description,
      category: test.category,
      difficulty: test.difficulty,
      duration: test.duration,
      total_questions: test.totalQuestions,
      total_marks: test.totalMarks,
      question_groups: test.questionGroups,
      status: test.status,
      start_date: test.startDate,
      end_date: test.endDate,
      students_assigned: test.studentsAssigned,
      students_completed: test.studentsCompleted,
      average_score: test.averageScore,
      passing_marks: test.passingMarks,
      instructions: test.instructions,
      allow_retake: test.allowRetake,
      show_results_immediately: test.showResultsImmediately,
      created_by: test.createdBy,
      questions: test.questions
    };
  }

  // Add a test (called by TPO)
  async addTest(test: Test) {
    try {
      const dbTest = this.mapTestToDatabase(test);
      const { data, error } = await supabase
        .from('tests')
        .insert([dbTest])
        .select()
        .single();

      if (error) {
        console.error('Error adding test:', error);
        throw error;
      }

      const newTest = this.mapDatabaseToTest(data);
      this.tests.unshift(newTest);
      this.notifyListeners();
      return newTest;
    } catch (error) {
      console.error('Error adding test:', error);
      throw error;
    }
  }

  // Update a test
  async updateTest(testId: string, updates: Partial<Test>) {
    try {
      const dbUpdates = this.mapTestToDatabase({ ...updates } as Test);
      const { data, error } = await supabase
        .from('tests')
        .update(dbUpdates)
        .eq('id', testId)
        .select()
        .single();

      if (error) {
        console.error('Error updating test:', error);
        throw error;
      }

      const index = this.tests.findIndex(t => t.id === testId);
      if (index !== -1) {
        this.tests[index] = { ...this.tests[index], ...updates };
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error updating test:', error);
      throw error;
    }
  }

  // Get all tests
  getAllTests(): Test[] {
    return [...this.tests];
  }

  // Get active tests for students
  getActiveTests(): Test[] {
    return this.tests.filter(test => test.status === 'active');
  }

  // Get test by ID
  getTestById(id: string): Test | undefined {
    return this.tests.find(test => test.id === id);
  }

  // Delete test
  async deleteTest(id: string) {
    try {
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting test:', error);
        throw error;
      }

      this.tests = this.tests.filter(test => test.id !== id);
      this.notifyListeners();
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  }

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Clear local cache (for logout)
  clear() {
    this.tests = [];
    this.initialized = false;
    this.notifyListeners();
  }
}

// Export singleton instance
export const testStore = new TestStore();
export type { Test, Question, QuestionGroup };