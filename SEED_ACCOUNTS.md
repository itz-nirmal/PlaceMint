# Account Seeding Guide

This guide explains how to seed pre-authorized TPO and Company accounts using the service role key.

## Pre-seeded Accounts

### TPO Accounts
1. **Chief Placement Officer**
   - Email: `tpo@college.edu`
   - Password: `TPO@2024!`
   - Name: Dr. John Smith
   - Employee ID: TPO001

2. **Assistant Placement Officer**
   - Email: `placement.officer@college.edu`
   - Password: `TPO@2024!`
   - Name: Ms. Sarah Johnson
   - Employee ID: TPO002

### Company Accounts
1. **TechCorp Solutions**
   - Email: `hr@techcorp.com`
   - Password: `Company@2024!`
   - HR Contact: Michael Brown
   - Industry: Information Technology

2. **InnovateTech**
   - Email: `recruitment@innovatetech.com`
   - Password: `Company@2024!`
   - HR Contact: Lisa Davis
   - Industry: Software Development

3. **GlobalSoft Inc**
   - Email: `careers@globalsoft.com`
   - Password: `Company@2024!`
   - HR Contact: Robert Wilson
   - Industry: IT Services

## How to Run the Seeding Process

### Complete Setup (Recommended)
```bash
# Step 1: Create auth users and basic profiles
npm run seed:accounts

# Step 2: Create role-specific profiles
npm run create:role-profiles
```

### Individual Scripts
```bash
# Create auth users and basic profiles
npm run seed:accounts

# Complete existing profiles (if needed)
npm run complete:profiles

# Create missing role-specific profiles
npm run create:role-profiles
```

## What the Script Does

1. **Creates Auth Users**: Uses Supabase Admin API to create authenticated users
2. **Creates Profiles**: Inserts records into the `profiles` table with role information
3. **Creates Role-specific Profiles**: 
   - For TPO: Creates records in `tpo_profiles` table
   - For Company: Creates records in `company_profiles` table

## Verification

After running the script, you can verify the accounts were created by:

1. **Check Supabase Dashboard**:
   - Go to Authentication > Users
   - You should see the new users listed

2. **Check Database Tables**:
   - `profiles` table should have entries for all accounts
   - `tpo_profiles` table should have TPO-specific data
   - `company_profiles` table should have company-specific data

3. **Test Login**:
   - Try logging in with the TPO/Company credentials
   - Access should be granted to the respective dashboards

## Security Notes

- The service role key is used only for initial seeding
- All accounts are created with email confirmation enabled
- Passwords should be changed after first login in production
- The script can be run multiple times safely (it will skip existing accounts)

## Troubleshooting

### Common Issues:

1. **"User already exists" error**: This is normal if running the script multiple times
2. **Permission errors**: Ensure the service role key is correct
3. **Database connection issues**: Check your Supabase URL and key

### Error Handling:
- The script continues even if individual account creation fails
- Detailed error messages are logged for debugging
- Successful creations are clearly marked with ✅

## Post-Seeding Steps

1. **Test TPO Login**: Go to `/tpo-login` and use TPO credentials
2. **Test Company Login**: Go to `/company-login` and use company credentials
3. **Verify Dashboard Access**: Ensure role-based access control works
4. **Change Default Passwords**: In production, change the default passwords

## Script Configuration

The accounts are defined in `scripts/seed-accounts.js`. You can modify:
- Account details (names, emails, etc.)
- Company information
- TPO department/designation details
- Passwords (ensure they meet your security requirements)

## Important Notes

- This script uses the **service role key** which has admin privileges
- Only run this script in development/staging environments initially
- Keep the service role key secure and never expose it in client-side code
- The script creates accounts with `email_confirm: true` so no email verification is needed