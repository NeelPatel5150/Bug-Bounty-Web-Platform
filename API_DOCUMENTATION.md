# Bug Bounty Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing fields or user already exists
- `400` - Invalid user data

---

### Login User
**POST** `/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Invalid credentials

---

### Get Current User
**GET** `/auth/me`

Get the authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "totalRewards": 5000,
  "role": "user",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-02-17T08:00:00.000Z"
}
```

**Error Responses:**
- `401` - Not authorized, no token
- `401` - Not authorized, token failed

---

## Bugs

### Get All Bugs
**GET** `/bugs`

Retrieve all bug bounties (public access).

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "XSS Vulnerability in Search Bar",
    "description": "Script tag executes in search bar...",
    "bountyAmount": 500,
    "status": "Open",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "winner": null,
    "createdAt": "2026-02-10T14:20:00.000Z",
    "updatedAt": "2026-02-10T14:20:00.000Z"
  }
]
```

---

### Get Bug by ID
**GET** `/bugs/:id`

Retrieve a specific bug by its ID (public access).

**Parameters:**
- `id` - Bug ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "XSS Vulnerability in Search Bar",
  "description": "Script tag executes in search bar when user input is not sanitized...",
  "bountyAmount": 500,
  "status": "Open",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "winner": null,
  "createdAt": "2026-02-10T14:20:00.000Z",
  "updatedAt": "2026-02-10T14:20:00.000Z"
}
```

**Error Responses:**
- `404` - Bug not found

---

### Create Bug
**POST** `/bugs`

Create a new bug bounty (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "SQL Injection in Login Form",
  "description": "The login form is vulnerable to SQL injection attacks...",
  "bountyAmount": 1000
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "SQL Injection in Login Form",
  "description": "The login form is vulnerable to SQL injection attacks...",
  "bountyAmount": 1000,
  "status": "Open",
  "createdBy": "507f1f77bcf86cd799439011",
  "winner": null,
  "createdAt": "2026-02-17T10:00:00.000Z",
  "updatedAt": "2026-02-17T10:00:00.000Z"
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Not authorized

---

### Approve Submission
**PATCH** `/bugs/:id/approve/:submissionId`

Approve a submission and award the bounty (requires authentication, only bug creator).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` - Bug ID
- `submissionId` - Submission ID to approve

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "XSS Vulnerability in Search Bar",
  "description": "Script tag executes in search bar...",
  "bountyAmount": 500,
  "status": "Closed",
  "createdBy": "507f1f77bcf86cd799439011",
  "winner": "507f1f77bcf86cd799439014",
  "createdAt": "2026-02-10T14:20:00.000Z",
  "updatedAt": "2026-02-17T11:00:00.000Z"
}
```

**Error Responses:**
- `400` - Bug already closed
- `400` - Cannot submit to your own bug
- `401` - Not authorized
- `403` - Only bug creator can approve
- `404` - Bug or submission not found

---

## Submissions

### Submit Solution
**POST** `/submissions/:bugId`

Submit a solution for a bug bounty (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `bugId` - Bug ID to submit solution for

**Request Body:**
```json
{
  "description": "Fixed the XSS vulnerability by implementing input sanitization...",
  "proof": "https://github.com/username/repo/pull/123"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "bugId": "507f1f77bcf86cd799439012",
  "submittedBy": "507f1f77bcf86cd799439014",
  "description": "Fixed the XSS vulnerability by implementing input sanitization...",
  "proof": "https://github.com/username/repo/pull/123",
  "status": "Pending",
  "createdAt": "2026-02-17T09:30:00.000Z",
  "updatedAt": "2026-02-17T09:30:00.000Z"
}
```

**Error Responses:**
- `400` - Bug is already closed
- `400` - Cannot submit to your own bug
- `400` - Already submitted to this bug
- `401` - Not authorized
- `404` - Bug not found

---

### Get Submissions for Bug
**GET** `/submissions/:bugId`

Get all submissions for a specific bug (public access).

**Parameters:**
- `bugId` - Bug ID

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "bugId": "507f1f77bcf86cd799439012",
    "submittedBy": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "description": "Fixed the XSS vulnerability by implementing input sanitization...",
    "proof": "https://github.com/username/repo/pull/123",
    "status": "Pending",
    "createdAt": "2026-02-17T09:30:00.000Z",
    "updatedAt": "2026-02-17T09:30:00.000Z"
  }
]
```

**Error Responses:**
- `404` - Bug not found

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Flow

1. **Register** or **Login** to receive a JWT token
2. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Token expires in 30 days

---

## Common Error Response Format

```json
{
  "message": "Error description here"
}
```
