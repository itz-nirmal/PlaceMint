# PlaceMint Auto-Update Features

PlaceMint includes comprehensive auto-update functionality that ensures all users are notified in real-time when data changes. Here's a detailed overview of all the automatic update features implemented:

## 🔄 Automatic Timestamp Updates

### Database Level Auto-Updates

Every table in the database automatically updates timestamps when records are modified:

- **`created_at`**: Automatically set when a record is created
- **`updated_at`**: Automatically updated whenever a record is modified

This is implemented using PostgreSQL triggers:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Tables with Auto-Timestamps:
- ✅ `profiles`
- ✅ `student_profiles`
- ✅ `company_profiles`
- ✅ `tpo_profiles`
- ✅ `job_postings`
- ✅ `applications`
- ✅ `placement_drives`

## 📡 Real-Time Subscriptions

### Supabase Real-Time Integration

All tables are enabled for real-time updates using Supabase's real-time functionality:

```typescript
// Real-time subscription example
const channel = supabase
  .channel('profile-changes')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `id=eq.${userId}`,
  }, (payload) => {
    // Handle real-time update
    console.log('Profile updated:', payload);
  })
  .subscribe();
```

### Real-Time Features Available:

1. **Profile Updates** (`useProfileRealtime`)
   - Student profile changes
   - Company profile changes
   - TPO profile changes
   - Basic profile information updates

2. **Job Posting Updates** (`useJobsRealtime`)
   - New job postings
   - Job status changes (active/inactive)
   - Job details modifications

3. **Application Updates** (`useApplicationsRealtime`)
   - New applications submitted
   - Application status changes
   - Application updates

4. **Notification Updates** (`useNotificationsRealtime`)
   - New notifications
   - Notification read status changes
   - Real-time unread count updates

5. **Placement Drive Updates** (`usePlacementDrivesRealtime`)
   - New placement drives
   - Drive details updates
   - Registration updates

## 🔔 Automatic Notifications

### Trigger-Based Notifications

The system automatically creates notifications when important events occur:

#### For Students:
- ✅ **Application Status Changes**: Notified when application status changes (pending → shortlisted → selected/rejected)
- ✅ **New Job Postings**: Notified when new jobs are posted
- ✅ **New Placement Drives**: Notified when new placement drives are scheduled
- ✅ **Job Closures**: Notified when jobs they applied for are closed
- ✅ **Profile Updates**: Confirmation when their profile is updated

#### For Companies:
- ✅ **New Applications**: Notified when students apply for their jobs
- ✅ **Profile Updates**: Confirmation when their company profile is updated

#### For TPOs:
- ✅ **System-wide visibility**: Can view all activities and changes
- ✅ **Detailed change logs**: Access to comprehensive audit trails

### Notification Types:
- 🟢 **Success**: Profile updates, successful applications
- 🔴 **Error**: Failed operations, rejections
- 🟡 **Warning**: Job closures, deadline reminders
- 🔵 **Info**: General updates, new postings

## 📊 Activity Tracking

### User Activity Monitoring

The system tracks and displays user activities:

```typescript
// Get user's recent activity
const { activities } = useUserActivity(userId);
```

#### Tracked Activities:
- **Profile Changes**: What fields were updated and when
- **Job Applications**: Applications submitted with status
- **Drive Registrations**: Placement drive registrations
- **System Interactions**: Login, profile views, etc.

### Change Log System

For TPOs and administrators, detailed change logs are maintained:

```sql
CREATE TABLE profile_change_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    table_name TEXT NOT NULL,
    changed_fields JSONB,
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES profiles(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Change Log Features:
- **Field-level tracking**: Exactly which fields changed
- **Before/after values**: Complete audit trail
- **User attribution**: Who made the changes
- **Timestamp tracking**: When changes occurred

## 🎯 React Integration

### Custom Hooks for Real-Time Updates

The system provides React hooks that automatically handle real-time subscriptions:

```typescript
// Master hook that handles all subscriptions
const { unreadCount } = useRealtimeSubscriptions(userId, userRole);

