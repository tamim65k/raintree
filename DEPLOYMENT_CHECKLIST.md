# Deployment Checklist ✅

Use this checklist to ensure everything is set up correctly before deploying.

## Pre-Deployment Checklist

### 1. Local Setup ✓
- [x] Node.js 16+ installed
- [x] Dependencies installed (`npm install`)
- [x] Client dependencies installed (`cd client && npm install`)
- [x] Build tested (`npm run build`)
- [x] Dev server tested (`npm run dev`)

### 2. Supabase Configuration ✓
- [ ] Supabase project created
- [ ] SQL setup script executed (`SUPABASE_SETUP.sql`)
- [ ] Tables verified:
  - [ ] `users` table exists
  - [ ] `plans` table exists
  - [ ] `progress` table exists
- [ ] Row Level Security enabled
- [ ] Credentials obtained:
  - [ ] Project URL copied
  - [ ] Anon key copied

### 3. Environment Variables ✓
- [ ] `client/.env` file exists
- [ ] `VITE_SUPABASE_URL` set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` set correctly
- [ ] `.env` file NOT committed to git (check .gitignore)

### 4. Testing ✓
- [ ] Application runs locally
- [ ] Can create an account
- [ ] Can login with password
- [ ] Can create a plan
- [ ] Can update plan progress
- [ ] Can view dashboard stats
- [ ] Notifications work
- [ ] Responsive on mobile
- [ ] All windows functional

### 5. Production Build ✓
- [ ] `npm run build` completes successfully
- [ ] No critical errors in build output
- [ ] `client/dist` folder created
- [ ] Assets generated correctly

## Deployment Steps

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Set for: Production, Preview, Development

5. **Redeploy**
   ```bash
   vercel --prod
   ```

6. **Verify**
   - [ ] Site loads correctly
   - [ ] Can create account
   - [ ] Can create and track plans
   - [ ] Responsive on mobile

### Option B: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=client/dist
   ```

5. **Configure Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add same variables as Vercel

### Option C: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload `client/dist` folder** to your hosting service

3. **Configure environment variables** in your hosting dashboard

4. **Ensure SPA routing** is configured (redirect all routes to index.html)

## Post-Deployment Checklist

### Functionality Test
- [ ] Site loads without errors
- [ ] Can access the application
- [ ] User system button works
- [ ] Can create new account
- [ ] Can login with existing account
- [ ] Can create a plan
- [ ] Can view dashboard
- [ ] Can add progress to plan
- [ ] Charts render correctly
- [ ] Notifications appear
- [ ] Can logout and login again

### Performance Test
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Images/assets load correctly
- [ ] Smooth animations
- [ ] Responsive on different screen sizes

### Mobile Test
- [ ] Opens on mobile browser
- [ ] All features accessible
- [ ] Touch controls work
- [ ] Readable text sizes
- [ ] No horizontal scrolling

### Security Check
- [ ] Environment variables not exposed in client code
- [ ] `.env` file not in repository
- [ ] Supabase credentials secure
- [ ] No sensitive data in console logs

## Troubleshooting

### Build Fails
- Check Node.js version (16+)
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

### App Loads but Login Fails
- Verify Supabase credentials in environment variables
- Check Supabase project is active (not paused)
- Verify SQL setup was run correctly
- Check browser console for errors

### Plans Not Saving
- Check Supabase connection
- Verify tables exist in Supabase dashboard
- Check RLS policies are active
- Review browser console for errors

### IP Lookup Not Working
- This is expected in production
- IP lookup works in development mode
- Can be safely ignored or disabled

## Monitoring

### After Deployment
- Monitor Supabase dashboard for:
  - Database usage
  - API requests
  - Error logs
  - User activity

### Analytics (Optional)
Consider adding:
- Google Analytics
- Plausible Analytics
- Vercel Analytics
- Custom logging

## Maintenance

### Regular Tasks
- Monitor Supabase usage (free tier limits)
- Check for security updates
- Update dependencies monthly
- Backup database data

### Scaling Considerations
- Free tier limits:
  - Supabase: 500MB database, 50MB file storage
  - Vercel: 100GB bandwidth/month
- Upgrade if needed

## Support Resources

- **Documentation**: See README.md, SETUP_GUIDE.md, QUICKSTART.md
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **React**: https://react.dev

---

## Final Checklist Summary

Before going live:
- [x] Code complete and tested
- [ ] Supabase configured
- [ ] Environment variables set
- [ ] Build successful
- [ ] Deployed to hosting
- [ ] Post-deployment tests passed
- [ ] Monitoring in place

**Status**: Ready for deployment! 🚀

---

**Last Updated**: 2025-10-15
