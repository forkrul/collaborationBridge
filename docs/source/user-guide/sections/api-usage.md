# API Usage Guide

This comprehensive guide covers how to effectively use the 8760 API for building applications and integrations.

## API Overview

The 8760 API is a RESTful API built with FastAPI that provides:

- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Format**: All requests and responses use JSON
- **OpenAPI Documentation**: Interactive documentation at `/docs`
- **Versioned API**: Current version is v1 (`/api/v1/`)
- **Authentication**: JWT-based authentication for protected endpoints
- **Rate Limiting**: Built-in rate limiting for API protection

## Base URL and Versioning

### Base URL Structure

```
{protocol}://{host}:{port}/api/{version}/
```

**Examples:**
- Development: `http://localhost:8000/api/v1/`
- Production: `https://api.yourdomain.com/api/v1/`

### API Versioning

The API uses URL-based versioning:
- **Current Version**: `v1`
- **Future Versions**: `v2`, `v3`, etc.
- **Backward Compatibility**: Previous versions remain available

## Making API Requests

### Request Format

All API requests should include appropriate headers:

```bash
curl -X POST "http://localhost:8000/api/v1/endpoint" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"key": "value"}'
```

### Required Headers

**Content-Type**: Always use `application/json` for request bodies
```bash
-H "Content-Type: application/json"
```

**Authorization**: Include JWT token for protected endpoints
```bash
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Accept**: Specify response format (optional, defaults to JSON)
```bash
-H "Accept: application/json"
```

### HTTP Methods

The API uses standard HTTP methods:

- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT**: Update entire resource
- **PATCH**: Partial resource update
- **DELETE**: Remove resources

## Response Format

### Success Responses

All successful responses follow a consistent format:

**Single Resource:**
```json
{
  "id": 1,
  "name": "Example Resource",
  "created_at": "2024-06-23T10:30:00Z",
  "updated_at": "2024-06-23T10:30:00Z"
}
```

**List of Resources:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Resource 1"
    },
    {
      "id": 2,
      "name": "Resource 2"
    }
  ],
  "total": 150,
  "skip": 0,
  "limit": 20,
  "has_next": true
}
```

### Error Responses

Error responses include detailed information:

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

### HTTP Status Codes

The API uses standard HTTP status codes:

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **204 No Content**: Successful request with no response body
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Core Endpoints

### Health Check

Check application status:

```bash
curl -X GET "http://localhost:8000/api/v1/health"
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-06-23T10:30:00Z",
  "version": "2.0.0",
  "environment": "production"
}
```

### Service Discovery

Get available services and their URLs:

```bash
curl -X GET "http://localhost:8000/api/v1/services"
```

**Response:**
```json
{
  "services": {
    "api": {
      "url": "http://localhost:8000",
      "health_endpoint": "/api/v1/health",
      "status": "healthy"
    },
    "database": {
      "status": "healthy",
      "connection_pool": {
        "active": 5,
        "idle": 15
      }
    }
  }
}
```

### API Information

Get API version and capabilities:

```bash
curl -X GET "http://localhost:8000/api/v1/info"
```

**Response:**
```json
{
  "name": "8760 API",
  "version": "2.0.0",
  "description": "Python MVP Template API",
  "features": [
    "authentication",
    "soft_delete",
    "bulk_operations",
    "health_monitoring"
  ],
  "documentation_url": "/docs"
}
```

## Pagination

### Pagination Parameters

List endpoints support pagination with these parameters:

- **skip**: Number of records to skip (default: 0)
- **limit**: Maximum records to return (default: 100, max: 1000)

```bash
curl -X GET "http://localhost:8000/api/v1/users?skip=20&limit=10"
```

### Pagination Response

Paginated responses include metadata:

```json
{
  "items": [...],
  "total": 150,
  "skip": 20,
  "limit": 10,
  "has_next": true,
  "has_previous": true,
  "page": 3,
  "pages": 15
}
```

### Pagination Best Practices

1. **Use reasonable page sizes**: 10-100 items per page
2. **Implement client-side pagination**: Don't load all data at once
3. **Cache results**: Store paginated results to improve performance
4. **Handle edge cases**: Empty results, last page, etc.

```javascript
// JavaScript pagination example
class PaginatedAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getPage(endpoint, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const url = `${this.baseUrl}${endpoint}?skip=${skip}&limit=${limit}`;
    
    const response = await fetch(url);
    return await response.json();
  }

  async getAllPages(endpoint, limit = 100) {
    const allItems = [];
    let skip = 0;
    let hasNext = true;

    while (hasNext) {
      const response = await this.getPage(endpoint, skip / limit + 1, limit);
      allItems.push(...response.items);
      hasNext = response.has_next;
      skip += limit;
    }

    return allItems;
  }
}
```

