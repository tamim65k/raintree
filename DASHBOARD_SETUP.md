# 🗂️ RAINTREE DASHBOARD - Setup Guide

## 📋 Database Setup

### Step 1: Run SQL Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `database_schema.sql`
4. Copy and paste the entire SQL code
5. Click **Run** to execute

This will create:
- ✅ `plans` table with all required columns
- ✅ Indexes for better performance
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update trigger for `last_updated` field

### Step 2: Verify Table Structure
After running the SQL, verify the `plans` table has these columns:
- `id` (UUID, Primary Key)
- `user_id` (TEXT)
- `name` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `priority` (TEXT)
- `tags` (TEXT[])
- `start_date` (DATE)
- `end_date` (DATE)
- `progress` (INTEGER)
- `tasks` (JSONB)
- `files` (JSONB)
- `notes` (TEXT)
- `time_spent` (INTEGER)
- `recurrence` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `last_updated` (TIMESTAMPTZ)

## 🎯 Features Implemented

### 🗂️ A. Plan Management
- ✅ **Create** new plans with full details
- ✅ **Edit** existing plans (click ✏️ button)
- ✅ **Delete** plans (click 🗑️ button)
- ✅ **Duplicate** plans (click 📋 button)
- ✅ **Description** field
- ✅ **Priority** levels (High, Medium, Low)
- ✅ **Tags** (comma-separated)
- ✅ **Deadlines** (start & end dates)
- ✅ **Categories** (Personal, Work, Study, Health, Other)
- ✅ **Notes** field for additional information

### ✅ B. Task Management
- ✅ **Add subtasks** under each plan
- ✅ **Drag & drop** to reorder tasks (grab the ⋮⋮ handle)
- ✅ **Progress bar** auto-updates when tasks are completed
- ✅ **Task recurrence** options (daily, weekly, monthly, custom)
- ✅ **Checkbox** to mark tasks complete
- ✅ **Delete tasks** individually

### 📊 D. Tracking & Analytics
Dashboard displays 8 key metrics:
1. **Total Plans** - All plans created
2. **Active Plans** - Plans not yet completed
3. **Completed Plans** - Plans at 100% progress
4. **Avg Progress** - Average completion across all plans
5. **Streak** - Consecutive days with updates
6. **Weekly %** - Completion rate this week
7. **Daily %** - Completion rate today
8. **Time Spent** - Total hours tracked

**Priority Breakdown:**
- Visual bars showing distribution of High/Medium/Low priority plans

**Integrated Timer:**
- Start/pause timer while working on a plan
- Time automatically saves to database
- Displays in hours/minutes/seconds

## 🔄 Real-time Features

The dashboard updates automatically every 5 seconds:
- New plans appear instantly
- Progress bars animate smoothly
- Stats recalculate in real-time
- All changes sync with Supabase immediately

## 🎨 User Interface Improvements

### Dashboard View
- Clean grid layout for plan cards
- Color-coded priorities (Red=High, Yellow=Medium, Green=Low)
- Hover effects and smooth animations
- Tag chips showing first 3 tags
- Progress bars with percentage
- Task count display

### Plan Detail View
- Full plan information
- Task list with drag-and-drop
- Integrated timer
- Edit/delete options
- Notes section

### Plan Form
- Clean, organized form layout
- All fields properly labeled
- Date pickers for deadlines
- Category and priority dropdowns
- Tag input with comma separation
- Notes textarea

## 🚀 How to Use

### Creating a Plan
1. Click **+ CREATE PLAN** button
2. Fill in the plan details:
   - Name (required)
   - Description
   - Category
   - Priority
   - Tags (comma-separated)
   - Start & End dates
   - Recurrence pattern
   - Notes
3. Click **CREATE** button

### Managing Tasks
1. Click on a plan card to open details
2. Type task name in input field
3. Click **+ ADD** to add task
4. Drag tasks by the ⋮⋮ handle to reorder
5. Check checkbox to mark complete
6. Progress bar updates automatically

### Using the Timer
1. Open a plan detail view
2. Click **⏱️ START TIMER**
3. Click **▶️ START** to begin tracking
4. Click **⏸️ PAUSE** to pause
5. Click **💾 SAVE** to save time to database

### Editing a Plan
1. Click the **✏️ Edit** button on any plan card
2. Modify the fields you want to change
3. Click **UPDATE** to save changes

### Duplicating a Plan
1. Click the **📋 Duplicate** button
2. A copy will be created with "(Copy)" appended to the name
3. All tasks are copied but marked as incomplete

## 🐛 Troubleshooting

### "Error creating plan" message
- Check that the `plans` table exists in Supabase
- Verify all required columns are present
- Check browser console for detailed error

### Plans not loading
- Verify Supabase connection in `supabaseClient.js`
- Check that `user.id` is being passed correctly
- Look for errors in browser console

### Tasks not saving
- Ensure `tasks` column is type JSONB
- Check that task objects have required fields: `id`, `title`, `completed`, `order`

### Timer not working
- Verify `time_spent` column exists and is INTEGER type
- Check browser console for errors

## 📝 Notes

- All times are stored in seconds in the database
- Tags are stored as PostgreSQL TEXT[] array
- Tasks are stored as JSONB for flexibility
- Progress is calculated automatically from completed tasks
- The dashboard refreshes every 5 seconds for real-time updates

## 🔒 Security

- Row Level Security (RLS) is enabled
- Users can only access their own plans
- All queries are filtered by `user_id`
- Policies prevent unauthorized access

## 🎉 Enjoy Your Dashboard!

Your comprehensive plan management system is ready to use. Create plans, track tasks, monitor progress, and boost your productivity!
