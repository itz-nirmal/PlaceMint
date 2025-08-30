-- Seed TPO and Company accounts
-- Note: These accounts need to be created through Supabase Auth first, then we update their profiles

-- This script assumes you've already created the auth users through Supabase dashboard
-- Replace the UUIDs below with actual user IDs from your Supabase Auth users table

-- Example TPO accounts (replace with actual UUIDs after creating auth users)
-- You'll need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create users manually with these emails and set passwords
-- 3. Copy their UUIDs and replace the examples below

-- Sample TPO Profile Data
-- INSERT INTO profiles (id, email, full_name, role, phone, created_at, updated_at) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'tpo@college.edu', 'Dr. John Smith', 'tpo', '+1234567890', NOW(), NOW()),
-- ('00000000-0000-0000-0000-000000000002', 'placement.officer@college.edu', 'Ms. Sarah Johnson', 'tpo', '+1234567891', NOW(), NOW());

-- Sample TPO Extended Profiles
-- INSERT INTO tpo_profiles (id, employee_id, department, designation, created_at, updated_at) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'TPO001', 'Training & Placement', 'Chief Placement Officer', NOW(), NOW()),
-- ('00000000-0000-0000-0000-000000000002', 'TPO002', 'Training & Placement', 'Assistant Placement Officer', NOW(), NOW());

-- Sample Company Profile Data
-- INSERT INTO profiles (id, email, full_name, role, phone, created_at, updated_at) VALUES
-- ('00000000-0000-0000-0000-000000000003', 'hr@techcorp.com', 'Michael Brown', 'company', '+1234567892', NOW(), NOW()),
-- ('00000000-0000-0000-0000-000000000004', 'recruitment@innovatetech.com', 'Lisa Davis', 'company', '+1234567893', NOW(), NOW()),
-- ('00000000-0000-0000-0000-000000000005', 'careers@globalsoft.com', 'Robert Wilson', 'company', '+1234567894', NOW(), NOW());

-- Sample Company Extended Profiles
-- INSERT INTO company_profiles (id, company_name, industry, website, description, address, hr_contact_name, hr_contact_email, hr_contact_phone, created_at, updated_at) VALUES
-- ('00000000-0000-0000-0000-000000000003', 'TechCorp Solutions', 'Information Technology', 'https://techcorp.com', 'Leading software development company specializing in enterprise solutions.', '123 Tech Street, Silicon Valley, CA 94000', 'Michael Brown', 'hr@techcorp.com', '+1234567892', NOW(), NOW()),
-- ('00000000-0000-0000-0000-000000000004', 'InnovateTech', 'Software Development', 'https://innovatetech.com', 'Innovative technology company focused on AI and machine learning solutions.', '456 Innovation Ave, Austin, TX 78701', 'Lisa Davis', 'recruitment@innovatetech.com', '+1234567893', NOW(), NOW()),
-- ('00000000-0000-0000-0000-000000000005', 'GlobalSoft Inc', 'IT Services', 'https://globalsoft.com', 'Global IT services provider with expertise in cloud computing and digital transformation.', '789 Global Plaza, New York, NY 10001', 'Robert Wilson', 'careers@globalsoft.com', '+1234567894', NOW(), NOW());

-- Instructions for manual setup:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add user" and create accounts with these details:

-- TPO Accounts to create:
-- Email: tpo@college.edu, Password: TPO@2024!, Confirm: true
-- Email: placement.officer@college.edu, Password: TPO@2024!, Confirm: true

-- Company Accounts to create:
-- Email: hr@techcorp.com, Password: Company@2024!, Confirm: true
-- Email: recruitment@innovatetech.com, Password: Company@2024!, Confirm: true
-- Email: careers@globalsoft.com, Password: Company@2024!, Confirm: true

-- After creating the auth users, get their UUIDs and run the INSERT statements above with the correct UUIDs

-- Function to help with account setup
CREATE OR REPLACE FUNCTION setup_preauthorized_account(
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    user_role TEXT,
    user_phone TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Insert into profiles table
    INSERT INTO profiles (id, email, full_name, role, phone, created_at, updated_at)
    VALUES (user_id, user_email, user_name, user_role::user_role, user_phone, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        updated_at = NOW();
        
    -- Log the account setup
    RAISE NOTICE 'Account setup completed for % (%) with role %', user_name, user_email, user_role;
END;
$$ LANGUAGE plpgsql;

-- Function to setup TPO profile
CREATE OR REPLACE FUNCTION setup_tpo_profile(
    user_id UUID,
    emp_id TEXT,
    dept TEXT DEFAULT 'Training & Placement',
    desig TEXT DEFAULT 'Placement Officer'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO tpo_profiles (id, employee_id, department, designation, created_at, updated_at)
    VALUES (user_id, emp_id, dept, desig, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        employee_id = EXCLUDED.employee_id,
        department = EXCLUDED.department,
        designation = EXCLUDED.designation,
        updated_at = NOW();
        
    RAISE NOTICE 'TPO profile setup completed for employee ID %', emp_id;
END;
$$ LANGUAGE plpgsql;

-- Function to setup Company profile
CREATE OR REPLACE FUNCTION setup_company_profile(
    user_id UUID,
    comp_name TEXT,
    comp_industry TEXT DEFAULT NULL,
    comp_website TEXT DEFAULT NULL,
    comp_description TEXT DEFAULT NULL,
    comp_address TEXT DEFAULT NULL,
    hr_name TEXT DEFAULT NULL,
    hr_email TEXT DEFAULT NULL,
    hr_phone TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO company_profiles (
        id, company_name, industry, website, description, address,
        hr_contact_name, hr_contact_email, hr_contact_phone, created_at, updated_at
    )
    VALUES (
        user_id, comp_name, comp_industry, comp_website, comp_description, comp_address,
        hr_name, hr_email, hr_phone, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        industry = EXCLUDED.industry,
        website = EXCLUDED.website,
        description = EXCLUDED.description,
        address = EXCLUDED.address,
        hr_contact_name = EXCLUDED.hr_contact_name,
        hr_contact_email = EXCLUDED.hr_contact_email,
        hr_contact_phone = EXCLUDED.hr_contact_phone,
        updated_at = NOW();
        
    RAISE NOTICE 'Company profile setup completed for %', comp_name;
END;
$$ LANGUAGE plpgsql;

-- Example usage (uncomment and modify with actual UUIDs after creating auth users):
/*
-- Setup TPO accounts
SELECT setup_preauthorized_account(
    '00000000-0000-0000-0000-000000000001'::UUID,
    'tpo@college.edu',
    'Dr. John Smith',
    'tpo',
    '+1234567890'
);

SELECT setup_tpo_profile(
    '00000000-0000-0000-0000-000000000001'::UUID,
    'TPO001',
    'Training & Placement',
    'Chief Placement Officer'
);

-- Setup Company accounts
SELECT setup_preauthorized_account(
    '00000000-0000-0000-0000-000000000003'::UUID,
    'hr@techcorp.com',
    'Michael Brown',
    'company',
    '+1234567892'
);

SELECT setup_company_profile(
    '00000000-0000-0000-0000-000000000003'::UUID,
    'TechCorp Solutions',
    'Information Technology',
    'https://techcorp.com',
    'Leading software development company specializing in enterprise solutions.',
    '123 Tech Street, Silicon Valley, CA 94000',
    'Michael Brown',
    'hr@techcorp.com',
    '+1234567892'
);
*/