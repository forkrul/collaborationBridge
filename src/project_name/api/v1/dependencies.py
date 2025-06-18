"""API dependencies for dependency injection.

This module contains FastAPI dependencies for authentication,
database sessions, and other common requirements.
"""

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from src.project_name.core.database import get_db
from src.project_name.core.security import verify_token

# Security scheme for JWT tokens
security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user ID from JWT token.
    
    Args:
        credentials: HTTP authorization credentials.
        
    Returns:
        str: User ID from token.
        
    Raises:
        HTTPException: If token is invalid or expired.
    """
    token = credentials.credentials
    user_id = verify_token(token)
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id


async def get_current_user_id_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    )
) -> Optional[str]:
    """Get current user ID from JWT token (optional).
    
    Args:
        credentials: Optional HTTP authorization credentials.
        
    Returns:
        Optional[str]: User ID from token if present and valid, None otherwise.
    """
    if credentials is None:
        return None
    
    token = credentials.credentials
    return verify_token(token)


# Database dependency alias for convenience
DatabaseSession = Depends(get_db)
