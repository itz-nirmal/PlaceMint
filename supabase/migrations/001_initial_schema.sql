-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'tpo', 'company');
CREATE TYPE application_status AS ENUM ('pending', 'shortlisted', 'rejected', 'selected');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'internship', 'contract');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_profiles table
CREATE TABLE student_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    student_id TEXT UNIQUE,
    department TEXT,
    year_of_study INTEGER,
    cgpa DECIMAL(3,2),
    skills TEXT[],
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    date_of_birth DATE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_profiles table
CREATE TABLE company_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    address TEXT,
    hr_contact_name TEXT,
    hr_contact_email TEXT,
    hr_contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tpo_profiles table
CREATE TABLE tpo_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    employee_id TEXT UNIQUE,
    department TEXT,
    designation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_postings table
CREATE TABLE job_postings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    job_type job_type NOT NULL DEFAULT 'full_time',
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT,
    skills_required TEXT[],
    experience_required INTEGER DEFAULT 0,
    application_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    cover_letter TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, job_id)
);

-- Create placement_drives table
CREATE TABLE placement_drives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    drive_date DATE,
    venue TEXT,
    eligibility_criteria TEXT,
    registration_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drive_registrations table
CREATE TABLE drive_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_job_postings_company ON job_postings(company_id);
CREATE INDEX idx_job_postings_active ON job_postings(is_active);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tpo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Student profiles policies
CREATE POLICY "Students can view their own profile" ON student_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update their own profile" ON student_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert their own profile" ON student_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "TPOs can view all student profiles" ON student_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'tpo'
        )
    );

-- Company profiles policies
CREATE POLICY "Companies can view their own profile" ON company_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Companies can update their own profile" ON company_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Companies can insert their own profile" ON company_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "TPOs can view all company profiles" ON company_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'tpo'
        )
    );

-- Job postings policies
CREATE POLICY "Anyone can view active job postings" ON job_postings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Companies can manage their own job postings" ON job_postings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM company_profiles 
            WHERE company_profiles.id = auth.uid() AND company_profiles.id = job_postings.company_id
        )
    );

CREATE POLICY "TPOs can view all job postings" ON job_postings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'tpo'
        )
    );

-- Applications policies
CREATE POLICY "Students can view their own applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_profiles 
            WHERE student_profiles.id = auth.uid() AND student_profiles.id = applications.student_id
        )
    );

CREATE POLICY "Students can create applications" ON applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM student_profiles 
            WHERE student_profiles.id = auth.uid() AND student_profiles.id = applications.student_id
        )
    );

CREATE POLICY "Companies can view applications for their jobs" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM job_postings jp
            JOIN company_profiles cp ON jp.company_id = cp.id
            WHERE cp.id = auth.uid() AND jp.id = applications.job_id
        )
    );

CREATE POLICY "Companies can update applications for their jobs" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM job_postings jp
            JOIN company_profiles cp ON jp.company_id = cp.id
            WHERE cp.id = auth.uid() AND jp.id = applications.job_id
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tpo_profiles_updated_at BEFORE UPDATE ON tpo_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_placement_drives_updated_at BEFORE UPDATE ON placement_drives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();