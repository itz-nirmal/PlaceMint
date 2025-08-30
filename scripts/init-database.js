#!/usr/bin/env node

/**
 * Database Initialization Script for PlaceMint
 * 
 * This script helps initialize the PostgreSQL database with the required schema.
 * It can be run to set up the database structure for the placement management system.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://zrhgxrftisqhgqxosglq.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // You'll need to add this to your .env

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY is required for database initialization');
  console.log('Please add your Supabase service role key to your .env file:');
  console.log('SUPABASE_SERVICE_KEY=your_service_role_key_here');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing database migration...');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }

    console.log('✅ Database schema created successfully!');
    
    // Create some sample data
    await createSampleData();
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function createSampleData() {
  console.log('📝 Creating sample data...');
  
  try {
    // Note: In a real scenario, you would create users through Supabase Auth
    // This is just for demonstration of the database structure
    
    console.log('ℹ️  Sample data creation skipped - users should be created through authentication flow');
    console.log('ℹ️  You can now register users through your application interface');
    
  } catch (error) {
    console.error('⚠️  Sample data creation failed:', error);
    // Don't exit on sample data failure
  }
}

// Run the initialization
initializeDatabase();