"""Base Pydantic schemas with common functionality.

This module provides base schemas and mixins for creating
consistent API models with proper validation and documentation.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TimestampSchema(BaseModel):
    """Schema mixin for timestamp fields.

    Attributes:
        created_at: When the resource was created.
        updated_at: When the resource was last modified.
    """

    created_at: datetime = Field(
        ..., description="Timestamp when the resource was created"
    )
    updated_at: datetime = Field(
        ..., description="Timestamp when the resource was last updated"
    )


class BaseSchema(BaseModel):
    """Base schema with common configuration.

    This schema provides a foundation for all API models with
    consistent configuration and behavior.
    """

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True,
        validate_assignment=True,
        str_strip_whitespace=True,
    )


class PaginationParams(BaseModel):
    """Schema for pagination parameters.

    Attributes:
        page: Current page number (1-indexed).
        per_page: Number of items per page.
        order_by: Field to order results by.
        order_dir: Direction to order results (asc/desc).
    """

    page: int = Field(default=1, ge=1, description="Page number")
    per_page: int = Field(default=20, ge=1, le=100, description="Items per page")
    order_by: str = Field(default="id", description="Field to order by")
    order_dir: str = Field(
        default="asc", pattern="^(asc|desc)$", description="Order direction"
    )


class PaginatedResponse(BaseModel):
    """Schema for paginated API responses.

    Attributes:
        items: List of items for the current page.
        total: Total number of items.
        page: Current page number.
        per_page: Number of items per page.
        pages: Total number of pages.
    """

    items: list[Any] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    per_page: int = Field(..., description="Items per page")
    pages: int = Field(..., description="Total number of pages")

    @field_validator("pages", mode="before")
    @classmethod
    def calculate_pages(cls, v: Any, values: dict[str, Any]) -> int:
        """Calculate total pages from total items and per_page."""
        if "total" in values and "per_page" in values:
            total = values["total"]
            per_page = values["per_page"]
            return (total + per_page - 1) // per_page
        return v


class ErrorResponse(BaseSchema):
    """Schema for error responses."""

    error: str = Field(..., description="Error message")
    detail: str | None = Field(None, description="Detailed error information")
    code: str | None = Field(None, description="Error code")


class SuccessResponse(BaseSchema):
    """Schema for success responses."""

    message: str = Field(..., description="Success message")
    data: Any | None = Field(None, description="Response data")
