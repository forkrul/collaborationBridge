# User Guide

Welcome to the 8760 User Guide! This guide will help you understand and use the application effectively.

## Overview

8760 is a modern Python web application built with FastAPI that provides a robust foundation for building scalable web services. The application follows modern development practices and includes comprehensive features for authentication, data management, and API interactions.

## Getting Started

### Accessing the Application

The application provides several interfaces for interaction:

- **Web API**: Primary interface for programmatic access
- **Interactive Documentation**: Built-in API documentation
- **Admin Interface**: Administrative functions (if enabled)

### API Documentation

8760 provides comprehensive API documentation through multiple interfaces:

#### Swagger UI
Access interactive API documentation at: `http://localhost:8000/docs`

Features:
- **Interactive Testing**: Test API endpoints directly from the browser
- **Request/Response Examples**: See example data for all endpoints
- **Authentication**: Test authenticated endpoints with tokens
- **Schema Documentation**: Detailed information about data models

#### ReDoc
Alternative documentation interface at: `http://localhost:8000/redoc`

Features:
- **Clean Interface**: Professional documentation layout
- **Detailed Schemas**: Comprehensive data model documentation
- **Code Examples**: Request/response examples in multiple formats
- **Search Functionality**: Find endpoints and schemas quickly

#### OpenAPI Specification
Raw OpenAPI specification at: `http://localhost:8000/openapi.json`

Use this for:
- **Code Generation**: Generate client libraries
- **API Testing**: Import into testing tools like Postman
- **Integration**: Connect with API management platforms

## Authentication

### Overview

8760 uses JWT (JSON Web Token) based authentication for secure access to protected resources.

### Getting Started with Authentication

#### 1. User Registration

Create a new user account:

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

#### 2. User Login

Authenticate and receive an access token:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePassword123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### 3. Using Access Tokens

Include the token in the Authorization header for protected endpoints:

```bash
curl -X GET "http://localhost:8000/api/v1/auth/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Token Management

#### Token Expiration
- **Default Expiration**: 30 minutes
- **Refresh Strategy**: Request new tokens before expiration
- **Automatic Logout**: Tokens expire automatically for security

#### Token Refresh

Refresh your access token:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Authorization: Bearer your-current-token"
```

#### Logout

Invalidate your session (client-side token removal):

```bash
curl -X POST "http://localhost:8000/api/v1/auth/logout" \
  -H "Authorization: Bearer your-token"
```

## API Usage

### Making API Requests

#### Base URL
All API endpoints are prefixed with: `http://localhost:8000/api/v1`

#### Content Type
Use `application/json` for request bodies:
```bash
curl -X POST "http://localhost:8000/api/v1/endpoint" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

#### Response Format
All responses are in JSON format with consistent structure:

**Success Response:**
```json
{
  "id": 1,
  "name": "Example",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "detail": "Error description",
  "error_code": "VALIDATION_ERROR",
  "field_errors": {
    "email": ["Invalid email format"]
  }
}
```

### Common Endpoints

#### Health Check
Check application status:
```bash
curl -X GET "http://localhost:8000/api/v1/health"
```

#### Service Discovery
Get available services:
```bash
curl -X GET "http://localhost:8000/api/v1/services"
```

#### User Profile
Get current user information:
```bash
curl -X GET "http://localhost:8000/api/v1/auth/profile" \
  -H "Authorization: Bearer your-token"
```

### Pagination

List endpoints support pagination:

```bash
curl -X GET "http://localhost:8000/api/v1/users?skip=0&limit=20"
```

Parameters:
- **skip**: Number of records to skip (default: 0)
- **limit**: Maximum records to return (default: 100, max: 1000)

Response includes pagination metadata:
```json
{
  "items": [...],
  "total": 150,
  "skip": 0,
  "limit": 20,
  "has_next": true
}
```

### Filtering and Search

Many endpoints support filtering:

```bash
# Filter by field
curl -X GET "http://localhost:8000/api/v1/users?is_active=true"

# Search by text
curl -X GET "http://localhost:8000/api/v1/users?search=john"

# Date range filtering
curl -X GET "http://localhost:8000/api/v1/users?created_after=2024-01-01"
```

## Data Models

### User Model

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "myusername",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Timestamps

All models include automatic timestamps:
- **created_at**: When the record was created
- **updated_at**: When the record was last modified
- **deleted_at**: When the record was soft-deleted (if applicable)

### Soft Delete

Some models support soft delete:
- Records are marked as deleted but not removed from database
- Soft-deleted records are excluded from normal queries
- Can be restored if needed

## Error Handling

### HTTP Status Codes

The API uses standard HTTP status codes:

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "detail": "Human-readable error message",
  "error_code": "MACHINE_READABLE_CODE",
  "field_errors": {
    "field_name": ["Field-specific error message"]
  },
  "request_id": "uuid-for-tracking"
}
```

