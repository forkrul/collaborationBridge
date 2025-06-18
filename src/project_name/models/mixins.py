"""Additional model mixins for common functionality."""

from typing import Optional
from sqlalchemy import Column, String, Text
from sqlalchemy.ext.declarative import declared_attr


class SlugMixin:
    """Mixin for adding slug functionality to models."""
    
    @declared_attr
    def slug(cls) -> Column:
        """URL-friendly slug for the record."""
        return Column(
            String(255),
            nullable=False,
            unique=True,
            index=True,
            doc="URL-friendly slug for the record"
        )


class DescriptionMixin:
    """Mixin for adding description field to models."""
    
    @declared_attr
    def description(cls) -> Column:
        """Description of the record."""
        return Column(
            Text,
            nullable=True,
            doc="Description of the record"
        )


class NameMixin:
    """Mixin for adding name field to models."""
    
    @declared_attr
    def name(cls) -> Column:
        """Name of the record."""
        return Column(
            String(255),
            nullable=False,
            doc="Name of the record"
        )


class TitleMixin:
    """Mixin for adding title field to models."""
    
    @declared_attr
    def title(cls) -> Column:
        """Title of the record."""
        return Column(
            String(255),
            nullable=False,
            doc="Title of the record"
        )


class StatusMixin:
    """Mixin for adding status field to models."""
    
    @declared_attr
    def status(cls) -> Column:
        """Status of the record."""
        return Column(
            String(50),
            nullable=False,
            default="active",
            index=True,
            doc="Status of the record"
        )


class OrderMixin:
    """Mixin for adding ordering functionality to models."""
    
    @declared_attr
    def order(cls) -> Column:
        """Order/position of the record."""
        return Column(
            Integer,
            nullable=False,
            default=0,
            index=True,
            doc="Order/position of the record"
        )
