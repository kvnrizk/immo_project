# 🚀 Deployment Guide - Clés de Paris

## Option 1: Railway + Vercel (Recommended - FREE)

This is the easiest way to deploy your full-stack application for free.

### Step 1: Prepare GitHub Repository

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create repository on GitHub:
# 1. Go to https://github.com/new
# 2. Name: immo_project
# 3. Click "Create repository"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/immo_project.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. **Go to https://railway.app**
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select your **immo_project** repository
5. Railway will detect Node.js automatically

**Configure Backend:**
- Click on your service
- Go to **Settings** → **Root Directory** → Set to `server`
- Go to **Variables** → Add these environment variables:

```
NODE_ENV=production
PORT=5001
```

6. **Add PostgreSQL Database:**
   - Click **"+ New"** → **Database** → **PostgreSQL**
   - Railway will automatically create and link the database
   - It will auto-generate: `DATABASE_URL` variable

7. **Update server/src/config/database.js** to use DATABASE_URL:

Check the file and ensure it uses `process.env.DATABASE_URL` for production.

8. **Deploy:**
   - Railway auto-deploys on every git push
   - After deployment, you'll get a URL like: `https://your-backend.railway.app`
   - **Copy this URL** - you'll need it for the frontend

9. **Initialize Database:**
   - In Railway, go to your backend service
   - Click **"Settings"** → **"Service Variables"**
   - Note down your database credentials
   - Or use Railway CLI:
   ```bash
   railway run node src/config/initDatabase.js
   ```

### Step 3: Deploy Frontend to Vercel

1. **Go to https://vercel.com**
2. Click **"Add New Project"**
3. Import your **immo_project** from GitHub
4. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **Leave as `.`** (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables:**
   Add this variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
   (Replace with your actual Railway backend URL from Step 2)

6. Click **Deploy**

7. After deployment, you'll get a URL like:
   - `https://your-project.vercel.app`

### Step 4: Update WhatsApp Number

Don't forget to update your WhatsApp number in:
- `src/components/PropertyCard.tsx` (line 66)

### Step 5: Test Your Production App

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test the login: username `admin`, password `admin7264`
3. Test WhatsApp button on properties
4. Check dashboard functionality

---

## Option 2: Deploy with Docker (VPS/Cloud)

If you have a VPS (like DigitalOcean, AWS, etc.):

### Deploy to DigitalOcean

1. **Create Droplet:**
   - Go to https://digitalocean.com
   - Create Ubuntu 22.04 droplet
   - SSH into your server

2. **Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. **Clone Repository:**
```bash
git clone https://github.com/YOUR_USERNAME/immo_project.git
cd immo_project
```

4. **Create Production .env:**
```bash
# Create server/.env
cat > server/.env << EOF
DB_HOST=postgres
DB_PORT=5432
DB_NAME=immo_db
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_PASSWORD
PORT=5001
NODE_ENV=production
EOF

# Create .env
cat > .env << EOF
VITE_API_URL=http://YOUR_SERVER_IP:5001/api
EOF
```

5. **Run with Docker Compose:**
```bash
docker-compose up -d --build
```

6. **Initialize Database:**
```bash
docker exec -it immo_backend sh
node src/config/initDatabase.js
exit
```

7. **Access Your App:**
   - Frontend: `http://YOUR_SERVER_IP:8080`
   - Backend: `http://YOUR_SERVER_IP:5001`

8. **Setup Domain (Optional):**
   - Point your domain to server IP
   - Setup Nginx reverse proxy
   - Add SSL with Let's Encrypt

---

## 🎯 Recommended Setup

**For Production:**
- **Backend + Database**: Railway (Free tier)
- **Frontend**: Vercel (Free tier)
- **Total Cost**: $0/month for small-medium traffic

**Advantages:**
- ✅ Auto-deploys from GitHub
- ✅ Free SSL certificates
- ✅ Auto-scaling
- ✅ Monitoring included
- ✅ Zero server maintenance

---

## 📝 After Deployment Checklist

- [ ] Update WhatsApp number
- [ ] Test login functionality
- [ ] Test property creation/editing
- [ ] Test calendar management
- [ ] Test WhatsApp button with real number
- [ ] Update README with production URLs
- [ ] Setup custom domain (optional)

---

## 🆘 Need Help?

Common issues:
1. **Backend connection fails**: Check VITE_API_URL in Vercel
2. **Database error**: Make sure to run initDatabase.js
3. **WhatsApp not working**: Verify number format (no spaces, with country code)

Your production URLs will be:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.railway.app`
- Admin: `https://your-project.vercel.app/login`
