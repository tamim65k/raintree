# Raintree.wiki - Hacker-Themed Plan Tracker

A cyberpunk-style personal plan tracking system with IP lookup tools and network monitoring displays.

## Features

### 🔐 User System
- Password-only authentication
- Unique password storage in Supabase
- Persistent user sessions

### 📊 Plan Management
- Create custom plans (daily habits, projects, study plans, etc.)
- Set start and end dates with target values
- Track progress with percentage completion
- Visual progress graphs
- Daily progress logging

### 📈 Dashboard
- Overview of all active plans
- Total progress statistics
- Streak tracking (consecutive days with updates)
- Quick access to create new plans

### 🌐 Network Tools
- IP lookup terminal with detailed information
- Live network scanner simulation
- Exploit framework display
- Network monitor
- System monitor

### 🎨 Design
- Full hacker/cyberpunk theme
- Matrix-style green terminal aesthetics
- Custom star cursor
- Glitch effects and animations
- Fully responsive (mobile, tablet, desktop)

## Setup

### 1. Install Dependencies

```bash
npm install
cd client && npm install
```

### 2. Configure Supabase

Create a Supabase project and run the SQL from `SUPABASE_SETUP.sql` to create the necessary tables:
- `users` - User accounts
- `plans` - User plans
- `progress` - Daily progress tracking

### 3. Environment Variables

The `.env` file in the `client` directory is already configured with the Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

This will start the Vite development server with the IP lookup API middleware.

### 5. Build for Production

```bash
npm run build
```

The built files will be in `client/dist`.

## Project Structure

```
/workspace
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application with windows
│   │   ├── AuthWindow.jsx # Login/Signup component
│   │   ├── Dashboard.jsx  # User dashboard
│   │   ├── PlanCreator.jsx # Plan creation form
│   │   ├── PlanTracker.jsx # Plan tracking with graphs
│   │   ├── supabaseClient.js # Supabase configuration
│   │   ├── styles.css     # All styling
│   │   └── main.jsx       # Entry point
│   ├── vite.config.js     # Vite config with API middleware
│   └── package.json
├── index.js               # Express backend for production
├── SUPABASE_SETUP.sql     # Database schema
└── package.json           # Root package.json

```

## Usage

1. **Access the Application**: Open the app in your browser
2. **Create Account**: Click "USER SYSTEM" button on the logo window
3. **Set Password**: Create a unique password (this is your login credential)
4. **Create Plans**: Use the dashboard to create new plans
5. **Track Progress**: Click on any plan to view details and add daily progress
6. **Monitor Streaks**: Keep your streak alive by updating plans daily!

## Technologies

- **Frontend**: React 18, Vite
- **Backend**: Express.js (for production IP API)
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Styling**: Custom CSS with hacker theme

## Features in Detail

### Plan Types
- Daily habits
- Projects
- Study plans
- Fitness goals
- Reading challenges
- Skill development
- Custom (other)

### Progress Tracking
- Add text descriptions of daily progress
- Automatic progress percentage updates
- Visual graphs showing progress over time
- Historical log of all updates

### Notifications (Future Enhancement)
- Daily reminders for plan updates
- Weekly/monthly progress summaries
- Email notifications via Supabase triggers

## Deployment

The project is configured for Vercel deployment with the included `vercel.json` file.

```bash
vercel deploy
```

Make sure to set the Supabase environment variables in your Vercel project settings.

## License

MIT
