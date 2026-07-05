# Supabase Setup Guide for IKAS

Follow these steps in order. You only need a free Supabase account.

---

## Step 1: Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New project**.
3. Fill in:
   - **Name:** `IKAS` (or anything you like)
   - **Database password:** choose a strong password and **save it somewhere safe**
   - **Region:** pick the closest region to your users
4. Click **Create new project** and wait 1–2 minutes for it to finish provisioning.

---

## Step 2: Copy your API keys into `.env`

1. In the Supabase dashboard, open your project.
2. Go to **Project Settings** (gear icon in the sidebar) → **API**.
3. Copy these two values:

   | Supabase dashboard | Your `.env` variable |
   |--------------------|----------------------|
   | **Project URL** | `VITE_SUPABASE_URL` |
   | **anon public** key (under Project API keys) | `VITE_SUPABASE_ANON_KEY` |

4. In your project folder, open `.env` (create it from `.env.example` if needed):

   ```bash
   cp .env.example .env
   ```

5. Paste your real values:

   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Important:** Never commit `.env` to Git — it is already in `.gitignore`.

6. Restart your dev server if it is running:

   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

---

## Step 3: Run the database migrations

This creates all tables, security policies, PostGIS (for map radius search), and storage.

### Option A — SQL Editor (recommended if you are new to Supabase)

1. In Supabase, go to **SQL Editor** in the sidebar.
2. Click **New query**.
3. Open this file in your code editor and copy its entire contents:

   `supabase/migrations/20250705000000_initial_schema.sql`

4. Paste into the SQL Editor and click **Run** (or press Cmd/Ctrl + Enter).
5. You should see **Success. No rows returned**.
6. Create a **second** new query.
7. Copy and paste the entire contents of:

   `supabase/migrations/20250705000001_storage.sql`

8. Click **Run** again.

### Option B — Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Your **project ref** is the short ID in your project URL:  
`https://YOUR_PROJECT_REF.supabase.co`

---

## Step 4: Verify the database was created

In Supabase, go to **Table Editor**. You should see:

- `profiles`
- `viewpoints`
- `viewpoint_ratings`
- `saved_viewpoints`
- `tags`
- `viewpoint_tags`

Go to **Storage** → you should see a bucket named `viewpoint-images`.

---

## Step 5: Configure email authentication

1. Go to **Authentication** → **Providers**.
2. Make sure **Email** is enabled (it is on by default).
3. For easier local testing, go to **Authentication** → **Providers** → **Email** and optionally **disable “Confirm email”** so you can sign up instantly without clicking a confirmation link.

---

## Step 6: Configure Google OAuth (optional but recommended)

Your app supports “Continue with Google”. To enable it:

### 6a. Create Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Go to **APIs & Services** → **Credentials**.
4. Click **Create Credentials** → **OAuth client ID**.
5. Application type: **Web application**.
6. Add **Authorized redirect URIs**:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_REF` with your Supabase project ref.
7. Copy the **Client ID** and **Client Secret**.

### 6b. Add Google to Supabase

1. In Supabase, go to **Authentication** → **Providers**.
2. Enable **Google**.
3. Paste the **Client ID** and **Client Secret** from Google.
4. Save.

---

## Step 7: Set redirect URLs for your app

1. Go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   ```
   http://localhost:5173
   ```
3. Under **Redirect URLs**, add:
   ```
   http://localhost:5173/auth/callback
   ```
4. Click **Save**.

When you deploy to Vercel later, come back and also add:
```
https://your-app-name.vercel.app/auth/callback
```

---

## Step 8: Test locally

1. Make sure `npm run dev` is running.
2. Open [http://localhost:5173](http://localhost:5173).
3. Try these flows:

   | Action | Expected result |
   |--------|-----------------|
   | Browse `/home` without logging in | Page loads (may show empty state if no viewpoints yet) |
   | Sign up with email/password | Account created, redirected to home |
   | Add a viewpoint | Form submits, new spot appears |
   | Save a viewpoint | Requires login; spot appears on `/saved` |
   | Explore map | Viewpoints show as markers (after you add some) |

---

## Troubleshooting

### “Supabase is not configured” or empty data everywhere
- Check `.env` has real values (not placeholders).
- Restart the dev server after editing `.env`.

### Sign-up works but nothing saves
- Migrations were not run — repeat Step 3.

### Google sign-in fails
- Redirect URI in Google Console must exactly match Supabase’s callback URL.
- App redirect URL (`/auth/callback`) must be in Supabase **URL Configuration**.

### Image upload fails
- Run the storage migration (`20250705000001_storage.sql`).
- Check **Storage** → `viewpoint-images` bucket exists.

### Radius search on map does nothing
- PostGIS migration must have run successfully (included in the first migration file).

### “Confirm email” blocking sign-up
- Disable email confirmation in **Authentication** → **Providers** → **Email**, or check your inbox for the confirmation link.

---

## What’s next?

After Supabase works locally:

1. Deploy to [Vercel](https://vercel.com) (import your GitHub repo).
2. Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel **Environment Variables**.
3. Add your Vercel URL to Supabase redirect URLs (Step 7).
4. Add your first viewpoints through the app!

See [README.md](./README.md) for Vercel deployment steps.
