# Push to GitHub & Deploy on Vercel

## 1. Create a new GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `enough-socialshare` (or whatever you prefer)
3. Leave it **empty** (no README, no .gitignore)
4. Create the repository

## 2. Push this project to GitHub

Run these in the project folder (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd /Users/gagesalzano/Desktop/personal/_websites/enough-socialshare

# Add your new repo as remote (use the URL GitHub shows after creating the repo)
git remote add origin https://github.com/YOUR_USERNAME/enough-socialshare.git

# Push
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/enough-socialshare.git
git push -u origin main
```

## 3. Deploy on Vercel

**Option A – Connect GitHub (recommended)**

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account with GitHub).
2. Click **Add New…** → **Project**.
3. Import your **enough-socialshare** repo from GitHub.
4. Leave the default settings and click **Deploy**.
5. Add env vars if needed (e.g. from `.env.example`):
   - **Vercel project** → **Settings** → **Environment Variables**  
   Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, and `NEXT_PUBLIC_BASE_URL` (your Vercel URL) if you use Turnstile.

**Option B – Vercel CLI**

```bash
npx vercel
```

Follow the prompts, then run `npx vercel --prod` when you want a production deployment.

---

Your initial commit is already done; you only need to add the remote, push, and deploy as above.
