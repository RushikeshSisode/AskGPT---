# AskGPT

AskGPT is a full-stack MERN-style AI chat application with authentication, persistent chat history, Gemini-powered text replies, AI image generation, a public community image feed, and a credit-based payment flow.

The frontend is built with React and Vite, and the backend is built with Express, MongoDB, and Mongoose.

## Features

- User registration and login with JWT authentication
- Persistent chat history per user
- Text chat powered by Google Gemini
- AI image generation with ImageKit
- Community page for published generated images
- Credit-based usage system
- Razorpay payment integration for credit purchases
- Production-safe environment variable examples
- In-app toast errors for text and image generation failures
- Deployment-ready frontend/backend environment separation

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express 5, MongoDB, Mongoose
- AI: Google Gemini API
- Media: ImageKit
- Payments: Razorpay
- Auth: JWT, bcryptjs

## Project Structure

```text
AskGPT/
|- client/   React + Vite frontend
\- server/   Express + MongoDB backend
```

## Environment Variables

### Backend: `server/.env`

```env
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
GEMINI_TEXT_MODEL=gemini-3.1-flash-lite
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
PORT=5000
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend: `client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd AskGPT
```

### 2. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Configure environment variables

- Create `server/.env` from `server/.env.example`
- Create `client/.env` from `client/.env.example`
- Add your real keys for MongoDB, Gemini, ImageKit, and Razorpay

### 4. Start the backend

```bash
cd server
npm run serve
```

### 5. Start the frontend

```bash
cd client
npm run dev
```

### 6. Open the app

Visit `http://localhost:5173`

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Server

```bash
npm run serve
npm start
```

## API Overview

### User routes

- `POST /api/users/register` - create account
- `POST /api/users/login` - sign in
- `GET /api/users/me` - get current user
- `GET /api/users/published-images` - fetch community images

### Chat routes

- `POST /api/chats` - create chat
- `GET /api/chats` - get user chats
- `DELETE /api/chats/:chatId` - delete chat
- `POST /api/chats/:chatId/message` - send text message
- `POST /api/chats/:chatId/image` - generate image

### Payment routes

- `GET /api/payments/plans` - get plans
- `POST /api/payments/purchase` - create Razorpay order
- `POST /api/payments/verify` - verify payment and add credits

## Production Deployment

This project is set up well for deploying the frontend and backend separately.

### Recommended platform

- Frontend: Render Static Site or Vercel
- Backend: Render Web Service
- Database: MongoDB Atlas

Render is a strong choice for this project because it works well with separate frontend/backend deployment, custom environment variables, and simple Node hosting.

### Backend deployment notes

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add all variables from `server/.env.example`
- Set `ALLOWED_ORIGINS` and `CLIENT_URL` to your deployed frontend URL

### Frontend deployment notes

- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Set `VITE_BACKEND_URL` to your deployed backend URL

## Important Production Notes

- If text chat fails in production while image generation still works, the Gemini API key or Gemini model configuration is usually the first thing to verify.
- Keep `.env` files out of Git and rotate any secret that was ever pushed to a public repository.
- CORS must include your deployed frontend origin in `ALLOWED_ORIGINS`.
- The frontend expects a valid backend URL through `VITE_BACKEND_URL`.

## Security

- Do not commit `.env` files
- Use strong values for `JWT_SECRET`
- Rotate exposed API keys immediately
- Keep MongoDB network access restricted
- Use separate development and production credentials

## Current Product Areas

- Login and authentication
- Main AI chat workspace
- Image generation flow
- Community gallery
- Credits and upgrade flow

## Known Notes

- Image generation consumes more credits than text chat
- Payment flow depends on valid Razorpay credentials
- Text chat depends on a working Gemini key and supported model name


