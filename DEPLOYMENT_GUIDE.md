# Deployment Guide for Old Phone Deals Website

## Issues Fixed

### 1. Phone Fetching Problem
- **Issue**: Frontend was using hardcoded `/api/` URLs instead of environment-based URLs
- **Fix**: Updated all API calls to use `import.meta.env.VITE_API_URL || '/api'`
- **Files Updated**: 
  - `Frontend/src/screens/MainPage.jsx`
  - `Frontend/src/context/CartContext.jsx`
  - `Frontend/src/screens/Wishlist.jsx`
  - `Frontend/src/screens/CheckoutPage.jsx`

### 2. Localhost Redirects in Authentication
- **Issue**: Backend was using `process.env.FRONTEND_URL` for email links, but this wasn't set for production
- **Fix**: Updated CORS configuration and server logging
- **Files Updated**: `Backend/server.js`

### 3. Environment Configuration
- **Issue**: No environment variables set for production deployment
- **Fix**: Added environment variables to `Frontend/netlify.toml`

## Deployment Steps

### Frontend (Netlify)

1. **Environment Variables in Netlify**:
   - Go to your Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Add: `VITE_API_URL` = `https://xpress-backend.Oldphones.com/api`

2. **Build Configuration**:
   - The `netlify.toml` file is already configured with:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Environment variable: `VITE_API_URL`
     - API redirects to your backend

3. **Deploy**:
   - Connect your GitHub repository to Netlify
   - Deploy from the `Frontend` folder
   - The build will automatically use the production API URL

### Backend (Heroku/Railway/etc.)

1. **Environment Variables**:
   Set these environment variables in your hosting platform:
   ```
   MONGO_URI=your-mongodb-connection-string
   SESSION_SECRET=your-secure-session-secret
   FRONTEND_URL=https://your-frontend-domain.netlify.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   PORT=5000
   ```

2. **Important**: 
   - Replace `your-frontend-domain.netlify.app` with your actual Netlify domain
   - This ensures email verification links point to your production frontend

3. **Deploy**:
   - Deploy the `Backend` folder to your hosting platform
   - Make sure the `Procfile` is present (it contains: `web: node server.js`)

### Database Setup

1. **MongoDB**:
   - Use MongoDB Atlas (cloud) or your preferred MongoDB hosting
   - Update the `MONGO_URI` environment variable with your connection string

2. **Initialize Database**:
   - The backend will automatically create the super admin and upload images on startup
   - Check the logs to ensure initialization completed successfully

## Testing After Deployment

1. **Frontend**:
   - Visit your Netlify URL
   - Check if phones are loading on the homepage
   - Test search functionality
   - Test user registration/login

2. **Backend**:
   - Test API endpoints directly: `https://xpress-backend.Oldphones.com/api/phone/getPhoneSeller`
   - Check if CORS is working by testing from your frontend domain

3. **Email Functionality**:
   - Test user registration (should send verification email)
   - Test password reset functionality
   - Verify email links point to your production frontend, not localhost

## Troubleshooting

### If phones still don't load:
1. Check browser console for CORS errors
2. Verify the `VITE_API_URL` environment variable is set correctly
3. Test the backend API directly in a new tab

### If email links still go to localhost:
1. Verify `FRONTEND_URL` environment variable is set correctly in backend
2. Restart the backend after setting the environment variable
3. Check backend logs for any errors

### If CORS errors occur:
1. Verify the `FRONTEND_URL` in backend matches your actual frontend domain
2. Check that credentials are enabled in CORS configuration
3. Ensure both frontend and backend are using HTTPS in production

## File Changes Summary

### Frontend Changes:
- All API calls now use environment variables
- `netlify.toml` includes production environment variables
- No more hardcoded localhost references

### Backend Changes:
- CORS configured for production frontend URL
- Removed localhost from server logging
- Environment-based configuration

The website should now work correctly in production with proper API communication and email functionality.
