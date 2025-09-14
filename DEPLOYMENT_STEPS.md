# Step-by-Step Deployment Guide

## ✅ Completed Steps:
1. Fixed all hardcoded API URLs in frontend
2. Updated backend CORS configuration
3. Built frontend successfully (dist folder created)

## 🚀 Next Steps:

### Step 1: Deploy Backend

**Choose your hosting platform:**

#### Option A: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-backend-name`
4. Set environment variables:
   ```bash
   heroku config:set FRONTEND_URL=https://your-netlify-domain.netlify.app
   heroku config:set MONGO_URI=your-mongodb-connection-string
   heroku config:set SESSION_SECRET=your-secure-random-string
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASS=your-gmail-app-password
   heroku config:set EMAIL_FROM=your-email@gmail.com
   ```
5. Deploy: `git push heroku main`

#### Option B: Railway
1. Go to railway.app
2. Connect your GitHub repository
3. Select the Backend folder
4. Add environment variables in the dashboard
5. Deploy automatically

#### Option C: Render
1. Go to render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Select Backend folder
5. Add environment variables
6. Deploy

### Step 2: Deploy Frontend to Netlify

1. **Go to netlify.com**
2. **Connect your GitHub repository**
3. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `Frontend/dist`
   - Base directory: `Frontend`

4. **Add environment variable:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

5. **Deploy**

### Step 3: Update Backend Environment Variable

After getting your Netlify URL, update the backend:
- Change `FRONTEND_URL` to your actual Netlify domain
- Redeploy the backend

### Step 4: Test Your Deployment

1. **Test phone loading:**
   - Visit your Netlify URL
   - Check if phones appear on homepage

2. **Test authentication:**
   - Try registering a new account
   - Check if verification email points to your Netlify domain (not localhost)

3. **Test API calls:**
   - Open browser dev tools
   - Check for any CORS errors
   - Verify API calls are going to your backend

## 🔧 Troubleshooting

### If phones don't load:
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Netlify
- Test backend API directly: `https://your-backend-url.com/api/phone/getPhoneSeller`

### If email links go to localhost:
- Verify `FRONTEND_URL` is set correctly in backend
- Restart backend after setting environment variable

### If CORS errors occur:
- Check that `FRONTEND_URL` in backend matches your Netlify domain exactly
- Ensure both frontend and backend use HTTPS

## 📝 Quick Checklist

- [ ] Backend deployed with environment variables
- [ ] Frontend deployed to Netlify
- [ ] `VITE_API_URL` set in Netlify
- [ ] `FRONTEND_URL` set in backend
- [ ] Test phone loading
- [ ] Test user registration
- [ ] Test email verification links

Your website should now work correctly in production! 🎉
