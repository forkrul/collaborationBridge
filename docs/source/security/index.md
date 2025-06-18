# Security Guide

The Python MVP Template includes comprehensive security features including JWT authentication, password hashing, CORS configuration, and security best practices.

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: SQLAlchemy ORM protection
- **Rate Limiting**: Request rate limiting (configurable)
- **Security Headers**: Standard security headers
- **Environment-based Secrets**: Secure configuration management

## Authentication System

### JWT Token Authentication

The template uses JWT (JSON Web Tokens) for stateless authentication:

```python
# src/your_package/core/security.py
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return subject."""
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        return user_id
    except jwt.PyJWTError:
        return None
```

### Password Security

```python
def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)

def generate_password_reset_token(email: str) -> str:
    """Generate password reset token."""
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.JWT_SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt
```

## Authentication Dependencies

### FastAPI Dependencies

```python
# src/your_package/api/v1/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user ID from JWT token."""
    token = credentials.credentials
    user_id = verify_token(token)
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id

async def get_current_user(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current user from database."""
    user = await UserService(db).get_user(int(current_user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_current_superuser(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
```

## Authentication Endpoints

### Login and Registration

```python
# src/your_package/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return access token."""
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register new user."""
    # Check if user exists
    existing_user = await UserService(db).get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = await UserService(db).create_user(user_data)
    return user
```

## Protected Endpoints

### Using Authentication

```python
# Protected endpoint requiring authentication
@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user profile."""
    return current_user

# Admin-only endpoint
@router.get("/admin/users", response_model=List[UserResponse])
async def list_all_users(
    current_user: User = Depends(get_current_superuser),
    db: AsyncSession = Depends(get_db)
):
    """List all users (admin only)."""
    return await UserService(db).get_users()
```

## CORS Configuration

### Cross-Origin Resource Sharing

```python
# src/your_package/main.py
from fastapi.middleware.cors import CORSMiddleware

# Configure CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```

## Input Validation

### Pydantic Schema Validation

```python
# src/your_package/schemas/user.py
from pydantic import BaseModel, EmailStr, Field, validator
import re

class UserCreate(BaseModel):
    """User creation schema with validation."""
    
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    password: str = Field(..., min_length=8, description="Password")
    
    @validator('username')
    def validate_username(cls, v):
        """Validate username format."""
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v
```

## Security Headers

### HTTP Security Headers

```python
# src/your_package/api/middleware/security.py
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response

# Add to main app
app.add_middleware(SecurityHeadersMiddleware)
```

## Environment Security

### Secret Management

```python
# src/your_package/core/config.py
from pydantic import BaseSettings, SecretStr

class Settings(BaseSettings):
    """Application settings with secure secret handling."""
    
    # Public settings
    PROJECT_NAME: str = "MyApp"
    ENVIRONMENT: str = "development"
    
    # Secret settings
    SECRET_KEY: SecretStr
    JWT_SECRET_KEY: SecretStr
    DATABASE_PASSWORD: SecretStr
    
    class Config:
        env_file = ".env"
        case_sensitive = True
```

## Security Best Practices

### Development

1. **Never commit secrets** to version control
2. **Use environment variables** for configuration
3. **Validate all inputs** with Pydantic schemas
4. **Use parameterized queries** (SQLAlchemy handles this)
5. **Implement proper error handling** (don't leak information)

### Production

1. **Use HTTPS** for all communications
2. **Set secure headers** for all responses
3. **Implement rate limiting** to prevent abuse
4. **Monitor for security events** and anomalies
5. **Keep dependencies updated** regularly

Your application is now secure by design! 🔒
