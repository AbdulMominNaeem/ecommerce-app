# Ecommerce App

A full-stack ecommerce application with a React + Vite frontend and an Express + MongoDB backend.

## Project structure

- `frontend/` - React app built with Vite
- `server/` - Express backend API with MongoDB, authentication, image upload, and email verification support

## Prerequisites

- Node.js 18+ installed
- MongoDB instance available (local or cloud)

## Environment variables

Create a `.env` file in `server/` with at least:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_EMAIL=<smtp_username>
SMTP_PASSWORD=<smtp_password>
```

If you do not need email verification, the SMTP variables may be optional depending on your use.

## Install dependencies

From the root folder, install frontend and backend dependencies separately:

```bash
cd frontend
npm install

cd ../server
npm install
```

## Run the app

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend app:

```bash
cd frontend
npm run dev
```

Frontend runs with Vite, and backend runs on the configured port (default `5000`).

## API endpoints

- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login and receive token
- `POST /api/auth/upload` - upload profile image
- `GET /api/user` - get current user data
- `PUT /api/user` - update user name/email

## Notes

- Uploaded images are served from the backend `/uploads` route
- User profile image is stored in the database as `photo` / `avatar`
- The frontend expects the backend to return a full image URL

## Useful commands

- Frontend development: `cd frontend && npm run dev`
- Backend development: `cd server && npm run dev`
- Frontend build: `cd frontend && npm run build`
- Backend start: `cd server && npm start`
