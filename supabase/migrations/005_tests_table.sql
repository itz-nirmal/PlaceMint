-- Create enum types for tests
CREATE TYPE test_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE test_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE test_category AS ENUM ('aptitude', 'coding', 'technical', 'mathematics');

-- Create tests table
CREATE TABLE tests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    category test_category NOT NULL,
    difficulty test_difficulty NOT NULL DEFAULT 'Medium',
    duration INTEGER NOT NULL, -- in minutes
    total_questions INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    question_groups JSONB DEFAULT '[]'::jsonb,
    status test_status DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    students_assigned INTEGER DEFAULT 0,
    students_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    passing_marks INTEGER NOT NULL,
    instructions TEXT DEFAULT '',
    allow_retake BOOLEAN DEFAULT false,
    show_results_immediately BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_results table to store student test results
CREATE TABLE test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id TEXT REFERENCES tests(id) ON DELETE CASCADE,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    total_marks INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_taken INTEGER, -- in minutes
    answers JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attempt_number INTEGER DEFAULT 1,
    UNIQUE(test_id, student_id, attempt_number)
);

-- Create indexes for better performance
CREATE INDEX idx_tests_status ON tests(status);
CREATE INDEX idx_tests_category ON tests(category);
CREATE INDEX idx_tests_created_by ON tests(created_by);
CREATE INDEX idx_tests_active ON tests(status) WHERE status = 'active';
CREATE INDEX idx_test_results_test ON test_results(test_id);
CREATE INDEX idx_test_results_student ON test_results(student_id);
CREATE INDEX idx_test_results_score ON test_results(score);

-- Enable Row Level Security (RLS)
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tests
CREATE POLICY "TPOs can manage all tests" ON tests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'tpo'
        )
    );

CREATE POLICY "Students can view active tests" ON tests
    FOR SELECT USING (
        status = 'active' AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'student'
        )
    );

-- Create RLS policies for test_results
CREATE POLICY "Students can view their own test results" ON test_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_profiles 
            WHERE student_profiles.id = auth.uid() AND student_profiles.id = test_results.student_id
        )
    );

CREATE POLICY "Students can insert their own test results" ON test_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM student_profiles 
            WHERE student_profiles.id = auth.uid() AND student_profiles.id = test_results.student_id
        )
    );

CREATE POLICY "TPOs can view all test results" ON test_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'tpo'
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update test statistics when results are added
CREATE OR REPLACE FUNCTION update_test_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update students_completed and average_score for the test
    UPDATE tests 
    SET 
        students_completed = (
            SELECT COUNT(DISTINCT student_id) 
            FROM test_results 
            WHERE test_id = NEW.test_id
        ),
        average_score = (
            SELECT COALESCE(AVG(percentage), 0) 
            FROM test_results 
            WHERE test_id = NEW.test_id
        )
    WHERE id = NEW.test_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update test statistics
CREATE TRIGGER update_test_stats_on_result_insert 
    AFTER INSERT ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_test_statistics();

CREATE TRIGGER update_test_stats_on_result_update 
    AFTER UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_test_statistics();