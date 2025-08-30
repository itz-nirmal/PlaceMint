import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://zrhgxrftisqhgqxosglq.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaGd4cmZ0aXNxaGdxeG9zZ2xxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU2MzI0MiwiZXhwIjoyMDcyMTM5MjQyfQ.NwoYc21VhnthVG4yLKcz2Q1IObJPocgygZZzINZf-vI";

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// TPO accounts to create
const tpoAccounts = [
  {
    email: 'tpo@college.edu',
    password: 'TPO@2024!',
    full_name: 'Dr. John Smith',
    phone: '+1234567890',
    employee_id: 'TPO001',
    department: 'Training & Placement',
    designation: 'Chief Placement Officer'
  },
  {
    email: 'placement.officer@college.edu',
    password: 'TPO@2024!',
    full_name: 'Ms. Sarah Johnson',
    phone: '+1234567891',
    employee_id: 'TPO002',
    department: 'Training & Placement',
    designation: 'Assistant Placement Officer'
  }
];

// Company accounts to create
const companyAccounts = [
  {
    email: 'hr@techcorp.com',
    password: 'Company@2024!',
    full_name: 'Michael Brown',
    phone: '+1234567892',
    company_name: 'TechCorp Solutions',
    industry: 'Information Technology',
    website: 'https://techcorp.com',
    description: 'Leading software development company specializing in enterprise solutions.',
    address: '123 Tech Street, Silicon Valley, CA 94000'
  },
  {
    email: 'recruitment@innovatetech.com',
    password: 'Company@2024!',
    full_name: 'Lisa Davis',
    phone: '+1234567893',
    company_name: 'InnovateTech',
    industry: 'Software Development',
    website: 'https://innovatetech.com',
    description: 'Innovative technology company focused on AI and machine learning solutions.',
    address: '456 Innovation Ave, Austin, TX 78701'
  },
  {
    email: 'careers@globalsoft.com',
    password: 'Company@2024!',
    full_name: 'Robert Wilson',
    phone: '+1234567894',
    company_name: 'GlobalSoft Inc',
    industry: 'IT Services',
    website: 'https://globalsoft.com',
    description: 'Global IT services provider with expertise in cloud computing and digital transformation.',
    address: '789 Global Plaza, New York, NY 10001'
  }
];

async function createTPOAccount(tpoData) {
  try {
    console.log(`Creating TPO account for ${tpoData.email}...`);
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: tpoData.email,
      password: tpoData.password,
      email_confirm: true,
      user_metadata: {
        full_name: tpoData.full_name,
        role: 'tpo'
      }
    });

    if (authError) {
      console.error(`Error creating auth user for ${tpoData.email}:`, authError);
      return;
    }

    const userId = authData.user.id;
    console.log(`Auth user created with ID: ${userId}`);

    // Update profile (in case trigger created it with default values)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: tpoData.email,
        full_name: tpoData.full_name,
        role: 'tpo',
        phone: tpoData.phone
      });

    if (profileError) {
      console.error(`Error updating profile for ${tpoData.email}:`, profileError);
      return;
    }

    // Create TPO profile
    const { error: tpoProfileError } = await supabase
      .from('tpo_profiles')
      .insert({
        id: userId,
        employee_id: tpoData.employee_id,
        department: tpoData.department,
        designation: tpoData.designation
      });

    if (tpoProfileError) {
      console.error(`Error creating TPO profile for ${tpoData.email}:`, tpoProfileError);
      return;
    }

    console.log(`✅ TPO account created successfully for ${tpoData.email}`);
    return userId;

  } catch (error) {
    console.error(`Unexpected error creating TPO account for ${tpoData.email}:`, error);
  }
}

async function createCompanyAccount(companyData) {
  try {
    console.log(`Creating Company account for ${companyData.email}...`);
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: companyData.email,
      password: companyData.password,
      email_confirm: true,
      user_metadata: {
        full_name: companyData.full_name,
        role: 'company'
      }
    });

    if (authError) {
      console.error(`Error creating auth user for ${companyData.email}:`, authError);
      return;
    }

    const userId = authData.user.id;
    console.log(`Auth user created with ID: ${userId}`);

    // Update profile (in case trigger created it with default values)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: companyData.email,
        full_name: companyData.full_name,
        role: 'company',
        phone: companyData.phone
      });

    if (profileError) {
      console.error(`Error updating profile for ${companyData.email}:`, profileError);
      return;
    }

    // Create Company profile
    const { error: companyProfileError } = await supabase
      .from('company_profiles')
      .insert({
        id: userId,
        company_name: companyData.company_name,
        industry: companyData.industry,
        website: companyData.website,
        description: companyData.description,
        address: companyData.address,
        hr_contact_name: companyData.full_name,
        hr_contact_email: companyData.email,
        hr_contact_phone: companyData.phone
      });

    if (companyProfileError) {
      console.error(`Error creating Company profile for ${companyData.email}:`, companyProfileError);
      return;
    }

    console.log(`✅ Company account created successfully for ${companyData.email}`);
    return userId;

  } catch (error) {
    console.error(`Unexpected error creating Company account for ${companyData.email}:`, error);
  }
}

async function seedAccounts() {
  console.log('🚀 Starting account seeding process...\n');

  // Create TPO accounts
  console.log('📋 Creating TPO accounts...');
  for (const tpoData of tpoAccounts) {
    await createTPOAccount(tpoData);
    console.log(''); // Add spacing
  }

  // Create Company accounts
  console.log('🏢 Creating Company accounts...');
  for (const companyData of companyAccounts) {
    await createCompanyAccount(companyData);
    console.log(''); // Add spacing
  }

  console.log('✨ Account seeding process completed!');
  console.log('\n📝 Account Summary:');
  console.log('TPO Accounts:');
  tpoAccounts.forEach(tpo => {
    console.log(`  - ${tpo.email} (${tpo.full_name})`);
  });
  console.log('\nCompany Accounts:');
  companyAccounts.forEach(company => {
    console.log(`  - ${company.email} (${company.company_name})`);
  });
  
  console.log('\n🔐 Default Passwords:');
  console.log('  - TPO accounts: TPO@2024!');
  console.log('  - Company accounts: Company@2024!');
}

// Run the seeding process
seedAccounts().catch(console.error);