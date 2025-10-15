# Complete Setup Guide for Raintree.wiki Plan Tracker

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-directory>

# Install dependencies
npm install
cd client
npm install
cd ..
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: raintree-tracker (or your choice)
   - Database Password: (choose a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (1-2 minutes)

### 2.2 Create Database Tables

1. In your Supabase dashboard, go to the **SQL Editor** tab
2. Click "New Query"
3. Copy and paste the entire content of `SUPABASE_SETUP.sql`
4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned"

The script creates:
- `users` table - stores user accounts with unique passwords
- `plans` table - stores user plans with all details
- `progress` table - stores daily progress entries
- Indexes for performance
- Row Level Security policies

### 2.3 Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see:
   - **Project URL** (starts with https://)
   - **anon/public** key (under "Project API keys")

### 2.4 Update Environment Variables

1. Open `/workspace/client/.env`
2. Replace the values with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: The `.env` file should be in the `client` folder, not the root.

## Step 3: Run the Application

### Development Mode

```bash
# From the root directory
npm run dev
```

This will start the Vite dev server at http://localhost:5173

### Production Build

```bash
# Build the application
npm run build

# Preview the production build
npm run start
```

## Step 4: Using the Application

### First Time Setup

1. Open the application in your browser
2. Click the "► USER SYSTEM" button on the Raintree logo window
3. Switch to "SIGNUP" tab
4. Enter a unique password (this is your login credential)
5. Click "SIGNUP"

### Creating Your First Plan

1. Once logged in, you'll see your dashboard
2. Click "[+ CREATE NEW PLAN]"
3. Fill in the plan details:
   - **Plan Name**: e.g., "Learn Python"
   - **Description**: Your goal
   - **Type**: Select from dropdown
   - **Start Date**: Today or any date
   - **End Date**: Your target completion date
   - **Target Value**: (Optional) e.g., "50 hours"
4. Click "[CREATE PLAN]"

### Tracking Progress

1. From the dashboard, click on any plan card
2. You'll see:
   - Plan details and current progress
   - Progress graph (after you add entries)
   - History of all updates
3. Add daily progress:
   - Type what you accomplished in the text area
   - Click "[ADD PROGRESS]"
4. Your progress percentage will automatically increase

### Notifications

1. Click "[📬 NOTIFICATIONS]" from the dashboard
2. Enable/disable notification types
3. View active notifications for:
   - Plans you haven't updated today
   - Plans ending soon

## Step 5: Deploy to Production

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts
4. In Vercel dashboard, add environment variables:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Alternative: Netlify, Railway, etc.

The app can be deployed to any static hosting platform:

1. Build the app: `npm run build`
2. Deploy the `client/dist` folder
3. Set environment variables in your platform's dashboard

## Troubleshooting

### "Failed to fetch IP information" Error

This is expected in production if the IP API is rate-limited. The IP lookup feature works in development with the Vite middleware. For production, you may need to:
- Use a different IP API
- Set up your own backend API
- Or simply ignore this feature if not needed

### Supabase Connection Issues

1. Check your `.env` file is in the `client` folder
2. Verify the credentials are correct
3. Make sure you ran the SQL setup script
4. Check Supabase project is active (not paused)

### Login Not Working

1. Verify the `users` table exists in Supabase
2. Check RLS policies are created
3. Try creating a new account
4. Check browser console for errors

### Plans Not Showing

1. Verify the `plans` table exists
2. Check you're logged in with the correct user
3. Try creating a new plan
4. Check Supabase logs in the dashboard

## Database Schema

### Users Table
```sql
id          UUID PRIMARY KEY
password    TEXT UNIQUE NOT NULL
created_at  TIMESTAMP
```

### Plans Table
```sql
id            UUID PRIMARY KEY
user_id       UUID (references users)
name          TEXT NOT NULL
description   TEXT
type          TEXT NOT NULL
start_date    DATE NOT NULL
end_date      DATE NOT NULL
target_value  TEXT
progress      INTEGER DEFAULT 0
created_at    TIMESTAMP
last_updated  TIMESTAMP
```

### Progress Table
```sql
id          UUID PRIMARY KEY
plan_id     UUID (references plans)
user_id     UUID (references users)
description TEXT NOT NULL
value       NUMERIC DEFAULT 1
created_at  TIMESTAMP
```

## Features Overview

✅ Password-only authentication
✅ Plan creation and management
✅ Daily progress tracking
✅ Visual progress graphs
✅ Streak tracking
✅ Notifications and reminders
✅ Fully responsive design
✅ Hacker-themed UI
✅ IP lookup tools
✅ Network monitoring displays

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for error messages
4. Verify all setup steps were completed

## Security Notes

- Passwords are stored in plain text in Supabase (for this simple implementation)
- For production use, consider implementing proper password hashing
- Row Level Security (RLS) is enabled but policies allow all operations
- For better security, implement proper RLS policies based on user authentication

## Future Enhancements

- Email notifications via Supabase Edge Functions
- Password hashing for better security
- Social authentication options
- Team/shared plans
- Export progress data
- Custom themes
- Mobile app

Enjoy tracking your progress! 🚀
