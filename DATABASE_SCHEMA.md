# Bug Bounty Platform - Database Schema

## Overview

The Bug Bounty Platform uses **MongoDB** as its database with **Mongoose** as the ODM (Object Document Mapper). The database consists of three main collections:

1. **Users** - Platform users (bug creators and hunters)
2. **Bugs** - Bug bounties posted by users
3. **Submissions** - Solutions submitted by hunters

---

## Collections

### 1. Users Collection

Stores information about all platform users.

**Collection Name:** `users`

**Schema:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Unique identifier (MongoDB) |
| `name` | String | Yes | - | User's full name |
| `email` | String | Yes | - | User's email (unique) |
| `password` | String | Yes | - | Hashed password (bcrypt) |
| `totalRewards` | Number | No | 0 | Total bounties earned |
| `role` | String | No | "user" | User role (user/admin) |
| `createdAt` | Date | Auto | - | Account creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

**Indexes:**
- `email` - Unique index for fast lookup and uniqueness constraint

**Methods:**
- `matchPassword(enteredPassword)` - Compares entered password with hashed password

**Hooks:**
- Pre-save hook to hash password using bcrypt (salt rounds: 10)

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "totalRewards": 5000,
  "role": "user",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-02-17T08:00:00.000Z"
}
```

---

### 2. Bugs Collection

Stores bug bounties posted by users.

**Collection Name:** `bugs`

**Schema:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Unique identifier |
| `title` | String | Yes | - | Bug title/summary |
| `description` | String | Yes | - | Detailed bug description |
| `bountyAmount` | Number | Yes | - | Reward amount (min: 1) |
| `status` | String | No | "Open" | Bug status (Open/Closed) |
| `createdBy` | ObjectId | Yes | - | Reference to User who created |
| `winner` | ObjectId | No | null | Reference to User who won |
| `createdAt` | Date | Auto | - | Bug creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

**Relationships:**
- `createdBy` → References `users` collection
- `winner` → References `users` collection

**Constraints:**
- `status` - Enum: ["Open", "Closed"]
- `bountyAmount` - Minimum value: 1

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "XSS Vulnerability in Search Bar",
  "description": "Script tag executes in search bar when user input is not sanitized. Steps to reproduce: 1. Navigate to search page 2. Enter <script>alert('XSS')</script> 3. Submit search",
  "bountyAmount": 500,
  "status": "Open",
  "createdBy": "507f1f77bcf86cd799439011",
  "winner": null,
  "createdAt": "2026-02-10T14:20:00.000Z",
  "updatedAt": "2026-02-10T14:20:00.000Z"
}
```

---

### 3. Submissions Collection

Stores solution submissions for bug bounties.

**Collection Name:** `submissions`

**Schema:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Unique identifier |
| `bugId` | ObjectId | Yes | - | Reference to Bug |
| `submittedBy` | ObjectId | Yes | - | Reference to User who submitted |
| `description` | String | Yes | - | Solution description |
| `proof` | String | Yes | - | URL/link to proof (GitHub, etc.) |
| `status` | String | No | "Pending" | Submission status |
| `createdAt` | Date | Auto | - | Submission timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

**Relationships:**
- `bugId` → References `bugs` collection
- `submittedBy` → References `users` collection

**Constraints:**
- `status` - Enum: ["Pending", "Approved", "Rejected"]

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "bugId": "507f1f77bcf86cd799439012",
  "submittedBy": "507f1f77bcf86cd799439014",
  "description": "Fixed the XSS vulnerability by implementing input sanitization using DOMPurify library. All user inputs are now sanitized before rendering.",
  "proof": "https://github.com/username/repo/pull/123",
  "status": "Pending",
  "createdAt": "2026-02-17T09:30:00.000Z",
  "updatedAt": "2026-02-17T09:30:00.000Z"
}
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ _id (PK)        │
│ name            │
│ email (unique)  │
│ password        │
│ totalRewards    │
│ role            │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N (createdBy)
         │
         ▼
