# Bug Bounty Web Platform

A full-stack MERN application for posting and solving bug bounties.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, bcrypt

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port (27017)

### Backend Setup
1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (or use default if hardcoded for dev):
   ```
   MONGO_URI=mongodb://localhost:27017/bugbounty
   JWT_SECRET=supersecretkey123
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- **User Auth**: Register/Login
- **Create Bug**: Post a bug with a bounty amount.
- **Solve Bug**: Submit a solution with proof.
- **Approve Solution**: Bug creator can approve a submission, which closes the bug and rewards the solver.
- **Dashboard**: View all open bugs.
- **Profile**: View earned rewards.
