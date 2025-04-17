# WatchWave - Movie Streaming Platform

A full-stack movie streaming platform built with React, Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Admin panel to manage users
- Movie browsing and filtering
- Save movies to favorites
- Responsive design

## Prerequisites

- Node.js (>= 14.x)
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory (or modify the existing one):
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/watchwave
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

The backend server will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

The frontend application will run on `http://localhost:3000`.

## Project Structure

- `/backend`: Node.js/Express server
  - `/controllers`: Business logic
  - `/middleware`: Authentication middleware
  - `/models`: MongoDB schemas
  - `/routes`: API routes

- `/frontend`: React application
  - `/src/components`: Reusable UI components
  - `/src/context`: Authentication context
  - `/src/pages`: App screens
  - `/src/store`: Redux store
  - `/src/utils`: Utility functions

## API Endpoints

### Authentication
- `POST /api/user/register`: Register a new user
- `POST /api/user/login`: Login user

### User Operations
- `GET /api/user/profile`: Get user profile
- `GET /api/user/liked/:email`: Get user's liked movies
- `POST /api/user/add`: Add movie to liked list
- `PUT /api/user/remove`: Remove movie from liked list

### Admin Operations
- `GET /api/user/admin/users`: Get all users (admin only)
- `DELETE /api/user/admin/users/:userId`: Delete user (admin only)

## Creating an Admin User

To create an admin user, register a regular user first, then update the user's `isAdmin` field in the MongoDB database to `true`.

```
db.users.updateOne({ email: "admin@example.com" }, { $set: { isAdmin: true } })
```

## License

MIT