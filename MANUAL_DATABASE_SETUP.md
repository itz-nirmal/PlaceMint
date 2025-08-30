# Manual Database Setup Instructions

## Issue Fixes Implemented

### 1. Fixed "Get Started" Button Redirects
- **Problem**: TPO and Company "Get Started" buttons were redirecting to general signup instead of their respective login pages
- **Solution**: Updated `HeroSection.tsx` to redirect TPO to `/tpo-login` and Company to `/company-login`

### 2. Fixed Profile Creation Issue
- **Problem**: When users create accounts, only Supabase Auth records were created, not the corresponding SQL table records
- **Solution**: Implemented automatic profile creation with fallback mechanisms

## Database Migration (Optional)

The application now works without requiring a database trigger, but you can optionally set up automatic profile creation by running this SQL in your Supabase dashboard:

### Optional: Set up Database Trigger
1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL script:

```sql
-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  -- Insert a new profile record for the new user
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'),
    NOW(),
    NOW()
  );

  -- If the user is a student, also create a student profile
  IF COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student') = 'student' THEN
    INSERT INTO public.student_profiles (id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW());
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Note**: The application will work perfectly without this trigger as it now includes application-level profile creation.

### Step 2: Test the Setup

1. **Test Student Registration**:
   - Go to the home page
   - Click "Get Started as Student" - should go to `/auth?type=signup`
   - Create a new student account
   - Verify that both `profiles` and `student_profiles` tables have the new record

2. **Test TPO/Company Login Redirects**:
   - Go to the home page
   - Click "Login as TPO" - should go to `/tpo-login`
   - Click "Login as Company" - should go to `/company-login`

## Application-Level Safeguards

The application also includes fallback mechanisms:

### 1. Profile Utility Functions
- `ensureProfileExists()` function in `src/utils/profileUtils.ts`
- Automatically creates profiles if they don't exist during login/signup
- Handles both main profile and role-specific profile creation

### 2. Enhanced Authentication Flow
- Student signup now includes profile creation fallback
- TPO and Company login pages verify role permissions
- Automatic profile creation for edge cases

## Files Modified

1. **`src/components/HeroSection.tsx`**
   - Fixed "Get Started" button redirects for TPO and Company

2. **`src/pages/Auth.tsx`**
   - Added profile creation logic for student signup
   - Imported and used profile utility functions

3. **`src/pages/TPOLogin.tsx`**
   - Added profile utility import (for future enhancements)

4. **`src/pages/CompanyLogin.tsx`**
   - Added profile utility import (for future enhancements)

5. **`src/utils/profileUtils.ts`** (New file)
   - Utility functions for profile management
   - `ensureProfileExists()` - Creates profiles if missing
   - `getUserProfile()` - Retrieves user profile data

6. **`supabase/migrations/004_auto_profile_creation.sql`** (New file)
   - Database trigger for automatic profile creation
   - Must be run manually in Supabase dashboard

## Testing Checklist

- [ ] Home page TPO "Get Started" redirects to `/tpo-login`
- [ ] Home page Company "Get Started" redirects to `/company-login`
- [ ] Home page Student "Get Started" redirects to `/auth?type=signup`
- [ ] Student signup creates records in both `profiles` and `student_profiles` tables
- [ ] Existing users can still login without issues
- [ ] TPO login verifies role permissions
- [ ] Company login verifies role permissions

## Notes

- The database trigger will handle profile creation for new signups automatically
- The application-level fallbacks ensure compatibility with existing users
- All changes are backward compatible with existing data
- Role-based access control is maintained for TPO and Company logins