### Common Error Codes

- **VALIDATION_ERROR**: Input validation failed
- **AUTHENTICATION_REQUIRED**: Valid token required
- **PERMISSION_DENIED**: Insufficient permissions
- **RESOURCE_NOT_FOUND**: Requested resource doesn't exist
- **RATE_LIMIT_EXCEEDED**: Too many requests

## Best Practices

### API Usage

1. **Always use HTTPS** in production
2. **Store tokens securely** (not in localStorage for web apps)
3. **Handle token expiration** gracefully
4. **Implement proper error handling**
5. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)

### Performance

1. **Use pagination** for large datasets
2. **Cache responses** when appropriate
3. **Minimize request frequency**
4. **Use compression** (gzip) for large payloads
5. **Implement request timeouts**

### Security

1. **Never log sensitive data** (passwords, tokens)
2. **Validate all input** on client side
3. **Use HTTPS** for all communications
4. **Implement proper session management**
5. **Follow OWASP guidelines**

## Troubleshooting

### Common Issues

#### Authentication Problems

**Issue**: "Invalid or expired token"
**Solution**: 
- Check token format and expiration
- Refresh token if expired
- Re-authenticate if refresh fails

**Issue**: "Permission denied"
**Solution**:
- Verify user has required permissions
- Check if account is active
- Contact administrator if needed

#### API Request Issues

**Issue**: "Validation error"
**Solution**:
- Check request format and required fields
- Verify data types match schema
- Review API documentation for examples

**Issue**: "Rate limit exceeded"
**Solution**:
- Reduce request frequency
- Implement exponential backoff
- Contact support for rate limit increase

### Getting Help

1. **Check API Documentation**: Review endpoint documentation
2. **Examine Error Messages**: Error responses include helpful details
3. **Check Application Logs**: Server logs contain detailed error information
4. **Contact Support**: Reach out to development team for assistance

### Useful Tools

- **Postman**: API testing and development
- **curl**: Command-line HTTP client
- **HTTPie**: User-friendly command-line HTTP client
- **Insomnia**: API testing and debugging

## Integration Examples

### Python Client

```python
import requests

# Authentication
response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    data={"username": "user@example.com", "password": "password"}
)
token = response.json()["access_token"]

# Authenticated request
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
    "http://localhost:8000/api/v1/auth/profile",
    headers=headers
)
user_data = response.json()
```

### JavaScript Client

```javascript
// Authentication
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'username=user@example.com&password=password'
});
const {access_token} = await loginResponse.json();

// Authenticated request
const profileResponse = await fetch('/api/v1/auth/profile', {
  headers: {'Authorization': `Bearer ${access_token}`}
});
const userData = await profileResponse.json();
```

## React Interface

### Modern Web Interface

8760 includes a modern React-based web interface that provides:

- **🌙 Dark-Mode-First Design**: Beautiful, accessible interface optimized for dark mode
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **⚡ Real-Time Updates**: Live data updates and notifications
- **🔐 Secure Authentication**: JWT-based authentication with session management
- **♿ Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### Interface Features

#### Dashboard
- System health and status overview
- Real-time metrics and monitoring
- Quick access to common tasks
- Customizable widgets and layouts

#### User Management
- User account creation and management
- Role and permission assignment
- Bulk operations and data export
- Advanced search and filtering

#### API Browser
- Interactive API documentation
- Real-time API testing interface
- Code generation examples
- Request/response inspection

### Getting Started with the Interface

1. **Access the Application**: Navigate to `http://localhost:3000` (development) or your deployed URL
2. **Login**: Use your credentials to access the interface
3. **Explore**: Navigate through the dashboard and available features
4. **Customize**: Adjust settings and preferences to your needs

### Interface Development

The React interface is built following the [UX Development PRD](../ux-development-prd.md) with:

- **Modern Stack**: React 18, TypeScript, Tailwind CSS
- **Comprehensive Testing**: 90%+ coverage with Playwright and Behave
- **Performance Optimized**: Core Web Vitals compliance
- **Accessibility First**: WCAG 2.1 AA compliance

Ready to start using 8760? Check out the interactive API documentation at `/docs` to explore all available endpoints, or access the modern React interface for a complete user experience! 🚀