// Individual hooks for specific features
const { activities } = useUserActivity(userId);
const { changeLogs } = useChangeLog(userId);
const { data: notifications } = useNotifications(userId);
```

### Automatic Cache Updates

React Query integration ensures UI stays in sync:

- **Optimistic Updates**: UI updates immediately, then syncs with server
- **Automatic Refetching**: Data refreshes when changes are detected
- **Error Handling**: Rollback on failures with user notifications

## 🔧 Implementation Examples

### 1. Student Profile Update Flow

```typescript
// When a student updates their profile:
const updateMutation = useUpdateStudentProfile();

updateMutation.mutate({
  id: studentId,
  updates: { cgpa: 8.5, skills: ['React', 'Node.js'] }
});

// This triggers:
// 1. Database update with automatic timestamp
// 2. Real-time notification to the student
// 3. Change log entry for TPO visibility
// 4. UI cache invalidation and refresh
```

### 2. Application Status Change Flow

```typescript
// When a company updates application status:
const updateStatus = useUpdateApplicationStatus();

updateStatus.mutate({
  id: applicationId,
  status: 'selected'
});

// This triggers:
// 1. Database update
// 2. Automatic notification to the student
// 3. Real-time UI update for both student and company
// 4. Activity log entry
```

### 3. New Job Posting Flow

```typescript
// When a company posts a new job:
const createJob = useCreateJob();

createJob.mutate({
  title: 'Software Engineer',
  company_id: companyId,
  // ... other job details
});

// This triggers:
// 1. Database insertion
// 2. Notifications to all students
// 3. Real-time job list updates
// 4. Activity tracking
```

## 🎨 UI Components

### NotificationCenter Component
- Real-time notification display
- Unread count badge
- Mark as read functionality
- Notification type styling

### ActivityTracker Component
- Recent activity timeline
- Change log viewer (for TPOs)
- Activity type icons and colors
- Time-based sorting

## 🔒 Security & Privacy

### Row Level Security (RLS)
- Users can only see their own data
- TPOs have broader access for management
- Companies can only see their job-related data

### Change Attribution
- All changes are attributed to the user who made them
- Anonymous changes are not allowed
- Audit trail for compliance

## 🚀 Performance Optimizations

### Efficient Real-Time Updates
- Filtered subscriptions (only relevant data)
- Debounced updates to prevent spam
- Automatic cleanup of old notifications

### Database Optimizations
- Indexes on frequently queried fields
- Efficient triggers that only fire when needed
- Cleanup functions for old data

## 📱 Usage in Components

### Adding Real-Time to New Components

```typescript
import { useRealtimeSubscriptions } from '@/hooks/useRealtime';
import { useProfile } from '@/hooks/useDatabase';

function MyComponent() {
  const { data: profile } = useProfile();
  
  // This automatically sets up all real-time subscriptions
  useRealtimeSubscriptions(profile?.id, profile?.role);
  
  return (
    // Your component JSX
  );
}
```

### Notification Integration

```typescript
import NotificationCenter from '@/components/NotificationCenter';

function Header() {
  return (
    <div className="header">
      {/* Other header content */}
      <NotificationCenter />
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables
No additional environment variables needed - uses existing Supabase configuration.

### Database Setup
Run the real-time features migration:

```sql
-- Execute the contents of:
-- supabase/migrations/002_realtime_features.sql
```

## 🎯 Summary

The PlaceMint auto-update system provides:

✅ **Automatic timestamp management**
✅ **Real-time data synchronization**
✅ **Intelligent notifications**
✅ **Comprehensive activity tracking**
✅ **Detailed change logging**
✅ **Secure, role-based access**
✅ **Performance-optimized updates**
✅ **Easy React integration**

Users will always see the most up-to-date information, receive relevant notifications, and have full visibility into system changes - all happening automatically in real-time!