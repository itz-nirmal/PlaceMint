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

// Account data for completion
const accountData = {
  'tpo@college.edu': {
    type: 'tpo',
    full_name: 'Dr. John Smith',
    phone: '+1234567890',
    employee_id: 'TPO001',
    department: 'Training & Placement',
    designation: 'Chief Placement Officer'
  },
  'placement.officer@college.edu': {
    type: 'tpo',
    full_name: 'Ms. Sarah Johnson',
    phone: '+1234567891',
    employee_id: 'TPO002',
    department: 'Training & Placement',
    designation: 'Assistant Placement Officer'
  },
  'hr@techcorp.com': {
    type: 'company',
    full_name: 'Michael Brown',
    phone: '+1234567892',
    company_name: 'TechCorp Solutions',
    industry: 'Information Technology',
    website: 'https://techcorp.com',
    description: 'Leading software development company specializing in enterprise solutions.',
    address: '123 Tech Street, Silicon Valley, CA 94000'
  },
  'recruitment@innovatetech.com': {
    type: 'company',
    full_name: 'Lisa Davis',
    phone: '+1234567893',
    company_name: 'InnovateTech',
    industry: 'Software Development',
    website: 'https://innovatetech.com',
    description: 'Innovative technology company focused on AI and machine learning solutions.',
    address: '456 Innovation Ave, Austin, TX 78701'
  },
  'careers@globalsoft.com': {
    type: 'company',
    full_name: 'Robert Wilson',
    phone: '+1234567894',
    company_name: 'GlobalSoft Inc',
    industry: 'IT Services',
    website: 'https://globalsoft.com',
    description: 'Global IT services provider with expertise in cloud computing and digital transformation.',
    address: '789 Global Plaza, New York, NY 10001'
  }
};

async function completeProfiles() {
  console.log('🔧 Completing profile setup for existing accounts...\n');

  // Get all auth users
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  for (const user of users.users) {
    const email = user.email;
    const userId = user.id;
    
    if (!accountData[email]) {
      continue; // Skip users not in our account data
    }

    const data = accountData[email];
    console.log(`Processing ${email}...`);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          full_name: data.full_name,
          role: data.type,
          phone: data.phone
        });

      if (profileError) {
        console.error(`Error updating profile for ${email}:`, profileError);
        continue;
      }

      console.log(`✅ Profile updated for ${email}`);

      // Create role-specific profile
      if (data.type === 'tpo') {
        const { error: tpoError } = await supabase
          .from('tpo_profiles')
          .upsert({
            id: userId,
            employee_id: data.employee_id,
            department: data.department,
            designation: data.designation
          });

        if (tpoError) {
          console.error(`Error creating TPO profile for ${email}:`, tpoError);
        } else {
          console.log(`✅ TPO profile created for ${email}`);
        }
      } else if (data.type === 'company') {
        const { error: companyError } = await supabase
          .from('company_profiles')
          .upsert({
            id: userId,
            company_name: data.company_name,
            industry: data.industry,
            website: data.website,
            description: data.description,
            address: data.address,
            hr_contact_name: data.full_name,
            hr_contact_email: email,
            hr_contact_phone: data.phone
          });

        if (companyError) {
          console.error(`Error creating Company profile for ${email}:`, companyError);
        } else {
          console.log(`✅ Company profile created for ${email}`);
        }
      }

      console.log(''); // Add spacing
    } catch (error) {
      console.error(`Unexpected error processing ${email}:`, error);
    }
  }

  console.log('✨ Profile completion process finished!');
  
  // Verify the setup
  console.log('\n🔍 Verifying account setup...');
  
  for (const email of Object.keys(accountData)) {
    const data = accountData[email];
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError) {
      console.log(`❌ Profile missing for ${email}`);
      continue;
    }

    console.log(`✅ Profile exists for ${email} (${profile.role})`);

    // Check role-specific profile
    if (data.type === 'tpo') {
      const { data: tpoProfile, error: tpoError } = await supabase
        .from('tpo_profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (tpoError) {
        console.log(`❌ TPO profile missing for ${email}`);
      } else {
        console.log(`✅ TPO profile exists for ${email} (${tpoProfile.employee_id})`);
      }
    } else if (data.type === 'company') {
      const { data: companyProfile, error: companyError } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (companyError) {
        console.log(`❌ Company profile missing for ${email}`);
      } else {
        console.log(`✅ Company profile exists for ${email} (${companyProfile.company_name})`);
      }
    }
  }

  console.log('\n🎉 All accounts are ready for use!');
  console.log('\n📝 Login Credentials:');
  console.log('TPO Accounts:');
  console.log('  - tpo@college.edu / TPO@2024!');
  console.log('  - placement.officer@college.edu / TPO@2024!');
  console.log('\nCompany Accounts:');
  console.log('  - hr@techcorp.com / Company@2024!');
  console.log('  - recruitment@innovatetech.com / Company@2024!');
  console.log('  - careers@globalsoft.com / Company@2024!');
}

// Run the completion process
completeProfiles().catch(console.error);