┌─────────────────┐
│      BUGS       │
├─────────────────┤
│ _id (PK)        │
│ title           │
│ description     │
│ bountyAmount    │
│ status          │
│ createdBy (FK)  │◄────┐
│ winner (FK)     │     │
│ createdAt       │     │
│ updatedAt       │     │
└────────┬────────┘     │
         │              │
         │ 1:N (bugId)  │ 1:1 (winner)
         │              │
         ▼              │
┌─────────────────┐     │
│  SUBMISSIONS    │     │
├─────────────────┤     │
│ _id (PK)        │     │
│ bugId (FK)      │     │
│ submittedBy (FK)├─────┘
│ description     │
│ proof           │
│ status          │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

---

## Business Logic & Workflows

### Bug Creation Flow
1. Authenticated user creates a bug with title, description, and bounty amount
2. Bug is created with status "Open" and `createdBy` set to current user
3. Bug is visible to all users (public)

### Submission Flow
1. Authenticated user submits a solution to an open bug
2. System validates:
   - Bug exists and is "Open"
   - User is not the bug creator
   - User hasn't already submitted to this bug
3. Submission is created with status "Pending"

### Approval Flow
1. Bug creator approves a submission
2. System validates:
   - User is the bug creator
   - Bug is still "Open"
   - Submission exists and is "Pending"
3. System updates:
   - Bug status → "Closed"
   - Bug winner → submission author
   - Submission status → "Approved"
   - Winner's totalRewards += bountyAmount

---

## Database Configuration

**Connection String:**
```
mongodb://localhost:27017/bugbounty
```

**Environment Variables:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

---

## Indexes & Performance

**Recommended Indexes:**

1. **Users Collection:**
   - `email` (unique) - Already created by schema
   
2. **Bugs Collection:**
   - `status` - For filtering open/closed bugs
   - `createdBy` - For user's bug listings
   - `createdAt` (descending) - For sorting by date

3. **Submissions Collection:**
   - `bugId` - For fetching submissions by bug
   - `submittedBy` - For user's submission history
   - `status` - For filtering by status

**Example Index Creation:**
```javascript
// In MongoDB shell or application startup
db.bugs.createIndex({ status: 1 });
db.bugs.createIndex({ createdBy: 1 });
db.bugs.createIndex({ createdAt: -1 });

db.submissions.createIndex({ bugId: 1 });
db.submissions.createIndex({ submittedBy: 1 });
db.submissions.createIndex({ status: 1 });
```

---

## Data Validation Rules

### Users
- Email must be unique and valid format
- Password must be at least 6 characters (enforced at application level)
- Name is required

### Bugs
- Title and description are required
- Bounty amount must be >= 1
- Status can only be "Open" or "Closed"
- CreatedBy must reference a valid user

### Submissions
- All fields (bugId, submittedBy, description, proof) are required
- BugId must reference a valid bug
- SubmittedBy must reference a valid user
- Status can only be "Pending", "Approved", or "Rejected"
- User cannot submit to their own bug (enforced at application level)
- User can only submit once per bug (enforced at application level)

---

## Sample Data

### Sample User
```javascript
{
  name: "Alice Hunter",
  email: "alice@example.com",
  password: "hashedPassword123",
  totalRewards: 2500,
  role: "user"
}
```

### Sample Bug
```javascript
{
  title: "SQL Injection in Login Form",
  description: "The login form allows SQL injection through username field",
  bountyAmount: 1000,
  status: "Open",
  createdBy: ObjectId("507f1f77bcf86cd799439011")
}
```

### Sample Submission
```javascript
{
  bugId: ObjectId("507f1f77bcf86cd799439012"),
  submittedBy: ObjectId("507f1f77bcf86cd799439014"),
  description: "Fixed by using parameterized queries",
  proof: "https://github.com/alice/fix-sql-injection/pull/1",
  status: "Pending"
}
```
