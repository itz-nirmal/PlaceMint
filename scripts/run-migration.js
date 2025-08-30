const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// You need to replace these with your actual Supabase URL and service key
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_SERVICE_KEY = 'your-supabase-service-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '005_tests_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running tests table migration...');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
    console.log('Tests table has been created with proper RLS policies.');
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();