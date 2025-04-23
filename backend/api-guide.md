# Dev Trainer API Documentation

Base URL: `https://api.devtrainer.net`

## Authentication

### OAuth Routes

#### GET `/api/auth/oauth-signin`

- Initiates Google OAuth flow
- No request body required
- Redirects to Google consent screen

#### GET `/api/auth/oauth-callback`

- Google OAuth callback handler
- Processes OAuth tokens and creates/updates user
- Redirects to dashboard on success

### Email/Password Routes

#### POST `/api/auth/signup`

- Creates new user account
- Request Body:

```json
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

- Returns user data and session cookie

#### POST `/api/auth/login`

- Authenticates existing user
- Request Body:

```json
{
  "email": "string",
  "password": "string"
}
```

- Returns user data and session cookie

#### POST `/api/auth/logout`

- Logs out current user
- Clears session and cookies
- No request body required

#### POST `/api/auth/logout-all`

- Logs out user from all devices
- Requires authentication
- Clears all sessions for user

#### POST `/api/auth/make-user-admin`

- Promotes user to admin status
- Request Body:

```json
{
  "adminPassword": "string"
}
```

- Requires valid admin password

## User Management

#### GET `/api/user`

- Get current user's information
- Requires authentication
- Returns user profile data

#### POST `/api/user/shortcuts`

- Add shortcuts to user's collection
- Request Body:

```json
{
  "shortcutIds": ["string"]
}
```

- Requires authentication

#### DELETE `/api/user/shortcuts/:shortcutId`

- Remove shortcut from user's collection
- Requires authentication
- Returns updated user shortcuts

#### GET `/api/user/shortcuts`

- Get user's saved shortcuts
- Requires authentication
- Returns array of shortcuts

#### POST `/api/user/profile-picture`

- Upload/update user profile picture
- Requires multipart form data
- Max size: 5MB
- Accepted formats: jpg, jpeg, png

#### GET `/api/user/profile-picture`

- Get user's profile picture
- Requires authentication
- Returns base64 encoded image

#### POST `/api/user/full-name`

- Update user's full name
- Request Body:

```json
{
  "fullName": "string"
}
```

- Requires authentication

#### DELETE `/api/user/delete-user`

- Delete user account
- Requires authentication
- Clears all user data except email

## Shortcuts Management

#### GET `/api/shortcuts`

- Get all shortcuts
- Supports pagination
- Query params: `page`, `limit`
- Requires authentication

#### GET `/api/shortcuts/type/:type`

- Get shortcuts by type
- Supports pagination
- Types: "mac", "vs code", "terminal"
- Query params: `page`, `limit`
- Requires authentication

#### GET `/api/shortcuts/types`

- Get all available shortcut types
- Requires authentication
- Returns array of types

#### POST `/api/shortcuts/admin`

- Create new shortcut (admin only)
- Request Body:

```json
{
  "shortDescription": "string",
  "description": "string",
  "keys": ["string"],
  "type": "string"
}
```

- Requires admin authentication

#### PUT `/api/shortcuts/admin/:id`

- Update existing shortcut (admin only)
- Same body as POST
- Requires admin authentication

#### DELETE `/api/shortcuts/admin/:id`

- Delete shortcut (admin only)
- Requires admin authentication

#### GET `/api/shortcuts/:id`

- Get specific shortcut by ID
- Requires authentication

## Code Snippets

#### POST `/api/snippets`

- Generate code snippet using AI
- Request Body:

```json
{
  "userInput": "string",
  "language": "string"
}
```

- Rate limited: 5 requests per minute
- Requires authentication

## Response Formats

### Success Response

```json
{
  "message": "string",
  "code": "string",
  "data?: any"
}
```

### Error Response

```json
{
  "message": "string",
  "code": "string"
}
```

## Authentication

All authenticated routes require:

- Valid session cookie
- Credentials in requests
- CORS enabled for frontend origin

## Rate Limiting

- Login attempts: 5 per minute
- Snippet generation: 5 per minute
- General API calls: 100 per minute

## Environment Variables

Required environment variables:

- `MONGO_URL`: MongoDB connection string
- `REDIS_URL`: Redis connection URL
- `SESSION_SECRET`: Session encryption key
- `TOKEN_ENCRYPTION_KEY`: OAuth token encryption key
- `ADMIN_PASSWORD`: Admin promotion password
- `OAUTH_CLIENT_ID`: Google OAuth client ID
- `OAUTH_CLIENT_SECRET`: Google OAuth client secret
- `OAUTH_REDIRECT_URL`: OAuth callback URL
