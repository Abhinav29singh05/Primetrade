Task Management System

A full-stack Task Management System built with React, Node.js, Express, and MongoDB. This application allows users to manage tasks, track their progress, and enables admins to manage users and assign admin privileges.

Features
User Features
Register and login as a user
Add, view, edit, and delete tasks
Set task descriptions
Track task status: to-do, in-progress, completed
Logout securely

Admin Features
View all users
Promote users to admin
Delete users
View user tasks

Tech Stack
Layer	Technology
Frontend-->	React, JSX, CSS
Backend-->	Node.js, Express
Database-->	MongoDB (Atlas or Local)
Authentication-->	JWT
Deployment-->	Frontend: Vercel, Backend: Render


Getting Started
Prerequisites
Node.js & npm installed
MongoDB Atlas account or local MongoDB setup
Git & GitHub account

Clone the Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret


Run locally:

npm run dev

Frontend Setup
cd frontend
npm install
npm start


Frontend will run on http://localhost:3000 by default

Deployment
Frontend: Deploy the frontend folder on Vercel
Backend: Deploy the backend folder on Render or Railway

Make sure to update environment variables for the deployed backend.

PRIMETRADE/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   ├── package-lock.json
│   ├── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
└── README.md



API Endpoints
User

POST /users/register – Register user
POST /users/login – Login user
GET /users/me – Get logged-in user

Tasks
GET /tasks – Get all tasks for user
POST /tasks – Add task
PATCH /tasks/:id – Update task (title, description, status)
DELETE /tasks/:id – Delete task

Admin
GET /admin/users – Get all users
PATCH /admin/makeAdmin/:id – Promote user to admin
DELETE /admin/deleteUser/:id – Delete user

License

This project is licensed under the MIT License.
