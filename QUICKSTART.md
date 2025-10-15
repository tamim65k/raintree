# Quick Start Guide 🚀

Get up and running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- A Supabase account (free tier is fine)

## 1. Install Dependencies (1 minute)

```bash
npm install
cd client && npm install && cd ..
```

## 2. Set Up Supabase (2 minutes)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to initialize

### Run Setup SQL
1. In Supabase dashboard → SQL Editor
2. Copy all content from `SUPABASE_SETUP.sql`
3. Paste and click "Run"

### Get Your Credentials
1. Go to Project Settings → API
2. Copy your:
   - Project URL
   - anon/public key

## 3. Configure Environment (30 seconds)

The `.env` file already exists at `client/.env`. Update it with your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Run the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 5. Create Your Account (30 seconds)

1. Click "► USER SYSTEM" on the logo
2. Switch to "SIGNUP"
3. Enter a password
4. Start creating plans!

---

## What You Get

✅ **User System** - Secure password-based login
✅ **Plan Manager** - Create and track unlimited plans
✅ **Progress Tracker** - Daily updates with visual graphs
✅ **Dashboard** - Overview of all your plans and streaks
✅ **Notifications** - Reminders for inactive plans
✅ **Hacker Theme** - Cyberpunk Matrix-style interface
✅ **Responsive** - Works on mobile, tablet, and desktop

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

---

**Built with:** React, Vite, Supabase, and lots of green text ✨
