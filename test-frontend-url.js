// Test script to verify FRONTEND_URL is set correctly
// Run this in your backend directory: node test-frontend-url.js

console.log('Current FRONTEND_URL:', process.env.FRONTEND_URL);

if (!process.env.FRONTEND_URL) {
  console.log('❌ FRONTEND_URL is not set!');
} else if (process.env.FRONTEND_URL.includes('localhost')) {
  console.log('❌ FRONTEND_URL still points to localhost!');
  console.log('Update it to your Netlify domain: https://your-site.netlify.app');
} else if (process.env.FRONTEND_URL.startsWith('https://')) {
  console.log('✅ FRONTEND_URL looks correct!');
  console.log('Reset password links will now point to:', process.env.FRONTEND_URL);
} else {
  console.log('⚠️  FRONTEND_URL should start with https://');
}