## Filtering and Search

### Query Parameters

Many endpoints support filtering through query parameters:

```bash
# Filter by field value
curl -X GET "http://localhost:8000/api/v1/users?is_active=true"

# Multiple filters
curl -X GET "http://localhost:8000/api/v1/users?is_active=true&role=admin"

# Date range filtering
curl -X GET "http://localhost:8000/api/v1/users?created_after=2024-01-01&created_before=2024-12-31"
```

### Search

Text search across multiple fields:

```bash
# Search users by name or email
curl -X GET "http://localhost:8000/api/v1/users?search=john"

# Search with pagination
curl -X GET "http://localhost:8000/api/v1/users?search=admin&skip=0&limit=10"
```

### Advanced Filtering

Some endpoints support advanced filtering:

```bash
# Sorting
curl -X GET "http://localhost:8000/api/v1/users?sort=created_at&order=desc"

# Field selection
curl -X GET "http://localhost:8000/api/v1/users?fields=id,email,full_name"

# Include soft-deleted records (admin only)
curl -X GET "http://localhost:8000/api/v1/users?include_deleted=true" \
  -H "Authorization: Bearer admin-token"
```

## Bulk Operations

### Bulk Create

Create multiple resources in a single request:

```bash
curl -X POST "http://localhost:8000/api/v1/users/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "users": [
      {
        "email": "user1@example.com",
        "username": "user1",
        "password": "password123"
      },
      {
        "email": "user2@example.com",
        "username": "user2",
        "password": "password123"
      }
    ]
  }'
```

**Response:**
```json
{
  "created": 2,
  "failed": 0,
  "results": [
    {
      "id": 1,
      "email": "user1@example.com",
      "status": "created"
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "status": "created"
    }
  ]
}
```

### Bulk Update

Update multiple resources:

```bash
curl -X PATCH "http://localhost:8000/api/v1/users/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "updates": [
      {
        "id": 1,
        "is_active": false
      },
      {
        "id": 2,
        "full_name": "Updated Name"
      }
    ]
  }'
```

### Bulk Delete (Soft Delete)

Soft delete multiple resources:

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "ids": [1, 2, 3],
    "reason": "Bulk cleanup operation"
  }'
