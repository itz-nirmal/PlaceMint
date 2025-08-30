# PlaceMint Database Setup Guide

This guide will help you set up the PostgreSQL database for the PlaceMint placement management system using Supabase.

## Overview

PlaceMint uses Supabase as its backend, which provides a PostgreSQL database with additional features like authentication, real-time subscriptions, and row-level security.

## Database Schema

The database includes the following main tables:

### Core Tables

1. **profiles** - Base user profiles (extends Supabase auth.users)
2. **student_profiles** - Extended student information
3. **company_profiles** - Company information and details
4. **tpo_profiles** - Training and Placement Officer profiles
5. **job_postings** - Job opportunities posted by companies
6. **applications** - Student applications to jobs
7. **placement_drives** - Campus placement drive information
8. **drive_registrations** - Student registrations for placement drives
9. **notifications** - System notifications for users

### Enums

- **user_role**: 'student', 'tpo', 'company'
- **application_status**: 'pending', 'shortlisted', 'rejected', 'selected'
- **job_type**: 'full_time', 'part_time', 'internship', 'contract'

## Setup Instructions

### 1. Supabase Project Setup

Your Supabase project is already configured with:
- Project ID: `zrhgxrftisqhgqxosglq`
- URL: `https://zrhgxrftisqhgqxosglq.supabase.co`

### 2. Environment Variables

Your `.env` file is already configured with:
```env
VITE_SUPABASE_PROJECT_ID="zrhgxrftisqhgqxosglq"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="https://zrhgxrftisqhgqxosglq.supabase.co"
```

### 3. Database Migration

You need to run **TWO** migration files in order:

1. `supabase/migrations/001_initial_schema.sql` - Creates the basic database schema
2. `supabase/migrations/002_realtime_features.sql` - Adds real-time features and notifications

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to the SQL Editor
4. **First**, copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Run the SQL script
6. **Then**, copy and paste the contents of `supabase/migrations/002_realtime_features.sql`
7. Run the second SQL script

#### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref zrhgxrftisqhgqxosglq

# Run migrations (this will run both files in order)
supabase db push
```

#### Option C: Manual SQL Execution

1. Go to your Supabase Dashboard → SQL Editor
2. Run the first migration:
   ```sql
   -- Copy and paste the entire contents of:
   -- supabase/migrations/001_initial_schema.sql
   ```
3. After successful execution, run the second migration:
   ```sql
   -- Copy and paste the entire contents of:
   -- supabase/migrations/002_realtime_features.sql
   ```

### 4. Verify Setup

After running **both** migrations, verify that everything was created:

1. Go to your Supabase Dashboard
2. Navigate to the Table Editor
3. You should see all the tables listed in the schema:
   - `profiles`
   - `student_profiles`
   - `company_profiles`
   - `tpo_profiles`
   - `job_postings`
   - `applications`
   - `placement_drives`
   - `drive_registrations`
   - `notifications`
   - `profile_change_log`

4. Check that real-time is enabled:
   - Go to Database → Replication
   - Ensure all tables are listed under "Tables in replication"

## Database Features

### Row Level Security (RLS)

The database implements comprehensive Row Level Security policies:

- **Students** can only view/edit their own profiles and applications
- **Companies** can manage their own job postings and view applications for their jobs
- **TPOs** have broader access to view student and company data
- **Public access** is allowed for viewing active job postings

### Real-Time Features

The second migration (`002_realtime_features.sql`) adds:

- **Real-time subscriptions** for all tables
- **Automatic notifications** when important events occur
- **Change logging** for audit trails
- **Activity tracking** for user actions
- **Trigger-based notifications** for status changes

### Automatic Timestamps

All tables include `created_at` and `updated_at` timestamps that are automatically managed through database triggers.

### Automatic Notifications

The system automatically creates notifications for:
- Application status changes
- New job postings
- New placement drives
- Profile updates
- Job closures

### Change Logging

A comprehensive audit trail is maintained in the `profile_change_log` table:
- Tracks what fields changed
- Stores before/after values
- Records who made the change
- Timestamps all modifications

### Indexes

Optimized indexes are created for:
- User roles and email lookups
- Job posting queries
- Application filtering
- Notification management
- Change log queries
- Real-time subscription performance

## Usage Examples

### Using the Database Services

```typescript
import { jobService, applicationService } from '@/services/database';

