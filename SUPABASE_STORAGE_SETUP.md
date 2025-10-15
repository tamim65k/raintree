# Supabase Storage Setup Guide

## Overview
This guide will help you set up Supabase Storage for file uploads in the Raintree.wiki application.

---

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New Bucket"**
4. Configure the bucket:
   - **Name**: `user-files`
   - **Public**: ❌ (Keep it private)
   - **File size limit**: 1GB (1073741824 bytes)
   - **Allowed MIME types**: Leave empty (allow all types)

5. Click **"Create Bucket"**

---

## Step 2: Set Up Storage Policies

### Allow Authenticated Users to Upload Files

Go to **Storage** → **Policies** → **user-files** bucket

#### Policy 1: Allow Upload
```sql
-- Policy Name: Allow authenticated users to upload files
-- Operation: INSERT
-- Policy Definition:
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Allow Users to View Their Own Files
```sql
-- Policy Name: Allow users to view their own files
-- Operation: SELECT
-- Policy Definition:
CREATE POLICY "Allow users to view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Allow Users to Delete Their Own Files
```sql
-- Policy Name: Allow users to delete their own files
-- Operation: DELETE
-- Policy Definition:
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 4: Allow Users to Update Their Own Files
```sql
-- Policy Name: Allow users to update their own files
-- Operation: UPDATE
-- Policy Definition:
CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Step 3: Alternative - Public Access (If Needed)

If you want to make files publicly accessible (not recommended for user files):

```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-files');
```

---

## Step 4: Configure Bucket Settings

### Via Supabase Dashboard:
1. Go to **Storage** → **user-files** bucket
2. Click **Settings** (gear icon)
3. Set:
   - **File size limit**: 1073741824 (1GB)
   - **Allowed MIME types**: Leave empty or specify types

### Via SQL:
```sql
-- Update bucket configuration
UPDATE storage.buckets
SET 
  file_size_limit = 1073741824,
  public = false
WHERE id = 'user-files';
```

---

## Step 5: Test File Upload

### Using the Application:
1. Log in to your dashboard
2. Click **[📁 FILES]** button
3. Click **[+ UPLOAD FILE]**
4. Select a file (max 1GB)
5. Wait for upload to complete
6. File should appear in the list

### Verify in Supabase:
1. Go to **Storage** → **user-files** bucket
2. You should see folders named with user IDs
3. Inside each folder are the user's uploaded files

---

## File Structure

Files are organized by user ID:
```
user-files/
├── {user-id-1}/
│   ├── 1234567890123_document.pdf
│   ├── 1234567890456_image.jpg
│   └── 1234567890789_video.mp4
├── {user-id-2}/
│   ├── 1234567891234_file.txt
│   └── 1234567891567_data.csv
```

The timestamp prefix (13 digits) prevents filename conflicts.

---

## Security Notes

1. **Private Bucket**: Files are only accessible to the user who uploaded them
2. **User Isolation**: Each user can only access files in their own folder
3. **Size Limit**: 1GB per file prevents abuse
4. **No Public Access**: Files cannot be accessed without authentication

---

## Troubleshooting

### Error: "new row violates row-level security policy"
- **Cause**: Storage policies not set up correctly
- **Solution**: Run the policy SQL commands above

### Error: "Bucket not found"
- **Cause**: Bucket name mismatch
- **Solution**: Ensure bucket is named exactly `user-files`

### Error: "File size exceeds limit"
- **Cause**: File larger than 1GB
- **Solution**: User must upload smaller files

### Files not showing in list
- **Cause**: Policy doesn't allow SELECT
- **Solution**: Add the SELECT policy from Step 2

---

## Advanced Configuration

### Enable File Versioning
```sql
-- Enable versioning (keeps old versions when files are updated)
UPDATE storage.buckets
SET versioning = true
WHERE id = 'user-files';
```

### Set Cache Control
Files are uploaded with `cacheControl: '3600'` (1 hour cache).
Adjust in `FileManager.jsx` if needed.

### Allowed File Types
To restrict file types, update bucket settings:
```sql
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain'
]
WHERE id = 'user-files';
```

---

## API Reference

### Upload File
```javascript
const { data, error } = await supabase.storage
  .from('user-files')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  })
```

### Download File
```javascript
const { data, error } = await supabase.storage
  .from('user-files')
  .download(filePath)
```

### Delete File
```javascript
const { error } = await supabase.storage
  .from('user-files')
  .remove([filePath])
```

### List Files
```javascript
const { data, error } = await supabase.storage
  .from('user-files')
  .list(userFolder, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' }
  })
```

---

## Production Checklist

- [x] Create `user-files` bucket
- [x] Set bucket to private
- [x] Configure 1GB file size limit
- [x] Add INSERT policy for uploads
- [x] Add SELECT policy for viewing
- [x] Add DELETE policy for deletion
- [x] Add UPDATE policy for renaming
- [x] Test file upload
- [x] Test file download
- [x] Test file deletion
- [x] Test file renaming
- [x] Verify user isolation

---

## Support

For issues with Supabase Storage:
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
