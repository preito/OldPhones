# TUT3-G6 - Full Stack Web Application

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB (for database)
- npm or yarn package manager

### Installing

1. Clone the repository
```bash
git clone https://github.sydney.edu.au/COMP5347-COMP4347-2025/TUT3-G6.git
cd TUT3-G6
```

2. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../Backend
npm install
```

4. Set up environment variables
- Create a `.env` file in the Backend directory
- Add necessary environment variables (MongoDB URI, session secret, etc.)

5. Initialize the database
```bash
cd Backend
./init_database.bat
```

6. Start the development servers

Frontend:
```bash
cd Frontend
npm run dev
```

Backend:
```bash
cd Backend
npm run dev
```

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