# TUT3-G6 - Full Stack Web Application

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB Atlas account (for cloud database)
- npm or yarn package manager
- Gmail account (for email functionality)

## Environment Variables Setup (IMPORTANT)

### Backend (`/Backend/.env`)
Create a `.env` file in the Backend directory using the template provided:

```bash
# Copy the template file
cp Backend/env.template Backend/.env
```

Then edit `Backend/.env` with your actual values:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/oldphones?retryWrites=true&w=majority
PORT=5000
SESSION_SECRET=your-super-secret-session-key-here-make-it-very-long-and-random
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:5173
```

**Notes:**
- Get your MongoDB URI from MongoDB Atlas
- Generate a long random string for SESSION_SECRET
- Use Gmail App Password (not your regular password) for SMTP_PASS
- Backend CORS already whitelists `http://localhost:5173` and `https://oldphones-frontend.onrender.com`
- **Never commit `.env` to GitHub**

### Frontend (`/Frontend/.env`)
Create a `.env` file in the Frontend directory using the template provided:

```bash
# Copy the template file
cp Frontend/env.template Frontend/.env
```

Then edit `Frontend/.env` with your configuration:
```
# For local development:
VITE_API_URL=http://localhost:5000/api

# For production (deployment):
# VITE_API_URL=https://your-backend-domain.example.com/api
```

**Important:** The code uses `VITE_API_URL` (not `VITE_BACKEND_URL`). Make sure to use the correct variable name.

## Installation & Setup

1. Clone the repository
```bash
git clone https://github.sydney.edu.au/COMP5347-COMP4347-2025/TUT3-G6.git
cd TUT3-G6
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../Frontend
npm install
```

4. Set up environment variables (see Environment Variables Setup above)

5. Initialize the database (optional - adds sample data)
```bash
cd Backend
npm run init-db
```

6. Start the development servers

**Backend:**
```bash
cd Backend
npm run dev    # runs Express with nodemon on http://localhost:5000
```

**Frontend:**
```bash
cd Frontend
npm run dev    # starts Vite dev server on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## Common Issues & Fixes

### 404 Errors or "Not valid JSON"
- **404 at `/auth/register` or `/phone/getPhoneSeller`**: Your backend routes are namespaced under `/api`. Use the axios instance from `src/api/axios.js` which automatically prepends `/api`.
- **"Not Found" is not valid JSON**: The frontend hit a URL that doesn't exist. Check your `VITE_API_URL` configuration and ensure it includes `/api` at the end.

### Sign-in redirecting to localhost in production
- Ensure your production `.env` in the Frontend sets `VITE_API_URL=https://your-backend.example.com/api`
- Rebuild and redeploy the frontend after changing environment variables.

## Deployment

### Option 1: Render (Backend) + Netlify/Vercel (Frontend)

**Backend (Render):**
1. Create a new **Web Service** from your GitHub repo pointing to `/Backend` as the root
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment variables (same as local `.env`):
   - `MONGO_URI`
   - `SESSION_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `PORT=10000` (optional)
   - `FRONTEND_URL=https://your-frontend.example.com` (your deployed frontend URL)
5. After deploy, you'll get a backend URL like `https://oldphones-backend.onrender.com`

**Frontend (Netlify or Vercel):**
1. New project from the repo with root set to `/Frontend`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variable: `VITE_API_URL=https://oldphones-backend.onrender.com/api`
5. Redeploy and test

### Option 2: Both on Render
- Create **two** services from the same repo:
  - Web Service → `/Backend`
  - Static Site → `/Frontend` (build `npm run build`, publish `dist`)
- Make sure the frontend's environment variable points to the backend's Render URL with `/api` suffix.

## Git Commands

```bash
# First time setup
git init
git remote add origin https://github.com/<your-username>/<your-repo>.git

# Standard workflow
git add .
git commit -m "Your commit message"
git push -u origin main
```

## Quick Checklist
- [ ] Backend `.env` created with all required variables
- [ ] Frontend `.env` created with `VITE_API_URL` (not `VITE_BACKEND_URL`)
- [ ] Both `npm install` completed in `/Backend` and `/Frontend`
- [ ] Local dev: `npm run dev` in both folders
- [ ] Test local development at http://localhost:5173
- [ ] Deploy backend → copy URL into frontend's `VITE_API_URL` with `/api`
- [ ] Rebuild & redeploy frontend
- [ ] Test login, register, create listing on deployed site

## Built With

Frontend:
* [React](https://reactjs.org/) - Frontend framework
* [Vite](https://vitejs.dev/) - Build tool and development server
* [TailwindCSS](https://tailwindcss.com/) - CSS framework
* [React Router](https://reactrouter.com/) - Routing
* [Axios](https://axios-http.com/) - HTTP client

Backend:
* [Node.js](https://nodejs.org/) - Runtime environment
* [Express](https://expressjs.com/) - Web framework
* [MongoDB](https://www.mongodb.com/) - Database
* [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
* [Nodemailer](https://nodemailer.com/) - Email functionality

* Built for Tutorial 3 (Tue 19:00 - 20:00)