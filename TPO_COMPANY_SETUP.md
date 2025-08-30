# TPO & Company Account Setup Guide

This guide explains how to set up pre-authorized TPO and Company accounts that can only login (no signup).

## 🔐 **Security Model**

- **Students**: Can sign up and create their own accounts
- **TPOs**: Pre-authorized accounts only - no public signup
- **Companies**: Pre-authorized accounts only - no public signup

## 📋 **Setup Process**

### **Step 1: Create Auth Users in Supabase**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication > Users**
3. Click **"Add user"** for each account you want to create

### **Step 2: Sample TPO Accounts**

Create these TPO accounts in Supabase Auth:

| Email | Password | Role |
|-------|----------|------|
| `tpo@college.edu` | `TPO@2024!` | TPO |
| `placement.officer@college.edu` | `TPO@2024!` | TPO |

**Steps:**
1. Click "Add user"
2. Enter email and password
3. Set "Email Confirm" to `true`
4. Click "Create user"
5. **Copy the User ID (UUID)** - you'll need this!

### **Step 3: Sample Company Accounts**

Create these Company accounts in Supabase Auth:

| Email | Password | Role |
|-------|----------|------|
| `hr@techcorp.com` | `Company@2024!` | Company |
| `recruitment@innovatetech.com` | `Company@2024!` | Company |
| `careers@globalsoft.com` | `Company@2024!` | Company |

### **Step 4: Run Database Migration**

1. First, run the migration file:
   ```sql
   -- Execute: supabase/migrations/003_seed_tpo_company_accounts.sql
   ```

### **Step 5: Setup Profiles with Actual UUIDs**

After creating the auth users, get their UUIDs and run these commands in your Supabase SQL Editor:

#### **For TPO Accounts:**

```sql
-- Replace 'ACTUAL_UUID_HERE' with the real UUID from Supabase Auth
SELECT setup_preauthorized_account(
    'ACTUAL_UUID_HERE'::UUID,
    'tpo@college.edu',
    'Dr. John Smith',
    'tpo',
    '+1234567890'
);

SELECT setup_tpo_profile(
    'ACTUAL_UUID_HERE'::UUID,
    'TPO001',
    'Training & Placement',
    'Chief Placement Officer'
);
```

#### **For Company Accounts:**

```sql
-- Replace 'ACTUAL_UUID_HERE' with the real UUID from Supabase Auth
SELECT setup_preauthorized_account(
    'ACTUAL_UUID_HERE'::UUID,
    'hr@techcorp.com',
    'Michael Brown',
    'company',
    '+1234567892'
);

SELECT setup_company_profile(
    'ACTUAL_UUID_HERE'::UUID,
    'TechCorp Solutions',
    'Information Technology',
    'https://techcorp.com',
    'Leading software development company specializing in enterprise solutions.',
    '123 Tech Street, Silicon Valley, CA 94000',
    'Michael Brown',
    'hr@techcorp.com',
    '+1234567892'
);
```

## 🔑 **Test Credentials**

After setup, you can test with these credentials:

### **TPO Login** (`/tpo-login`)
- Email: `tpo@college.edu`
- Password: `TPO@2024!`

### **Company Login** (`/company-login`)
- Email: `hr@techcorp.com`
- Password: `Company@2024!`

## 🛡️ **Security Features**

### **Role Verification**
- TPO login page checks if user has `role = 'tpo'`
- Company login page checks if user has `role = 'company'`
- If wrong role, user is signed out and access denied

### **Access Control**
- Students can only access student features
- TPOs can access all student data and manage placements
- Companies can only access their own job postings and applications

## 🔧 **Adding New Accounts**

### **To add a new TPO:**

1. Create auth user in Supabase Dashboard
2. Get the UUID
3. Run:
```sql
SELECT setup_preauthorized_account(
    'NEW_UUID'::UUID,
    'new.tpo@college.edu',
    'New TPO Name',
    'tpo',
    '+1234567890'
);

SELECT setup_tpo_profile(
    'NEW_UUID'::UUID,
    'TPO003',
    'Training & Placement',
    'Placement Officer'
);
```

### **To add a new Company:**

1. Create auth user in Supabase Dashboard
2. Get the UUID
3. Run:
```sql
SELECT setup_preauthorized_account(
    'NEW_UUID'::UUID,
    'hr@newcompany.com',
    'HR Manager Name',
    'company',
    '+1234567890'
);

SELECT setup_company_profile(
    'NEW_UUID'::UUID,
    'New Company Name',
    'Industry',
    'https://website.com',
    'Company description',
    'Company address',
    'HR Contact Name',
    'hr@newcompany.com',
    '+1234567890'
);
```

## 🚀 **Login URLs**

- **Students**: `/auth` (can signup and login)
- **TPOs**: `/tpo-login` (login only)
- **Companies**: `/company-login` (login only)

## ✅ **Verification**

After setup, verify:

1. ✅ Students can sign up at `/auth`
2. ✅ TPO can login at `/tpo-login` with correct credentials
3. ✅ Company can login at `/company-login` with correct credentials
4. ✅ Wrong role users get access denied
5. ✅ All users redirect to `/dashboard` after successful login

## 🔍 **Troubleshooting**

### **"Access denied" error:**
- Check if the user's role in the `profiles` table matches the login page
- Verify the profile was created correctly

### **"User not found" error:**
- Check if the auth user was created in Supabase Auth
- Verify the email is correct

### **Profile not found:**
- Run the setup functions with the correct UUID
- Check if the profile was inserted into the database

This setup ensures only authorized TPOs and Companies can access the system while allowing students to freely register! 🎯