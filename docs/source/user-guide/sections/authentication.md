# Authentication Guide

This guide covers everything you need to know about authentication in the application.

## Overview

The application uses JWT (JSON Web Token) based authentication for secure access to protected resources. The authentication system provides:

- **Secure Token-Based Authentication**: JWT tokens for stateless authentication
- **User Registration and Login**: Complete user account management
- **Token Refresh**: Automatic token renewal for seamless user experience
- **Role-Based Access Control**: Different permission levels for different user types
- **Session Management**: Secure session handling and logout

## Getting Started

### User Registration

Create a new user account using the registration endpoint:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "myusername",
    "password": "SecurePassword123",
    "full_name": "John Doe"
  }'
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "myusername",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-06-23T10:30:00Z"
}
```

### User Login

Authenticate and receive an access token:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePassword123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "myusername",
    "full_name": "John Doe"
  }
}
```

### Using Access Tokens

Include the token in the Authorization header for protected endpoints:

```bash
curl -X GET "http://localhost:8000/api/v1/auth/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Token Management

### Token Types

**Access Token:**
- **Purpose**: Authenticate API requests
- **Lifetime**: 30 minutes (default)
- **Usage**: Include in Authorization header
- **Format**: `Bearer <token>`

**Refresh Token:**
- **Purpose**: Obtain new access tokens
- **Lifetime**: 7 days (default)
- **Usage**: Exchange for new access token
- **Security**: More secure, longer-lived

### Token Expiration

Access tokens have a limited lifetime for security. When a token expires:

1. **API returns 401 Unauthorized**
2. **Client should refresh the token**
3. **If refresh fails, redirect to login**

### Token Refresh

Refresh your access token before it expires:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "your-refresh-token"}'
```

