# 🚀 Deployment Checklist

## ✅ Code Updates Completed

- [x] Created centralized URL helper (`Backend/utils/urls.js`)
- [x] Updated authController.js to use URL helper functions
- [x] Improved CORS configuration in server.js
- [x] All email links now use `process.env.FRONTEND_URL`

## 🔧 Backend Deployment Steps

### 1. Update Environment Variables
On your backend hosting platform (Render/Heroku/etc.):

```bash
FRONTEND_URL=https://your-actual-frontend-domain.com
```

**Important:** Replace `your-actual-frontend-domain.com` with your real deployed frontend URL.

### 2. Redeploy Backend
- Trigger a redeploy after updating environment variables
- Wait for deployment to complete

## 🌐 Frontend Deployment Steps

### 1. Update Environment Variables
On your frontend hosting platform (Netlify/Vercel/etc.):

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

**Important:** Make sure the URL ends with `/api`

### 2. Redeploy Frontend
- Trigger a redeploy after updating environment variables
- Wait for deployment to complete

## 🧪 Testing Checklist

### 1. Test Email Links
- [ ] Sign up with a new email
- [ ] Check verification email - link should show your deployed domain (not localhost)
- [ ] Test password reset - link should show your deployed domain (not localhost)

### 2. Test Core Functionality
- [ ] User registration works
- [ ] Email verification works
- [ ] Login works
- [ ] Password reset works
- [ ] All API calls work without CORS errors

### 3. Check Browser Console
- [ ] No CORS errors
- [ ] No 404 errors for API calls
- [ ] No "Not valid JSON" errors

## 🔍 Troubleshooting

### If verification emails still show localhost:
1. Double-check `FRONTEND_URL` in backend environment variables
2. Ensure backend was redeployed after changing environment variables
3. Check that the environment variable is set correctly (no typos)

### If you get CORS errors:
1. Verify `FRONTEND_URL` is set correctly in backend
2. Check that your frontend domain matches exactly
3. Ensure backend was redeployed

### If API calls return 404:
1. Verify `VITE_API_URL` ends with `/api`
2. Check that your backend URL is correct
3. Ensure frontend was redeployed

## 📝 Quick Commands

### Check your current environment variables:
```bash
# Backend (if using Render)
# Go to your service → Environment tab

# Frontend (if using Netlify)
# Go to your site → Site settings → Environment variables
```

### Test locally first:
```bash
# Backend
cd Backend
npm run dev

# Frontend (in another terminal)
cd Frontend
npm run dev
```

## 🎯 Success Indicators

✅ Verification emails contain your deployed domain  
✅ Password reset emails contain your deployed domain  
✅ No CORS errors in browser console  
✅ All API calls work correctly  
✅ Users can register, verify, and login successfully  

---

**Need help?** Check the browser console for errors and verify your environment variables are set correctly on both platforms.