// Get all active jobs
const jobs = await jobService.getActiveJobs();

// Apply for a job
await applicationService.applyForJob({
  student_id: 'user-id',
  job_id: 'job-id',
  cover_letter: 'My cover letter...'
});
```

### Using React Hooks

```typescript
import { useActiveJobs, useApplyForJob } from '@/hooks/useDatabase';

function JobList() {
  const { data: jobs, isLoading } = useActiveJobs();
  const applyMutation = useApplyForJob();

  const handleApply = (jobId: string) => {
    applyMutation.mutate({
      student_id: currentUser.id,
      job_id: jobId,
      cover_letter: 'My application...'
    });
  };

  // ... component logic
}
```

### Using Real-Time Features

```typescript
import { useRealtimeSubscriptions } from '@/hooks/useRealtime';
import { useProfile } from '@/hooks/useDatabase';
import NotificationCenter from '@/components/NotificationCenter';
import ActivityTracker from '@/components/ActivityTracker';

function Dashboard() {
  const { data: profile } = useProfile();
  
  // This sets up all real-time subscriptions automatically
  const { unreadCount } = useRealtimeSubscriptions(profile?.id, profile?.role);

  return (
    <div>
      {/* Notification bell with real-time unread count */}
      <NotificationCenter />
      
      {/* Activity tracker showing real-time updates */}
      <ActivityTracker userId={profile?.id} />
      
      {/* Your other dashboard content */}
    </div>
  );
}
```

### Activity Tracking

```typescript
import { useUserActivity, useChangeLog } from '@/hooks/useRealtime';

function UserProfile({ userId }) {
  const { activities, loading } = useUserActivity(userId);
  const { changeLogs } = useChangeLog(userId); // For TPOs only

  return (
    <div>
      <h3>Recent Activity</h3>
      {activities.map(activity => (
        <div key={activity.id}>
          {activity.description} - {activity.timestamp}
        </div>
      ))}
    </div>
  );
}
```

## Data Flow

1. **User Registration**: Users register through Supabase Auth
2. **Profile Creation**: After registration, users create their specific profile (student/company/TPO)
3. **Job Management**: Companies post jobs, students apply
4. **Application Tracking**: Applications are tracked through various statuses
5. **Notifications**: System sends notifications for important events

## Security Considerations

- All sensitive operations require authentication
- RLS policies prevent unauthorized data access
- User roles determine access levels
- API keys should be kept secure and not exposed in client-side code

## Troubleshooting

### Common Issues

1. **Migration Fails**: Check that you have the correct permissions and the SQL syntax is valid
2. **RLS Policies**: If you can't access data, verify that the RLS policies are correctly set up
3. **Authentication**: Ensure users are properly authenticated before accessing protected resources
4. **Activity Tracking Not Working**: 
   - Ensure both migrations have been run successfully
   - Check that the `profile_change_log` table exists
   - Verify RLS policies allow access to change logs for TPOs
   - Use the `useBasicUserActivity` hook as a fallback if the main hook fails
5. **Real-time Features Not Working**:
   - Verify that real-time is enabled in your Supabase project
   - Check that tables are added to the replication publication
   - Ensure your browser supports WebSocket connections

### Testing Activity Tracking

You can test the activity tracking hooks using the `ActivityTest` component:

```typescript
import ActivityTest from '@/components/ActivityTest';

// Add this to any page to test the hooks
<ActivityTest />
```

This component will show:
- Current user profile information
- Results from the main activity hook
- Results from the basic activity hook (fallback)
- Change log results (for TPOs only)
- Error messages if any hooks fail

### Hook Fallbacks

The system includes multiple fallback mechanisms:

1. **`useUserActivity`**: Primary hook that queries applications and drive registrations
2. **`useBasicUserActivity`**: Fallback hook that uses notifications as activity indicators
3. **`useChangeLog`**: Gracefully handles missing tables with proper error messages

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the database logs in your Supabase dashboard
- Ensure your environment variables are correctly set
- Use the ActivityTest component to diagnose hook issues
- Check browser console for detailed error messages

## Next Steps

After setting up the database:

1. Test user registration and profile creation
2. Create sample job postings
3. Test the application flow
4. Set up real-time subscriptions for notifications
5. Configure email templates for notifications

The database is now ready to support your PlaceMint placement management system!