**Response:**
```json
{
  "access_token": "new-access-token",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### Automatic Token Refresh

Implement automatic token refresh in your client:

```javascript
// JavaScript example
class AuthClient {
  constructor() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  async makeRequest(url, options = {}) {
    // Add authorization header
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`
    };

    let response = await fetch(url, options);

    // If token expired, try to refresh
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        options.headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, options);
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    }

    return response;
  }

  async refreshAccessToken() {
    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refresh_token: this.refreshToken})
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access_token;
        localStorage.setItem('access_token', this.accessToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }
}
```

## User Profile Management

### Get Current User Profile

Retrieve information about the currently authenticated user:

```bash
curl -X GET "http://localhost:8000/api/v1/auth/profile" \
  -H "Authorization: Bearer your-token"
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "myusername",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-06-23T10:30:00Z",
  "updated_at": "2024-06-23T10:30:00Z",
  "last_login": "2024-06-23T15:45:00Z"
}
```

### Update User Profile

Update user profile information:

```bash
curl -X PATCH "http://localhost:8000/api/v1/auth/profile" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Smith",
    "email": "john.smith@example.com"
  }'
```

### Change Password

Change the user's password:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/change-password" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "OldPassword123",
    "new_password": "NewSecurePassword456"
  }'
```

## Session Management

### Logout

Invalidate the current session:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/logout" \
  -H "Authorization: Bearer your-token"
```

**Client-side logout:**
```javascript
// Clear tokens from storage
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');

// Redirect to login page
window.location.href = '/login';
```

### Session Security

**Best Practices:**

1. **Store tokens securely**:
   - Use httpOnly cookies for web apps
   - Use secure storage for mobile apps
   - Never store in localStorage for sensitive apps

2. **Implement proper logout**:
   - Clear all tokens
   - Invalidate server-side sessions
   - Redirect to login page

3. **Handle token expiration**:
   - Implement automatic refresh
   - Graceful fallback to login
   - Show appropriate user messages

## Role-Based Access Control

### User Roles

**Standard Roles:**
- **User**: Basic application access
- **Admin**: Administrative functions
- **Superuser**: Full system access

### Permission Checking

Check user permissions:

```bash
curl -X GET "http://localhost:8000/api/v1/auth/permissions" \
  -H "Authorization: Bearer your-token"
```

**Response:**
```json
{
  "roles": ["user"],
  "permissions": [
    "users.read",
    "posts.create",
    "posts.read",
    "posts.update_own"
  ]
}
```

### Protected Endpoints

Some endpoints require specific permissions:

```bash
# Admin-only endpoint
curl -X GET "http://localhost:8000/api/v1/admin/users" \
  -H "Authorization: Bearer admin-token"

# Superuser-only endpoint
curl -X DELETE "http://localhost:8000/api/v1/admin/users/123" \
  -H "Authorization: Bearer superuser-token"
```

## Security Best Practices

### Client-Side Security

1. **Token Storage**:
   ```javascript
   // ✅ Good: Use httpOnly cookies
   // Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict

   // ❌ Avoid: localStorage for sensitive apps
   localStorage.setItem('token', token); // Vulnerable to XSS
   ```

2. **HTTPS Only**:
   ```javascript
   // Always use HTTPS in production
   const API_BASE = 'https://api.yourdomain.com';
   ```

3. **Token Validation**:
   ```javascript
   // Validate token before use
   function isTokenValid(token) {
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       return payload.exp > Date.now() / 1000;
     } catch {
       return false;
     }
   }
   ```

### Server-Side Security

The server implements several security measures:

- **Password Hashing**: bcrypt with salt
- **Rate Limiting**: Prevent brute force attacks
- **CORS Configuration**: Restrict cross-origin requests
- **Input Validation**: Pydantic schema validation
- **SQL Injection Prevention**: SQLAlchemy ORM protection

## Error Handling

### Authentication Errors

**Common Error Responses:**

```json
// Invalid credentials
{
  "detail": "Invalid username or password",
  "error_code": "INVALID_CREDENTIALS"
}

// Token expired
{
  "detail": "Token has expired",
  "error_code": "TOKEN_EXPIRED"
}

// Invalid token
{
  "detail": "Invalid token",
  "error_code": "INVALID_TOKEN"
}

// Insufficient permissions
{
  "detail": "Insufficient permissions",
  "error_code": "PERMISSION_DENIED"
}
```

### Error Handling in Client Code

```javascript
async function handleAuthError(response) {
  const error = await response.json();
  
  switch (error.error_code) {
    case 'TOKEN_EXPIRED':
      // Try to refresh token
      return await refreshToken();
      
    case 'INVALID_TOKEN':
    case 'INVALID_CREDENTIALS':
      // Redirect to login
      window.location.href = '/login';
      break;
      
    case 'PERMISSION_DENIED':
      // Show permission error
      showError('You do not have permission to perform this action');
      break;
      
    default:
      showError(error.detail || 'Authentication error');
  }
}
```

## Integration Examples

### Python Client

```python
import requests
from typing import Optional

class AuthClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None

    def login(self, username: str, password: str) -> bool:
        """Login and store tokens."""
        response = requests.post(
            f"{self.base_url}/api/v1/auth/login",
            data={"username": username, "password": password}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            return True
        return False

    def make_authenticated_request(self, method: str, endpoint: str, **kwargs):
        """Make an authenticated request with automatic token refresh."""
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Bearer {self.access_token}'
        kwargs['headers'] = headers

        response = requests.request(method, f"{self.base_url}{endpoint}", **kwargs)
        
        # If token expired, try to refresh
        if response.status_code == 401:
            if self.refresh_access_token():
                headers['Authorization'] = f'Bearer {self.access_token}'
                response = requests.request(method, f"{self.base_url}{endpoint}", **kwargs)
        
        return response

    def refresh_access_token(self) -> bool:
        """Refresh the access token."""
        if not self.refresh_token:
            return False
            
        response = requests.post(
            f"{self.base_url}/api/v1/auth/refresh",
            json={"refresh_token": self.refresh_token}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data["access_token"]
            return True
        return False

# Usage
client = AuthClient("http://localhost:8000")
if client.login("user@example.com", "password"):
    response = client.make_authenticated_request("GET", "/api/v1/auth/profile")
    print(response.json())
```

### React Hook

```javascript
// useAuth.js - React authentication hook
import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `username=${username}&password=${password}`
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        setUser(data.user);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const response = await authenticatedFetch('/api/v1/auth/profile');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    let response = await fetch(url, { ...options, headers });

    // Handle token expiration
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        response = await fetch(url, { ...options, headers });
      } else {
        logout();
      }
    }

    return response;
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refresh_token: refresh})
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    authenticatedFetch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Troubleshooting

### Common Issues

**Issue: "Invalid or expired token"**
- **Cause**: Token has expired or is malformed
- **Solution**: Refresh token or re-authenticate

**Issue: "Permission denied"**
- **Cause**: User lacks required permissions
- **Solution**: Contact administrator for role assignment

**Issue: "Rate limit exceeded"**
- **Cause**: Too many authentication attempts
- **Solution**: Wait and retry, implement exponential backoff

**Issue: "User account disabled"**
- **Cause**: Account has been deactivated
- **Solution**: Contact administrator to reactivate account

### Debug Authentication Issues

```bash
# Check token validity
curl -X GET "http://localhost:8000/api/v1/auth/verify-token" \
  -H "Authorization: Bearer your-token"

# Get detailed user information
curl -X GET "http://localhost:8000/api/v1/auth/profile" \
  -H "Authorization: Bearer your-token"

# Check user permissions
curl -X GET "http://localhost:8000/api/v1/auth/permissions" \
  -H "Authorization: Bearer your-token"
```

Ready to implement secure authentication in your application? This guide covers everything you need to know! 🔐
