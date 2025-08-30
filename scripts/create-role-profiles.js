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

async function createRoleProfiles() {
  console.log('🔧 Creating missing role-specific profiles...\n');

  // Get TPO profiles
  const { data: tpoProfiles, error: tpoError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('role', 'tpo');

  if (tpoError) {
    console.error('Error fetching TPO profiles:', tpoError);
    return;
  }

  console.log('📋 Creating TPO profiles...');
  for (const profile of tpoProfiles) {
    const tpoData = {
      'tpo@college.edu': {
        employee_id: 'TPO001',
        department: 'Training & Placement',
        designation: 'Chief Placement Officer'
      },
      'placement.officer@college.edu': {
        employee_id: 'TPO002',
        department: 'Training & Placement',
        designation: 'Assistant Placement Officer'
      }
    };

    if (tpoData[profile.email]) {
      const data = tpoData[profile.email];
      
      const { error: insertError } = await supabase
        .from('tpo_profiles')
        .insert({
          id: profile.id,
          employee_id: data.employee_id,
          department: data.department,
          designation: data.designation
        });

      if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
        console.error(`Error creating TPO profile for ${profile.email}:`, insertError);
      } else {
        console.log(`✅ TPO profile created for ${profile.email}`);
      }
    }
  }

  // Get Company profiles
  const { data: companyProfiles, error: companyError } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone')
    .eq('role', 'company');

  if (companyError) {
    console.error('Error fetching Company profiles:', companyError);
    return;
  }

  console.log('\n🏢 Creating Company profiles...');
  for (const profile of companyProfiles) {
    const companyData = {
      'hr@techcorp.com': {
        company_name: 'TechCorp Solutions',
        industry: 'Information Technology',
        website: 'https://techcorp.com',
        description: 'Leading software development company specializing in enterprise solutions.',
        address: '123 Tech Street, Silicon Valley, CA 94000'
      },
      'recruitment@innovatetech.com': {
        company_name: 'InnovateTech',
        industry: 'Software Development',
        website: 'https://innovatetech.com',
        description: 'Innovative technology company focused on AI and machine learning solutions.',
        address: '456 Innovation Ave, Austin, TX 78701'
      },
      'careers@globalsoft.com': {
        company_name: 'GlobalSoft Inc',
        industry: 'IT Services',
        website: 'https://globalsoft.com',
        description: 'Global IT services provider with expertise in cloud computing and digital transformation.',
        address: '789 Global Plaza, New York, NY 10001'
      }
    };

    if (companyData[profile.email]) {
      const data = companyData[profile.email];
      
      const { error: insertError } = await supabase
        .from('company_profiles')
        .insert({
          id: profile.id,
          company_name: data.company_name,
          industry: data.industry,
          website: data.website,
          description: data.description,
          address: data.address,
          hr_contact_name: profile.full_name,
          hr_contact_email: profile.email,
          hr_contact_phone: profile.phone
        });

      if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
        console.error(`Error creating Company profile for ${profile.email}:`, insertError);
      } else {
        console.log(`✅ Company profile created for ${profile.email}`);
      }
    }
  }

  console.log('\n✨ Role-specific profile creation completed!');
  
  // Final verification
  console.log('\n🔍 Final verification...');
  
  // Check TPO profiles
  const { data: finalTPOProfiles } = await supabase
    .from('tpo_profiles')
    .select(`
      *,
      profiles (email, full_name)
    `);

  console.log('\nTPO Profiles:');
  finalTPOProfiles?.forEach(tpo => {
    console.log(`✅ ${tpo.profiles.email} - ${tpo.profiles.full_name} (${tpo.employee_id})`);
  });

  // Check Company profiles
  const { data: finalCompanyProfiles } = await supabase
    .from('company_profiles')
    .select(`
      *,
      profiles (email, full_name)
    `);

  console.log('\nCompany Profiles:');
  finalCompanyProfiles?.forEach(company => {
    console.log(`✅ ${company.profiles.email} - ${company.company_name}`);
  });

  console.log('\n🎉 All accounts are now fully set up and ready to use!');
  console.log('\n📝 Test the accounts:');
  console.log('1. Go to /tpo-login and use: tpo@college.edu / TPO@2024!');
  console.log('2. Go to /company-login and use: hr@techcorp.com / Company@2024!');
}

// Run the process
createRoleProfiles().catch(console.error);