```

## Error Handling

### Error Response Structure

```json
{
  "detail": "Validation error",
  "error_code": "VALIDATION_ERROR",
  "field_errors": {
    "email": ["Invalid email format"],
    "password": ["Password too short"]
  },
  "request_id": "req_123456789"
}
```

### Common Error Codes

- **VALIDATION_ERROR**: Input validation failed
- **AUTHENTICATION_REQUIRED**: Valid token required
- **PERMISSION_DENIED**: Insufficient permissions
- **RESOURCE_NOT_FOUND**: Requested resource doesn't exist
- **RATE_LIMIT_EXCEEDED**: Too many requests
- **DUPLICATE_RESOURCE**: Resource already exists

### Error Handling in Client Code

```javascript
async function handleApiResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    
    switch (error.error_code) {
      case 'VALIDATION_ERROR':
        // Handle validation errors
        displayFieldErrors(error.field_errors);
        break;
        
      case 'AUTHENTICATION_REQUIRED':
        // Redirect to login
        window.location.href = '/login';
        break;
        
      case 'RATE_LIMIT_EXCEEDED':
        // Implement exponential backoff
        await delay(1000);
        return retryRequest();
        
      default:
        // Generic error handling
        showError(error.detail);
    }
    
    throw new Error(error.detail);
  }
  
  return await response.json();
}
```

## Rate Limiting

### Rate Limit Headers

API responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Handling

```javascript
class RateLimitedClient {
  async makeRequest(url, options) {
    const response = await fetch(url, options);
    
    // Check rate limit headers
    const remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
    const reset = parseInt(response.headers.get('X-RateLimit-Reset'));
    
    if (response.status === 429) {
      // Rate limited - wait until reset
      const waitTime = (reset * 1000) - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Retry request
      return this.makeRequest(url, options);
    }
    
    // Proactive rate limiting
    if (remaining < 10) {
      console.warn('Approaching rate limit, slowing down requests');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return response;
  }
}
```

## Data Validation

### Request Validation

All request data is validated using Pydantic schemas:

```json
// Valid user creation request
{
  "email": "user@example.com",
  "username": "validuser",
  "password": "SecurePassword123",
  "full_name": "John Doe"
}

// Invalid request - validation errors
{
  "email": "invalid-email",
  "username": "a",
  "password": "123"
}
```

### Validation Error Response

```json
{
  "detail": "Validation error",
  "error_code": "VALIDATION_ERROR",
  "field_errors": {
    "email": ["Invalid email format"],
    "username": ["Username must be at least 3 characters"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Client-Side Validation

Implement client-side validation to improve user experience:

```javascript
function validateUserData(userData) {
  const errors = {};
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    errors.email = ['Invalid email format'];
  }
  
  // Username validation
  if (userData.username.length < 3) {
    errors.username = ['Username must be at least 3 characters'];
  }
  
  // Password validation
  if (userData.password.length < 8) {
    errors.password = ['Password must be at least 8 characters'];
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
}
```

## Performance Optimization

### Request Optimization

1. **Use appropriate HTTP methods**
2. **Minimize request payload size**
3. **Implement request caching**
4. **Use compression (gzip)**

```javascript
// Optimized API client
class OptimizedAPIClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cache = new Map();
  }

  async get(endpoint, options = {}) {
    const cacheKey = `${endpoint}${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes
        return cached.data;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept-Encoding': 'gzip',
        'Accept': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();
    
    // Cache successful responses
    if (response.ok) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  }
}
```

### Batch Requests

Group multiple operations into single requests:

```javascript
// Instead of multiple individual requests
const user1 = await api.get('/users/1');
const user2 = await api.get('/users/2');
const user3 = await api.get('/users/3');

// Use batch request
const users = await api.post('/users/batch', {
  ids: [1, 2, 3]
});
```

## Integration Examples

### Python Integration

```python
import asyncio
import aiohttp
from typing import List, Dict, Any

class APIClient:
    def __init__(self, base_url: str, token: str = None):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def _get_headers(self) -> Dict[str, str]:
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers

    async def get(self, endpoint: str, params: Dict = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        async with self.session.get(url, params=params, headers=self._get_headers()) as response:
            return await response.json()

    async def post(self, endpoint: str, data: Dict = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        async with self.session.post(url, json=data, headers=self._get_headers()) as response:
            return await response.json()

# Usage
async def main():
    async with APIClient('http://localhost:8000/api/v1', 'your-token') as client:
        # Get user profile
        profile = await client.get('/auth/profile')
        print(f"User: {profile['full_name']}")
        
        # Create new user
        new_user = await client.post('/users', {
            'email': 'new@example.com',
            'username': 'newuser',
            'password': 'password123'
        })
        print(f"Created user: {new_user['id']}")

asyncio.run(main())
```

### Node.js Integration

```javascript
const axios = require('axios');

class APIClient {
  constructor(baseUrl, token = null) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add auth interceptor
    this.client.interceptors.request.use(config => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Handle authentication error
          console.error('Authentication required');
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint, params = {}) {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }

  async post(endpoint, data = {}) {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data = {}) {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    const response = await this.client.delete(endpoint);
    return response.data;
  }
}

// Usage
const client = new APIClient('http://localhost:8000/api/v1', 'your-token');

async function example() {
  try {
    // Get users with pagination
    const users = await client.get('/users', { skip: 0, limit: 10 });
    console.log(`Found ${users.total} users`);

    // Create new user
    const newUser = await client.post('/users', {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    });
    console.log(`Created user: ${newUser.id}`);

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

example();
```

## Best Practices

### API Usage Best Practices

1. **Always use HTTPS in production**
2. **Implement proper error handling**
3. **Use appropriate HTTP methods**
4. **Handle rate limiting gracefully**
5. **Validate data on client side**
6. **Implement request timeouts**
7. **Use pagination for large datasets**
8. **Cache responses when appropriate**

### Security Best Practices

1. **Never log sensitive data**
2. **Store tokens securely**
3. **Implement request signing for sensitive operations**
4. **Use HTTPS for all communications**
5. **Validate all input data**
6. **Implement proper session management**

### Performance Best Practices

1. **Use connection pooling**
2. **Implement request caching**
3. **Minimize request payload size**
4. **Use compression**
5. **Implement exponential backoff for retries**
6. **Monitor API performance**

Ready to build amazing integrations with the 8760 API? This guide provides everything you need to get started! 🚀
