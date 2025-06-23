# Expanded Python Community Management Library PRD

## Table of Contents
1. [Extended Architecture Overview](#1-extended-architecture-overview)
2. [Content Management System](#2-content-management-system)
3. [Event Management Module](#3-event-management-module)
4. [Monetization & Payment Processing](#4-monetization--payment-processing)
5. [Advanced Gamification System](#5-advanced-gamification-system)
6. [Real-time Communication (WebSocket/Chat)](#6-real-time-communication-websocketchat)
7. [Notification & Email System](#7-notification--email-system)
8. [Analytics & Reporting](#8-analytics--reporting)
9. [File Upload & Media Management](#9-file-upload--media-management)
10. [Search & Discovery](#10-search--discovery)
11. [Moderation & Admin Tools](#11-moderation--admin-tools)
12. [External Integration Framework](#12-external-integration-framework)
13. [Advanced Testing Strategies](#13-advanced-testing-strategies)
14. [Performance & Scaling](#14-performance--scaling)
15. [Multi-tenancy Support](#15-multi-tenancy-support)

## 1. Extended Architecture Overview

### 1.1 Enhanced Module Structure
```
pycommunity/
├── __init__.py
├── core/
│   ├── __init__.py
│   ├── models/              # Base models and mixins
│   ├── schemas/             # Base Pydantic schemas
│   ├── database.py          # Database utilities
│   ├── exceptions.py        # Custom exceptions
│   ├── dependencies.py      # FastAPI dependencies
│   ├── middleware/          # Custom middleware
│   ├── pagination.py        # Pagination utilities
│   └── permissions.py       # Permission framework
├── members/                 # Member management
├── content/                 # Posts, articles, wiki
├── communities/             # Space management
├── engagement/              # Gamification, reactions
├── monetization/            # Payments, subscriptions
├── events/                  # Event management
├── courses/                 # Learning management
├── messaging/               # Chat, DMs, threads
├── notifications/           # Email, push, in-app
├── analytics/               # Metrics and reporting
├── media/                   # File uploads, CDN
├── search/                  # Full-text search
├── moderation/              # Content moderation
├── ai/                      # AI-powered features
├── integrations/            # Third-party integrations
├── admin/                   # Admin dashboard
├── webhooks/                # Webhook management
├── tasks/                   # Background tasks
├── utils/                   # Shared utilities
└── migrations/              # Database migrations
```

### 1.2 Enhanced Base Models

```python
"""Enhanced base models with audit trails and versioning.

Provides comprehensive base functionality for all models including
soft delete, audit logging, and version control.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional, Type, TypeVar
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean, Column, DateTime, Integer, String, Text, 
    ForeignKey, event, JSON, Float
)
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.orm import Query, Session, relationship
from sqlalchemy.sql import func

Base = declarative_base()
T = TypeVar("T", bound="BaseModel")


class AuditMixin:
    """Mixin for comprehensive audit trail functionality.
    
    Tracks all changes to a model with user attribution
    and timestamp information.
    """
    
    created_by_id: Optional[int] = Column(
        Integer, 
        ForeignKey("members.id"), 
        nullable=True
    )
    updated_by_id: Optional[int] = Column(
        Integer, 
        ForeignKey("members.id"), 
        nullable=True
    )
    deleted_by_id: Optional[int] = Column(
        Integer, 
        ForeignKey("members.id"), 
        nullable=True
    )
    
    # IP tracking for security
    created_from_ip: Optional[str] = Column(String(45), nullable=True)
    updated_from_ip: Optional[str] = Column(String(45), nullable=True)
    
    # Version tracking
    version: int = Column(Integer, default=1, nullable=False)
    
    @declared_attr
    def created_by(cls):
        """Relationship to creator."""
        return relationship(
            "Member",
            foreign_keys=[cls.created_by_id],
            lazy="select"
        )
    
    @declared_attr
    def updated_by(cls):
        """Relationship to last updater."""
        return relationship(
            "Member",
            foreign_keys=[cls.updated_by_id],
            lazy="select"
        )


class UUIDMixin:
    """Mixin for UUID support alongside integer IDs.
    
    Provides public UUID identifiers while maintaining
    integer primary keys for performance.
    """
    
    uuid: UUID = Column(
        String(36),
        default=lambda: str(uuid4()),
        unique=True,
        nullable=False,
        index=True
    )


class TaggableMixin:
    """Mixin for tagging support on any model."""
    
    tags: List[str] = Column(JSON, default=list, nullable=False)
    
    def add_tag(self, tag: str) -> None:
        """Add a tag to the model.
        
        Args:
            tag: Tag to add.
        """
        if tag not in self.tags:
            self.tags.append(tag)
    
    def remove_tag(self, tag: str) -> None:
        """Remove a tag from the model.
        
        Args:
            tag: Tag to remove.
        """
        if tag in self.tags:
            self.tags.remove(tag)
    
    def has_tag(self, tag: str) -> bool:
        """Check if model has a specific tag.
        
        Args:
            tag: Tag to check.
            
        Returns:
            True if tag exists, False otherwise.
        """
        return tag in self.tags


class BaseModel(Base, SoftDeleteMixin, AuditMixin, UUIDMixin):
    """Enhanced base model with all common functionality.
    
    Combines soft delete, audit trails, UUIDs, and common
    patterns for all database models.
    """
    
    __abstract__ = True
    
    # Additional metadata
    metadata_json: Dict[str, Any] = Column(
        JSON, 
        default=dict, 
        nullable=False
    )
    
    # Search optimization
    search_vector: Optional[str] = Column(
        Text,
        nullable=True
    )
    
    def update_search_vector(self) -> None:
        """Update the search vector for full-text search.
        
        Should be overridden by subclasses to include
        relevant fields in the search index.
        """
        pass
    
    @classmethod
    def get_by_uuid(
        cls: Type[T], 
        session: Session, 
        uuid: str
    ) -> Optional[T]:
        """Get instance by UUID.
        
        Args:
            session: Database session.
            uuid: UUID to search for.
            
        Returns:
            Instance if found, None otherwise.
        """
        return session.query(cls).filter(
            cls.uuid == uuid,
            cls.is_deleted == False
        ).first()


# Audit log table for tracking all changes
class AuditLog(Base):
    """Audit log for tracking all database changes.
    
    Stores a complete history of all create, update, and
    delete operations across all tables.
    """
    
    __tablename__ = "audit_logs"
    
    id: int = Column(Integer, primary_key=True)
    timestamp: datetime = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )
    
    # What changed
    table_name: str = Column(String(100), nullable=False, index=True)
    record_id: int = Column(Integer, nullable=False)
    record_uuid: Optional[str] = Column(String(36), nullable=True)
    operation: str = Column(String(10), nullable=False)  # INSERT, UPDATE, DELETE
    
    # Who made the change
    user_id: Optional[int] = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=True
    )
    ip_address: Optional[str] = Column(String(45), nullable=True)
    user_agent: Optional[str] = Column(String(500), nullable=True)
    
    # What was changed
    old_values: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    new_values: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    changed_fields: List[str] = Column(JSON, default=list)
    
    # Additional context
    request_id: Optional[str] = Column(String(36), nullable=True, index=True)
    session_id: Optional[str] = Column(String(36), nullable=True)
    
    user = relationship("Member", lazy="select")
```

## 2. Content Management System

### 2.1 Advanced Content Models

```python
"""Content management system for posts, articles, and wiki pages.

Provides a flexible content system supporting multiple content types,
versioning, collaborative editing, and rich media.
"""
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Set

from pydantic import BaseModel, Field, validator
from sqlalchemy import (
    Column, String, Boolean, Integer, Float, ForeignKey,
    Text, JSON, Enum as SQLEnum, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship, Session
from sqlalchemy.dialects.postgresql import TSVECTOR

from pycommunity.core.models import BaseModel, TaggableMixin


class ContentType(str, Enum):
    """Types of content supported by the platform."""
    
    POST = "post"           # Regular discussion post
    ARTICLE = "article"     # Long-form article
    WIKI = "wiki"          # Collaborative wiki page
    POLL = "poll"          # Poll with voting
    QUESTION = "question"   # Q&A format
    ANNOUNCEMENT = "announcement"  # Official announcements


class ContentStatus(str, Enum):
    """Content publication status."""
    
    DRAFT = "draft"
    PUBLISHED = "published"
    SCHEDULED = "scheduled"
    ARCHIVED = "archived"
    UNDER_REVIEW = "under_review"


class ContentVisibility(str, Enum):
    """Content visibility levels."""
    
    PUBLIC = "public"          # Visible to all
    MEMBERS_ONLY = "members_only"  # Community members only
    PRIVATE = "private"        # Specific members only
    UNLISTED = "unlisted"      # Accessible via direct link


# Many-to-many table for content collaborators
content_collaborators = Table(
    "content_collaborators",
    Base.metadata,
    Column("content_id", Integer, ForeignKey("content.id")),
    Column("member_id", Integer, ForeignKey("members.id")),
    Column("role", String(20), default="editor"),  # editor, reviewer
    Column("added_at", DateTime(timezone=True), default=datetime.utcnow)
)


class Content(BaseModel, TaggableMixin):
    """Core content model supporting multiple content types.
    
    Provides a flexible foundation for all types of content
    with support for versioning, SEO, and rich media.
    """
    
    __tablename__ = "content"
    
    # Basic fields
    title: str = Column(String(200), nullable=False)
    slug: str = Column(String(200), nullable=False, index=True)
    excerpt: Optional[str] = Column(String(500), nullable=True)
    body: str = Column(Text, nullable=False)
    body_html: Optional[str] = Column(Text, nullable=True)  # Rendered HTML
    body_json: Optional[Dict[str, Any]] = Column(JSON, nullable=True)  # For rich editors
    
    # Content metadata
    type: ContentType = Column(
        SQLEnum(ContentType),
        default=ContentType.POST,
        nullable=False,
        index=True
    )
    status: ContentStatus = Column(
        SQLEnum(ContentStatus),
        default=ContentStatus.DRAFT,
        nullable=False,
        index=True
    )
    visibility: ContentVisibility = Column(
        SQLEnum(ContentVisibility),
        default=ContentVisibility.MEMBERS_ONLY,
        nullable=False
    )
    
    # SEO fields
    meta_title: Optional[str] = Column(String(100), nullable=True)
    meta_description: Optional[str] = Column(String(160), nullable=True)
    og_image_url: Optional[str] = Column(String(500), nullable=True)
    canonical_url: Optional[str] = Column(String(500), nullable=True)
    
    # Publishing
    published_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True
    )
    scheduled_for: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    expires_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Engagement metrics
    view_count: int = Column(Integer, default=0, nullable=False)
    unique_view_count: int = Column(Integer, default=0, nullable=False)
    read_time_seconds: int = Column(Integer, default=0, nullable=False)
    engagement_score: float = Column(Float, default=0.0, nullable=False)
    
    # Content features
    allow_comments: bool = Column(Boolean, default=True, nullable=False)
    allow_reactions: bool = Column(Boolean, default=True, nullable=False)
    is_pinned: bool = Column(Boolean, default=False, nullable=False)
    is_featured: bool = Column(Boolean, default=False, nullable=False)
    is_locked: bool = Column(Boolean, default=False, nullable=False)
    
    # Full-text search
    search_vector = Column(TSVECTOR, nullable=True)
    
    # Relationships
    author_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    parent_id: Optional[int] = Column(
        Integer,
        ForeignKey("content.id"),
        nullable=True
    )
    
    author = relationship("Member", foreign_keys=[author_id])
    community = relationship("Community", back_populates="content")
    parent = relationship("Content", remote_side="Content.id", backref="replies")
    collaborators = relationship(
        "Member",
        secondary=content_collaborators,
        back_populates="collaborated_content"
    )
    
    # Additional relationships
    versions = relationship("ContentVersion", back_populates="content")
    attachments = relationship("ContentAttachment", back_populates="content")
    reactions = relationship("ContentReaction", back_populates="content")
    bookmarks = relationship("ContentBookmark", back_populates="content")
    
    __table_args__ = (
        UniqueConstraint('slug', 'community_id', name='_slug_community_uc'),
    )
    
    def update_search_vector(self) -> None:
        """Update full-text search vector."""
        # In production, use PostgreSQL's to_tsvector
        search_text = f"{self.title} {self.excerpt or ''} {self.body}"
        self.search_vector = search_text  # Simplified
    
    def calculate_read_time(self) -> int:
        """Calculate estimated read time in seconds.
        
        Returns:
            Estimated read time based on word count.
        """
        words = len(self.body.split())
        # Average reading speed: 200-250 words per minute
        return max(30, int(words / 4))  # Minimum 30 seconds
    
    def increment_view_count(
        self,
        viewer_id: Optional[int] = None,
        session: Optional[Session] = None
    ) -> None:
        """Increment view count with unique tracking.
        
        Args:
            viewer_id: ID of viewing member.
            session: Database session for tracking.
        """
        self.view_count += 1
        
        if viewer_id and session:
            # Track unique views
            existing_view = session.query(ContentView).filter(
                ContentView.content_id == self.id,
                ContentView.viewer_id == viewer_id
            ).first()
            
            if not existing_view:
                self.unique_view_count += 1
                view = ContentView(
                    content_id=self.id,
                    viewer_id=viewer_id
                )
                session.add(view)


class ContentVersion(BaseModel):
    """Version history for content edits.
    
    Tracks all changes to content for revision history
    and collaborative editing.
    """
    
    __tablename__ = "content_versions"
    
    content_id: int = Column(
        Integer,
        ForeignKey("content.id"),
        nullable=False,
        index=True
    )
    version_number: int = Column(Integer, nullable=False)
    
    # Snapshot of content at this version
    title: str = Column(String(200), nullable=False)
    body: str = Column(Text, nullable=False)
    body_html: Optional[str] = Column(Text, nullable=True)
    body_json: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    
    # Change metadata
    change_summary: Optional[str] = Column(String(500), nullable=True)
    changed_fields: List[str] = Column(JSON, default=list)
    
    # Edit attribution
    editor_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    
    content = relationship("Content", back_populates="versions")
    editor = relationship("Member")
    
    __table_args__ = (
        UniqueConstraint('content_id', 'version_number'),
    )


class ContentAttachment(BaseModel):
    """Attachments for content (images, files, embeds)."""
    
    __tablename__ = "content_attachments"
    
    content_id: int = Column(
        Integer,
        ForeignKey("content.id"),
        nullable=False,
        index=True
    )
    
    # File information
    file_name: str = Column(String(255), nullable=False)
    file_type: str = Column(String(100), nullable=False)
    file_size: int = Column(Integer, nullable=False)  # bytes
    file_url: str = Column(String(500), nullable=False)
    thumbnail_url: Optional[str] = Column(String(500), nullable=True)
    
    # Attachment metadata
    alt_text: Optional[str] = Column(String(500), nullable=True)
    caption: Optional[str] = Column(String(500), nullable=True)
    position: int = Column(Integer, default=0, nullable=False)
    
    # For embeds (YouTube, etc.)
    embed_type: Optional[str] = Column(String(50), nullable=True)
    embed_data: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    
    content = relationship("Content", back_populates="attachments")


class ContentReaction(Base):
    """Reactions/emojis on content."""
    
    __tablename__ = "content_reactions"
    
    id: int = Column(Integer, primary_key=True)
    content_id: int = Column(
        Integer,
        ForeignKey("content.id"),
        nullable=False,
        index=True
    )
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    reaction_type: str = Column(String(50), nullable=False)  # emoji or predefined
    created_at: datetime = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    content = relationship("Content", back_populates="reactions")
    member = relationship("Member")
    
    __table_args__ = (
        UniqueConstraint('content_id', 'member_id', 'reaction_type'),
    )


class ContentService:
    """Service class for content operations."""
    
    def __init__(self, session: Session) -> None:
        """Initialize content service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def create_content(
        self,
        author_id: int,
        community_id: int,
        content_data: ContentCreateSchema
    ) -> Content:
        """Create new content with automatic slug generation.
        
        Args:
            author_id: ID of content author.
            community_id: ID of target community.
            content_data: Content creation data.
            
        Returns:
            Created content instance.
            
        Raises:
            ValueError: If slug already exists in community.
        """
        from slugify import slugify
        
        # Generate unique slug
        base_slug = slugify(content_data.title)
        slug = base_slug
        counter = 1
        
        while self._slug_exists(slug, community_id):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Create content
        content = Content(
            author_id=author_id,
            community_id=community_id,
            slug=slug,
            **content_data.dict(exclude={"collaborator_ids"})
        )
        
        # Add collaborators if specified
        if content_data.collaborator_ids:
            collaborators = self.session.query(Member).filter(
                Member.id.in_(content_data.collaborator_ids)
            ).all()
            content.collaborators.extend(collaborators)
        
        # Calculate read time
        content.read_time_seconds = content.calculate_read_time()
        
        # Update search vector
        content.update_search_vector()
        
        self.session.add(content)
        self.session.commit()
        self.session.refresh(content)
        
        # Create initial version
        await self._create_version(content, is_initial=True)
        
        return content
    
    async def update_content(
        self,
        content_id: int,
        editor_id: int,
        update_data: ContentUpdateSchema
    ) -> Content:
        """Update content with version tracking.
        
        Args:
            content_id: ID of content to update.
            editor_id: ID of editor making changes.
            update_data: Updated content data.
            
        Returns:
            Updated content instance.
            
        Raises:
            ValueError: If content not found or locked.
        """
        content = self.session.query(Content).filter(
            Content.id == content_id,
            Content.is_deleted == False
        ).first()
        
        if not content:
            raise ValueError(f"Content {content_id} not found")
        
        if content.is_locked:
            raise ValueError("Content is locked and cannot be edited")
        
        # Track changed fields
        changed_fields = []
        old_values = {}
        
        for field, value in update_data.dict(exclude_unset=True).items():
            if hasattr(content, field) and getattr(content, field) != value:
                changed_fields.append(field)
                old_values[field] = getattr(content, field)
                setattr(content, field, value)
        
        if changed_fields:
            # Update metadata
            content.version += 1
            content.updated_by_id = editor_id
            
            # Recalculate if body changed
            if "body" in changed_fields:
                content.read_time_seconds = content.calculate_read_time()
                content.update_search_vector()
            
            self.session.commit()
            
            # Create version record
            await self._create_version(
                content,
                editor_id=editor_id,
                change_summary=update_data.change_summary,
                changed_fields=changed_fields
            )
        
        self.session.refresh(content)
        return content
    
    async def _create_version(
        self,
        content: Content,
        editor_id: Optional[int] = None,
        change_summary: Optional[str] = None,
        changed_fields: Optional[List[str]] = None,
        is_initial: bool = False
    ) -> ContentVersion:
        """Create a version snapshot of content.
        
        Args:
            content: Content to version.
            editor_id: ID of editor (if not initial).
            change_summary: Summary of changes.
            changed_fields: List of changed fields.
            is_initial: Whether this is the initial version.
            
        Returns:
            Created version record.
        """
        version = ContentVersion(
            content_id=content.id,
            version_number=content.version,
            title=content.title,
            body=content.body,
            body_html=content.body_html,
            body_json=content.body_json,
            editor_id=editor_id or content.author_id,
            change_summary=change_summary or ("Initial version" if is_initial else None),
            changed_fields=changed_fields or []
        )
        
        self.session.add(version)
        self.session.commit()
        
        return version
    
    def _slug_exists(self, slug: str, community_id: int) -> bool:
        """Check if slug already exists in community.
        
        Args:
            slug: Slug to check.
            community_id: Community to check within.
            
        Returns:
            True if slug exists, False otherwise.
        """
        return self.session.query(Content).filter(
            Content.slug == slug,
            Content.community_id == community_id,
            Content.is_deleted == False
        ).first() is not None
```

### 2.2 Content Schemas

```python
"""Pydantic schemas for content management."""
from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field, validator


class ContentCreateSchema(BaseModel):
    """Schema for creating new content."""
    
    title: str = Field(..., min_length=1, max_length=200)
    excerpt: Optional[str] = Field(None, max_length=500)
    body: str = Field(..., min_length=1)
    body_json: Optional[Dict[str, Any]] = None
    
    type: ContentType = ContentType.POST
    visibility: ContentVisibility = ContentVisibility.MEMBERS_ONLY
    
    tags: List[str] = Field(default_factory=list, max_items=10)
    collaborator_ids: List[int] = Field(default_factory=list)
    
    # SEO
    meta_title: Optional[str] = Field(None, max_length=100)
    meta_description: Optional[str] = Field(None, max_length=160)
    
    # Publishing options
    status: ContentStatus = ContentStatus.DRAFT
    scheduled_for: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    # Features
    allow_comments: bool = True
    allow_reactions: bool = True
    
    @validator("scheduled_for")
    def validate_scheduled_time(cls, v: Optional[datetime]) -> Optional[datetime]:
        """Ensure scheduled time is in the future."""
        if v and v <= datetime.utcnow():
            raise ValueError("Scheduled time must be in the future")
        return v
    
    @validator("tags")
    def validate_tags(cls, v: List[str]) -> List[str]:
        """Validate and normalize tags."""
        # Remove duplicates and empty tags
        tags = list(set(tag.strip().lower() for tag in v if tag.strip()))
        
        # Validate tag format
        import re
        tag_pattern = re.compile(r'^[a-z0-9-]+$')
        
        for tag in tags:
            if not tag_pattern.match(tag):
                raise ValueError(f"Invalid tag format: {tag}")
            if len(tag) > 50:
                raise ValueError(f"Tag too long: {tag}")
        
        return tags


class ContentUpdateSchema(BaseModel):
    """Schema for updating content."""
    
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    excerpt: Optional[str] = Field(None, max_length=500)
    body: Optional[str] = Field(None, min_length=1)
    body_json: Optional[Dict[str, Any]] = None
    
    visibility: Optional[ContentVisibility] = None
    status: Optional[ContentStatus] = None
    
    tags: Optional[List[str]] = Field(None, max_items=10)
    
    # Publishing
    scheduled_for: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    # Features
    allow_comments: Optional[bool] = None
    allow_reactions: Optional[bool] = None
    is_pinned: Optional[bool] = None
    is_featured: Optional[bool] = None
    
    # Version tracking
    change_summary: Optional[str] = Field(None, max_length=500)


class ContentResponseSchema(BaseModel):
    """Schema for content API responses."""
    
    id: int
    uuid: str
    title: str
    slug: str
    excerpt: Optional[str]
    body: str
    body_html: Optional[str]
    
    type: ContentType
    status: ContentStatus
    visibility: ContentVisibility
    
    # Author info
    author: MemberBasicSchema
    collaborators: List[MemberBasicSchema]
    
    # Community info
    community_id: int
    community_name: str
    community_slug: str
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    
    # Metrics
    view_count: int
    unique_view_count: int
    read_time_seconds: int
    engagement_score: float
    reaction_counts: Dict[str, int]
    comment_count: int
    bookmark_count: int
    
    # Features
    allow_comments: bool
    allow_reactions: bool
    is_pinned: bool
    is_featured: bool
    is_locked: bool
    
    # User-specific
    has_bookmarked: bool = False
    user_reactions: List[str] = Field(default_factory=list)
    can_edit: bool = False
    can_delete: bool = False
    
    tags: List[str]
    version: int
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True
```

## 3. Event Management Module

### 3.1 Event Models

```python
"""Event management system for online and hybrid events.

Supports various event types including webinars, workshops,
meetups, and courses with attendance tracking and recordings.
"""
from datetime import datetime, timedelta
from decimal import Decimal
from enum import Enum
from typing import Dict, List, Optional, Set

from sqlalchemy import (
    Column, String, Boolean, Integer, Float, ForeignKey,
    DateTime, Numeric, Text, JSON, Enum as SQLEnum, Table
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel, TaggableMixin


class EventType(str, Enum):
    """Types of events supported."""
    
    WEBINAR = "webinar"
    WORKSHOP = "workshop"
    MEETUP = "meetup"
    COURSE_SESSION = "course_session"
    LIVE_STREAM = "live_stream"
    AMA = "ama"  # Ask Me Anything
    OFFICE_HOURS = "office_hours"


class EventStatus(str, Enum):
    """Event lifecycle status."""
    
    DRAFT = "draft"
    PUBLISHED = "published"
    REGISTRATION_OPEN = "registration_open"
    REGISTRATION_CLOSED = "registration_closed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EventAccessType(str, Enum):
    """Event access control types."""
    
    PUBLIC = "public"
    MEMBERS_ONLY = "members_only"
    PAID = "paid"
    INVITE_ONLY = "invite_only"


class AttendeeStatus(str, Enum):
    """Attendee registration status."""
    
    REGISTERED = "registered"
    WAITLISTED = "waitlisted"
    ATTENDED = "attended"
    NO_SHOW = "no_show"
    CANCELLED = "cancelled"


# Event attendees association table
event_attendees = Table(
    "event_attendees",
    Base.metadata,
    Column("event_id", Integer, ForeignKey("events.id")),
    Column("member_id", Integer, ForeignKey("members.id")),
    Column("status", SQLEnum(AttendeeStatus), default=AttendeeStatus.REGISTERED),
    Column("registered_at", DateTime(timezone=True), default=datetime.utcnow),
    Column("attended_at", DateTime(timezone=True), nullable=True),
    Column("attendance_duration_seconds", Integer, nullable=True),
    Column("registration_metadata", JSON, default=dict),
    Column("payment_id", Integer, ForeignKey("payments.id"), nullable=True)
)


class Event(BaseModel, TaggableMixin):
    """Core event model for all event types.
    
    Supports both online and hybrid events with comprehensive
    attendee management and integration capabilities.
    """
    
    __tablename__ = "events"
    
    # Basic information
    title: str = Column(String(200), nullable=False)
    slug: str = Column(String(200), nullable=False)
    description: str = Column(Text, nullable=False)
    short_description: Optional[str] = Column(String(500), nullable=True)
    
    # Event metadata
    type: EventType = Column(
        SQLEnum(EventType),
        nullable=False,
        index=True
    )
    status: EventStatus = Column(
        SQLEnum(EventStatus),
        default=EventStatus.DRAFT,
        nullable=False,
        index=True
    )
    access_type: EventAccessType = Column(
        SQLEnum(EventAccessType),
        default=EventAccessType.MEMBERS_ONLY,
        nullable=False
    )
    
    # Scheduling
    start_time: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
    end_time: datetime = Column(
        DateTime(timezone=True),
        nullable=False
    )
    timezone: str = Column(String(50), nullable=False, default="UTC")
    
    # Recurring events
    is_recurring: bool = Column(Boolean, default=False, nullable=False)
    recurrence_rule: Optional[str] = Column(String(500), nullable=True)  # RRULE format
    recurrence_end_date: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    parent_event_id: Optional[int] = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=True
    )
    
    # Capacity and registration
    max_attendees: Optional[int] = Column(Integer, nullable=True)
    waitlist_enabled: bool = Column(Boolean, default=True, nullable=False)
    registration_required: bool = Column(Boolean, default=True, nullable=False)
    registration_opens_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    registration_closes_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Pricing (for paid events)
    price: Optional[Decimal] = Column(
        Numeric(10, 2),
        nullable=True
    )
    currency: Optional[str] = Column(String(3), nullable=True)  # ISO 4217
    early_bird_price: Optional[Decimal] = Column(
        Numeric(10, 2),
        nullable=True
    )
    early_bird_ends_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Virtual event details
    is_virtual: bool = Column(Boolean, default=True, nullable=False)
    meeting_url: Optional[str] = Column(String(500), nullable=True)
    meeting_id: Optional[str] = Column(String(100), nullable=True)
    meeting_password: Optional[str] = Column(String(100), nullable=True)
    streaming_platform: Optional[str] = Column(String(50), nullable=True)
    
    # Physical location (for hybrid/in-person)
    is_in_person: bool = Column(Boolean, default=False, nullable=False)
    venue_name: Optional[str] = Column(String(200), nullable=True)
    venue_address: Optional[str] = Column(String(500), nullable=True)
    venue_city: Optional[str] = Column(String(100), nullable=True)
    venue_country: Optional[str] = Column(String(100), nullable=True)
    venue_coordinates: Optional[Dict[str, float]] = Column(JSON, nullable=True)
    
    # Content and materials
    agenda: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    speaker_bios: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    materials_url: Optional[str] = Column(String(500), nullable=True)
    recording_available: bool = Column(Boolean, default=False, nullable=False)
    recording_url: Optional[str] = Column(String(500), nullable=True)
    
    # Engagement features
    allow_questions: bool = Column(Boolean, default=True, nullable=False)
    allow_chat: bool = Column(Boolean, default=True, nullable=False)
    enable_polls: bool = Column(Boolean, default=False, nullable=False)
    enable_breakout_rooms: bool = Column(Boolean, default=False, nullable=False)
    
    # Metrics
    registered_count: int = Column(Integer, default=0, nullable=False)
    attended_count: int = Column(Integer, default=0, nullable=False)
    average_rating: Optional[float] = Column(Float, nullable=True)
    
    # Relationships
    host_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    
    host = relationship("Member", foreign_keys=[host_id])
    community = relationship("Community", back_populates="events")
    attendees = relationship(
        "Member",
        secondary=event_attendees,
        back_populates="events"
    )
    parent_event = relationship(
        "Event",
        remote_side="Event.id",
        backref="recurring_instances"
    )
    
    # Additional relationships
    co_hosts = relationship("EventCoHost", back_populates="event")
    sessions = relationship("EventSession", back_populates="event")
    feedback = relationship("EventFeedback", back_populates="event")
    recordings = relationship("EventRecording", back_populates="event")
    
    def is_registration_open(self) -> bool:
        """Check if registration is currently open.
        
        Returns:
            True if registration is open, False otherwise.
        """
        now = datetime.utcnow()
        
        if self.status != EventStatus.REGISTRATION_OPEN:
            return False
        
        if self.registration_opens_at and now < self.registration_opens_at:
            return False
        
        if self.registration_closes_at and now > self.registration_closes_at:
            return False
        
        if self.max_attendees and self.registered_count >= self.max_attendees:
            return self.waitlist_enabled
        
        return True
    
    def get_attendee_status(
        self,
        member_id: int,
        session: Session
    ) -> Optional[AttendeeStatus]:
        """Get attendance status for a member.
        
        Args:
            member_id: Member to check.
            session: Database session.
            
        Returns:
            Attendee status if registered, None otherwise.
        """
        result = session.execute(
            event_attendees.select().where(
                event_attendees.c.event_id == self.id,
                event_attendees.c.member_id == member_id
            )
        ).first()
        
        return result.status if result else None


class EventSession(BaseModel):
    """Individual sessions within a multi-session event."""
    
    __tablename__ = "event_sessions"
    
    event_id: int = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False,
        index=True
    )
    
    title: str = Column(String(200), nullable=False)
    description: Optional[str] = Column(Text, nullable=True)
    
    start_time: datetime = Column(DateTime(timezone=True), nullable=False)
    end_time: datetime = Column(DateTime(timezone=True), nullable=False)
    
    speaker_id: Optional[int] = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=True
    )
    
    # Session-specific settings
    meeting_url: Optional[str] = Column(String(500), nullable=True)
    materials_url: Optional[str] = Column(String(500), nullable=True)
    recording_url: Optional[str] = Column(String(500), nullable=True)
    
    event = relationship("Event", back_populates="sessions")
    speaker = relationship("Member")


class EventRecording(BaseModel):
    """Recording information for events."""
    
    __tablename__ = "event_recordings"
    
    event_id: int = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False,
        index=True
    )
    
    # Recording details
    title: str = Column(String(200), nullable=False)
    duration_seconds: int = Column(Integer, nullable=False)
    file_size_bytes: int = Column(Integer, nullable=False)
    
    # URLs
    video_url: str = Column(String(500), nullable=False)
    thumbnail_url: Optional[str] = Column(String(500), nullable=True)
    transcript_url: Optional[str] = Column(String(500), nullable=True)
    
    # Access control
    is_public: bool = Column(Boolean, default=False, nullable=False)
    available_until: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Metrics
    view_count: int = Column(Integer, default=0, nullable=False)
    
    event = relationship("Event", back_populates="recordings")


class EventService:
    """Service class for event management operations."""
    
    def __init__(self, session: Session) -> None:
        """Initialize event service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def create_event(
        self,
        host_id: int,
        community_id: int,
        event_data: EventCreateSchema
    ) -> Event:
        """Create a new event.
        
        Args:
            host_id: ID of event host.
            community_id: ID of hosting community.
            event_data: Event creation data.
            
        Returns:
            Created event instance.
            
        Raises:
            ValueError: If validation fails.
        """
        # Validate event times
        if event_data.end_time <= event_data.start_time:
            raise ValueError("End time must be after start time")
        
        if event_data.start_time <= datetime.utcnow():
            raise ValueError("Event must be scheduled in the future")
        
        # Generate unique slug
        from slugify import slugify
        base_slug = slugify(event_data.title)
        slug = await self._generate_unique_slug(base_slug, community_id)
        
        # Create event
        event = Event(
            host_id=host_id,
            community_id=community_id,
            slug=slug,
            **event_data.dict(exclude={"co_host_ids", "session_data"})
        )
        
        self.session.add(event)
        self.session.flush()
        
        # Add co-hosts
        if event_data.co_host_ids:
            for co_host_id in event_data.co_host_ids:
                co_host = EventCoHost(
                    event_id=event.id,
                    member_id=co_host_id
                )
                self.session.add(co_host)
        
        # Create sessions for multi-session events
        if event_data.session_data:
            for session_info in event_data.session_data:
                session = EventSession(
                    event_id=event.id,
                    **session_info.dict()
                )
                self.session.add(session)
        
        # Handle recurring events
        if event.is_recurring and event.recurrence_rule:
            await self._create_recurring_instances(event)
        
        self.session.commit()
        self.session.refresh(event)
        
        return event
    
    async def register_attendee(
        self,
        event_id: int,
        member_id: int,
        payment_id: Optional[int] = None
    ) -> AttendeeStatus:
        """Register a member for an event.
        
        Args:
            event_id: Event to register for.
            member_id: Member to register.
            payment_id: Payment ID if required.
            
        Returns:
            Registration status (registered or waitlisted).
            
        Raises:
            ValueError: If registration not allowed.
        """
        event = self.session.query(Event).filter(
            Event.id == event_id,
            Event.is_deleted == False
        ).first()
        
        if not event:
            raise ValueError("Event not found")
        
        if not event.is_registration_open():
            raise ValueError("Registration is not open")
        
        # Check if already registered
        existing = event.get_attendee_status(member_id, self.session)
        if existing:
            raise ValueError(f"Already registered with status: {existing}")
        
        # Check payment requirement
        if event.access_type == EventAccessType.PAID and not payment_id:
            raise ValueError("Payment required for this event")
        
        # Determine status
        if event.max_attendees and event.registered_count >= event.max_attendees:
            status = AttendeeStatus.WAITLISTED
        else:
            status = AttendeeStatus.REGISTERED
            event.registered_count += 1
        
        # Create registration
        self.session.execute(
            event_attendees.insert().values(
                event_id=event_id,
                member_id=member_id,
                status=status,
                payment_id=payment_id,
                registered_at=datetime.utcnow()
            )
        )
        
        self.session.commit()
        
        # Send confirmation email
        await self._send_registration_confirmation(event, member_id, status)
        
        return status
    
    async def check_in_attendee(
        self,
        event_id: int,
        member_id: int
    ) -> None:
        """Check in an attendee when they join the event.
        
        Args:
            event_id: Event ID.
            member_id: Member ID.
            
        Raises:
            ValueError: If not registered or already checked in.
        """
        # Update attendee record
        self.session.execute(
            event_attendees.update().where(
                event_attendees.c.event_id == event_id,
                event_attendees.c.member_id == member_id,
                event_attendees.c.status == AttendeeStatus.REGISTERED
            ).values(
                status=AttendeeStatus.ATTENDED,
                attended_at=datetime.utcnow()
            )
        )
        
        # Update event metrics
        event = self.session.query(Event).get(event_id)
        event.attended_count += 1
        
        self.session.commit()
    
    async def _generate_unique_slug(
        self,
        base_slug: str,
        community_id: int
    ) -> str:
        """Generate unique slug for event.
        
        Args:
            base_slug: Base slug to start with.
            community_id: Community context.
            
        Returns:
            Unique slug.
        """
        slug = base_slug
        counter = 1
        
        while self.session.query(Event).filter(
            Event.slug == slug,
            Event.community_id == community_id,
            Event.is_deleted == False
        ).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        return slug
    
    async def _create_recurring_instances(
        self,
        parent_event: Event
    ) -> List[Event]:
        """Create recurring instances of an event.
        
        Args:
            parent_event: Parent event with recurrence rule.
            
        Returns:
            List of created recurring instances.
        """
        from dateutil import rrule
        
        # Parse recurrence rule
        rule = rrule.rrulestr(
            parent_event.recurrence_rule,
            dtstart=parent_event.start_time
        )
        
        instances = []
        duration = parent_event.end_time - parent_event.start_time
        
        # Generate instances (limit to prevent infinite loops)
        for occurrence in list(rule)[:52]:  # Max 52 occurrences
            if parent_event.recurrence_end_date and occurrence > parent_event.recurrence_end_date:
                break
            
            if occurrence == parent_event.start_time:
                continue  # Skip the parent event itself
            
            # Create instance
            instance_data = {
                key: value for key, value in parent_event.__dict__.items()
                if not key.startswith('_') and key not in ['id', 'uuid', 'created_at', 'updated_at']
            }
            
            instance_data.update({
                'parent_event_id': parent_event.id,
                'start_time': occurrence,
                'end_time': occurrence + duration,
                'slug': f"{parent_event.slug}-{occurrence.strftime('%Y%m%d')}",
                'is_recurring': False  # Instances are not themselves recurring
            })
            
            instance = Event(**instance_data)
            self.session.add(instance)
            instances.append(instance)
        
        return instances
```

## 4. Monetization & Payment Processing

### 4.1 Payment Models

```python
"""Monetization and payment processing system.

Handles subscriptions, one-time payments, tiers, and
integration with payment providers like Stripe.
"""
from datetime import datetime, timedelta
from decimal import Decimal
from enum import Enum
from typing import Dict, List, Optional, Any

from sqlalchemy import (
    Column, String, Boolean, Integer, ForeignKey,
    DateTime, Numeric, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel


class PaymentProvider(str, Enum):
    """Supported payment providers."""
    
    STRIPE = "stripe"
    PAYPAL = "paypal"
    PADDLE = "paddle"
    LEMON_SQUEEZY = "lemon_squeezy"


class PaymentStatus(str, Enum):
    """Payment transaction status."""
    
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"
    CANCELLED = "cancelled"


class SubscriptionStatus(str, Enum):
    """Subscription lifecycle status."""
    
    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PAUSED = "paused"


class PricingModel(str, Enum):
    """Types of pricing models."""
    
    FREE = "free"
    ONE_TIME = "one_time"
    SUBSCRIPTION = "subscription"
    PAY_WHAT_YOU_WANT = "pay_what_you_want"
    TIERED = "tiered"


class BillingInterval(str, Enum):
    """Subscription billing intervals."""
    
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"
    LIFETIME = "lifetime"


class PricingTier(BaseModel):
    """Pricing tiers for communities or features.
    
    Defines different access levels with associated
    features and pricing.
    """
    
    __tablename__ = "pricing_tiers"
    
    # Basic information
    name: str = Column(String(100), nullable=False)
    slug: str = Column(String(100), nullable=False, unique=True)
    description: Optional[str] = Column(String(500), nullable=True)
    
    # Pricing
    pricing_model: PricingModel = Column(
        SQLEnum(PricingModel),
        nullable=False
    )
    price: Decimal = Column(Numeric(10, 2), nullable=False)
    currency: str = Column(String(3), nullable=False, default="USD")
    
    # Subscription specific
    billing_interval: Optional[BillingInterval] = Column(
        SQLEnum(BillingInterval),
        nullable=True
    )
    trial_days: int = Column(Integer, default=0, nullable=False)
    setup_fee: Decimal = Column(Numeric(10, 2), default=0, nullable=False)
    
    # Features and limits
    features: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    limits: Dict[str, int] = Column(JSON, default=dict, nullable=False)
    
    # Display
    is_featured: bool = Column(Boolean, default=False, nullable=False)
    is_available: bool = Column(Boolean, default=True, nullable=False)
    display_order: int = Column(Integer, default=0, nullable=False)
    badge_text: Optional[str] = Column(String(20), nullable=True)  # e.g., "Popular"
    
    # Community association
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Relationships
    community = relationship("Community")
    subscriptions = relationship("Subscription", back_populates="tier")
    
    def has_feature(self, feature_key: str) -> bool:
        """Check if tier includes a feature.
        
        Args:
            feature_key: Feature to check.
            
        Returns:
            True if feature is included.
        """
        return self.features.get(feature_key, False)
    
    def get_limit(self, limit_key: str) -> Optional[int]:
        """Get limit value for a specific resource.
        
        Args:
            limit_key: Limit to check.
            
        Returns:
            Limit value or None if unlimited.
        """
        return self.limits.get(limit_key)


class Payment(BaseModel):
    """Individual payment transaction record.
    
    Tracks all monetary transactions including
    subscriptions, one-time payments, and refunds.
    """
    
    __tablename__ = "payments"
    
    # Transaction details
    amount: Decimal = Column(Numeric(10, 2), nullable=False)
    currency: str = Column(String(3), nullable=False)
    status: PaymentStatus = Column(
        SQLEnum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False,
        index=True
    )
    
    # Payment provider
    provider: PaymentProvider = Column(
        SQLEnum(PaymentProvider),
        nullable=False
    )
    provider_payment_id: str = Column(String(200), nullable=False, unique=True)
    provider_customer_id: Optional[str] = Column(String(200), nullable=True)
    
    # Payment method
    payment_method_type: str = Column(String(50), nullable=False)  # card, bank, etc.
    payment_method_last4: Optional[str] = Column(String(4), nullable=True)
    payment_method_brand: Optional[str] = Column(String(20), nullable=True)
    
    # Metadata
    description: Optional[str] = Column(String(500), nullable=True)
    statement_descriptor: Optional[str] = Column(String(22), nullable=True)
    metadata: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    
    # Fees and net amount
    fee_amount: Decimal = Column(Numeric(10, 2), default=0, nullable=False)
    net_amount: Decimal = Column(Numeric(10, 2), nullable=False)
    
    # Refund information
    refunded_amount: Decimal = Column(Numeric(10, 2), default=0, nullable=False)
    refund_reason: Optional[str] = Column(String(200), nullable=True)
    
    # Timestamps
    paid_at: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
    failed_at: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
    refunded_at: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    subscription_id: Optional[int] = Column(
        Integer,
        ForeignKey("subscriptions.id"),
        nullable=True
    )
    
    member = relationship("Member", back_populates="payments")
    subscription = relationship("Subscription", back_populates="payments")
    
    # Indexes
    __table_args__ = (
        Index('idx_payments_member_status', 'member_id', 'status'),
        Index('idx_payments_provider_id', 'provider', 'provider_payment_id'),
    )


class Subscription(BaseModel):
    """Subscription management for recurring payments.
    
    Handles subscription lifecycle including trials,
    renewals, cancellations, and plan changes.
    """
    
    __tablename__ = "subscriptions"
    
    # Subscription details
    status: SubscriptionStatus = Column(
        SQLEnum(SubscriptionStatus),
        default=SubscriptionStatus.ACTIVE,
        nullable=False,
        index=True
    )
    
    # Provider information
    provider: PaymentProvider = Column(
        SQLEnum(PaymentProvider),
        nullable=False
    )
    provider_subscription_id: str = Column(
        String(200),
        nullable=False,
        unique=True
    )
    provider_customer_id: str = Column(String(200), nullable=False)
    
    # Billing
    current_period_start: datetime = Column(
        DateTime(timezone=True),
        nullable=False
    )
    current_period_end: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
    
    # Trial information
    trial_start: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    trial_end: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Cancellation
    cancel_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    cancelled_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    cancel_reason: Optional[str] = Column(String(200), nullable=True)
    
    # Pause functionality
    paused_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    pause_resumes_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Metadata
    metadata: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    
    # Relationships
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    tier_id: int = Column(
        Integer,
        ForeignKey("pricing_tiers.id"),
        nullable=False
    )
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    member = relationship("Member", back_populates="subscriptions")
    tier = relationship("PricingTier", back_populates="subscriptions")
    community = relationship("Community")
    payments = relationship("Payment", back_populates="subscription")
    
    def is_active(self) -> bool:
        """Check if subscription is currently active.
        
        Returns:
            True if subscription provides access.
        """
        return self.status in [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIALING
        ]
    
    def days_until_renewal(self) -> int:
        """Calculate days until next renewal.
        
        Returns:
            Number of days until renewal.
        """
        if not self.is_active():
            return -1
        
        delta = self.current_period_end - datetime.utcnow()
        return max(0, delta.days)


class PaymentService:
    """Service for handling payments and subscriptions."""
    
    def __init__(
        self,
        session: Session,
        stripe_client: Optional[Any] = None
    ) -> None:
        """Initialize payment service.
        
        Args:
            session: Database session.
            stripe_client: Stripe client instance.
        """
        self.session = session
        self.stripe = stripe_client
    
    async def create_subscription(
        self,
        member_id: int,
        tier_id: int,
        payment_method_id: str,
        community_id: Optional[int] = None
    ) -> Subscription:
        """Create a new subscription.
        
        Args:
            member_id: Member subscribing.
            tier_id: Pricing tier.
            payment_method_id: Stripe payment method.
            community_id: Optional community context.
            
        Returns:
            Created subscription.
            
        Raises:
            ValueError: If validation fails.
        """
        # Get member and tier
        member = self.session.query(Member).get(member_id)
        tier = self.session.query(PricingTier).get(tier_id)
        
        if not member or not tier:
            raise ValueError("Invalid member or tier")
        
        if tier.pricing_model != PricingModel.SUBSCRIPTION:
            raise ValueError("Tier is not subscription-based")
        
        # Create or get Stripe customer
        if not member.stripe_customer_id:
            customer = await self._create_stripe_customer(member)
            member.stripe_customer_id = customer.id
        
        # Attach payment method
        await self._attach_payment_method(
            member.stripe_customer_id,
            payment_method_id
        )
        
        # Calculate trial end
        trial_end = None
        if tier.trial_days > 0:
            trial_end = datetime.utcnow() + timedelta(days=tier.trial_days)
        
        # Create Stripe subscription
        stripe_sub = await self._create_stripe_subscription(
            customer_id=member.stripe_customer_id,
            price_id=tier.stripe_price_id,
            trial_end=trial_end
        )
        
        # Create local subscription record
        subscription = Subscription(
            member_id=member_id,
            tier_id=tier_id,
            community_id=community_id,
            provider=PaymentProvider.STRIPE,
            provider_subscription_id=stripe_sub.id,
            provider_customer_id=member.stripe_customer_id,
            status=SubscriptionStatus.TRIALING if trial_end else SubscriptionStatus.ACTIVE,
            current_period_start=datetime.fromtimestamp(stripe_sub.current_period_start),
            current_period_end=datetime.fromtimestamp(stripe_sub.current_period_end),
            trial_start=datetime.utcnow() if trial_end else None,
            trial_end=trial_end
        )
        
        self.session.add(subscription)
        self.session.commit()
        
        # Grant access
        await self._grant_tier_access(member_id, tier_id)
        
        return subscription
    
    async def process_webhook(
        self,
        provider: PaymentProvider,
        event_type: str,
        event_data: Dict[str, Any]
    ) -> None:
        """Process payment provider webhooks.
        
        Args:
            provider: Payment provider.
            event_type: Type of webhook event.
            event_data: Event payload.
        """
        if provider == PaymentProvider.STRIPE:
            await self._process_stripe_webhook(event_type, event_data)
        elif provider == PaymentProvider.PAYPAL:
            await self._process_paypal_webhook(event_type, event_data)
        # Add other providers as needed
    
    async def _process_stripe_webhook(
        self,
        event_type: str,
        event_data: Dict[str, Any]
    ) -> None:
        """Process Stripe webhook events.
        
        Args:
            event_type: Stripe event type.
            event_data: Event data from Stripe.
        """
        if event_type == "invoice.payment_succeeded":
            await self._handle_successful_payment(event_data)
        elif event_type == "invoice.payment_failed":
            await self._handle_failed_payment(event_data)
        elif event_type == "customer.subscription.updated":
            await self._handle_subscription_update(event_data)
        elif event_type == "customer.subscription.deleted":
            await self._handle_subscription_cancellation(event_data)
        # Add more event handlers as needed
    
    async def _handle_successful_payment(
        self,
        invoice_data: Dict[str, Any]
    ) -> None:
        """Handle successful payment webhook.
        
        Args:
            invoice_data: Stripe invoice data.
        """
        # Find subscription
        subscription = self.session.query(Subscription).filter(
            Subscription.provider_subscription_id == invoice_data["subscription"]
        ).first()
        
        if not subscription:
            return
        
        # Create payment record
        payment = Payment(
            member_id=subscription.member_id,
            subscription_id=subscription.id,
            amount=Decimal(str(invoice_data["amount_paid"] / 100)),
            currency=invoice_data["currency"].upper(),
            status=PaymentStatus.SUCCEEDED,
            provider=PaymentProvider.STRIPE,
            provider_payment_id=invoice_data["payment_intent"],
            provider_customer_id=invoice_data["customer"],
            payment_method_type="card",  # Get from payment intent
            paid_at=datetime.fromtimestamp(invoice_data["status_transitions"]["paid_at"]),
            net_amount=Decimal(str((invoice_data["amount_paid"] - invoice_data.get("fee", 0)) / 100))
        )
        
        self.session.add(payment)
        
        # Update subscription periods
        subscription.current_period_start = datetime.fromtimestamp(
            invoice_data["period_start"]
        )
        subscription.current_period_end = datetime.fromtimestamp(
            invoice_data["period_end"]
        )
        
        # Clear trial if ending
        if subscription.trial_end and datetime.utcnow() >= subscription.trial_end:
            subscription.status = SubscriptionStatus.ACTIVE
        
        self.session.commit()
        
        # Send receipt email
        await self._send_payment_receipt(payment)
```

### 4.2 Revenue Analytics

```python
"""Revenue analytics and reporting for monetization.

Provides insights into revenue trends, customer lifetime value,
churn analysis, and financial metrics.
"""
from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import Dict, List, Optional, Tuple

from sqlalchemy import func, and_, or_
from sqlalchemy.orm import Session

from pycommunity.monetization.models import Payment, Subscription, PricingTier


class RevenueAnalytics:
    """Analytics service for revenue and subscription metrics."""
    
    def __init__(self, session: Session) -> None:
        """Initialize analytics service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def get_revenue_summary(
        self,
        start_date: date,
        end_date: date,
        community_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Get comprehensive revenue summary.
        
        Args:
            start_date: Start of period.
            end_date: End of period.
            community_id: Optional community filter.
            
        Returns:
            Revenue summary with key metrics.
        """
        # Base query
        query = self.session.query(Payment).filter(
            Payment.status == PaymentStatus.SUCCEEDED,
            Payment.paid_at >= start_date,
            Payment.paid_at <= end_date
        )
        
        if community_id:
            query = query.join(Subscription).filter(
                Subscription.community_id == community_id
            )
        
        # Calculate metrics
        total_revenue = query.with_entities(
            func.sum(Payment.amount)
        ).scalar() or Decimal("0")
        
        total_fees = query.with_entities(
            func.sum(Payment.fee_amount)
        ).scalar() or Decimal("0")
        
        net_revenue = total_revenue - total_fees
        
        # Transaction counts
        transaction_count = query.count()
        
        # Average transaction value
        avg_transaction = total_revenue / transaction_count if transaction_count > 0 else Decimal("0")
        
        # Refunds
        refund_query = query.filter(Payment.refunded_amount > 0)
        refund_count = refund_query.count()
        refund_amount = refund_query.with_entities(
            func.sum(Payment.refunded_amount)
        ).scalar() or Decimal("0")
        
        # Revenue by payment method
        revenue_by_method = {}
        method_results = query.with_entities(
            Payment.payment_method_type,
            func.sum(Payment.amount),
            func.count(Payment.id)
        ).group_by(Payment.payment_method_type).all()
        
        for method, amount, count in method_results:
            revenue_by_method[method] = {
                "amount": float(amount),
                "count": count,
                "percentage": float(amount / total_revenue * 100) if total_revenue > 0 else 0
            }
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "revenue": {
                "gross": float(total_revenue),
                "fees": float(total_fees),
                "net": float(net_revenue),
                "currency": "USD"  # Get from payments
            },
            "transactions": {
                "count": transaction_count,
                "average_value": float(avg_transaction)
            },
            "refunds": {
                "count": refund_count,
                "amount": float(refund_amount),
                "rate": refund_count / transaction_count * 100 if transaction_count > 0 else 0
            },
            "payment_methods": revenue_by_method
        }
    
    async def get_subscription_metrics(
        self,
        as_of_date: Optional[date] = None,
        community_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Get subscription metrics including MRR, churn, and growth.
        
        Args:
            as_of_date: Date to calculate metrics for.
            community_id: Optional community filter.
            
        Returns:
            Subscription metrics.
        """
        if not as_of_date:
            as_of_date = date.today()
        
        # Base query
        query = self.session.query(Subscription)
        if community_id:
            query = query.filter(Subscription.community_id == community_id)
        
        # Active subscriptions
        active_subs = query.filter(
            Subscription.status.in_([
                SubscriptionStatus.ACTIVE,
                SubscriptionStatus.TRIALING
            ])
        )
        
        # Calculate MRR (Monthly Recurring Revenue)
        mrr_query = active_subs.join(PricingTier)
        
        monthly_subs = mrr_query.filter(
            PricingTier.billing_interval == BillingInterval.MONTHLY
        ).with_entities(func.sum(PricingTier.price)).scalar() or Decimal("0")
        
        yearly_subs = mrr_query.filter(
            PricingTier.billing_interval == BillingInterval.YEARLY
        ).with_entities(func.sum(PricingTier.price / 12)).scalar() or Decimal("0")
        
        quarterly_subs = mrr_query.filter(
            PricingTier.billing_interval == BillingInterval.QUARTERLY
        ).with_entities(func.sum(PricingTier.price / 3)).scalar() or Decimal("0")
        
        total_mrr = monthly_subs + yearly_subs + quarterly_subs
        
        # Subscription counts by status
        status_counts = {}
        status_results = query.with_entities(
            Subscription.status,
            func.count(Subscription.id)
        ).group_by(Subscription.status).all()
        
        for status, count in status_results:
            status_counts[status.value] = count
        
        # Churn calculation (last 30 days)
        churn_start = as_of_date - timedelta(days=30)
        
        churned_count = query.filter(
            Subscription.cancelled_at >= churn_start,
            Subscription.cancelled_at <= as_of_date
        ).count()
        
        active_at_start = query.filter(
            or_(
                Subscription.created_at < churn_start,
                and_(
                    Subscription.created_at >= churn_start,
                    Subscription.cancelled_at > churn_start
                )
            )
        ).count()
        
        churn_rate = (churned_count / active_at_start * 100) if active_at_start > 0 else 0
        
        # Growth metrics
        new_subs_30d = query.filter(
            Subscription.created_at >= as_of_date - timedelta(days=30),
            Subscription.created_at <= as_of_date
        ).count()
        
        # Customer lifetime value (simple calculation)
        avg_customer_lifespan_days = 365 / (churn_rate * 12) if churn_rate > 0 else 365
        avg_revenue_per_user = total_mrr / active_subs.count() if active_subs.count() > 0 else Decimal("0")
        ltv = avg_revenue_per_user * (avg_customer_lifespan_days / 30)
        
        return {
            "as_of": as_of_date.isoformat(),
            "mrr": {
                "total": float(total_mrr),
                "by_interval": {
                    "monthly": float(monthly_subs),
                    "quarterly": float(quarterly_subs),
                    "yearly": float(yearly_subs)
                }
            },
            "subscriptions": {
                "total_active": active_subs.count(),
                "by_status": status_counts,
                "trials": status_counts.get("trialing", 0)
            },
            "churn": {
                "rate_monthly": churn_rate,
                "count_last_30d": churned_count
            },
            "growth": {
                "new_subscriptions_30d": new_subs_30d,
                "net_growth_30d": new_subs_30d - churned_count
            },
            "ltv": {
                "average": float(ltv),
                "avg_lifespan_days": avg_customer_lifespan_days
            }
        }
    
    async def get_revenue_forecast(
        self,
        months_ahead: int = 3,
        community_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Forecast revenue based on current subscriptions.
        
        Args:
            months_ahead: Number of months to forecast.
            community_id: Optional community filter.
            
        Returns:
            Monthly revenue forecast.
        """
        # Get current MRR
        metrics = await self.get_subscription_metrics(
            community_id=community_id
        )
        current_mrr = Decimal(str(metrics["mrr"]["total"]))
        monthly_churn_rate = Decimal(str(metrics["churn"]["rate_monthly"] / 100))
        
        # Get historical growth rate (last 3 months)
        growth_rates = []
        for i in range(1, 4):
            month_start = date.today() - timedelta(days=30 * i)
            month_metrics = await self.get_subscription_metrics(
                as_of_date=month_start,
                community_id=community_id
            )
            
            if i < 3:
                prev_metrics = await self.get_subscription_metrics(
                    as_of_date=month_start - timedelta(days=30),
                    community_id=community_id
                )
                
                if prev_metrics["mrr"]["total"] > 0:
                    growth_rate = (
                        month_metrics["mrr"]["total"] - prev_metrics["mrr"]["total"]
                    ) / prev_metrics["mrr"]["total"]
                    growth_rates.append(growth_rate)
        
        avg_growth_rate = Decimal(str(sum(growth_rates) / len(growth_rates))) if growth_rates else Decimal("0.05")
        
        # Generate forecast
        forecast = []
        projected_mrr = current_mrr
        
        for month in range(1, months_ahead + 1):
            # Apply growth and churn
            projected_mrr = projected_mrr * (1 + avg_growth_rate - monthly_churn_rate)
            
            forecast_date = date.today() + timedelta(days=30 * month)
            
            forecast.append({
                "month": forecast_date.strftime("%Y-%m"),
                "projected_mrr": float(projected_mrr),
                "projected_revenue": float(projected_mrr),
                "confidence": "medium" if month <= 3 else "low",
                "factors": {
                    "growth_rate": float(avg_growth_rate),
                    "churn_rate": float(monthly_churn_rate)
                }
            })
        
        return forecast
```

## 5. Advanced Gamification System

### 5.1 Gamification Models

```python
"""Advanced gamification system with achievements, leaderboards, and rewards.

Provides comprehensive engagement mechanics including points, levels,
badges, streaks, challenges, and social competition features.
"""
from datetime import datetime, date, timedelta
from enum import Enum
from typing import Dict, List, Optional, Set, Any

from sqlalchemy import (
    Column, String, Boolean, Integer, Float, ForeignKey,
    DateTime, JSON, Enum as SQLEnum, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel


class AchievementType(str, Enum):
    """Types of achievements members can earn."""
    
    BADGE = "badge"
    MILESTONE = "milestone"
    SKILL = "skill"
    SPECIAL = "special"
    SEASONAL = "seasonal"


class AchievementRarity(str, Enum):
    """Rarity levels for achievements."""
    
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"


class ChallengeType(str, Enum):
    """Types of challenges members can participate in."""
    
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    SPECIAL = "special"
    COMMUNITY = "community"


class RewardType(str, Enum):
    """Types of rewards that can be earned."""
    
    POINTS = "points"
    BADGE = "badge"
    TITLE = "title"
    FEATURE_UNLOCK = "feature_unlock"
    DISCOUNT = "discount"
    CUSTOM = "custom"


class Achievement(BaseModel):
    """Achievement definitions that members can earn.
    
    Defines badges, milestones, and other achievements
    with their unlock criteria and rewards.
    """
    
    __tablename__ = "achievements"
    
    # Basic information
    name: str = Column(String(100), nullable=False)
    slug: str = Column(String(100), unique=True, nullable=False)
    description: str = Column(String(500), nullable=False)
    
    # Achievement properties
    type: AchievementType = Column(
        SQLEnum(AchievementType),
        nullable=False,
        index=True
    )
    rarity: AchievementRarity = Column(
        SQLEnum(AchievementRarity),
        default=AchievementRarity.COMMON,
        nullable=False
    )
    
    # Visual elements
    icon_url: str = Column(String(500), nullable=False)
    color: Optional[str] = Column(String(7), nullable=True)
    animation_url: Optional[str] = Column(String(500), nullable=True)
    
    # Unlock criteria (JSON schema)
    criteria: Dict[str, Any] = Column(JSON, nullable=False)
    """
    Example criteria structures:
    {
        "type": "post_count",
        "value": 100,
        "timeframe_days": 30  # optional
    }
    {
        "type": "streak",
        "value": 7,
        "action": "daily_login"
    }
    {
        "type": "engagement_score",
        "value": 1000
    }
    {
        "type": "custom",
        "handler": "special_event_2024"
    }
    """
    
    # Rewards
    point_reward: int = Column(Integer, default=0, nullable=False)
    rewards: List[Dict[str, Any]] = Column(JSON, default=list, nullable=False)
    
    # Display and availability
    is_active: bool = Column(Boolean, default=True, nullable=False)
    is_secret: bool = Column(Boolean, default=False, nullable=False)
    display_order: int = Column(Integer, default=0, nullable=False)
    
    # Time constraints
    available_from: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    available_until: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Statistics
    total_earned_count: int = Column(Integer, default=0, nullable=False)
    
    # Community association
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Relationships
    community = relationship("Community")
    member_achievements = relationship(
        "MemberAchievement",
        back_populates="achievement"
    )
    
    def is_available(self) -> bool:
        """Check if achievement is currently available.
        
        Returns:
            True if achievement can be earned.
        """
        if not self.is_active:
            return False
        
        now = datetime.utcnow()
        
        if self.available_from and now < self.available_from:
            return False
        
        if self.available_until and now > self.available_until:
            return False
        
        return True


class MemberAchievement(BaseModel):
    """Tracks achievements earned by members."""
    
    __tablename__ = "member_achievements"
    
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    achievement_id: int = Column(
        Integer,
        ForeignKey("achievements.id"),
        nullable=False,
        index=True
    )
    
    # Earning details
    earned_at: datetime = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )
    progress: float = Column(Float, default=100.0, nullable=False)  # Percentage
    
    # Additional metadata
    metadata: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    
    # Display preferences
    is_featured: bool = Column(Boolean, default=False, nullable=False)
    is_hidden: bool = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    member = relationship("Member", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="member_achievements")
    
    __table_args__ = (
        UniqueConstraint('member_id', 'achievement_id'),
    )


class Challenge(BaseModel):
    """Time-limited challenges for engagement.
    
    Defines special tasks or goals that members can
    complete for rewards within a specific timeframe.
    """
    
    __tablename__ = "challenges"
    
    # Basic information
    title: str = Column(String(200), nullable=False)
    description: str = Column(String(1000), nullable=False)
    instructions: Optional[str] = Column(String(2000), nullable=True)
    
    # Challenge properties
    type: ChallengeType = Column(
        SQLEnum(ChallengeType),
        nullable=False,
        index=True
    )
    
    # Timing
    start_time: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
    end_time: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
    
    # Requirements
    requirements: Dict[str, Any] = Column(JSON, nullable=False)
    """
    Example requirements:
    {
        "actions": [
            {"type": "create_post", "count": 3},
            {"type": "give_reactions", "count": 10},
            {"type": "attend_event", "count": 1}
        ],
        "min_completion": 2  # Complete at least 2 actions
    }
    """
    
    # Rewards
    rewards: List[Dict[str, Any]] = Column(JSON, default=list, nullable=False)
    
    # Participation limits
    max_participants: Optional[int] = Column(Integer, nullable=True)
    max_completions_per_member: int = Column(Integer, default=1, nullable=False)
    
    # Visual elements
    banner_url: Optional[str] = Column(String(500), nullable=True)
    icon_url: Optional[str] = Column(String(500), nullable=True)
    
    # Statistics
    participant_count: int = Column(Integer, default=0, nullable=False)
    completion_count: int = Column(Integer, default=0, nullable=False)
    
    # Community association
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    
    # Relationships
    community = relationship("Community")
    participants = relationship("ChallengeParticipation", back_populates="challenge")
    
    def is_active(self) -> bool:
        """Check if challenge is currently active.
        
        Returns:
            True if challenge is ongoing.
        """
        now = datetime.utcnow()
        return self.start_time <= now <= self.end_time


class ChallengeParticipation(BaseModel):
    """Tracks member participation in challenges."""
    
    __tablename__ = "challenge_participations"
    
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    challenge_id: int = Column(
        Integer,
        ForeignKey("challenges.id"),
        nullable=False,
        index=True
    )
    
    # Progress tracking
    started_at: datetime = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )
    completed_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Progress details
    progress: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    completion_percentage: float = Column(Float, default=0.0, nullable=False)
    
    # Rewards claimed
    rewards_claimed: bool = Column(Boolean, default=False, nullable=False)
    rewards_claimed_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Relationships
    member = relationship("Member")
    challenge = relationship("Challenge", back_populates="participants")
    
    __table_args__ = (
        UniqueConstraint('member_id', 'challenge_id'),
    )


class Leaderboard(BaseModel):
    """Leaderboard configurations for different metrics.
    
    Defines various leaderboards that track and rank
    member performance across different dimensions.
    """
    
    __tablename__ = "leaderboards"
    
    # Basic information
    name: str = Column(String(100), nullable=False)
    slug: str = Column(String(100), unique=True, nullable=False)
    description: Optional[str] = Column(String(500), nullable=True)
    
    # Leaderboard configuration
    metric_type: str = Column(String(50), nullable=False)  # points, posts, reactions, etc.
    timeframe: str = Column(String(20), nullable=False)  # all_time, monthly, weekly, daily
    
    # Calculation rules
    calculation_rules: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    """
    Example rules:
    {
        "metric": "engagement_score",
        "formula": "posts * 10 + reactions_given * 2 + reactions_received * 5",
        "filters": {"community_id": 123},
        "min_activity_days": 7
    }
    """
    
    # Display settings
    is_active: bool = Column(Boolean, default=True, nullable=False)
    is_public: bool = Column(Boolean, default=True, nullable=False)
    show_top_n: int = Column(Integer, default=100, nullable=False)
    
    # Update frequency
    update_frequency_minutes: int = Column(Integer, default=60, nullable=False)
    last_updated_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Community association
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Relationships
    community = relationship("Community")
    entries = relationship("LeaderboardEntry", back_populates="leaderboard")


class LeaderboardEntry(BaseModel):
    """Individual entries in leaderboards."""
    
    __tablename__ = "leaderboard_entries"
    
    leaderboard_id: int = Column(
        Integer,
        ForeignKey("leaderboards.id"),
        nullable=False,
        index=True
    )
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    
    # Ranking data
    rank: int = Column(Integer, nullable=False, index=True)
    score: float = Column(Float, nullable=False)
    previous_rank: Optional[int] = Column(Integer, nullable=True)
    
    # Time period
    period_start: date = Column(DateTime(timezone=True), nullable=False)
    period_end: date = Column(DateTime(timezone=True), nullable=False)
    
    # Additional metrics
    metrics: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    
    # Relationships
    leaderboard = relationship("Leaderboard", back_populates="entries")
    member = relationship("Member")
    
    __table_args__ = (
        UniqueConstraint('leaderboard_id', 'member_id', 'period_start'),
        Index('idx_leaderboard_rank', 'leaderboard_id', 'period_start', 'rank'),
    )


class GamificationService:
    """Service for managing gamification features."""
    
    def __init__(self, session: Session) -> None:
        """Initialize gamification service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def check_and_award_achievements(
        self,
        member_id: int,
        trigger_type: str,
        context: Optional[Dict[str, Any]] = None
    ) -> List[Achievement]:
        """Check and award achievements based on member actions.
        
        Args:
            member_id: Member to check achievements for.
            trigger_type: Type of action that triggered check.
            context: Additional context for the trigger.
            
        Returns:
            List of newly awarded achievements.
        """
        member = self.session.query(Member).get(member_id)
        if not member:
            return []
        
        # Get available achievements
        achievements = self.session.query(Achievement).filter(
            Achievement.is_active == True,
            Achievement.is_deleted == False
        ).all()
        
        # Filter already earned
        earned_ids = {
            ma.achievement_id for ma in member.achievements
        }
        
        available = [a for a in achievements if a.id not in earned_ids and a.is_available()]
        
        # Check each achievement
        newly_earned = []
        
        for achievement in available:
            if await self._check_achievement_criteria(member, achievement, trigger_type, context):
                # Award achievement
                member_achievement = MemberAchievement(
                    member_id=member_id,
                    achievement_id=achievement.id,
                    earned_at=datetime.utcnow(),
                    metadata={
                        "trigger_type": trigger_type,
                        "context": context or {}
                    }
                )
                
                self.session.add(member_achievement)
                
                # Award points
                if achievement.point_reward > 0:
                    member.add_points(achievement.point_reward, f"achievement:{achievement.slug}")
                
                # Process additional rewards
                await self._process_achievement_rewards(member, achievement)
                
                newly_earned.append(achievement)
                
                # Update achievement stats
                achievement.total_earned_count += 1
        
        if newly_earned:
            self.session.commit()
            
            # Send notifications
            for achievement in newly_earned:
                await self._send_achievement_notification(member, achievement)
        
        return newly_earned
    
    async def _check_achievement_criteria(
        self,
        member: Member,
        achievement: Achievement,
        trigger_type: str,
        context: Optional[Dict[str, Any]]
    ) -> bool:
        """Check if member meets achievement criteria.
        
        Args:
            member: Member to check.
            achievement: Achievement to check criteria for.
            trigger_type: Type of trigger.
            context: Additional context.
            
        Returns:
            True if criteria are met.
        """
        criteria = achievement.criteria
        criteria_type = criteria.get("type")
        
        if criteria_type == "post_count":
            timeframe_days = criteria.get("timeframe_days")
            
            query = self.session.query(func.count(Post.id)).filter(
                Post.author_id == member.id,
                Post.is_deleted == False
            )
            
            if timeframe_days:
                since_date = datetime.utcnow() - timedelta(days=timeframe_days)
                query = query.filter(Post.created_at >= since_date)
            
            count = query.scalar()
            return count >= criteria.get("value", 0)
        
        elif criteria_type == "streak":
            action = criteria.get("action")
            required_days = criteria.get("value", 0)
            
            if action == "daily_login":
                return member.streak_days >= required_days
            # Add other streak types
        
        elif criteria_type == "engagement_score":
            # Calculate engagement score
            score = await self._calculate_engagement_score(member)
            return score


## 6. Real-time Communication (WebSocket/Chat)

### 6.1 WebSocket Implementation

```python
"""Real-time communication system using WebSockets.

Provides instant messaging, presence tracking, typing indicators,
and real-time notifications using FastAPI WebSocket support.
"""
import json
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Set, Any

from fastapi import WebSocket, WebSocketDisconnect, Depends
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Session, relationship

from pycommunity.core.models import BaseModel
from pycommunity.core.dependencies import get_db, get_current_member_ws


class MessageType(str, Enum):
    """Types of real-time messages."""
    
    CHAT = "chat"
    SYSTEM = "system"
    NOTIFICATION = "notification"
    PRESENCE = "presence"
    TYPING = "typing"
    REACTION = "reaction"
    DELETE = "delete"
    EDIT = "edit"


class PresenceStatus(str, Enum):
    """Member presence status."""
    
    ONLINE = "online"
    AWAY = "away"
    BUSY = "busy"
    OFFLINE = "offline"


class ChatMessage(BaseModel):
    """Persistent chat message storage.
    
    Stores chat messages for history and offline delivery.
    """
    
    __tablename__ = "chat_messages"
    
    # Message content
    content: str = Column(String(2000), nullable=False)
    content_html: Optional[str] = Column(String(3000), nullable=True)
    
    # Message metadata
    type: MessageType = Column(
        SQLEnum(MessageType),
        default=MessageType.CHAT,
        nullable=False
    )
    
    # Threading
    thread_id: Optional[str] = Column(String(100), nullable=True, index=True)
    reply_to_id: Optional[int] = Column(
        Integer,
        ForeignKey("chat_messages.id"),
        nullable=True
    )
    
    # Editing
    edited_at: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
    edit_history: List[Dict[str, Any]] = Column(JSON, default=list)
    
    # Attachments
    attachments: List[Dict[str, Any]] = Column(JSON, default=list)
    
    # Delivery tracking
    delivered_to: List[int] = Column(JSON, default=list)  # Member IDs
    read_by: List[Dict[str, Any]] = Column(JSON, default=list)  # [{member_id, read_at}]
    
    # Location context
    channel_id: Optional[int] = Column(
        Integer,
        ForeignKey("chat_channels.id"),
        nullable=True
    )
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    
    # Relationships
    sender_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    
    sender = relationship("Member", foreign_keys=[sender_id])
    reply_to = relationship("ChatMessage", remote_side="ChatMessage.id")
    channel = relationship("ChatChannel", back_populates="messages")
    reactions = relationship("MessageReaction", back_populates="message")


class ChatChannel(BaseModel):
    """Chat channels for organized conversations."""
    
    __tablename__ = "chat_channels"
    
    name: str = Column(String(100), nullable=False)
    description: Optional[str] = Column(String(500), nullable=True)
    
    # Channel type
    is_direct: bool = Column(Boolean, default=False, nullable=False)
    is_private: bool = Column(Boolean, default=False, nullable=False)
    
    # Settings
    slow_mode_seconds: int = Column(Integer, default=0, nullable=False)
    auto_archive_hours: Optional[int] = Column(Integer, nullable=True)
    
    # Community context
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    
    # Statistics
    message_count: int = Column(Integer, default=0, nullable=False)
    last_message_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Relationships
    messages = relationship("ChatMessage", back_populates="channel")
    members = relationship("ChatChannelMember", back_populates="channel")


class ConnectionManager:
    """Manages WebSocket connections and message routing.
    
    Handles connection lifecycle, message broadcasting,
    and presence tracking for real-time features.
    """
    
    def __init__(self):
        """Initialize connection manager."""
        # Active connections by member ID
        self.active_connections: Dict[int, List[WebSocket]] = {}
        
        # Presence tracking
        self.presence: Dict[int, PresenceStatus] = {}
        
        # Typing indicators by channel
        self.typing: Dict[str, Set[int]] = {}
        
        # Room subscriptions
        self.room_subscriptions: Dict[str, Set[int]] = {}
    
    async def connect(
        self,
        websocket: WebSocket,
        member_id: int
    ) -> None:
        """Accept and track a new WebSocket connection.
        
        Args:
            websocket: WebSocket connection.
            member_id: ID of connecting member.
        """
        await websocket.accept()
        
        # Add to active connections
        if member_id not in self.active_connections:
            self.active_connections[member_id] = []
        
        self.active_connections[member_id].append(websocket)
        
        # Update presence
        self.presence[member_id] = PresenceStatus.ONLINE
        
        # Notify others of presence change
        await self.broadcast_presence_update(member_id, PresenceStatus.ONLINE)
    
    async def disconnect(
        self,
        websocket: WebSocket,
        member_id: int
    ) -> None:
        """Handle WebSocket disconnection.
        
        Args:
            websocket: Disconnecting WebSocket.
            member_id: ID of disconnecting member.
        """
        # Remove from active connections
        if member_id in self.active_connections:
            self.active_connections[member_id].remove(websocket)
            
            # If no more connections, mark as offline
            if not self.active_connections[member_id]:
                del self.active_connections[member_id]
                self.presence[member_id] = PresenceStatus.OFFLINE
                
                # Clear typing indicators
                for channel_typing in self.typing.values():
                    channel_typing.discard(member_id)
                
                # Notify others
                await self.broadcast_presence_update(member_id, PresenceStatus.OFFLINE)
    
    async def send_personal_message(
        self,
        message: Dict[str, Any],
        member_id: int
    ) -> None:
        """Send message to specific member.
        
        Args:
            message: Message data.
            member_id: Target member ID.
        """
        if member_id in self.active_connections:
            message_json = json.dumps(message)
            
            # Send to all connections for this member
            disconnected = []
            for connection in self.active_connections[member_id]:
                try:
                    await connection.send_text(message_json)
                except:
                    disconnected.append(connection)
            
            # Clean up disconnected
            for conn in disconnected:
                self.active_connections[member_id].remove(conn)
    
    async def broadcast_to_room(
        self,
        room_id: str,
        message: Dict[str, Any],
        exclude_member: Optional[int] = None
    ) -> None:
        """Broadcast message to all members in a room.
        
        Args:
            room_id: Room identifier.
            message: Message to broadcast.
            exclude_member: Member to exclude from broadcast.
        """
        if room_id not in self.room_subscriptions:
            return
        
        message_json = json.dumps(message)
        
        for member_id in self.room_subscriptions[room_id]:
            if member_id == exclude_member:
                continue
            
            if member_id in self.active_connections:
                for connection in self.active_connections[member_id]:
                    try:
                        await connection.send_text(message_json)
                    except:
                        pass
    
    async def join_room(
        self,
        member_id: int,
        room_id: str
    ) -> None:
        """Add member to a room.
        
        Args:
            member_id: Member joining.
            room_id: Room to join.
        """
        if room_id not in self.room_subscriptions:
            self.room_subscriptions[room_id] = set()
        
        self.room_subscriptions[room_id].add(member_id)
    
    async def leave_room(
        self,
        member_id: int,
        room_id: str
    ) -> None:
        """Remove member from a room.
        
        Args:
            member_id: Member leaving.
            room_id: Room to leave.
        """
        if room_id in self.room_subscriptions:
            self.room_subscriptions[room_id].discard(member_id)
    
    async def handle_typing(
        self,
        member_id: int,
        channel_id: str,
        is_typing: bool
    ) -> None:
        """Handle typing indicator updates.
        
        Args:
            member_id: Member typing.
            channel_id: Channel where typing.
            is_typing: Whether member is typing.
        """
        if channel_id not in self.typing:
            self.typing[channel_id] = set()
        
        if is_typing:
            self.typing[channel_id].add(member_id)
        else:
            self.typing[channel_id].discard(member_id)
        
        # Broadcast typing update
        await self.broadcast_to_room(
            f"channel:{channel_id}",
            {
                "type": MessageType.TYPING,
                "channel_id": channel_id,
                "member_id": member_id,
                "is_typing": is_typing,
                "typing_members": list(self.typing[channel_id])
            },
            exclude_member=member_id
        )
    
    async def broadcast_presence_update(
        self,
        member_id: int,
        status: PresenceStatus
    ) -> None:
        """Broadcast presence status update.
        
        Args:
            member_id: Member whose status changed.
            status: New presence status.
        """
        message = {
            "type": MessageType.PRESENCE,
            "member_id": member_id,
            "status": status.value,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Send to all connected members
        # In production, limit to friends/community members
        for connections in self.active_connections.values():
            for connection in connections:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    pass


# Global connection manager instance
manager = ConnectionManager()


class WebSocketService:
    """Service for WebSocket message handling."""
    
    def __init__(self, session: Session):
        """Initialize WebSocket service.
        
        Args:
            session: Database session.
        """
        self.session = session
        self.manager = manager
    
    async def handle_chat_message(
        self,
        sender_id: int,
        content: str,
        channel_id: Optional[int] = None,
        thread_id: Optional[str] = None,
        reply_to_id: Optional[int] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> ChatMessage:
        """Process and broadcast a chat message.
        
        Args:
            sender_id: Message sender.
            content: Message content.
            channel_id: Target channel.
            thread_id: Thread identifier.
            reply_to_id: Message being replied to.
            attachments: File attachments.
            
        Returns:
            Created message.
        """
        # Create message record
        message = ChatMessage(
            sender_id=sender_id,
            content=content,
            channel_id=channel_id,
            thread_id=thread_id,
            reply_to_id=reply_to_id,
            attachments=attachments or [],
            community_id=1  # Get from context
        )
        
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        
        # Prepare broadcast message
        broadcast_data = {
            "type": MessageType.CHAT,
            "message": {
                "id": message.id,
                "content": message.content,
                "sender_id": sender_id,
                "sender_name": message.sender.display_name,
                "sender_avatar": message.sender.avatar_url,
                "channel_id": channel_id,
                "thread_id": thread_id,
                "reply_to_id": reply_to_id,
                "attachments": attachments,
                "created_at": message.created_at.isoformat()
            }
        }
        
        # Determine broadcast target
        if channel_id:
            room_id = f"channel:{channel_id}"
        elif thread_id:
            room_id = f"thread:{thread_id}"
        else:
            room_id = "global"  # Fallback
        
        # Broadcast to room
        await self.manager.broadcast_to_room(
            room_id,
            broadcast_data,
            exclude_member=sender_id
        )
        
        # Send confirmation to sender
        await self.manager.send_personal_message(
            {
                **broadcast_data,
                "confirmed": True
            },
            sender_id
        )
        
        # Update channel stats
        if channel_id:
            channel = self.session.query(ChatChannel).get(channel_id)
            if channel:
                channel.message_count += 1
                channel.last_message_at = datetime.utcnow()
                self.session.commit()
        
        return message
    
    async def handle_message_edit(
        self,
        message_id: int,
        editor_id: int,
        new_content: str
    ) -> None:
        """Handle message edit.
        
        Args:
            message_id: Message to edit.
            editor_id: Member editing.
            new_content: New content.
        """
        message = self.session.query(ChatMessage).get(message_id)
        
        if not message or message.sender_id != editor_id:
            return
        
        # Save edit history
        message.edit_history.append({
            "content": message.content,
            "edited_at": datetime.utcnow().isoformat()
        })
        
        # Update content
        message.content = new_content
        message.edited_at = datetime.utcnow()
        
        self.session.commit()
        
        # Broadcast edit
        broadcast_data = {
            "type": MessageType.EDIT,
            "message_id": message_id,
            "new_content": new_content,
            "edited_at": message.edited_at.isoformat()
        }
        
        if message.channel_id:
            await self.manager.broadcast_to_room(
                f"channel:{message.channel_id}",
                broadcast_data
            )


# WebSocket endpoint
@app.websocket("/ws/{member_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    member_id: int,
    db: Session = Depends(get_db)
):
    """WebSocket endpoint for real-time communication.
    
    Args:
        websocket: WebSocket connection.
        member_id: Connecting member ID.
        db: Database session.
    """
    service = WebSocketService(db)
    
    await manager.connect(websocket, member_id)
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_json()
            
            # Route based on message type
            if data["type"] == "chat":
                await service.handle_chat_message(
                    sender_id=member_id,
                    content=data["content"],
                    channel_id=data.get("channel_id"),
                    thread_id=data.get("thread_id"),
                    reply_to_id=data.get("reply_to_id"),
                    attachments=data.get("attachments")
                )
            
            elif data["type"] == "typing":
                await manager.handle_typing(
                    member_id=member_id,
                    channel_id=data["channel_id"],
                    is_typing=data["is_typing"]
                )
            
            elif data["type"] == "presence":
                manager.presence[member_id] = PresenceStatus(data["status"])
                await manager.broadcast_presence_update(
                    member_id,
                    PresenceStatus(data["status"])
                )
            
            elif data["type"] == "join_room":
                await manager.join_room(member_id, data["room_id"])
            
            elif data["type"] == "leave_room":
                await manager.leave_room(member_id, data["room_id"])
    
    except WebSocketDisconnect:
        await manager.disconnect(websocket, member_id)
```

## 7. Notification & Email System

### 7.1 Notification Models

```python
"""Comprehensive notification and email system.

Handles in-app notifications, email delivery, push notifications,
and notification preferences with template support.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any

from sqlalchemy import (
    Column, String, Boolean, Integer, ForeignKey,
    DateTime, JSON, Text, Enum as SQLEnum
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel


class NotificationType(str, Enum):
    """Types of notifications."""
    
    # Content notifications
    MENTION = "mention"
    REPLY = "reply"
    REACTION = "reaction"
    NEW_POST = "new_post"
    
    # Community notifications
    INVITE = "invite"
    JOIN_REQUEST = "join_request"
    ROLE_CHANGE = "role_change"
    
    # Event notifications
    EVENT_REMINDER = "event_reminder"
    EVENT_UPDATE = "event_update"
    EVENT_CANCELLED = "event_cancelled"
    
    # Achievement notifications
    ACHIEVEMENT_EARNED = "achievement_earned"
    LEVEL_UP = "level_up"
    BADGE_EARNED = "badge_earned"
    
    # System notifications
    SYSTEM_ANNOUNCEMENT = "system_announcement"
    SECURITY_ALERT = "security_alert"
    SUBSCRIPTION_UPDATE = "subscription_update"


class NotificationChannel(str, Enum):
    """Delivery channels for notifications."""
    
    IN_APP = "in_app"
    EMAIL = "email"
    PUSH = "push"
    SMS = "sms"
    WEBHOOK = "webhook"


class NotificationPriority(str, Enum):
    """Notification priority levels."""
    
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class Notification(BaseModel):
    """Core notification model.
    
    Stores all notifications with flexible delivery options
    and tracking capabilities.
    """
    
    __tablename__ = "notifications"
    
    # Notification content
    type: NotificationType = Column(
        SQLEnum(NotificationType),
        nullable=False,
        index=True
    )
    title: str = Column(String(200), nullable=False)
    body: str = Column(Text, nullable=False)
    
    # Rich content
    data: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    action_url: Optional[str] = Column(String(500), nullable=True)
    image_url: Optional[str] = Column(String(500), nullable=True)
    
    # Priority and timing
    priority: NotificationPriority = Column(
        SQLEnum(NotificationPriority),
        default=NotificationPriority.NORMAL,
        nullable=False
    )
    expires_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Delivery status
    channels: List[str] = Column(JSON, default=list, nullable=False)
    delivered_channels: List[str] = Column(JSON, default=list, nullable=False)
    
    # Read status
    is_read: bool = Column(Boolean, default=False, nullable=False, index=True)
    read_at: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
    
    # Grouping
    group_key: Optional[str] = Column(String(100), nullable=True, index=True)
    
    # Recipients
    recipient_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    sender_id: Optional[int] = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=True
    )
    
    # Context
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Relationships
    recipient = relationship("Member", foreign_keys=[recipient_id])
    sender = relationship("Member", foreign_keys=[sender_id])
    community = relationship("Community")
    deliveries = relationship("NotificationDelivery", back_populates="notification")


class NotificationDelivery(BaseModel):
    """Tracks delivery status for each notification channel."""
    
    __tablename__ = "notification_deliveries"
    
    notification_id: int = Column(
        Integer,
        ForeignKey("notifications.id"),
        nullable=False,
        index=True
    )
    
    channel: NotificationChannel = Column(
        SQLEnum(NotificationChannel),
        nullable=False
    )
    
    # Delivery status
    delivered: bool = Column(Boolean, default=False, nullable=False)
    delivered_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    failed: bool = Column(Boolean, default=False, nullable=False)
    failed_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    error_message: Optional[str] = Column(String(500), nullable=True)
    
    # Channel-specific data
    channel_data: Dict[str, Any] = Column(JSON, default=dict)
    
    # Relationships
    notification = relationship("Notification", back_populates="deliveries")


class NotificationPreference(BaseModel):
    """Member notification preferences."""
    
    __tablename__ = "notification_preferences"
    
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    
    # Global settings
    enabled: bool = Column(Boolean, default=True, nullable=False)
    quiet_hours_start: Optional[str] = Column(String(5), nullable=True)  # HH:MM
    quiet_hours_end: Optional[str] = Column(String(5), nullable=True)
    timezone: str = Column(String(50), default="UTC", nullable=False)
    
    # Channel preferences by notification type
    preferences: Dict[str, Dict[str, bool]] = Column(
        JSON,
        default=dict,
        nullable=False
    )
    """
    Example structure:
    {
        "mention": {
            "in_app": true,
            "email": true,
            "push": true
        },
        "new_post": {
            "in_app": true,
            "email": false,
            "push": false
        }
    }
    """
    
    # Email settings
    email_frequency: str = Column(
        String(20),
        default="instant",
        nullable=False
    )  # instant, daily, weekly
    
    # Push settings
    push_sound: bool = Column(Boolean, default=True, nullable=False)
    push_vibrate: bool = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    member = relationship("Member")


class EmailTemplate(BaseModel):
    """Email templates for notifications."""
    
    __tablename__ = "email_templates"
    
    name: str = Column(String(100), unique=True, nullable=False)
    subject: str = Column(String(200), nullable=False)
    
    # Template content
    html_template: str = Column(Text, nullable=False)
    text_template: str = Column(Text, nullable=False)
    
    # Variables available in template
    available_variables: List[str] = Column(JSON, default=list)
    
    # Metadata
    category: str = Column(String(50), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    
    # Preview data for testing
    preview_data: Dict[str, Any] = Column(JSON, default=dict)


class NotificationService:
    """Service for managing notifications."""
    
    def __init__(
        self,
        session: Session,
        email_service: Optional[Any] = None,
        push_service: Optional[Any] = None
    ):
        """Initialize notification service.
        
        Args:
            session: Database session.
            email_service: Email delivery service.
            push_service: Push notification service.
        """
        self.session = session
        self.email_service = email_service
        self.push_service = push_service
    
    async def create_notification(
        self,
        recipient_id: int,
        type: NotificationType,
        title: str,
        body: str,
        data: Optional[Dict[str, Any]] = None,
        sender_id: Optional[int] = None,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        channels: Optional[List[NotificationChannel]] = None
    ) -> Notification:
        """Create and deliver a notification.
        
        Args:
            recipient_id: Recipient member ID.
            type: Notification type.
            title: Notification title.
            body: Notification body.
            data: Additional data.
            sender_id: Sender member ID.
            priority: Notification priority.
            channels: Delivery channels to use.
            
        Returns:
            Created notification.
        """
        # Get recipient preferences
        preferences = await self._get_preferences(recipient_id)
        
        # Determine channels if not specified
        if not channels:
            channels = await self._determine_channels(
                recipient_id,
                type,
                preferences
            )
        
        # Create notification
        notification = Notification(
            recipient_id=recipient_id,
            type=type,
            title=title,
            body=body,
            data=data or {},
            sender_id=sender_id,
            priority=priority,
            channels=[c.value for c in channels]
        )
        
        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)
        
        # Deliver through each channel
        for channel in channels:
            await self._deliver_notification(notification, channel)
        
        return notification
    
    async def _deliver_notification(
        self,
        notification: Notification,
        channel: NotificationChannel
    ) -> None:
        """Deliver notification through specific channel.
        
        Args:
            notification: Notification to deliver.
            channel: Delivery channel.
        """
        delivery = NotificationDelivery(
            notification_id=notification.id,
            channel=channel
        )
        
        try:
            if channel == NotificationChannel.IN_APP:
                # In-app notifications are created by default
                delivery.delivered = True
                delivery.delivered_at = datetime.utcnow()
                
                # Send real-time update if connected
                await self._send_realtime_notification(notification)
            
            elif channel == NotificationChannel.EMAIL:
                await self._send_email_notification(notification)
                delivery.delivered = True
                delivery.delivered_at = datetime.utcnow()
            
            elif channel == NotificationChannel.PUSH:
                await self._send_push_notification(notification)
                delivery.delivered = True
                delivery.delivered_at = datetime.utcnow()
            
            elif channel == NotificationChannel.SMS:
                await self._send_sms_notification(notification)
                delivery.delivered = True
                delivery.delivered_at = datetime.utcnow()
            
            elif channel == NotificationChannel.WEBHOOK:
                await self._send_webhook_notification(notification)
                delivery.delivered = True
                delivery.delivered_at = datetime.utcnow()
        
        except Exception as e:
            delivery.failed = True
            delivery.failed_at = datetime.utcnow()
            delivery.error_message = str(e)
        
        self.session.add(delivery)
        self.session.commit()
        
        # Update notification delivery status
        if delivery.delivered:
            notification.delivered_channels.append(channel.value)
            self.session.commit()
    
    async def _send_email_notification(
        self,
        notification: Notification
    ) -> None:
        """Send email notification.
        
        Args:
            notification: Notification to send.
        """
        if not self.email_service:
            return
        
        # Get email template
        template_name = f"notification_{notification.type.value}"
        template = self.session.query(EmailTemplate).filter(
            EmailTemplate.name == template_name,
            EmailTemplate.is_active == True
        ).first()
        
        if not template:
            # Use default template
            template = self.session.query(EmailTemplate).filter(
                EmailTemplate.name == "notification_default"
            ).first()
        
        if not template:
            raise ValueError("No email template found")
        
        # Prepare template variables
        variables = {
            "recipient_name": notification.recipient.display_name,
            "title": notification.title,
            "body": notification.body,
            "action_url": notification.action_url,
            "sender_name": notification.sender.display_name if notification.sender else "System",
            **notification.data
        }
        
        # Render templates
        from jinja2 import Template
        
        html_template = Template(template.html_template)
        text_template = Template(template.text_template)
        subject_template = Template(template.subject)
        
        html_content = html_template.render(**variables)
        text_content = text_template.render(**variables)
        subject = subject_template.render(**variables)
        
        # Send email
        await self.email_service.send_email(
            to=notification.recipient.email,
            subject=subject,
            html_body=html_content,
            text_body=text_content
        )
    
    async def mark_as_read(
        self,
        notification_id: int,
        member_id: int
    ) -> None:
        """Mark notification as read.
        
        Args:
            notification_id: Notification ID.
            member_id: Member marking as read.
        """
        notification = self.session.query(Notification).filter(
            Notification.id == notification_id,
            Notification.recipient_id == member_id
        ).first()
        
        if notification and not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            self.session.commit()
    
    async def get_unread_count(
        self,
        member_id: int,
        community_id: Optional[int] = None
    ) -> int:
        """Get unread notification count.
        
        Args:
            member_id: Member ID.
            community_id: Optional community filter.
            
        Returns:
            Count of unread notifications.
        """
        query = self.session.query(Notification).filter(
            Notification.recipient_id == member_id,
            Notification.is_read == False,
            Notification.is_deleted == False
        )
        
        if community_id:
            query = query.filter(Notification.community_id == community_id)
        
        return query.count()
```

## 8. Analytics & Reporting

### 8.1 Analytics Models

```python
"""Analytics and reporting system for community insights.

Tracks user behavior, content performance, community health,
and provides comprehensive reporting capabilities.
"""
from datetime import datetime, date, timedelta
from decimal import Decimal
from enum import Enum
from typing import Dict, List, Optional, Any, Tuple

from sqlalchemy import (
    Column, String, Boolean, Integer, Float, ForeignKey,
    DateTime, Date, JSON, Enum as SQLEnum, func
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel


class MetricType(str, Enum):
    """Types of metrics tracked."""
    
    # User metrics
    DAILY_ACTIVE_USERS = "daily_active_users"
    MONTHLY_ACTIVE_USERS = "monthly_active_users"
    NEW_MEMBERS = "new_members"
    MEMBER_RETENTION = "member_retention"
    
    # Content metrics
    POSTS_CREATED = "posts_created"
    ENGAGEMENT_RATE = "engagement_rate"
    AVG_READ_TIME = "avg_read_time"
    CONTENT_VIEWS = "content_views"
    
    # Community metrics
    COMMUNITY_HEALTH = "community_health"
    GROWTH_RATE = "growth_rate"
    CHURN_RATE = "churn_rate"
    
    # Revenue metrics
    REVENUE = "revenue"
    MRR = "mrr"
    LTV = "ltv"
    ARPU = "arpu"


class AnalyticsEvent(BaseModel):
    """Raw analytics events for processing.
    
    Stores all user interactions and system events
    for analytics processing.
    """
    
    __tablename__ = "analytics_events"
    
    # Event identification
    event_name: str = Column(String(100), nullable=False, index=True)
    event_category: str = Column(String(50), nullable=False, index=True)
    
    # Event data
    properties: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    
    # User context
    member_id: Optional[int] = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=True,
        index=True
    )
    session_id: Optional[str] = Column(String(100), nullable=True, index=True)
    
    # Device/platform context
    platform: Optional[str] = Column(String(20), nullable=True)
    device_type: Optional[str] = Column(String(20), nullable=True)
    browser: Optional[str] = Column(String(50), nullable=True)
    ip_address: Optional[str] = Column(String(45), nullable=True)
    country: Optional[str] = Column(String(2), nullable=True)
    
    # Community context
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True,
        index=True
    )
    
    # Relationships
    member = relationship("Member")
    community = relationship("Community")


class DailyMetric(BaseModel):
    """Aggregated daily metrics."""
    
    __tablename__ = "daily_metrics"
    
    date: date = Column(Date, nullable=False, index=True)
    metric_type: MetricType = Column(
        SQLEnum(MetricType),
        nullable=False,
        index=True
    )
    
    # Metric values
    value: float = Column(Float, nullable=False)
    previous_value: Optional[float] = Column(Float, nullable=True)
    change_percentage: Optional[float] = Column(Float, nullable=True)
    
    # Dimensions
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True,
        index=True
    )
    
    # Additional data
    metadata: Dict[str, Any] = Column(JSON, default=dict)
    
    # Relationships
    community = relationship("Community")
    
    __table_args__ = (
        UniqueConstraint('date', 'metric_type', 'community_id'),
    )


class UserSession(BaseModel):
    """User session tracking for analytics."""
    
    __tablename__ = "user_sessions"
    
    session_id: str = Column(String(100), unique=True, nullable=False)
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    
    # Session timing
    started_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
    ended_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    duration_seconds: Optional[int] = Column(Integer, nullable=True)
    
    # Session activity
    page_views: int = Column(Integer, default=0, nullable=False)
    actions_count: int = Column(Integer, default=0, nullable=False)
    
    # Context
    entry_page: Optional[str] = Column(String(200), nullable=True)
    exit_page: Optional[str] = Column(String(200), nullable=True)
    referrer: Optional[str] = Column(String(500), nullable=True)
    
    # Device info
    device_info: Dict[str, Any] = Column(JSON, default=dict)
    
    # Relationships
    member = relationship("Member")


class ContentAnalytics(BaseModel):
    """Analytics for individual content pieces."""
    
    __tablename__ = "content_analytics"
    
    content_id: int = Column(
        Integer,
        ForeignKey("content.id"),
        nullable=False,
        index=True
    )
    date: date = Column(Date, nullable=False, index=True)
    
    # View metrics
    views: int = Column(Integer, default=0, nullable=False)
    unique_views: int = Column(Integer, default=0, nullable=False)
    
    # Engagement metrics
    reactions: int = Column(Integer, default=0, nullable=False)
    comments: int = Column(Integer, default=0, nullable=False)
    shares: int = Column(Integer, default=0, nullable=False)
    bookmarks: int = Column(Integer, default=0, nullable=False)
    
    # Time metrics
    total_read_time: int = Column(Integer, default=0, nullable=False)  # seconds
    avg_read_time: float = Column(Float, default=0.0, nullable=False)
    bounce_rate: float = Column(Float, default=0.0, nullable=False)
    
    # Relationships
    content = relationship("Content")
    
    __table_args__ = (
        UniqueConstraint('content_id', 'date'),
    )


class CommunityHealthScore(BaseModel):
    """Community health tracking over time."""
    
    __tablename__ = "community_health_scores"
    
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    date: date = Column(Date, nullable=False, index=True)
    
    # Overall health score (0-100)
    overall_score: float = Column(Float, nullable=False)
    
    # Component scores
    activity_score: float = Column(Float, nullable=False)
    engagement_score: float = Column(Float, nullable=False)
    retention_score: float = Column(Float, nullable=False)
    growth_score: float = Column(Float, nullable=False)
    content_quality_score: float = Column(Float, nullable=False)
    
    # Key metrics
    metrics: Dict[str, Any] = Column(JSON, default=dict)
    
    # Recommendations
    recommendations: List[str] = Column(JSON, default=list)
    
    # Relationships
    community = relationship("Community")
    
    __table_args__ = (
        UniqueConstraint('community_id', 'date'),
    )


class AnalyticsService:
    """Service for analytics and reporting."""
    
    def __init__(self, session: Session):
        """Initialize analytics service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def track_event(
        self,
        event_name: str,
        event_category: str,
        member_id: Optional[int] = None,
        properties: Optional[Dict[str, Any]] = None,
        session_id: Optional[str] = None,
        community_id: Optional[int] = None
    ) -> AnalyticsEvent:
        """Track an analytics event.
        
        Args:
            event_name: Name of the event.
            event_category: Event category.
            member_id: Member performing action.
            properties: Event properties.
            session_id: Session identifier.
            community_id: Community context.
            
        Returns:
            Created event.
        """
        event = AnalyticsEvent(
            event_name=event_name,
            event_category=event_category,
            member_id=member_id,
            properties=properties or {},
            session_id=session_id,
            community_id=community_id
        )
        
        self.session.add(event)
        self.session.commit()
        
        # Process real-time metrics if needed
        await self._process_realtime_metrics(event)
        
        return event
    
    async def calculate_daily_metrics(
        self,
        target_date: Optional[date] = None
    ) -> None:
        """Calculate and store daily metrics.
        
        Args:
            target_date: Date to calculate for (default: yesterday).
        """
        if not target_date:
            target_date = date.today() - timedelta(days=1)
        
        # Calculate each metric type
        metrics_to_calculate = [
            (MetricType.DAILY_ACTIVE_USERS, self._calculate_dau),
            (MetricType.NEW_MEMBERS, self._calculate_new_members),
            (MetricType.POSTS_CREATED, self._calculate_posts_created),
            (MetricType.ENGAGEMENT_RATE, self._calculate_engagement_rate),
        ]
        
        for metric_type, calculator in metrics_to_calculate:
            # Calculate globally
            value = await calculator(target_date)
            await self._store_metric(
                target_date,
                metric_type,
                value,
                community_id=None
            )
            
            # Calculate per community
            communities = self.session.query(Community).filter(
                Community.is_active == True
            ).all()
            
            for community in communities:
                value = await calculator(target_date, community.id)
                await self._store_metric(
                    target_date,
                    metric_type,
                    value,
                    community_id=community.id
                )
    
    async def _calculate_dau(
        self,
        target_date: date,
        community_id: Optional[int] = None
    ) -> int:
        """Calculate daily active users.
        
        Args:
            target_date: Date to calculate for.
            community_id: Optional community filter.
            
        Returns:
            Number of daily active users.
        """
        query = self.session.query(
            func.count(func.distinct(AnalyticsEvent.member_id))
        ).filter(
            func.date(AnalyticsEvent.created_at) == target_date,
            AnalyticsEvent.member_id.isnot(None)
        )
        
        if community_id:
            query = query.filter(AnalyticsEvent.community_id == community_id)
        
        return query.scalar() or 0
    
    async def get_community_dashboard(
        self,
        community_id: int,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """Get comprehensive dashboard data for a community.
        
        Args:
            community_id: Community to analyze.
            start_date: Period start.
            end_date: Period end.
            
        Returns:
            Dashboard data with metrics and visualizations.
        """
        # Get community
        community = self.session.query(Community).get(community_id)
        if not community:
            raise ValueError("Community not found")
        
        # Current period metrics
        current_metrics = await self._get_period_metrics(
            community_id,
            start_date,
            end_date
        )
        
        # Previous period for comparison
        period_length = (end_date - start_date).days
        prev_start = start_date - timedelta(days=period_length)
        prev_end = start_date - timedelta(days=1)
        
        previous_metrics = await self._get_period_metrics(
            community_id,
            prev_start,
            prev_end
        )
        
        # Calculate changes
        metrics_with_change = {}
        for key, current_value in current_metrics.items():
            previous_value = previous_metrics.get(key, 0)
            
            if previous_value > 0:
                change_percentage = ((current_value - previous_value) / previous_value) * 100
            else:
                change_percentage = 100 if current_value > 0 else 0
            
            metrics_with_change[key] = {
                "value": current_value,
                "previous_value": previous_value,
                "change_percentage": round(change_percentage, 2)
            }
        
        # Get time series data
        time_series = await self._get_time_series_data(
            community_id,
            start_date,
            end_date
        )
        
        # Top content
        top_content = await self._get_top_content(
            community_id,
            start_date,
            end_date,
            limit=10
        )
        
        # Active members
        active_members = await self._get_most_active_members(
            community_id,
            start_date,
            end_date,
            limit=10
        )
        
        # Health score
        latest_health = self.session.query(CommunityHealthScore).filter(
            CommunityHealthScore.community_id == community_id
        ).order_by(
            CommunityHealthScore.date.desc()
        ).first()
        
        return {
            "community": {
                "id": community.id,
                "name": community.name,
                "member_count": community.member_count
            },
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "metrics": metrics_with_change,
            "time_series": time_series,
            "top_content": top_content,
            "active_members": active_members,
            "health_score": {
                "overall": latest_health.overall_score if latest_health else None,
                "components": {
                    "activity": latest_health.activity_score if latest_health else None,
                    "engagement": latest_health.engagement_score if latest_health else None,
                    "retention": latest_health.retention_score if latest_health else None,
                    "growth": latest_health.growth_score if latest_health else None,
                    "content_quality": latest_health.content_quality_score if latest_health else None
                },
                "recommendations": latest_health.recommendations if latest_health else []
            }
        }
    
    async def calculate_community_health(
        self,
        community_id: int,
        target_date: Optional[date] = None
    ) -> CommunityHealthScore:
        """Calculate community health score.
        
        Args:
            community_id: Community to analyze.
            target_date: Date to calculate for.
            
        Returns:
            Community health score.
        """
        if not target_date:
            target_date = date.today()
        
        # Calculate component scores
        activity_score = await self._calculate_activity_score(community_id, target_date)
        engagement_score = await self._calculate_engagement_score(community_id, target_date)
        retention_score = await self._calculate_retention_score(community_id, target_date)
        growth_score = await self._calculate_growth_score(community_id, target_date)
        content_quality_score = await self._calculate_content_quality_score(community_id, target_date)
        
        # Calculate overall score (weighted average)
        weights = {
            "activity": 0.25,
            "engagement": 0.25,
            "retention": 0.20,
            "growth": 0.15,
            "content_quality": 0.15
        }
        
        overall_score = (
            activity_score * weights["activity"] +
            engagement_score * weights["engagement"] +
            retention_score * weights["retention"] +
            growth_score * weights["growth"] +
            content_quality_score * weights["content_quality"]
        )
        
        # Generate recommendations
        recommendations = []
        
        if activity_score < 50:
            recommendations.append("Increase member activity through challenges and events")
        
        if engagement_score < 50:
            recommendations.append("Encourage more interactions with gamification features")
        
        if retention_score < 50:
            recommendations.append("Focus on member retention with personalized content")
        
        if growth_score < 50:
            recommendations.append("Implement referral programs to boost growth")
        
        if content_quality_score < 50:
            recommendations.append("Improve content quality with moderation and guidelines")
        
        # Store health score
        health_score = CommunityHealthScore(
            community_id=community_id,
            date=target_date,
            overall_score=overall_score,
            activity_score=activity_score,
            engagement_score=engagement_score,
            retention_score=retention_score,
            growth_score=growth_score,
            content_quality_score=content_quality_score,
            recommendations=recommendations,
            metrics={
                "dau": await self._calculate_dau(target_date, community_id),
                "wau": await self._calculate_wau(target_date, community_id),
                "mau": await self._calculate_mau(target_date, community_id)
            }
        )
        
        # Check for existing score
        existing = self.session.query(CommunityHealthScore).filter(
            CommunityHealthScore.community_id == community_id,
            CommunityHealthScore.date == target_date
        ).first()
        
        if existing:
            # Update existing
            for key, value in health_score.__dict__.items():
                if not key.startswith('_'):
                    setattr(existing, key, value)
        else:
            self.session.add(health_score)
        
        self.session.commit()
        
        return health_score


## 9. File Upload & Media Management

### 9.1 Media Management Models

```python
"""File upload and media management system.

Handles file uploads, image processing, CDN integration,
and media organization with security features.
"""
import hashlib
import mimetypes
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Any, BinaryIO

from PIL import Image
from sqlalchemy import (
    Column, String, Boolean, Integer, ForeignKey,
    DateTime, JSON, Enum as SQLEnum, BigInteger
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel


class MediaType(str, Enum):
    """Types of media files."""
    
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"
    ARCHIVE = "archive"
    OTHER = "other"


class MediaStatus(str, Enum):
    """Media processing status."""
    
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"
    DELETED = "deleted"


class StorageProvider(str, Enum):
    """Storage backend providers."""
    
    LOCAL = "local"
    S3 = "s3"
    CLOUDINARY = "cloudinary"
    GCS = "gcs"  # Google Cloud Storage
    AZURE = "azure"


class MediaFile(BaseModel):
    """Core media file model.
    
    Tracks all uploaded files with metadata, processing
    status, and CDN information.
    """
    
    __tablename__ = "media_files"
    
    # File identification
    filename: str = Column(String(255), nullable=False)
    original_filename: str = Column(String(255), nullable=False)
    file_hash: str = Column(String(64), unique=True, nullable=False)  # SHA-256
    
    # File properties
    file_size: int = Column(BigInteger, nullable=False)  # bytes
    mime_type: str = Column(String(100), nullable=False)
    media_type: MediaType = Column(
        SQLEnum(MediaType),
        nullable=False,
        index=True
    )
    
    # Storage information
    storage_provider: StorageProvider = Column(
        SQLEnum(StorageProvider),
        nullable=False
    )
    storage_path: str = Column(String(500), nullable=False)
    storage_key: str = Column(String(500), unique=True, nullable=False)
    cdn_url: Optional[str] = Column(String(500), nullable=True)
    
    # Processing status
    status: MediaStatus = Column(
        SQLEnum(MediaStatus),
        default=MediaStatus.PENDING,
        nullable=False,
        index=True
    )
    processing_metadata: Dict[str, Any] = Column(JSON, default=dict)
    
    # Image-specific metadata
    width: Optional[int] = Column(Integer, nullable=True)
    height: Optional[int] = Column(Integer, nullable=True)
    
    # Video-specific metadata
    duration_seconds: Optional[int] = Column(Integer, nullable=True)
    
    # Security
    is_public: bool = Column(Boolean, default=False, nullable=False)
    scan_status: Optional[str] = Column(String(20), nullable=True)
    scan_results: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    
    # Usage tracking
    download_count: int = Column(Integer, default=0, nullable=False)
    last_accessed_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Owner information
    uploaded_by_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True,
        index=True
    )
    
    # Relationships
    uploaded_by = relationship("Member")
    community = relationship("Community")
    thumbnails = relationship("MediaThumbnail", back_populates="media_file")
    
    def get_url(self, variant: Optional[str] = None) -> str:
        """Get URL for media file or variant.
        
        Args:
            variant: Thumbnail variant name.
            
        Returns:
            URL to access the file.
        """
        if variant and self.thumbnails:
            thumbnail = next(
                (t for t in self.thumbnails if t.variant == variant),
                None
            )
            if thumbnail:
                return thumbnail.cdn_url or thumbnail.storage_path
        
        return self.cdn_url or self.storage_path


class MediaThumbnail(BaseModel):
    """Thumbnails and variants of media files."""
    
    __tablename__ = "media_thumbnails"
    
    media_file_id: int = Column(
        Integer,
        ForeignKey("media_files.id"),
        nullable=False,
        index=True
    )
    
    # Variant information
    variant: str = Column(String(50), nullable=False)  # thumb, medium, large, etc.
    width: int = Column(Integer, nullable=False)
    height: int = Column(Integer, nullable=False)
    
    # Storage
    storage_path: str = Column(String(500), nullable=False)
    storage_key: str = Column(String(500), unique=True, nullable=False)
    cdn_url: Optional[str] = Column(String(500), nullable=True)
    file_size: int = Column(Integer, nullable=False)
    
    # Format
    format: str = Column(String(10), nullable=False)  # jpg, png, webp
    quality: int = Column(Integer, default=85, nullable=False)
    
    # Relationships
    media_file = relationship("MediaFile", back_populates="thumbnails")
    
    __table_args__ = (
        UniqueConstraint('media_file_id', 'variant'),
    )


class MediaCollection(BaseModel):
    """Collections for organizing media files."""
    
    __tablename__ = "media_collections"
    
    name: str = Column(String(100), nullable=False)
    description: Optional[str] = Column(String(500), nullable=True)
    
    # Collection settings
    is_public: bool = Column(Boolean, default=False, nullable=False)
    allow_downloads: bool = Column(Boolean, default=True, nullable=False)
    
    # Organization
    tags: List[str] = Column(JSON, default=list)
    
    # Owner
    owner_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Relationships
    owner = relationship("Member")
    community = relationship("Community")
    items = relationship("MediaCollectionItem", back_populates="collection")


class UploadPolicy(BaseModel):
    """Upload policies for communities."""
    
    __tablename__ = "upload_policies"
    
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        unique=True,
        nullable=False
    )
    
    # Size limits (bytes)
    max_file_size: int = Column(BigInteger, default=10485760, nullable=False)  # 10MB
    max_image_size: int = Column(BigInteger, default=5242880, nullable=False)  # 5MB
    max_video_size: int = Column(BigInteger, default=104857600, nullable=False)  # 100MB
    
    # Allowed types
    allowed_image_types: List[str] = Column(
        JSON,
        default=["image/jpeg", "image/png", "image/gif", "image/webp"]
    )
    allowed_video_types: List[str] = Column(
        JSON,
        default=["video/mp4", "video/webm"]
    )
    allowed_document_types: List[str] = Column(
        JSON,
        default=["application/pdf", "application/msword", "text/plain"]
    )
    
    # Processing settings
    auto_optimize_images: bool = Column(Boolean, default=True, nullable=False)
    generate_thumbnails: bool = Column(Boolean, default=True, nullable=False)
    scan_for_malware: bool = Column(Boolean, default=True, nullable=False)
    
    # Thumbnail sizes
    thumbnail_sizes: List[Dict[str, int]] = Column(
        JSON,
        default=[
            {"name": "thumb", "width": 150, "height": 150},
            {"name": "medium", "width": 500, "height": 500},
            {"name": "large", "width": 1200, "height": 1200}
        ]
    )
    
    # Storage settings
    storage_provider: StorageProvider = Column(
        SQLEnum(StorageProvider),
        default=StorageProvider.S3,
        nullable=False
    )
    
    # Retention
    retention_days: Optional[int] = Column(Integer, nullable=True)
    
    # Relationships
    community = relationship("Community", uselist=False)


class MediaService:
    """Service for media file management."""
    
    def __init__(
        self,
        session: Session,
        storage_client: Optional[Any] = None,
        cdn_client: Optional[Any] = None
    ):
        """Initialize media service.
        
        Args:
            session: Database session.
            storage_client: Storage backend client.
            cdn_client: CDN client.
        """
        self.session = session
        self.storage_client = storage_client
        self.cdn_client = cdn_client
    
    async def upload_file(
        self,
        file: BinaryIO,
        filename: str,
        member_id: int,
        community_id: Optional[int] = None,
        is_public: bool = False
    ) -> MediaFile:
        """Upload a file with processing.
        
        Args:
            file: File object to upload.
            filename: Original filename.
            member_id: Uploading member.
            community_id: Community context.
            is_public: Whether file is publicly accessible.
            
        Returns:
            Created media file record.
            
        Raises:
            ValueError: If file validation fails.
        """
        # Get upload policy
        policy = await self._get_upload_policy(community_id)
        
        # Read file data
        file_data = file.read()
        file_size = len(file_data)
        
        # Calculate hash
        file_hash = hashlib.sha256(file_data).hexdigest()
        
        # Check for existing file
        existing = self.session.query(MediaFile).filter(
            MediaFile.file_hash == file_hash
        ).first()
        
        if existing:
            # Deduplicate - return existing file
            return existing
        
        # Determine file type
        mime_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
        media_type = self._get_media_type(mime_type)
        
        # Validate file
        await self._validate_file(
            file_data,
            file_size,
            mime_type,
            media_type,
            policy
        )
        
        # Generate storage key
        storage_key = self._generate_storage_key(
            filename,
            file_hash,
            member_id,
            community_id
        )
        
        # Create media record
        media_file = MediaFile(
            filename=self._sanitize_filename(filename),
            original_filename=filename,
            file_hash=file_hash,
            file_size=file_size,
            mime_type=mime_type,
            media_type=media_type,
            storage_provider=policy.storage_provider,
            storage_path="",  # Will be updated after upload
            storage_key=storage_key,
            uploaded_by_id=member_id,
            community_id=community_id,
            is_public=is_public,
            status=MediaStatus.PROCESSING
        )
        
        self.session.add(media_file)
        self.session.commit()
        
        try:
            # Upload to storage
            storage_path = await self._upload_to_storage(
                file_data,
                storage_key,
                mime_type,
                policy.storage_provider
            )
            
            media_file.storage_path = storage_path
            
            # Process based on type
            if media_type == MediaType.IMAGE:
                await self._process_image(media_file, file_data, policy)
            elif media_type == MediaType.VIDEO:
                await self._process_video(media_file, file_data, policy)
            
            # Scan for malware if enabled
            if policy.scan_for_malware:
                await self._scan_file(media_file, file_data)
            
            # Upload to CDN if configured
            if self.cdn_client and is_public:
                cdn_url = await self._upload_to_cdn(media_file)
                media_file.cdn_url = cdn_url
            
            media_file.status = MediaStatus.READY
            
        except Exception as e:
            media_file.status = MediaStatus.FAILED
            media_file.processing_metadata["error"] = str(e)
            raise
        
        finally:
            self.session.commit()
        
        return media_file
    
    async def _process_image(
        self,
        media_file: MediaFile,
        file_data: bytes,
        policy: UploadPolicy
    ) -> None:
        """Process uploaded image.
        
        Args:
            media_file: Media file record.
            file_data: Raw file data.
            policy: Upload policy.
        """
        # Open image
        image = Image.open(BytesIO(file_data))
        
        # Store dimensions
        media_file.width = image.width
        media_file.height = image.height
        
        # Auto-optimize if enabled
        if policy.auto_optimize_images:
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA', 'P'):
                rgb_image = Image.new('RGB', image.size, (255, 255, 255))
                rgb_image.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = rgb_image
        
        # Generate thumbnails
        if policy.generate_thumbnails:
            for size_config in policy.thumbnail_sizes:
                thumbnail = await self._generate_thumbnail(
                    media_file,
                    image,
                    size_config["name"],
                    size_config["width"],
                    size_config["height"]
                )
                
                self.session.add(thumbnail)
    
    async def _generate_thumbnail(
        self,
        media_file: MediaFile,
        image: Image,
        variant: str,
        max_width: int,
        max_height: int
    ) -> MediaThumbnail:
        """Generate image thumbnail.
        
        Args:
            media_file: Parent media file.
            image: PIL Image object.
            variant: Thumbnail variant name.
            max_width: Maximum width.
            max_height: Maximum height.
            
        Returns:
            Created thumbnail record.
        """
        # Calculate dimensions maintaining aspect ratio
        image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Save to buffer
        buffer = BytesIO()
        image.save(buffer, format='JPEG', quality=85, optimize=True)
        thumbnail_data = buffer.getvalue()
        
        # Generate storage key
        storage_key = f"{media_file.storage_key}/thumbnails/{variant}.jpg"
        
        # Upload thumbnail
        storage_path = await self._upload_to_storage(
            thumbnail_data,
            storage_key,
            "image/jpeg",
            media_file.storage_provider
        )
        
        # Create thumbnail record
        thumbnail = MediaThumbnail(
            media_file_id=media_file.id,
            variant=variant,
            width=image.width,
            height=image.height,
            storage_path=storage_path,
            storage_key=storage_key,
            file_size=len(thumbnail_data),
            format="jpg",
            quality=85
        )
        
        # Upload to CDN if parent is public
        if media_file.is_public and self.cdn_client:
            thumbnail.cdn_url = await self._upload_to_cdn_raw(
                thumbnail_data,
                storage_key,
                "image/jpeg"
            )
        
        return thumbnail
    
    async def delete_file(
        self,
        media_file_id: int,
        member_id: int,
        hard_delete: bool = False
    ) -> None:
        """Delete a media file.
        
        Args:
            media_file_id: File to delete.
            member_id: Member requesting deletion.
            hard_delete: Whether to permanently delete.
            
        Raises:
            ValueError: If file not found or unauthorized.
        """
        media_file = self.session.query(MediaFile).get(media_file_id)
        
        if not media_file:
            raise ValueError("Media file not found")
        
        # Check permissions
        if media_file.uploaded_by_id != member_id:
            # Check if member is admin
            member = self.session.query(Member).get(member_id)
            if not member or member.role != "admin":
                raise ValueError("Unauthorized to delete this file")
        
        if hard_delete:
            # Delete from storage
            await self._delete_from_storage(
                media_file.storage_key,
                media_file.storage_provider
            )
            
            # Delete thumbnails
            for thumbnail in media_file.thumbnails:
                await self._delete_from_storage(
                    thumbnail.storage_key,
                    media_file.storage_provider
                )
            
            # Delete from CDN
            if media_file.cdn_url and self.cdn_client:
                await self._delete_from_cdn(media_file.storage_key)
            
            # Hard delete from database
            self.session.delete(media_file)
        else:
            # Soft delete
            media_file.soft_delete()
            media_file.status = MediaStatus.DELETED
        
        self.session.commit()
    
    def _get_media_type(self, mime_type: str) -> MediaType:
        """Determine media type from MIME type.
        
        Args:
            mime_type: MIME type string.
            
        Returns:
            Media type enum value.
        """
        if mime_type.startswith("image/"):
            return MediaType.IMAGE
        elif mime_type.startswith("video/"):
            return MediaType.VIDEO
        elif mime_type.startswith("audio/"):
            return MediaType.AUDIO
        elif mime_type in [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument",
            "text/plain"
        ]:
            return MediaType.DOCUMENT
        elif mime_type in ["application/zip", "application/x-rar"]:
            return MediaType.ARCHIVE
        else:
            return MediaType.OTHER
    
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for storage.
        
        Args:
            filename: Original filename.
            
        Returns:
            Sanitized filename.
        """
        import re
        
        # Remove path components
        filename = Path(filename).name
        
        # Replace special characters
        filename = re.sub(r'[^\w\s.-]', '', filename)
        filename = re.sub(r'\s+', '-', filename)
        
        # Limit length
        name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
        if len(name) > 100:
            name = name[:100]
        
        return f"{name}.{ext}" if ext else name


## 10. Search & Discovery

### 10.1 Search Implementation

```python
"""Full-text search and discovery system.

Implements PostgreSQL full-text search with ranking,
faceted search, and AI-powered recommendations.
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Tuple

from sqlalchemy import (
    Column, String, Integer, Float, ForeignKey,
    DateTime, JSON, func, text, and_, or_
)
from sqlalchemy.dialects.postgresql import TSVECTOR, TSQUERY
from sqlalchemy.orm import Session

from pycommunity.core.models import BaseModel


class SearchableType(str, Enum):
    """Types of searchable content."""
    
    MEMBER = "member"
    CONTENT = "content"
    COMMUNITY = "community"
    EVENT = "event"
    COMMENT = "comment"


class SearchIndex(BaseModel):
    """Search index for all searchable content.
    
    Centralized search index with weighted fields
    and faceted search support.
    """
    
    __tablename__ = "search_index"
    
    # Object reference
    object_type: SearchableType = Column(
        SQLEnum(SearchableType),
        nullable=False,
        index=True
    )
    object_id: int = Column(Integer, nullable=False, index=True)
    
    # Search fields with different weights
    title: Optional[str] = Column(String(500), nullable=True)
    content: Optional[str] = Column(Text, nullable=True)
    tags: List[str] = Column(JSON, default=list)
    
    # Full-text search vectors
    title_vector: Optional[TSVECTOR] = Column(TSVECTOR, nullable=True)
    content_vector: Optional[TSVECTOR] = Column(TSVECTOR, nullable=True)
    
    # Facets for filtering
    community_id: Optional[int] = Column(Integer, index=True)
    author_id: Optional[int] = Column(Integer, index=True)
    created_at: datetime = Column(DateTime(timezone=True), index=True)
    
    # Scoring factors
    popularity_score: float = Column(Float, default=0.0)
    quality_score: float = Column(Float, default=0.0)
    recency_score: float = Column(Float, default=0.0)
    
    # Metadata
    metadata: Dict[str, Any] = Column(JSON, default=dict)
    
    __table_args__ = (
        UniqueConstraint('object_type', 'object_id'),
        Index('idx_search_vectors', 'title_vector', 'content_vector', postgresql_using='gin'),
    )


class SearchResult:
    """Search result with ranking and highlights."""
    
    def __init__(
        self,
        object_type: str,
        object_id: int,
        title: str,
        excerpt: str,
        score: float,
        highlights: Optional[Dict[str, List[str]]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Initialize search result.
        
        Args:
            object_type: Type of result.
            object_id: ID of result object.
            title: Result title.
            excerpt: Result excerpt.
            score: Relevance score.
            highlights: Highlighted matches.
            metadata: Additional metadata.
        """
        self.object_type = object_type
        self.object_id = object_id
        self.title = title
        self.excerpt = excerpt
        self.score = score
        self.highlights = highlights or {}
        self.metadata = metadata or {}


class SearchService:
    """Service for search and discovery features."""
    
    def __init__(self, session: Session):
        """Initialize search service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def search(
        self,
        query: str,
        search_types: Optional[List[SearchableType]] = None,
        community_id: Optional[int] = None,
        author_id: Optional[int] = None,
        tags: Optional[List[str]] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        limit: int = 20,
        offset: int = 0,
        sort_by: str = "relevance"
    ) -> Tuple[List[SearchResult], int]:
        """Perform full-text search with filters.
        
        Args:
            query: Search query string.
            search_types: Types to search (None = all).
            community_id: Filter by community.
            author_id: Filter by author.
            tags: Filter by tags.
            date_from: Date range start.
            date_to: Date range end.
            limit: Maximum results.
            offset: Result offset.
            sort_by: Sort method (relevance, date, popularity).
            
        Returns:
            Tuple of (results, total_count).
        """
        # Parse query for special operators
        parsed_query = self._parse_query(query)
        
        # Build base query
        base_query = self.session.query(SearchIndex)
        
        # Apply type filter
        if search_types:
            base_query = base_query.filter(
                SearchIndex.object_type.in_(search_types)
            )
        
        # Apply filters
        if community_id:
            base_query = base_query.filter(SearchIndex.community_id == community_id)
        
        if author_id:
            base_query = base_query.filter(SearchIndex.author_id == author_id)
        
        if tags:
            # All tags must match
            for tag in tags:
                base_query = base_query.filter(
                    SearchIndex.tags.contains([tag])
                )
        
        if date_from:
            base_query = base_query.filter(SearchIndex.created_at >= date_from)
        
        if date_to:
            base_query = base_query.filter(SearchIndex.created_at <= date_to)
        
        # Apply full-text search
        if parsed_query["terms"]:
            search_query = self._build_tsquery(parsed_query)
            
            # Calculate relevance score
            title_rank = func.ts_rank(
                SearchIndex.title_vector,
                search_query,
                1  # Normalization option
            )
            
            content_rank = func.ts_rank(
                SearchIndex.content_vector,
                search_query,
                1
            )
            
            # Combined score with title weighted higher
            combined_rank = (title_rank * 2 + content_rank) / 3
            
            # Add recency boost
            recency_boost = func.exp(
                -func.extract(
                    'epoch',
                    func.now() - SearchIndex.created_at
                ) / (30 * 24 * 60 * 60)  # 30 days decay
            )
            
            # Final score
            final_score = (
                combined_rank * 0.7 +
                SearchIndex.popularity_score * 0.2 +
                recency_boost * 0.1
            )
            
            base_query = base_query.filter(
                or_(
                    SearchIndex.title_vector.match(search_query),
                    SearchIndex.content_vector.match(search_query)
                )
            ).add_columns(final_score.label('score'))
        else:
            # No search terms, just use popularity
            base_query = base_query.add_columns(
                SearchIndex.popularity_score.label('score')
            )
        
        # Get total count
        total_count = base_query.count()
        
        # Apply sorting
        if sort_by == "relevance" and parsed_query["terms"]:
            base_query = base_query.order_by(text('score DESC'))
        elif sort_by == "date":
            base_query = base_query.order_by(SearchIndex.created_at.desc())
        elif sort_by == "popularity":
            base_query = base_query.order_by(SearchIndex.popularity_score.desc())
        
        # Apply pagination
        results_query = base_query.limit(limit).offset(offset)
        
        # Execute query
        raw_results = results_query.all()
        
        # Convert to SearchResult objects
        search_results = []
        for row in raw_results:
            index_entry = row[0] if isinstance(row, tuple) else row
            score = row[1] if isinstance(row, tuple) and len(row) > 1 else 0.0
            
            # Get highlights if searching
            highlights = {}
            if parsed_query["terms"]:
                highlights = await self._get_highlights(
                    index_entry,
                    parsed_query["terms"]
                )
            
            result = SearchResult(
                object_type=index_entry.object_type.value,
                object_id=index_entry.object_id,
                title=index_entry.title or "Untitled",
                excerpt=self._generate_excerpt(
                    index_entry.content,
                    parsed_query["terms"]
                ),
                score=float(score),
                highlights=highlights,
                metadata=index_entry.metadata
            )
            
            search_results.append(result)
        
        return search_results, total_count
    
    async def index_object(
        self,
        object_type: SearchableType,
        object_id: int,
        title: Optional[str] = None,
        content: Optional[str] = None,
        tags: Optional[List[str]] = None,
        community_id: Optional[int] = None,
        author_id: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> SearchIndex:
        """Index or update a searchable object.
        
        Args:
            object_type: Type of object.
            object_id: Object ID.
            title: Object title.
            content: Object content.
            tags: Object tags.
            community_id: Community context.
            author_id: Author/owner ID.
            metadata: Additional metadata.
            
        Returns:
            Created or updated search index entry.
        """
        # Check for existing entry
        existing = self.session.query(SearchIndex).filter(
            SearchIndex.object_type == object_type,
            SearchIndex.object_id == object_id
        ).first()
        
        if existing:
            # Update existing
            index_entry = existing
        else:
            # Create new
            index_entry = SearchIndex(
                object_type=object_type,
                object_id=object_id
            )
        
        # Update fields
        index_entry.title = title
        index_entry.content = content
        index_entry.tags = tags or []
        index_entry.community_id = community_id
        index_entry.author_id = author_id
        index_entry.metadata = metadata or {}
        
        # Update search vectors
        if title:
            index_entry.title_vector = func.to_tsvector('english', title)
        
        if content:
            index_entry.content_vector = func.to_tsvector('english', content)
        
        # Calculate scores
        index_entry.popularity_score = await self._calculate_popularity_score(
            object_type,
            object_id
        )
        index_entry.quality_score = await self._calculate_quality_score(
            object_type,
            object_id
        )
        
        if not existing:
            self.session.add(index_entry)
        
        self.session.commit()
        
        return index_entry
    
    async def suggest(
        self,
        query: str,
        limit: int = 10,
        community_id: Optional[int] = None
    ) -> List[str]:
        """Get search suggestions/autocomplete.
        
        Args:
            query: Partial query string.
            limit: Maximum suggestions.
            community_id: Community context.
            
        Returns:
            List of suggested queries.
        """
        # Simple implementation using title field
        # In production, use a dedicated suggestion index
        
        suggestions_query = self.session.query(
            SearchIndex.title
        ).filter(
            SearchIndex.title.ilike(f"{query}%")
        ).distinct()
        
        if community_id:
            suggestions_query = suggestions_query.filter(
                SearchIndex.community_id == community_id
            )
        
        suggestions_query = suggestions_query.limit(limit)
        
        results = suggestions_query.all()
        
        return [r[0] for r in results if r[0]]
    
    async def get_trending_searches(
        self,
        community_id: Optional[int] = None,
        timeframe_days: int = 7,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get trending search terms.
        
        Args:
            community_id: Community context.
            timeframe_days: Lookback period.
            limit: Maximum results.
            
        Returns:
            List of trending searches with counts.
        """
        # This would typically analyze search logs
        # Simplified implementation using popular content
        
        since_date = datetime.utcnow() - timedelta(days=timeframe_days)
        
        trending_query = self.session.query(
            SearchIndex.tags,
            func.count(SearchIndex.id).label('count')
        ).filter(
            SearchIndex.created_at >= since_date
        )
        
        if community_id:
            trending_query = trending_query.filter(
                SearchIndex.community_id == community_id
            )
        
        # Unnest tags and count
        # This is PostgreSQL specific
        trending_tags = self.session.execute(
            text("""
                SELECT tag, COUNT(*) as count
                FROM search_index, 
                     jsonb_array_elements_text(tags::jsonb) as tag
                WHERE created_at >= :since_date
                GROUP BY tag
                ORDER BY count DESC
                LIMIT :limit
            """),
            {"since_date": since_date, "limit": limit}
        ).fetchall()
        
        return [
            {"term": tag, "count": count}
            for tag, count in trending_tags
        ]
    
    def _parse_query(self, query: str) -> Dict[str, Any]:
        """Parse search query for operators.
        
        Args:
            query: Raw search query.
            
        Returns:
            Parsed query components.
        """
        # Simple parser - extend for advanced syntax
        import re
        
        parsed = {
            "terms": [],
            "required": [],
            "excluded": [],
            "phrases": []
        }
        
        # Extract quoted phrases
        phrase_pattern = r'"([^"]+)"'
        phrases = re.findall(phrase_pattern, query)
        parsed["phrases"] = phrases
        
        # Remove phrases from query
        query_without_phrases = re.sub(phrase_pattern, '', query)
        
        # Split remaining terms
        terms = query_without_phrases.split()
        
        for term in terms:
            if term.startswith('+'):
                parsed["required"].append(term[1:])
            elif term.startswith('-'):
                parsed["excluded"].append(term[1:])
            else:
                parsed["terms"].append(term)
        
        # Combine all positive terms
        parsed["terms"].extend(parsed["required"])
        parsed["terms"].extend(phrases)
        
        return parsed
    
    def _build_tsquery(self, parsed_query: Dict[str, Any]) -> TSQUERY:
        """Build PostgreSQL tsquery from parsed query.
        
        Args:
            parsed_query: Parsed query components.
            
        Returns:
            PostgreSQL tsquery.
        """
        query_parts = []
        
        # Add regular terms with OR
        if parsed_query["terms"]:
            term_query = " | ".join(parsed_query["terms"])
            query_parts.append(term_query)
        
        # Add required terms with AND
        if parsed_query["required"]:
            required_query = " & ".join(parsed_query["required"])
            query_parts.append(f"({required_query})")
        
        # Add excluded terms
        if parsed_query["excluded"]:
            for excluded in parsed_query["excluded"]:
                query_parts.append(f"!{excluded}")
        
        # Combine all parts
        final_query = " & ".join(query_parts) if query_parts else ""
        
        return func.to_tsquery('english', final_query)
    
    async def _calculate_popularity_score(
        self,
        object_type: SearchableType,
        object_id: int
    ) -> float:
        """Calculate popularity score for an object.
        
        Args:
            object_type: Type of object.
            object_id: Object ID.
            
        Returns:
            Popularity score (0-1).
        """
        # Simplified calculation based on object type
        if object_type == SearchableType.CONTENT:
            # Based on views, reactions, comments
            content = self.session.query(Content).get(object_id)
            if content:
                score = (
                    min(content.view_count / 1000, 1.0) * 0.3 +
                    min(content.reaction_count / 100, 1.0) * 0.4 +
                    min(content.comment_count / 50, 1.0) * 0.3
                )
                return score
        
        elif object_type == SearchableType.MEMBER:
            # Based on points, activity
            member = self.session.query(Member).get(object_id)
            if member:
                score = min(member.points / 10000, 1.0)
                return score
        
        return 0.0
    
    def _generate_excerpt(
        self,
        content: Optional[str],
        search_terms: List[str],
        max_length: int = 200
    ) -> str:
        """Generate excerpt with search terms highlighted.
        
        Args:
            content: Full content.
            search_terms: Terms to highlight.
            max_length: Maximum excerpt length.
            
        Returns:
            Generated excerpt.
        """
        if not content:
            return ""
        
        # Find first occurrence of any search term
        lower_content = content.lower()
        first_match_pos = len(content)
        
        for term in search_terms:
            pos = lower_content.find(term.lower())
            if pos != -1 and pos < first_match_pos:
                first_match_pos = pos
        
        # Extract excerpt around match
        start = max(0, first_match_pos - 50)
        end = min(len(content), first_match_pos + max_length - 50)
        
        excerpt = content[start:end]
        
        # Add ellipsis if truncated
        if start > 0:
            excerpt = "..." + excerpt
        if end < len(content):
            excerpt = excerpt + "..."
        
        return excerpt


## 11. Moderation & Admin Tools

### 11.1 Moderation System

```python
"""Content moderation and admin tools.

Provides automated and manual moderation capabilities,
reporting system, and admin dashboard features.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any

from sqlalchemy import (
    Column, String, Boolean, Integer, Float, ForeignKey,
    DateTime, JSON, Text, Enum as SQLEnum
)
from sqlalchemy.orm import relationship, Session

from pycommunity.core.models import BaseModel


class ModerationStatus(str, Enum):
    """Content moderation status."""
    
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    FLAGGED = "flagged"
    UNDER_REVIEW = "under_review"


class ModerationAction(str, Enum):
    """Actions that can be taken on content."""
    
    APPROVE = "approve"
    REJECT = "reject"
    DELETE = "delete"
    EDIT = "edit"
    HIDE = "hide"
    LOCK = "lock"
    PIN = "pin"
    WARN_USER = "warn_user"
    BAN_USER = "ban_user"


class ReportReason(str, Enum):
    """Reasons for reporting content."""
    
    SPAM = "spam"
    HARASSMENT = "harassment"
    HATE_SPEECH = "hate_speech"
    VIOLENCE = "violence"
    SEXUAL_CONTENT = "sexual_content"
    MISINFORMATION = "misinformation"
    COPYRIGHT = "copyright"
    OTHER = "other"


class ReportStatus(str, Enum):
    """Status of content reports."""
    
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


class ModerationRule(BaseModel):
    """Automated moderation rules.
    
    Defines rules for automatic content moderation
    based on patterns, keywords, or AI detection.
    """
    
    __tablename__ = "moderation_rules"
    
    name: str = Column(String(100), nullable=False)
    description: Optional[str] = Column(String(500), nullable=True)
    
    # Rule configuration
    rule_type: str = Column(String(50), nullable=False)  # keyword, regex, ai
    rule_config: Dict[str, Any] = Column(JSON, nullable=False)
    """
    Example configs:
    {
        "type": "keyword",
        "keywords": ["spam", "viagra"],
        "action": "flag"
    }
    {
        "type": "regex",
        "pattern": "\\b\\d{3}-\\d{3}-\\d{4}\\b",
        "action": "hide",
        "reason": "Phone number detected"
    }
    {
        "type": "ai",
        "model": "toxicity",
        "threshold": 0.8,
        "action": "flag"
    }
    """
    
    # Rule settings
    is_active: bool = Column(Boolean, default=True, nullable=False)
    severity: int = Column(Integer, default=1, nullable=False)  # 1-5
    
    # Actions
    action: ModerationAction = Column(
        SQLEnum(ModerationAction),
        nullable=False
    )
    auto_approve_below_severity: Optional[int] = Column(Integer, nullable=True)
    
    # Scope
    apply_to_content: bool = Column(Boolean, default=True, nullable=False)
    apply_to_comments: bool = Column(Boolean, default=True, nullable=False)
    apply_to_messages: bool = Column(Boolean, default=False, nullable=False)
    
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Statistics
    matches_count: int = Column(Integer, default=0, nullable=False)
    false_positive_count: int = Column(Integer, default=0, nullable=False)
    
    # Relationships
    community = relationship("Community")


class ContentReport(BaseModel):
    """Reports on content by users."""
    
    __tablename__ = "content_reports"
    
    # Reported content
    content_type: str = Column(String(50), nullable=False)  # post, comment, message
    content_id: int = Column(Integer, nullable=False)
    
    # Report details
    reason: ReportReason = Column(
        SQLEnum(ReportReason),
        nullable=False
    )
    description: Optional[str] = Column(Text, nullable=True)
    
    # Reporter
    reporter_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    
    # Status
    status: ReportStatus = Column(
        SQLEnum(ReportStatus),
        default=ReportStatus.OPEN,
        nullable=False,
        index=True
    )
    
    # Resolution
    resolved_by_id: Optional[int] = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=True
    )
    resolved_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    resolution_notes: Optional[str] = Column(Text, nullable=True)
    action_taken: Optional[ModerationAction] = Column(
        SQLEnum(ModerationAction),
        nullable=True
    )
    
    # Context
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False,
        index=True
    )
    
    # Relationships
    reporter = relationship("Member", foreign_keys=[reporter_id])
    resolved_by = relationship("Member", foreign_keys=[resolved_by_id])
    community = relationship("Community")


class ModerationLog(BaseModel):
    """Log of all moderation actions."""
    
    __tablename__ = "moderation_logs"
    
    # Action details
    action: ModerationAction = Column(
        SQLEnum(ModerationAction),
        nullable=False,
        index=True
    )
    
    # Target
    target_type: str = Column(String(50), nullable=False)  # content, member
    target_id: int = Column(Integer, nullable=False)
    
    # Actor
    moderator_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    
    # Details
    reason: Optional[str] = Column(String(500), nullable=True)
    notes: Optional[str] = Column(Text, nullable=True)
    
    # Related report
    report_id: Optional[int] = Column(
        Integer,
        ForeignKey("content_reports.id"),
        nullable=True
    )
    
    # Context
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Before/after state
    before_state: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    after_state: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    
    # Relationships
    moderator = relationship("Member")
    report = relationship("ContentReport")
    community = relationship("Community")


class BannedMember(BaseModel):
    """Banned members tracking."""
    
    __tablename__ = "banned_members"
    
    member_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )
    
    # Ban details
    banned_by_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    reason: str = Column(String(500), nullable=False)
    
    # Ban scope
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )  # None = platform-wide ban
    
    # Duration
    banned_until: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )  # None = permanent
    
    # Appeal
    can_appeal: bool = Column(Boolean, default=True, nullable=False)
    appeal_submitted: bool = Column(Boolean, default=False, nullable=False)
    appeal_notes: Optional[str] = Column(Text, nullable=True)
    
    # Relationships
    member = relationship("Member", foreign_keys=[member_id])
    banned_by = relationship("Member", foreign_keys=[banned_by_id])
    community = relationship("Community")
    
    __table_args__ = (
        UniqueConstraint('member_id', 'community_id'),
    )


class ModerationQueue(BaseModel):
    """Queue for content requiring moderation."""
    
    __tablename__ = "moderation_queue"
    
    # Content reference
    content_type: str = Column(String(50), nullable=False)
    content_id: int = Column(Integer, nullable=False)
    
    # Priority
    priority: int = Column(Integer, default=0, nullable=False)  # Higher = urgent
    
    # Reason for moderation
    reason: str = Column(String(200), nullable=False)
    triggered_rules: List[int] = Column(JSON, default=list)  # Rule IDs
    
    # Assignment
    assigned_to_id: Optional[int] = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=True
    )
    assigned_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Status
    status: ModerationStatus = Column(
        SQLEnum(ModerationStatus),
        default=ModerationStatus.PENDING,
        nullable=False,
        index=True
    )
    
    # Context
    community_id: int = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False
    )
    
    # AI scores
    ai_scores: Optional[Dict[str, float]] = Column(JSON, nullable=True)
    
    # Relationships
    assigned_to = relationship("Member")
    community = relationship("Community")
    
    __table_args__ = (
        UniqueConstraint('content_type', 'content_id'),
        Index('idx_moderation_queue_status_priority', 'status', 'priority'),
    )


class ModerationService:
    """Service for content moderation."""
    
    def __init__(
        self,
        session: Session,
        ai_service: Optional[Any] = None
    ):
        """Initialize moderation service.
        
        Args:
            session: Database session.
            ai_service: AI service for automated moderation.
        """
        self.session = session
        self.ai_service = ai_service
    
    async def check_content(
        self,
        content: str,
        content_type: str,
        content_id: int,
        author_id: int,
        community_id: int
    ) -> ModerationStatus:
        """Check content against moderation rules.
        
        Args:
            content: Content to check.
            content_type: Type of content.
            content_id: Content ID.
            author_id: Author ID.
            community_id: Community ID.
            
        Returns:
            Moderation status.
        """
        # Get applicable rules
        rules = self.session.query(ModerationRule).filter(
            ModerationRule.is_active == True,
            or_(
                ModerationRule.community_id == community_id,
                ModerationRule.community_id.is_(None)  # Global rules
            )
        ).order_by(ModerationRule.severity.desc()).all()
        
        triggered_rules = []
        highest_severity = 0
        suggested_action = None
        
        # Check each rule
        for rule in rules:
            if await self._check_rule(content, rule):
                triggered_rules.append(rule.id)
                if rule.severity > highest_severity:
                    highest_severity = rule.severity
                    suggested_action = rule.action
                
                # Update rule statistics
                rule.matches_count += 1
        
        # AI moderation if available
        ai_scores = {}
        if self.ai_service:
            ai_scores = await self.ai_service.moderate_content(content)
            
            # Check AI thresholds
            if ai_scores.get("toxicity", 0) > 0.8:
                highest_severity = max(highest_severity, 4)
                suggested_action = ModerationAction.FLAG
            
            if ai_scores.get("spam", 0) > 0.9:
                highest_severity = max(highest_severity, 3)
                suggested_action = ModerationAction.REJECT
        
        # Determine status
        if not triggered_rules and not ai_scores:
            return ModerationStatus.APPROVED
        
        # Check member trust level
        member = self.session.query(Member).get(author_id)
        if member and member.trust_level >= 3 and highest_severity < 3:
            # Trusted members get auto-approved for low severity
            return ModerationStatus.APPROVED
        
        # Add to moderation queue
        queue_entry = ModerationQueue(
            content_type=content_type,
            content_id=content_id,
            priority=highest_severity,
            reason=f"Triggered {len(triggered_rules)} rules",
            triggered_rules=triggered_rules,
            community_id=community_id,
            ai_scores=ai_scores,
            status=ModerationStatus.PENDING
        )
        
        self.session.add(queue_entry)
        self.session.commit()
        
        # Take immediate action for high severity
        if highest_severity >= 4 and suggested_action:
            await self.take_action(
                content_type=content_type,
                content_id=content_id,
                action=suggested_action,
                moderator_id=0,  # System
                reason="Automated action due to high severity"
            )
            
            return ModerationStatus.REJECTED
        
        return ModerationStatus.UNDER_REVIEW
    
    async def report_content(
        self,
        reporter_id: int,
        content_type: str,
        content_id: int,
        reason: ReportReason,
        description: Optional[str] = None
    ) -> ContentReport:
        """Report content for moderation.
        
        Args:
            reporter_id: Member reporting.
            content_type: Type of content.
            content_id: Content ID.
            reason: Report reason.
            description: Additional details.
            
        Returns:
            Created report.
        """
        # Get content community
        if content_type == "post":
            content = self.session.query(Content).get(content_id)
            community_id = content.community_id if content else None
        else:
            # Handle other content types
            community_id = None  # Implement based on content type
        
        # Create report
        report = ContentReport(
            content_type=content_type,
            content_id=content_id,
            reason=reason,
            description=description,
            reporter_id=reporter_id,
            community_id=community_id,
            status=ReportStatus.OPEN
        )
        
        self.session.add(report)
        
        # Add to moderation queue with high priority
        queue_entry = ModerationQueue(
            content_type=content_type,
            content_id=content_id,
            priority=3,  # Reports get medium-high priority
            reason=f"User report: {reason.value}",
            community_id=community_id,
            status=ModerationStatus.FLAGGED
        )
        
        self.session.add(queue_entry)
        self.session.commit()
        
        # Notify moderators
        await self._notify_moderators(report)
        
        return report
    
    async def take_action(
        self,
        content_type: str,
        content_id: int,
        action: ModerationAction,
        moderator_id: int,
        reason: Optional[str] = None,
        report_id: Optional[int] = None
    ) -> ModerationLog:
        """Take moderation action on content.
        
        Args:
            content_type: Type of content.
            content_id: Content ID.
            action: Action to take.
            moderator_id: Moderator taking action.
            reason: Reason for action.
            report_id: Related report ID.
            
        Returns:
            Moderation log entry.
        """
        # Get current state
        before_state = await self._get_content_state(content_type, content_id)
        
        # Execute action
        if action == ModerationAction.DELETE:
            await self._delete_content(content_type, content_id)
        elif action == ModerationAction.HIDE:
            await self._hide_content(content_type, content_id)
        elif action == ModerationAction.LOCK:
            await self._lock_content(content_type, content_id)
        elif action == ModerationAction.APPROVE:
            await self._approve_content(content_type, content_id)
        elif action == ModerationAction.WARN_USER:
            await self._warn_user(content_type, content_id, reason)
        elif action == ModerationAction.BAN_USER:
            await self._ban_user(content_type, content_id, moderator_id, reason)
        
        # Get after state
        after_state = await self._get_content_state(content_type, content_id)
        
        # Log action
        log_entry = ModerationLog(
            action=action,
            target_type=content_type,
            target_id=content_id,
            moderator_id=moderator_id,
            reason=reason,
            report_id=report_id,
            before_state=before_state,
            after_state=after_state
        )
        
        self.session.add(log_entry)
        
        # Update moderation queue
        queue_entry = self.session.query(ModerationQueue).filter(
            ModerationQueue.content_type == content_type,
            ModerationQueue.content_id == content_id
        ).first()
        
        if queue_entry:
            if action == ModerationAction.APPROVE:
                queue_entry.status = ModerationStatus.APPROVED
            else:
                queue_entry.status = ModerationStatus.REJECTED
        
        # Update report if provided
        if report_id:
            report = self.session.query(ContentReport).get(report_id)
            if report:
                report.status = ReportStatus.RESOLVED
                report.resolved_by_id = moderator_id
                report.resolved_at = datetime.utcnow()
                report.action_taken = action
        
        self.session.commit()
        
        return log_entry
    
    async def _check_rule(
        self,
        content: str,
        rule: ModerationRule
    ) -> bool:
        """Check if content matches a rule.
        
        Args:
            content: Content to check.
            rule: Rule to check against.
            
        Returns:
            True if rule matches.
        """
        config = rule.rule_config
        rule_type = config.get("type")
        
        if rule_type == "keyword":
            # Check for keywords
            keywords = config.get("keywords", [])
            content_lower = content.lower()
            
            for keyword in keywords:
                if keyword.lower() in content_lower:
                    return True
        
        elif rule_type == "regex":
            # Check regex pattern
            import re
            pattern = config.get("pattern")
            if pattern:
                if re.search(pattern, content, re.IGNORECASE):
                    return True
        
        elif rule_type == "ai" and self.ai_service:
            # AI-based detection
            model = config.get("model")
            threshold = config.get("threshold", 0.5)
            
            scores = await self.ai_service.moderate_content(content)
            if scores.get(model, 0) > threshold:
                return True
        
        return False
    
    async def get_moderation_stats(
        self,
        community_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get moderation statistics.
        
        Args:
            community_id: Filter by community.
            start_date: Period start.
            end_date: Period end.
            
        Returns:
            Moderation statistics.
        """
        # Base queries
        queue_query = self.session.query(ModerationQueue)
        reports_query = self.session.query(ContentReport)
        logs_query = self.session.query(ModerationLog)
        
        # Apply filters
        if community_id:
            queue_query = queue_query.filter(
                ModerationQueue.community_id == community_id
            )
            reports_query = reports_query.filter(
                ContentReport.community_id == community_id
            )
            logs_query = logs_query.filter(
                ModerationLog.community_id == community_id
            )
        
        if start_date:
            queue_query = queue_query.filter(
                ModerationQueue.created_at >= start_date
            )
            reports_query = reports_query.filter(
                ContentReport.created_at >= start_date
            )
            logs_query = logs_query.filter(
                ModerationLog.created_at >= start_date
            )
        
        if end_date:
            queue_query = queue_query.filter(
                ModerationQueue.created_at <= end_date
            )
            reports_query = reports_query.filter(
                ContentReport.created_at <= end_date
            )
            logs_query = logs_query.filter(
                ModerationLog.created_at <= end_date
            )
        
        # Calculate statistics
        return {
            "queue": {
                "pending": queue_query.filter(
                    ModerationQueue.status == ModerationStatus.PENDING
                ).count(),
                "in_review": queue_query.filter(
                    ModerationQueue.status == ModerationStatus.UNDER_REVIEW
                ).count(),
                "total": queue_query.count()
            },
            "reports": {
                "open": reports_query.filter(
                    ContentReport.status == ReportStatus.OPEN
                ).count(),
                "resolved": reports_query.filter(
                    ContentReport.status == ReportStatus.RESOLVED
                ).count(),
                "by_reason": self._count_by_reason(reports_query)
            },
            "actions": {
                "total": logs_query.count(),
                "by_action": self._count_by_action(logs_query)
            },
            "response_time": {
                "average_minutes": self._calculate_avg_response_time(reports_query)
            }
        }
    
    def _count_by_reason(self, query) -> Dict[str, int]:
        """Count reports by reason."""
        results = query.with_entities(
            ContentReport.reason,
            func.count(ContentReport.id)
        ).group_by(ContentReport.reason).all()
        
        return {reason.value: count for reason, count in results}
    
    def _count_by_action(self, query) -> Dict[str, int]:
        """Count moderation actions."""
        results = query.with_entities(
            ModerationLog.action,
            func.count(ModerationLog.id)
        ).group_by(ModerationLog.action).all()
        
        return {action.value: count for action, count in results}


## 12. External Integration Framework

### 12.1 Integration Models

```python
"""External integration framework for third-party services.

Provides a flexible system for integrating with external APIs,
webhooks, OAuth providers, and automation platforms.
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable

from sqlalchemy import (
    Column, String, Boolean, Integer, ForeignKey,
    DateTime, JSON, Text, Enum as SQLEnum
)
from sqlalchemy.orm import relationship, Session
import httpx

from pycommunity.core.models import BaseModel


class IntegrationType(str, Enum):
    """Types of external integrations."""
    
    OAUTH = "oauth"
    WEBHOOK = "webhook"
    API = "api"
    ZAPIER = "zapier"
    SLACK = "slack"
    DISCORD = "discord"
    GITHUB = "github"
    JIRA = "jira"
    SALESFORCE = "salesforce"
    HUBSPOT = "hubspot"
    CUSTOM = "custom"


class IntegrationStatus(str, Enum):
    """Status of integrations."""
    
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    PENDING = "pending"
    EXPIRED = "expired"


class Integration(BaseModel):
    """External service integrations."""
    
    __tablename__ = "integrations"
    
    # Integration identification
    name: str = Column(String(100), nullable=False)
    type: IntegrationType = Column(
        SQLEnum(IntegrationType),
        nullable=False,
        index=True
    )
    provider: str = Column(String(50), nullable=False)
    
    # Configuration
    config: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    """
    Example configs:
    {
        "oauth": {
            "client_id": "xxx",
            "client_secret": "yyy",
            "redirect_uri": "https://...",
            "scopes": ["read", "write"]
        },
        "webhook": {
            "url": "https://...",
            "secret": "xxx",
            "events": ["user.created", "post.published"]
        }
    }
    """
    
    # Authentication
    auth_data: Dict[str, Any] = Column(JSON, default=dict, nullable=False)
    """Encrypted storage for tokens, keys, etc."""
    
    # Status
    status: IntegrationStatus = Column(
        SQLEnum(IntegrationStatus),
        default=IntegrationStatus.PENDING,
        nullable=False,
        index=True
    )
    last_sync_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    last_error: Optional[str] = Column(Text, nullable=True)
    
    # Ownership
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True,
        index=True
    )
    created_by_id: int = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )
    
    # Settings
    is_enabled: bool = Column(Boolean, default=True, nullable=False)
    sync_frequency_minutes: Optional[int] = Column(Integer, nullable=True)
    
    # Relationships
    community = relationship("Community")
    created_by = relationship("Member")
    mappings = relationship("IntegrationMapping", back_populates="integration")
    logs = relationship("IntegrationLog", back_populates="integration")


class IntegrationMapping(BaseModel):
    """Field mappings between internal and external systems."""
    
    __tablename__ = "integration_mappings"
    
    integration_id: int = Column(
        Integer,
        ForeignKey("integrations.id"),
        nullable=False,
        index=True
    )
    
    # Mapping configuration
    entity_type: str = Column(String(50), nullable=False)  # member, content, etc.
    
    # Field mappings
    field_mappings: Dict[str, str] = Column(JSON, default=dict)
    """
    Example:
    {
        "internal_field": "external_field",
        "email": "contact_email",
        "display_name": "full_name"
    }
    """
    
    # Transformation rules
    transformations: Dict[str, Any] = Column(JSON, default=dict)
    """
    Example:
    {
        "display_name": {
            "type": "concat",
            "fields": ["first_name", "last_name"],
            "separator": " "
        }
    }
    """
    
    # Sync settings
    sync_direction: str = Column(String(20), default="both")  # in, out, both
    
    # Relationships
    integration = relationship("Integration", back_populates="mappings")


class WebhookEndpoint(BaseModel):
    """Incoming webhook endpoints."""
    
    __tablename__ = "webhook_endpoints"
    
    # Endpoint configuration
    name: str = Column(String(100), nullable=False)
    path: str = Column(String(100), unique=True, nullable=False)
    
    # Security
    secret: str = Column(String(200), nullable=False)
    allowed_ips: List[str] = Column(JSON, default=list)
    
    # Processing
    handler: str = Column(String(100), nullable=False)  # Handler function name
    config: Dict[str, Any] = Column(JSON, default=dict)
    
    # Status
    is_active: bool = Column(Boolean, default=True, nullable=False)
    
    # Statistics
    requests_count: int = Column(Integer, default=0, nullable=False)
    last_request_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Ownership
    community_id: Optional[int] = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=True
    )
    
    # Relationships
    community = relationship("Community")
    requests = relationship("WebhookRequest", back_populates="endpoint")


class WebhookRequest(BaseModel):
    """Log of incoming webhook requests."""
    
    __tablename__ = "webhook_requests"
    
    endpoint_id: int = Column(
        Integer,
        ForeignKey("webhook_endpoints.id"),
        nullable=False,
        index=True
    )
    
    # Request data
    method: str = Column(String(10), nullable=False)
    headers: Dict[str, str] = Column(JSON, default=dict)
    body: Dict[str, Any] = Column(JSON, default=dict)
    query_params: Dict[str, str] = Column(JSON, default=dict)
    
    # Response
    status_code: int = Column(Integer, nullable=False)
    response_body: Optional[Dict[str, Any]] = Column(JSON, nullable=True)
    
    # Processing
    processed: bool = Column(Boolean, default=False, nullable=False)
    processing_error: Optional[str] = Column(Text, nullable=True)
    
    # Source
    ip_address: str = Column(String(45), nullable=False)
    user_agent: Optional[str] = Column(String(500), nullable=True)
    
    # Relationships
    endpoint = relationship("WebhookEndpoint", back_populates="requests")


class IntegrationLog(BaseModel):
    """Log of integration activities."""
    
    __tablename__ = "integration_logs"
    
    integration_id: int = Column(
        Integer,
        ForeignKey("integrations.id"),
        nullable=False,
        index=True
    )
    
    # Log entry
    action: str = Column(String(50), nullable=False)  # sync, auth, error
    level: str = Column(String(20), nullable=False)  # info, warning, error
    message: str = Column(Text, nullable=False)
    
    # Context
    context: Dict[str, Any] = Column(JSON, default=dict)
    
    # Metrics
    items_synced: Optional[int] = Column(Integer, nullable=True)
    duration_seconds: Optional[float] = Column(Float, nullable=True)
    
    # Relationships
    integration = relationship("Integration", back_populates="logs")


class IntegrationService:
    """Service for managing external integrations."""
    
    def __init__(
        self,
        session: Session,
        encryption_key: Optional[str] = None
    ):
        """Initialize integration service.
        
        Args:
            session: Database session.
            encryption_key: Key for encrypting sensitive data.
        """
        self.session = session
        self.encryption_key = encryption_key
        self._handlers: Dict[str, Callable] = {}
        self._webhook_handlers: Dict[str, Callable] = {}
    
    def register_handler(
        self,
        integration_type: str,
        handler: Callable
    ) -> None:
        """Register an integration handler.
        
        Args:
            integration_type: Type of integration.
            handler: Handler function.
        """
        self._handlers[integration_type] = handler
    
    def register_webhook_handler(
        self,
        handler_name: str,
        handler: Callable
    ) -> None:
        """Register a webhook handler.
        
        Args:
            handler_name: Name of handler.
            handler: Handler function.
        """
        self._webhook_handlers[handler_name] = handler
    
    async def create_integration(
        self,
        name: str,
        type: IntegrationType,
        provider: str,
        config: Dict[str, Any],
        created_by_id: int,
        community_id: Optional[int] = None
    ) -> Integration:
        """Create a new integration.
        
        Args:
            name: Integration name.
            type: Integration type.
            provider: Provider name.
            config: Integration configuration.
            created_by_id: Creator ID.
            community_id: Community context.
            
        Returns:
            Created integration.
        """
        integration = Integration(
            name=name,
            type=type,
            provider=provider,
            config=config,
            created_by_id=created_by_id,
            community_id=community_id,
            status=IntegrationStatus.PENDING
        )
        
        self.session.add(integration)
        self.session.commit()
        
        # Initialize based on type
        if type == IntegrationType.OAUTH:
            await self._initialize_oauth(integration)
        elif type == IntegrationType.WEBHOOK:
            await self._initialize_webhook(integration)
        
        return integration
    
    async def authenticate_oauth(
        self,
        integration_id: int,
        authorization_code: str
    ) -> bool:
        """Complete OAuth authentication.
        
        Args:
            integration_id: Integration to authenticate.
            authorization_code: OAuth authorization code.
            
        Returns:
            True if successful.
        """
        integration = self.session.query(Integration).get(integration_id)
        if not integration or integration.type != IntegrationType.OAUTH:
            return False
        
        config = integration.config.get("oauth", {})
        
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            response = await client.post(
                config.get("token_url"),
                data={
                    "grant_type": "authorization_code",
                    "code": authorization_code,
                    "client_id": config.get("client_id"),
                    "client_secret": config.get("client_secret"),
                    "redirect_uri": config.get("redirect_uri")
                }
            )
            
            if response.status_code == 200:
                tokens = response.json()
                
                # Encrypt and store tokens
                integration.auth_data = self._encrypt_data({
                    "access_token": tokens.get("access_token"),
                    "refresh_token": tokens.get("refresh_token"),
                    "expires_at": datetime.utcnow() + timedelta(
                        seconds=tokens.get("expires_in", 3600)
                    )
                })
                
                integration.status = IntegrationStatus.ACTIVE
                self.session.commit()
                
                # Log success
                await self._log_activity(
                    integration,
                    "auth",
                    "info",
                    "OAuth authentication successful"
                )
                
                return True
        
        return False
    
    async def sync_integration(
        self,
        integration_id: int
    ) -> Dict[str, Any]:
        """Sync data with external integration.
        
        Args:
            integration_id: Integration to sync.
            
        Returns:
            Sync results.
        """
        integration = self.session.query(Integration).get(integration_id)
        if not integration or not integration.is_enabled:
            return {"success": False, "error": "Integration not found or disabled"}
        
        # Check if handler exists
        handler = self._handlers.get(integration.provider)
        if not handler:
            return {"success": False, "error": f"No handler for {integration.provider}"}
        
        start_time = datetime.utcnow()
        
        try:
            # Refresh auth if needed
            if integration.type == IntegrationType.OAUTH:
                await self._refresh_oauth_if_needed(integration)
            
            # Execute sync
            result = await handler(integration, self.session)
            
            # Update integration
            integration.last_sync_at = datetime.utcnow()
            integration.status = IntegrationStatus.ACTIVE
            integration.last_error = None
            
            # Log success
            duration = (datetime.utcnow() - start_time).total_seconds()
            await self._log_activity(
                integration,
                "sync",
                "info",
                f"Sync completed successfully",
                context={"result": result},
                items_synced=result.get("items_synced", 0),
                duration_seconds=duration
            )
            
            self.session.commit()
            
            return {
                "success": True,
                "result": result,
                "duration": duration
            }
            
        except Exception as e:
            # Update error status
            integration.status = IntegrationStatus.ERROR
            integration.last_error = str(e)
            
            # Log error
            await self._log_activity(
                integration,
                "sync",
                "error",
                f"Sync failed: {str(e)}"
            )
            
            self.session.commit()
            
            return {
                "success": False,
                "error": str(e)
            }
    
    async def handle_webhook(
        self,
        endpoint_path: str,
        method: str,
        headers: Dict[str, str],
        body: Dict[str, Any],
        query_params: Dict[str, str],
        ip_address: str
    ) -> Dict[str, Any]:
        """Handle incoming webhook request.
        
        Args:
            endpoint_path: Webhook endpoint path.
            method: HTTP method.
            headers: Request headers.
            body: Request body.
            query_params: Query parameters.
            ip_address: Request IP address.
            
        Returns:
            Response data.
        """
        # Find endpoint
        endpoint = self.session.query(WebhookEndpoint).filter(
            WebhookEndpoint.path == endpoint_path,
            WebhookEndpoint.is_active == True
        ).first()
        
        if not endpoint:
            return {"error": "Endpoint not found"}, 404
        
        # Verify IP if configured
        if endpoint.allowed_ips and ip_address not in endpoint.allowed_ips:
            return {"error": "Unauthorized IP"}, 403
        
        # Verify signature if configured
        if endpoint.secret:
            if not self._verify_webhook_signature(
                endpoint.secret,
                headers,
                body
            ):
                return {"error": "Invalid signature"}, 401
        
        # Log request
        request_log = WebhookRequest(
            endpoint_id=endpoint.id,
            method=method,
            headers=headers,
            body=body,
            query_params=query_params,
            ip_address=ip_address,
            user_agent=headers.get("User-Agent")
        )
        
        self.session.add(request_log)
        
        # Update endpoint stats
        endpoint.requests_count += 1
        endpoint.last_request_at = datetime.utcnow()
        
        # Get handler
        handler = self._webhook_handlers.get(endpoint.handler)
        if not handler:
            request_log.status_code = 500
            request_log.processing_error = f"Handler {endpoint.handler} not found"
            self.session.commit()
            return {"error": "Handler not found"}, 500
        
        try:
            # Process webhook
            result = await handler(
                endpoint=endpoint,
                body=body,
                headers=headers,
                session=self.session
            )
            
            request_log.processed = True
            request_log.status_code = 200
            request_log.response_body = result
            
            self.session.commit()
            
            return result, 200
            
        except Exception as e:
            request_log.status_code = 500
            request_log.processing_error = str(e)
            
            self.session.commit()
            
            return {"error": "Processing failed"}, 500
    
    async def _refresh_oauth_if_needed(
        self,
        integration: Integration
    ) -> None:
        """Refresh OAuth tokens if expired.
        
        Args:
            integration: OAuth integration.
        """
        auth_data = self._decrypt_data(integration.auth_data)
        expires_at = auth_data.get("expires_at")
        
        if expires_at and datetime.utcnow() >= expires_at:
            # Refresh token
            config = integration.config.get("oauth", {})
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    config.get("token_url"),
                    data={
                        "grant_type": "refresh_token",
                        "refresh_token": auth_data.get("refresh_token"),
                        "client_id": config.get("client_id"),
                        "client_secret": config.get("client_secret")
                    }
                )
                
                if response.status_code == 200:
                    tokens = response.json()
                    
                    # Update tokens
                    auth_data.update({
                        "access_token": tokens.get("access_token"),
                        "expires_at": datetime.utcnow() + timedelta(
                            seconds=tokens.get("expires_in", 3600)
                        )
                    })
                    
                    if tokens.get("refresh_token"):
                        auth_data["refresh_token"] = tokens["refresh_token"]
                    
                    integration.auth_data = self._encrypt_data(auth_data)
                    self.session.commit()
    
    async def _log_activity(
        self,
        integration: Integration,
        action: str,
        level: str,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        items_synced: Optional[int] = None,
        duration_seconds: Optional[float] = None
    ) -> None:
        """Log integration activity.
        
        Args:
            integration: Integration instance.
            action: Action performed.
            level: Log level.
            message: Log message.
            context: Additional context.
            items_synced: Number of items synced.
            duration_seconds: Operation duration.
        """
        log_entry = IntegrationLog(
            integration_id=integration.id,
            action=action,
            level=level,
            message=message,
            context=context or {},
            items_synced=items_synced,
            duration_seconds=duration_seconds
        )
        
        self.session.add(log_entry)
    
    def _encrypt_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Encrypt sensitive data.
        
        Args:
            data: Data to encrypt.
            
        Returns:
            Encrypted data.
        """
        # Implement encryption using self.encryption_key
        # For now, return as-is (implement proper encryption in production)
        return data
    
    def _decrypt_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Decrypt sensitive data.
        
        Args:
            data: Data to decrypt.
            
        Returns:
            Decrypted data.
        """
        # Implement decryption using self.encryption_key
        # For now, return as-is (implement proper decryption in production)
        return data
    
    def _verify_webhook_signature(
        self,
        secret: str,
        headers: Dict[str, str],
        body: Dict[str, Any]
    ) -> bool:
        """Verify webhook signature.
        
        Args:
            secret: Webhook secret.
            headers: Request headers.
            body: Request body.
            
        Returns:
            True if signature is valid.
        """
        # Implement signature verification based on provider
        # Example for GitHub-style HMAC-SHA256
        import hmac
        import hashlib
        import json
        
        signature = headers.get("X-Webhook-Signature", "")
        
        expected_signature = hmac.new(
            secret.encode(),
            json.dumps(body, sort_keys=True).encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, f"sha256={expected_signature}")


# Integration handler examples

async def slack_integration_handler(
    integration: Integration,
    session: Session
) -> Dict[str, Any]:
    """Handler for Slack integration sync."""
    
    auth_data = integration.auth_data  # Would be decrypted
    
    # Example: Post new content to Slack
    new_content = session.query(Content).filter(
        Content.created_at > integration.last_sync_at,
        Content.community_id == integration.community_id,
        Content.status == ContentStatus.PUBLISHED
    ).all()
    
    posted_count = 0
    
    async with httpx.AsyncClient() as client:
        for content in new_content:
            response = await client.post(
                "https://slack.com/api/chat.postMessage",
                headers={
                    "Authorization": f"Bearer {auth_data.get('access_token')}"
                },
                json={
                    "channel": integration.config.get("channel_id"),
                    "text": f"New post: {content.title}",
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": f"*{content.title}*\n{content.excerpt}"
                            }
                        }
                    ]
                }
            )
            
            if response.status_code == 200:
                posted_count += 1
    
    return {
        "items_synced": posted_count,
        "type": "content_posts"
    }


async def github_webhook_handler(
    endpoint: WebhookEndpoint,
    body: Dict[str, Any],
    headers: Dict[str, str],
    session: Session
) -> Dict[str, Any]:
    """Handler for GitHub webhook events."""
    
    event_type = headers.get("X-GitHub-Event", "")
    
    if event_type == "issues":
        # Create a post for new issues
        issue = body.get("issue", {})
        
        if body.get("action") == "opened":
            content = Content(
                title=f"GitHub Issue: {issue.get('title')}",
                body=issue.get('body', ''),
                author_id=1,  # System user
                community_id=endpoint.community_id,
                type=ContentType.POST,
                tags=["github", "issue"],
                metadata={
                    "github_issue_url": issue.get("html_url"),
                    "github_issue_number": issue.get("number")
                }
            )
            
            session.add(content)
            session.commit()
            
            return {"status": "processed", "content_id": content.id}
    
    return {"status": "ignored", "reason": f"Unhandled event type: {event_type}"}


## 13. Advanced Testing Strategies

### 13.1 Comprehensive Test Suite

```python
"""Advanced testing strategies and fixtures.

Provides comprehensive testing utilities including factories,
fixtures, mocks, and performance testing tools.
"""
import asyncio
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, AsyncGenerator
from unittest.mock import Mock, AsyncMock

import factory
import pytest
import pytest_asyncio
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from pycommunity.core.models import Base
from pycommunity.members.models import Member, MemberRole
from pycommunity.communities.models import Community, CommunityType
from pycommunity.content.models import Content, ContentType

fake = Faker()


# Test database configuration
TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost/pycommunity_test"


class AsyncSQLAlchemyModelFactory(factory.Factory):
    """Base factory for async SQLAlchemy models."""
    
    class Meta:
        abstract = True
    
    @classmethod
    async def create_async(cls, **kwargs):
        """Create instance asynchronously."""
        instance = cls.build(**kwargs)
        async with cls._meta.sqlalchemy_session() as session:
            session.add(instance)
            await session.commit()
            await session.refresh(instance)
        return instance
    
    @classmethod
    async def create_batch_async(cls, size, **kwargs):
        """Create multiple instances asynchronously."""
        instances = []
        async with cls._meta.sqlalchemy_session() as session:
            for _ in range(size):
                instance = cls.build(**kwargs)
                session.add(instance)
                instances.append(instance)
            await session.commit()
            for instance in instances:
                await session.refresh(instance)
        return instances


class MemberFactory(AsyncSQLAlchemyModelFactory):
    """Factory for creating test members."""
    
    class Meta:
        model = Member
    
    email = factory.LazyAttribute(lambda x: fake.email())
    username = factory.LazyAttribute(lambda x: fake.user_name())
    display_name = factory.LazyAttribute(lambda x: fake.name())
    bio = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=200))
    is_verified = True
    points = factory.LazyAttribute(lambda x: fake.random_int(0, 10000))
    level = factory.LazyAttribute(lambda x: fake.random_int(1, 10))
    
    @factory.post_generation
    def communities(self, create, extracted, **kwargs):
        """Add member to communities after creation."""
        if not create:
            return
        
        if extracted:
            for community in extracted:
                self.communities.append(community)


class CommunityFactory(AsyncSQLAlchemyModelFactory):
    """Factory for creating test communities."""
    
    class Meta:
        model = Community
    
    name = factory.LazyAttribute(lambda x: fake.company())
    slug = factory.LazyAttribute(lambda x: fake.slug())
    description = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=300))
    type = factory.LazyAttribute(
        lambda x: fake.random_element(list(CommunityType))
    )
    owner_id = factory.SubFactory(MemberFactory)
    member_count = factory.LazyAttribute(lambda x: fake.random_int(10, 1000))


class ContentFactory(AsyncSQLAlchemyModelFactory):
    """Factory for creating test content."""
    
    class Meta:
        model = Content
    
    title = factory.LazyAttribute(lambda x: fake.sentence(nb_words=6))
    body = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=1000))
    excerpt = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=200))
    type = ContentType.POST
    author_id = factory.SubFactory(MemberFactory)
    community_id = factory.SubFactory(CommunityFactory)
    view_count = factory.LazyAttribute(lambda x: fake.random_int(0, 10000))


@pytest_asyncio.fixture
async def async_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create async database session for tests."""
    
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        future=True
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async_session_maker = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    
    async with async_session_maker() as session:
        yield session
    
    await engine.dispose()


@pytest.fixture
def mock_redis():
    """Mock Redis client for testing."""
    
    class MockRedis:
        def __init__(self):
            self.data = {}
            self.ttls = {}
        
        async def get(self, key: str) -> Optional[str]:
            if key in self.data:
                if key in self.ttls and datetime.utcnow() > self.ttls[key]:
                    del self.data[key]
                    del self.ttls[key]
                    return None
                return self.data[key]
            return None
        
        async def set(self, key: str, value: str, ex: Optional[int] = None):
            self.data[key] = value
            if ex:
                self.ttls[key] = datetime.utcnow() + timedelta(seconds=ex)
        
        async def delete(self, key: str):
            if key in self.data:
                del self.data[key]
            if key in self.ttls:
                del self.ttls[key]
        
        async def incr(self, key: str) -> int:
            current = int(self.data.get(key, 0))
            self.data[key] = str(current + 1)
            return current + 1
        
        async def expire(self, key: str, seconds: int):
            if key in self.data:
                self.ttls[key] = datetime.utcnow() + timedelta(seconds=seconds)
    
    return MockRedis()


@pytest.fixture
def mock_email_service():
    """Mock email service for testing."""
    
    class MockEmailService:
        def __init__(self):
            self.sent_emails = []
        
        async def send_email(
            self,
            to: str,
            subject: str,
            html_body: str,
            text_body: Optional[str] = None
        ):
            self.sent_emails.append({
                "to": to,
                "subject": subject,
                "html_body": html_body,
                "text_body": text_body,
                "sent_at": datetime.utcnow()
            })
            return True
        
        def get_sent_emails(self, to: Optional[str] = None) -> List[Dict]:
            if to:
                return [e for e in self.sent_emails if e["to"] == to]
            return self.sent_emails
        
        def clear(self):
            self.sent_emails = []
    
    return MockEmailService()


class TestMemberService:
    """Advanced tests for member service."""
    
    @pytest.mark.asyncio
    async def test_concurrent_member_creation(
        self,
        async_db_session: AsyncSession
    ):
        """Test concurrent member creation handling."""
        
        from pycommunity.members.services import MemberService
        
        service = MemberService(async_db_session)
        
        # Create multiple members concurrently
        tasks = []
        for i in range(10):
            member_data = MemberCreateSchema(
                email=f"user{i}@example.com",
                username=f"user{i}",
                display_name=f"User {i}"
            )
            tasks.append(service.create_member(member_data))
        
        # Execute concurrently
        members = await asyncio.gather(*tasks)
        
        # Verify all created successfully
        assert len(members) == 10
        assert len(set(m.id for m in members)) == 10  # All unique IDs
        
        # Verify in database
        db_members = await async_db_session.query(Member).all()
        assert len(db_members) == 10
    
    @pytest.mark.asyncio
    async def test_member_soft_delete_cascade(
        self,
        async_db_session: AsyncSession
    ):
        """Test cascading effects of member soft delete."""
        
        # Create member with related data
        member = await MemberFactory.create_async()
        community = await CommunityFactory.create_async(owner_id=member.id)
        content = await ContentFactory.create_async(
            author_id=member.id,
            community_id=community.id
        )
        
        # Soft delete member
        member.soft_delete()
        await async_db_session.commit()
        
        # Verify member is soft deleted
        assert member.is_deleted is True
        assert member.deleted_at is not None
        
        # Verify content is anonymized
        await async_db_session.refresh(content)
        assert content.author_id is None  # Anonymized
        
        # Verify community ownership transferred
        # (Implementation depends on business rules)
    
    @pytest.mark.benchmark
    async def test_member_query_performance(
        self,
        async_db_session: AsyncSession,
        benchmark
    ):
        """Benchmark member query performance."""
        
        # Create test data
        await MemberFactory.create_batch_async(1000)
        
        # Benchmark query
        def query_active_members():
            return async_db_session.query(Member).filter(
                Member.is_deleted == False,
                Member.points > 100
            ).limit(50).all()
        
        result = benchmark(query_active_members)
        assert len(result) <= 50


class TestContentModeration:
    """Tests for content moderation system."""
    
    @pytest.mark.asyncio
    async def test_ai_moderation_mock(
        self,
        async_db_session: AsyncSession
    ):
        """Test AI moderation with mocked service."""
        
        from pycommunity.moderation.services import ModerationService
        
        # Mock AI service
        mock_ai = AsyncMock()
        mock_ai.moderate_content.return_value = {
            "toxicity": 0.9,
            "spam": 0.1,
            "hate_speech": 0.05
        }
        
        service = ModerationService(async_db_session, mock_ai)
        
        # Test moderation
        status = await service.check_content(
            content="This is toxic content",
            content_type="post",
            content_id=1,
            author_id=1,
            community_id=1
        )
        
        # Verify AI was called
        mock_ai.moderate_content.assert_called_once_with("This is toxic content")
        
        # Verify content was flagged
        assert status == ModerationStatus.UNDER_REVIEW
        
        # Verify added to moderation queue
        queue_entry = await async_db_session.query(ModerationQueue).first()
        assert queue_entry is not None
        assert queue_entry.ai_scores["toxicity"] == 0.9
    
    @pytest.mark.parametrize("content,should_flag", [
        ("Normal content here", False),
        ("Buy viagra now!!!", True),
        ("Check out my OnlyFans", True),
        ("Great community post", False),
    ])
    async def test_keyword_moderation(
        self,
        async_db_session: AsyncSession,
        content: str,
        should_flag: bool
    ):
        """Test keyword-based moderation rules."""
        
        from pycommunity.moderation.services import ModerationService
        
        # Create moderation rules
        spam_rule = ModerationRule(
            name="Spam Keywords",
            rule_type="keyword",
            rule_config={
                "type": "keyword",
                "keywords": ["viagra", "onlyfans", "casino"],
                "action": "flag"
            },
            action=ModerationAction.FLAG,
            severity=3
        )
        
        async_db_session.add(spam_rule)
        await async_db_session.commit()
        
        service = ModerationService(async_db_session)
        
        # Test content
        status = await service.check_content(
            content=content,
            content_type="post",
            content_id=1,
            author_id=1,
            community_id=1
        )
        
        if should_flag:
            assert status == ModerationStatus.UNDER_REVIEW
        else:
            assert status == ModerationStatus.APPROVED


class TestWebSocketCommunication:
    """Tests for WebSocket real-time features."""
    
    @pytest.mark.asyncio
    async def test_websocket_connection(self):
        """Test WebSocket connection lifecycle."""
        
        from pycommunity.messaging.websocket import ConnectionManager
        
        manager = ConnectionManager()
        
        # Mock WebSocket
        mock_ws = AsyncMock()
        
        # Test connection
        await manager.connect(mock_ws, member_id=1)
        
        assert 1 in manager.active_connections
        assert manager.presence[1] == PresenceStatus.ONLINE
        
        # Test disconnection
        await manager.disconnect(mock_ws, member_id=1)
        
        assert 1 not in manager.active_connections
        assert manager.presence[1] == PresenceStatus.OFFLINE
    
    @pytest.mark.asyncio
    async def test_message_broadcasting(self):
        """Test message broadcasting to rooms."""
        
        from pycommunity.messaging.websocket import ConnectionManager
        
        manager = ConnectionManager()
        
        # Setup mock connections
        mock_ws1 = AsyncMock()
        mock_ws2 = AsyncMock()
        mock_ws3 = AsyncMock()
        
        await manager.connect(mock_ws1, member_id=1)
        await manager.connect(mock_ws2, member_id=2)
        await manager.connect(mock_ws3, member_id=3)
        
        # Join room
        await manager.join_room(1, "channel:general")
        await manager.join_room(2, "channel:general")
        # Member 3 not in room
        
        # Broadcast message
        message = {
            "type": "chat",
            "content": "Hello everyone!",
            "sender_id": 1
        }
        
        await manager.broadcast_to_room(
            "channel:general",
            message,
            exclude_member=1  # Don't send to sender
        )
        
        # Verify broadcasts
        mock_ws1.send_text.assert_not_called()  # Excluded
        mock_ws2.send_text.assert_called_once()
        mock_ws3.send_text.assert_not_called()  # Not in room


class TestPerformance:
    """Performance and load tests."""
    
    @pytest.mark.asyncio
    @pytest.mark.slow
    async def test_high_load_content_creation(
        self,
        async_db_session: AsyncSession
    ):
        """Test system under high load for content creation."""
        
        from pycommunity.content.services import ContentService
        
        service = ContentService(async_db_session)
        
        # Create test users and community
        users = await MemberFactory.create_batch_async(10)
        community = await CommunityFactory.create_async()
        
        # Measure time for creating many posts
        start_time = datetime.utcnow()
        
        tasks = []
        for i in range(100):
            user = users[i % len(users)]
            content_data = ContentCreateSchema(
                title=f"Load test post {i}",
                body=fake.text(max_nb_chars=1000),
                type=ContentType.POST
            )
            
            task = service.create_content(
                author_id=user.id,
                community_id=community.id,
                content_data=content_data
            )
            tasks.append(task)
        
        # Execute all concurrently
        contents = await asyncio.gather(*tasks)
        
        end_time = datetime.utcnow()
        duration = (end_time - start_time).total_seconds()
        
        # Verify all created
        assert len(contents) == 100
        
        # Performance assertion (adjust based on requirements)
        assert duration < 10.0  # Should complete within 10 seconds
        
        print(f"Created 100 posts in {duration:.2f} seconds")
        print(f"Rate: {100 / duration:.2f} posts/second")
    
    @pytest.mark.asyncio
    async def test_search_performance(
        self,
        async_db_session: AsyncSession
    ):
        """Test search performance with large dataset."""
        
        from pycommunity.search.services import SearchService
        
        # Create large dataset
        members = await MemberFactory.create_batch_async(100)
        communities = await CommunityFactory.create_batch_async(10)
        
        # Create many content items
        contents = []
        for i in range(1000):
            content = await ContentFactory.create_async(
                author_id=members[i % len(members)].id,
                community_id=communities[i % len(communities)].id
            )
            contents.append(content)
        
        # Index all content
        service = SearchService(async_db_session)
        
        for content in contents:
            await service.index_object(
                object_type=SearchableType.CONTENT,
                object_id=content.id,
                title=content.title,
                content=content.body,
                community_id=content.community_id,
                author_id=content.author_id
            )
        
        # Measure search performance
        search_times = []
        
        for _ in range(10):
            start = datetime.utcnow()
            
            results, total = await service.search(
                query="test content",
                limit=20
            )
            
            duration = (datetime.utcnow() - start).total_seconds()
            search_times.append(duration)
        
        # Calculate statistics
        avg_time = sum(search_times) / len(search_times)
        max_time = max(search_times)
        
        print(f"Average search time: {avg_time*1000:.2f}ms")
        print(f"Max search time: {max_time*1000:.2f}ms")
        
        # Performance assertions
        assert avg_time < 0.1  # Average under 100ms
        assert max_time < 0.2  # Max under 200ms


# Pytest configuration

def pytest_configure(config):
    """Configure pytest with custom markers."""
    
    config.addinivalue_line(
        "markers",
        "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers",
        "benchmark: marks tests as benchmarks"
    )
    config.addinivalue_line(
        "markers",
        "integration: marks tests as integration tests"
    )


# Test utilities

class TestDataBuilder:
    """Builder for creating complex test scenarios."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_active_community(
        self,
        member_count: int = 50,
        content_count: int = 100
    ) -> Community:
        """Create a community with activity."""
        
        # Create owner
        owner = await MemberFactory.create_async()
        
        # Create community
        community = await CommunityFactory.create_async(
            owner_id=owner.id,
            member_count=member_count
        )
        
        # Create members
        members = [owner]
        for _ in range(member_count - 1):
            member = await MemberFactory.create_async()
            members.append(member)
            community.members.append(member)
        
        # Create content
        for i in range(content_count):
            author = members[i % len(members)]
            await ContentFactory.create_async(
                author_id=author.id,
                community_id=community.id
            )
        
        await self.session.commit()
        
        return community


## 14. Performance & Scaling

### 14.1 Performance Optimization

```python
"""Performance optimization and scaling strategies.

Implements caching, query optimization, connection pooling,
and horizontal scaling support.
"""
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Set
import asyncio

from sqlalchemy import create_engine, pool, event
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import selectinload, joinedload, contains_eager
from sqlalchemy.sql import text

import redis.asyncio as redis
from aiocache import Cache, cached
from aiocache.serializers import JsonSerializer


class DatabaseOptimizer:
    """Database performance optimization utilities."""
    
    def __init__(self, database_url: str):
        """Initialize database optimizer.
        
        Args:
            database_url: Database connection URL.
        """
        self.database_url = database_url
        self._engine = None
        self._redis_pool = None
    
    async def create_optimized_engine(self) -> Any:
        """Create optimized async database engine.
        
        Returns:
            Async engine with performance optimizations.
        """
        engine = create_async_engine(
            self.database_url,
            # Connection pool settings
            pool_size=20,
            max_overflow=40,
            pool_pre_ping=True,  # Verify connections before use
            pool_recycle=3600,   # Recycle connections after 1 hour
            
            # Statement caching
            query_cache_size=1200,
            
            # Execution options
            connect_args={
                "server_settings": {
                    "application_name": "pycommunity",
                    "jit": "on"
                },
                "command_timeout": 60,
                "prepared_statement_cache_size": 0,  # Disable for better pooling
            }
        )
        
        # Add event listeners
        @event.listens_for(engine.sync_engine, "connect")
        def set_sqlite_pragma(dbapi_conn, connection_record):
            """Set performance pragmas for SQLite."""
            if "sqlite" in self.database_url:
                cursor = dbapi_conn.cursor()
                cursor.execute("PRAGMA journal_mode=WAL")
                cursor.execute("PRAGMA synchronous=NORMAL")
                cursor.execute("PRAGMA cache_size=10000")
                cursor.execute("PRAGMA temp_store=MEMORY")
                cursor.close()
        
        return engine
    
    async def create_indexes(self, session: AsyncSession) -> None:
        """Create performance indexes.
        
        Args:
            session: Database session.
        """
        indexes = [
            # Members
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_members_email_lower ON members (LOWER(email)) WHERE is_deleted = FALSE",
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_members_points_level ON members (points DESC, level DESC) WHERE is_deleted = FALSE",
            
            # Content
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_community_created ON content (community_id, created_at DESC) WHERE is_deleted = FALSE",
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_author_type ON content (author_id, type) WHERE is_deleted = FALSE",
            
            # Search optimization
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_search_gin ON content USING gin(to_tsvector('english', title || ' ' || body))",
            
            # Analytics
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_composite ON analytics_events (event_name, created_at DESC, member_id)",
            
            # Partial indexes for common queries
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_published ON content (published_at DESC) WHERE status = 'published' AND is_deleted = FALSE",
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_members_verified ON members (created_at DESC) WHERE is_verified = TRUE AND is_deleted = FALSE",
        ]
        
        for index_sql in indexes:
            await session.execute(text(index_sql))
        
        await session.commit()
    
    async def analyze_tables(self, session: AsyncSession) -> None:
        """Update table statistics for query planner.
        
        Args:
            session: Database session.
        """
        tables = [
            "members", "communities", "content", "chat_messages",
            "events", "payments", "subscriptions", "notifications"
        ]
        
        for table in tables:
            await session.execute(text(f"ANALYZE {table}"))
        
        await session.commit()


class QueryOptimizer:
    """Query optimization strategies."""
    
    @staticmethod
    def optimize_member_query(query):
        """Optimize member queries with eager loading.
        
        Args:
            query: Base query.
            
        Returns:
            Optimized query.
        """
        return query.options(
            selectinload(Member.communities),
            selectinload(Member.achievements),
            selectinload(Member.subscriptions).selectinload(Subscription.tier)
        )
    
    @staticmethod
    def optimize_content_query(query):
        """Optimize content queries.
        
        Args:
            query: Base query.
            
        Returns:
            Optimized query.
        """
        return query.options(
            joinedload(Content.author),
            joinedload(Content.community),
            selectinload(Content.attachments),
            selectinload(Content.reactions)
        )
    
    @staticmethod
    def optimize_community_dashboard_query(query):
        """Optimize complex dashboard queries.
        
        Args:
            query: Base query.
            
        Returns:
            Optimized query.
        """
        return query.options(
            selectinload(Community.members),
            selectinload(Community.content).selectinload(Content.author),
            selectinload(Community.events)
        )


class CacheManager:
    """Advanced caching strategies."""
    
    def __init__(self, redis_url: str):
        """Initialize cache manager.
        
        Args:
            redis_url: Redis connection URL.
        """
        self.redis_url = redis_url
        self._redis_pool = None
        self._local_cache = Cache(Cache.MEMORY)
    
    async def initialize(self) -> None:
        """Initialize cache connections."""
        self._redis_pool = await redis.create_pool(
            self.redis_url,
            max_connections=50,
            minsize=10
        )
    
    async def get_or_set(
        self,
        key: str,
        factory: Callable,
        ttl: int = 300,
        local_ttl: int = 60
    ) -> Any:
        """Get from cache or set using factory.
        
        Args:
            key: Cache key.
            factory: Async callable to generate value.
            ttl: Redis TTL in seconds.
            local_ttl: Local cache TTL.
            
        Returns:
            Cached or generated value.
        """
        # Try local cache first
        local_value = await self._local_cache.get(key)
        if local_value is not None:
            return local_value
        
        # Try Redis
        async with self._redis_pool.get() as redis_conn:
            redis_value = await redis_conn.get(key)
            if redis_value is not None:
                value = json.loads(redis_value)
                # Update local cache
                await self._local_cache.set(key, value, ttl=local_ttl)
                return value
        
        # Generate value
        value = await factory()
        
        # Store in both caches
        await self._local_cache.set(key, value, ttl=local_ttl)
        
        async with self._redis_pool.get() as redis_conn:
            await redis_conn.setex(
                key,
                ttl,
                json.dumps(value)
            )
        
        return value
    
    async def invalidate_pattern(self, pattern: str) -> None:
        """Invalidate cache entries by pattern.
        
        Args:
            pattern: Redis key pattern.
        """
        async with self._redis_pool.get() as redis_conn:
            cursor = 0
            while True:
                cursor, keys = await redis_conn.scan(
                    cursor,
                    match=pattern,
                    count=100
                )
                
                if keys:
                    await redis_conn.delete(*keys)
                
                if cursor == 0:
                    break
        
        # Clear local cache
        await self._local_cache.clear()


class ContentDeliveryOptimizer:
    """Optimize content delivery and CDN usage."""
    
    def __init__(self, cdn_config: Dict[str, Any]):
        """Initialize CDN optimizer.
        
        Args:
            cdn_config: CDN configuration.
        """
        self.cdn_config = cdn_config
        self._edge_locations = cdn_config.get("edge_locations", [])
    
    def get_optimal_cdn_url(
        self,
        resource_path: str,
        user_location: Optional[str] = None
    ) -> str:
        """Get optimal CDN URL for user location.
        
        Args:
            resource_path: Path to resource.
            user_location: User's geographic location.
            
        Returns:
            Optimal CDN URL.
        """
        if user_location and self._edge_locations:
            # Find nearest edge location
            nearest_edge = self._find_nearest_edge(user_location)
            return f"https://{nearest_edge}/{resource_path}"
        
        # Default CDN URL
        return f"https://{self.cdn_config['default_domain']}/{resource_path}"
    
    def _find_nearest_edge(self, user_location: str) -> str:
        """Find nearest CDN edge location.
        
        Args:
            user_location: User location code.
            
        Returns:
            Nearest edge domain.
        """
        # Simplified - in production use geo-distance calculation
        location_map = {
            "US": "cdn-us.example.com",
            "EU": "cdn-eu.example.com",
            "ASIA": "cdn-asia.example.com",
        }
        
        return location_map.get(
            user_location,
            self.cdn_config['default_domain']
        )


class BackgroundTaskQueue:
    """Async task queue for background processing."""
    
    def __init__(self, redis_url: str):
        """Initialize task queue.
        
        Args:
            redis_url: Redis connection URL.
        """
        self.redis_url = redis_url
        self._redis = None
        self._workers: List[asyncio.Task] = []
        self._handlers: Dict[str, Callable] = {}
    
    async def initialize(self, num_workers: int = 4) -> None:
        """Initialize queue and workers.
        
        Args:
            num_workers: Number of worker tasks.
        """
        self._redis = await redis.create_redis_pool(self.redis_url)
        
        # Start workers
        for i in range(num_workers):
            worker = asyncio.create_task(self._worker(f"worker-{i}"))
            self._workers.append(worker)
    
    def register_handler(self, task_type: str, handler: Callable) -> None:
        """Register task handler.
        
        Args:
            task_type: Type of task.
            handler: Async handler function.
        """
        self._handlers[task_type] = handler
    
    async def enqueue(
        self,
        task_type: str,
        payload: Dict[str, Any],
        priority: int = 0,
        delay_seconds: int = 0
    ) -> str:
        """Enqueue task for processing.
        
        Args:
            task_type: Type of task.
            payload: Task payload.
            priority: Task priority (higher = more urgent).
            delay_seconds: Delay before processing.
            
        Returns:
            Task ID.
        """
        task_id = str(uuid.uuid4())
        
        task_data = {
            "id": task_id,
            "type": task_type,
            "payload": payload,
            "priority": priority,
            "created_at": datetime.utcnow().isoformat(),
            "attempts": 0
        }
        
        if delay_seconds > 0:
            # Add to delayed queue
            score = (datetime.utcnow() + timedelta(seconds=delay_seconds)).timestamp()
            await self._redis.zadd(
                "tasks:delayed",
                score,
                json.dumps(task_data)
            )
        else:
            # Add to priority queue
            await self._redis.zadd(
                "tasks:queue",
                -priority,  # Negative for reverse sort
                json.dumps(task_data)
            )
        
        return task_id
    
    async def _worker(self, worker_id: str) -> None:
        """Worker process for handling tasks.
        
        Args:
            worker_id: Worker identifier.
        """
        while True:
            try:
                # Check delayed tasks
                await self._process_delayed_tasks()
                
                # Get next task
                task_data = await self._redis.zpopmin("tasks:queue")
                
                if not task_data:
                    await asyncio.sleep(1)
                    continue
                
                task = json.loads(task_data[0])
                
                # Process task
                await self._process_task(task)
                
            except Exception as e:
                print(f"Worker {worker_id} error: {e}")
                await asyncio.sleep(5)
    
    async def _process_task(self, task: Dict[str, Any]) -> None:
        """Process a single task.
        
        Args:
            task: Task data.
        """
        task_type = task["type"]
        handler = self._handlers.get(task_type)
        
        if not handler:
            print(f"No handler for task type: {task_type}")
            return
        
        try:
            await handler(task["payload"])
            
            # Log success
            await self._redis.lpush(
                "tasks:completed",
                json.dumps({
                    **task,
                    "completed_at": datetime.utcnow().isoformat()
                })
            )
            
        except Exception as e:
            task["attempts"] += 1
            task["last_error"] = str(e)
            
            if task["attempts"] < 3:
                # Retry with exponential backoff
                delay = 60 * (2 ** task["attempts"])
                await self.enqueue(
                    task["type"],
                    task["payload"],
                    task["priority"],
                    delay
                )
            else:
                # Move to failed queue
                await self._redis.lpush(
                    "tasks:failed",
                    json.dumps(task)
                )
    
    async def _process_delayed_tasks(self) -> None:
        """Move ready delayed tasks to main queue."""
        now = datetime.utcnow().timestamp()
        
        # Get tasks ready to process
        ready_tasks = await self._redis.zrangebyscore(
            "tasks:delayed",
            0,
            now,
            withscores=False
        )
        
        for task_data in ready_tasks:
            task = json.loads(task_data)
            
            # Move to main queue
            await self._redis.zadd(
                "tasks:queue",
                -task["priority"],
                task_data
            )
            
            # Remove from delayed queue
            await self._redis.zrem("tasks:delayed", task_data)


class PerformanceMonitor:
    """Monitor system performance metrics."""
    
    def __init__(self, metrics_backend: Any):
        """Initialize performance monitor.
        
        Args:
            metrics_backend: Metrics collection backend.
        """
        self.metrics = metrics_backend
        self._request_times: Dict[str, List[float]] = {}
    
    async def track_request(
        self,
        endpoint: str,
        duration: float,
        status_code: int
    ) -> None:
        """Track API request performance.
        
        Args:
            endpoint: API endpoint.
            duration: Request duration in seconds.
            status_code: HTTP status code.
        """
        # Send to metrics backend
        await self.metrics.histogram(
            "api_request_duration",
            duration,
            tags={
                "endpoint": endpoint,
                "status": str(status_code)
            }
        )
        
        # Track for analysis
        if endpoint not in self._request_times:
            self._request_times[endpoint] = []
        
        self._request_times[endpoint].append(duration)
        
        # Keep only recent data
        if len(self._request_times[endpoint]) > 1000:
            self._request_times[endpoint] = self._request_times[endpoint][-1000:]
    
    async def track_db_query(
        self,
        query_type: str,
        duration: float,
        row_count: int
    ) -> None:
        """Track database query performance.
        
        Args:
            query_type: Type of query.
            duration: Query duration.
            row_count: Number of rows returned.
        """
        await self.metrics.histogram(
            "db_query_duration",
            duration,
            tags={
                "query_type": query_type,
                "row_count_bucket": self._get_row_count_bucket(row_count)
            }
        )
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get performance summary statistics.
        
        Returns:
            Performance statistics.
        """
        summary = {}
        
        for endpoint, times in self._request_times.items():
            if times:
                summary[endpoint] = {
                    "count": len(times),
                    "avg_ms": sum(times) / len(times) * 1000,
                    "min_ms": min(times) * 1000,
                    "max_ms": max(times) * 1000,
                    "p95_ms": self._percentile(times, 95) * 1000,
                    "p99_ms": self._percentile(times, 99) * 1000
                }
        
        return summary
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile of data.
        
        Args:
            data: List of values.
            percentile: Percentile to calculate.
            
        Returns:
            Percentile value.
        """
        if not data:
            return 0.0
        
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        
        return sorted_data[min(index, len(sorted_data) - 1)]
    
    def _get_row_count_bucket(self, row_count: int) -> str:
        """Get row count bucket for metrics.
        
        Args:
            row_count: Number of rows.
            
        Returns:
            Bucket name.
        """
        if row_count == 0:
            return "0"
        elif row_count <= 10:
            return "1-10"
        elif row_count <= 100:
            return "11-100"
        elif row_count <= 1000:
            return "101-1000"
        else:
            return "1000+"


## 15. Multi-tenancy Support

### 15.1 Multi-tenancy Implementation

```python
"""Multi-tenancy support for SaaS deployment.

Provides tenant isolation, data segregation, and
tenant-specific customization capabilities.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any

from sqlalchemy import (
    Column, String, Boolean, Integer, ForeignKey,
    DateTime, JSON, Enum as SQLEnum, event
)
from sqlalchemy.orm import relationship, Session, Query
from sqlalchemy.ext.declarative import declared_attr

from pycommunity.core.models import BaseModel


class TenantIsolationLevel(str, Enum):
    """Levels of tenant isolation."""
    
    SHARED = "shared"  # Shared tables with tenant_id
    SCHEMA = "schema"  # Separate schemas per tenant
    DATABASE = "database"  # Separate databases per tenant


class TenantStatus(str, Enum):
    """Tenant account status."""
    
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TRIAL = "trial"
    EXPIRED = "expired"
    PENDING = "pending"


class Tenant(BaseModel):
    """Tenant (organization) model for multi-tenancy."""
    
    __tablename__ = "tenants"
    
    # Tenant identification
    name: str = Column(String(100), nullable=False)
    slug: str = Column(String(100), unique=True, nullable=False)
    domain: Optional[str] = Column(String(255), unique=True, nullable=True)
    
    # Status and billing
    status: TenantStatus = Column(
        SQLEnum(TenantStatus),
        default=TenantStatus.TRIAL,
        nullable=False
    )
    trial_ends_at: Optional[datetime] = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Configuration
    settings: Dict[str, Any] = Column(JSON, default=dict)
    features: List[str] = Column(JSON, default=list)
    
    # Limits
    max_members: Optional[int] = Column(Integer, nullable=True)
    max_communities: Optional[int] = Column(Integer, nullable=True)
    max_storage_gb: Optional[int] = Column(Integer, nullable=True)
    
    # Customization
    branding: Dict[str, Any] = Column(JSON, default=dict)
    """
    Example branding:
    {
        "logo_url": "https://...",
        "primary_color": "#007bff",
        "custom_css": "...",
        "email_from_name": "Community"
    }
    """
    
    # Database isolation
    isolation_level: TenantIsolationLevel = Column(
        SQLEnum(TenantIsolationLevel),
        default=TenantIsolationLevel.SHARED,
        nullable=False
    )
    schema_name: Optional[str] = Column(String(63), unique=True, nullable=True)
    database_name: Optional[str] = Column(String(63), unique=True, nullable=True)
    
    # Statistics
    member_count: int = Column(Integer, default=0, nullable=False)
    community_count: int = Column(Integer, default=0, nullable=False)
    storage_used_mb: int = Column(Integer, default=0, nullable=False)
    
    # Relationships
    communities = relationship("Community", back_populates="tenant")
    members = relationship("Member", back_populates="tenant")


class TenantMixin:
    """Mixin for models that belong to a tenant."""
    
    @declared_attr
    def tenant_id(cls):
        """Tenant ID foreign key."""
        return Column(
            Integer,
            ForeignKey("tenants.id"),
            nullable=False,
            index=True
        )
    
    @declared_attr
    def tenant(cls):
        """Tenant relationship."""
        return relationship("Tenant")


class TenantContext:
    """Thread-local storage for current tenant context."""
    
    def __init__(self):
        """Initialize tenant context."""
        self._local = threading.local()
    
    @property
    def current_tenant_id(self) -> Optional[int]:
        """Get current tenant ID."""
        return getattr(self._local, 'tenant_id', None)
    
    @current_tenant_id.setter
    def current_tenant_id(self, tenant_id: Optional[int]) -> None:
        """Set current tenant ID."""
        self._local.tenant_id = tenant_id
    
    @property
    def current_tenant(self) -> Optional[Tenant]:
        """Get current tenant object."""
        return getattr(self._local, 'tenant', None)
    
    @current_tenant.setter
    def current_tenant(self, tenant: Optional[Tenant]) -> None:
        """Set current tenant object."""
        self._local.tenant = tenant
        if tenant:
            self._local.tenant_id = tenant.id
    
    def clear(self) -> None:
        """Clear tenant context."""
        self._local.tenant_id = None
        self._local.tenant = None


# Global tenant context
tenant_context = TenantContext()


class TenantFilter:
    """Automatic tenant filtering for queries."""
    
    @staticmethod
    def apply_tenant_filter(query: Query) -> Query:
        """Apply tenant filter to query.
        
        Args:
            query: SQLAlchemy query.
            
        Returns:
            Filtered query.
        """
        if not tenant_context.current_tenant_id:
            return query
        
        # Check if model has tenant_id
        model = query.column_descriptions[0]['type']
        
        if hasattr(model, 'tenant_id'):
            query = query.filter(
                model.tenant_id == tenant_context.current_tenant_id
            )
        
        return query


# Register query event listener
@event.listens_for(Query, "before_compile", propagate=True)
def apply_tenant_filter_on_query(query, delete_context):
    """Automatically apply tenant filter to queries."""
    
    # Skip if explicitly disabled
    if query.get_execution_options().get('include_all_tenants'):
        return query
    
    return TenantFilter.apply_tenant_filter(query)


class TenantService:
    """Service for managing tenants."""
    
    def __init__(self, session: Session):
        """Initialize tenant service.
        
        Args:
            session: Database session.
        """
        self.session = session
    
    async def create_tenant(
        self,
        name: str,
        slug: str,
        domain: Optional[str] = None,
        isolation_level: TenantIsolationLevel = TenantIsolationLevel.SHARED
    ) -> Tenant:
        """Create a new tenant.
        
        Args:
            name: Tenant name.
            slug: URL-safe slug.
            domain: Custom domain.
            isolation_level: Data isolation level.
            
        Returns:
            Created tenant.
        """
        tenant = Tenant(
            name=name,
            slug=slug,
            domain=domain,
            isolation_level=isolation_level,
            status=TenantStatus.TRIAL,
            trial_ends_at=datetime.utcnow() + timedelta(days=14)
        )
        
        # Set up isolation based on level
        if isolation_level == TenantIsolationLevel.SCHEMA:
            tenant.schema_name = f"tenant_{slug}"
            await self._create_tenant_schema(tenant.schema_name)
        
        elif isolation_level == TenantIsolationLevel.DATABASE:
            tenant.database_name = f"tenant_{slug}"
            await self._create_tenant_database(tenant.database_name)
        
        self.session.add(tenant)
        self.session.commit()
        
        # Initialize tenant data
        await self._initialize_tenant_data(tenant)
        
        return tenant
    
    async def get_tenant_by_domain(
        self,
        domain: str
    ) -> Optional[Tenant]:
        """Get tenant by custom domain.
        
        Args:
            domain: Domain to look up.
            
        Returns:
            Tenant if found.
        """
        return self.session.query(Tenant).filter(
            Tenant.domain == domain,
            Tenant.status == TenantStatus.ACTIVE
        ).first()
    
    async def get_tenant_by_slug(
        self,
        slug: str
    ) -> Optional[Tenant]:
        """Get tenant by slug.
        
        Args:
            slug: Tenant slug.
            
        Returns:
            Tenant if found.
        """
        return self.session.query(Tenant).filter(
            Tenant.slug == slug
        ).first()
    
    async def set_current_tenant(
        self,
        tenant: Tenant
    ) -> None:
        """Set current tenant context.
        
        Args:
            tenant: Tenant to set as current.
        """
        tenant_context.current_tenant = tenant
        
        # Switch schema if needed
        if tenant.isolation_level == TenantIsolationLevel.SCHEMA:
            await self._switch_to_schema(tenant.schema_name)
    
    async def update_tenant_usage(
        self,
        tenant_id: int
    ) -> None:
        """Update tenant usage statistics.
        
        Args:
            tenant_id: Tenant to update.
        """
        tenant = self.session.query(Tenant).get(tenant_id)
        if not tenant:
            return
        
        # Update member count
        tenant.member_count = self.session.query(Member).filter(
            Member.tenant_id == tenant_id,
            Member.is_deleted == False
        ).count()
        
        # Update community count
        tenant.community_count = self.session.query(Community).filter(
            Community.tenant_id == tenant_id,
            Community.is_deleted == False
        ).count()
        
        # Update storage usage
        storage_mb = self.session.query(
            func.sum(MediaFile.file_size)
        ).filter(
            MediaFile.tenant_id == tenant_id
        ).scalar() or 0
        
        tenant.storage_used_mb = storage_mb // (1024 * 1024)
        
        self.session.commit()
    
    async def check_tenant_limits(
        self,
        tenant: Tenant,
        resource_type: str
    ) -> bool:
        """Check if tenant has reached resource limits.
        
        Args:
            tenant: Tenant to check.
            resource_type: Type of resource (members, communities, storage).
            
        Returns:
            True if within limits, False if exceeded.
        """
        if resource_type == "members":
            if tenant.max_members and tenant.member_count >= tenant.max_members:
                return False
        
        elif resource_type == "communities":
            if tenant.max_communities and tenant.community_count >= tenant.max_communities:
                return False
        
        elif resource_type == "storage":
            if tenant.max_storage_gb:
                storage_gb = tenant.storage_used_mb / 1024
                if storage_gb >= tenant.max_storage_gb:
                    return False
        
        return True
    
    async def _create_tenant_schema(
        self,
        schema_name: str
    ) -> None:
        """Create PostgreSQL schema for tenant.
        
        Args:
            schema_name: Schema name to create.
        """
        # Create schema
        await self.session.execute(
            text(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")
        )
        
        # Create tables in schema
        # In production, use Alembic migrations
        from pycommunity.core.models import Base
        
        Base.metadata.create_all(
            self.session.bind,
            schema=schema_name
        )
    
    async def _switch_to_schema(
        self,
        schema_name: str
    ) -> None:
        """Switch to tenant schema.
        
        Args:
            schema_name: Schema to switch to.
        """
        await self.session.execute(
            text(f"SET search_path TO {schema_name}, public")
        )
    
    async def _initialize_tenant_data(
        self,
        tenant: Tenant
    ) -> None:
        """Initialize default data for new tenant.
        
        Args:
            tenant: Newly created tenant.
        """
        # Set context
        tenant_context.current_tenant = tenant
        
        # Create default admin user
        admin = Member(
            tenant_id=tenant.id,
            email=f"admin@{tenant.slug}.local",
            username="admin",
            display_name="Administrator",
            role=MemberRole.ADMIN,
            is_verified=True
        )
        
        self.session.add(admin)
        
        # Create default community
        community = Community(
            tenant_id=tenant.id,
            name="General",
            slug="general",
            description="General discussion",
            owner_id=admin.id,
            type=CommunityType.PUBLIC
        )
        
        self.session.add(community)
        
        # Create welcome content
        welcome_post = Content(
            tenant_id=tenant.id,
            title="Welcome to your new community!",
            body="This is your community platform. Start by inviting members and creating content.",
            author_id=admin.id,
            community_id=community.id,
            type=ContentType.ANNOUNCEMENT,
            status=ContentStatus.PUBLISHED
        )
        
        self.session.add(welcome_post)
        
        self.session.commit()


class TenantMiddleware:
    """ASGI middleware for tenant resolution."""
    
    def __init__(self, app: Any, tenant_service: TenantService):
        """Initialize tenant middleware.
        
        Args:
            app: ASGI application.
            tenant_service: Tenant service instance.
        """
        self.app = app
        self.tenant_service = tenant_service
    
    async def __call__(
        self,
        scope: Dict[str, Any],
        receive: Any,
        send: Any
    ) -> None:
        """Process request with tenant context.
        
        Args:
            scope: ASGI scope.
            receive: ASGI receive.
            send: ASGI send.
        """
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        # Extract tenant from request
        tenant = await self._resolve_tenant(scope)
        
        if tenant:
            # Set tenant context
            tenant_context.current_tenant = tenant
            scope["tenant"] = tenant
        
        try:
            await self.app(scope, receive, send)
        finally:
            # Clear tenant context
            tenant_context.clear()
    
    async def _resolve_tenant(
        self,
        scope: Dict[str, Any]
    ) -> Optional[Tenant]:
        """Resolve tenant from request.
        
        Args:
            scope: ASGI scope.
            
        Returns:
            Resolved tenant or None.
        """
        headers = dict(scope.get("headers", []))
        host = headers.get(b"host", b"").decode()
        path = scope.get("path", "")
        
        # Try custom domain first
        if host and not host.startswith("localhost"):
            tenant = await self.tenant_service.get_tenant_by_domain(host)
            if tenant:
                return tenant
        
        # Try subdomain
        if "." in host:
            subdomain = host.split(".")[0]
            tenant = await self.tenant_service.get_tenant_by_slug(subdomain)
            if tenant:
                return tenant
        
        # Try path prefix
        if path.startswith("/t/"):
            parts = path.split("/")
            if len(parts) >= 3:
                slug = parts[2]
                tenant = await self.tenant_service.get_tenant_by_slug(slug)
                if tenant:
                    return tenant
        
        return None


# Update models to include tenant support

class Member(BaseModel, TenantMixin):
    """Member model with multi-tenancy support."""
    
    __tablename__ = "members"
    
    # ... existing fields ...
    
    # Ensure email uniqueness per tenant
    __table_args__ = (
        UniqueConstraint('email', 'tenant_id'),
        UniqueConstraint('username', 'tenant_id'),
    )


class Community(BaseModel, TenantMixin):
    """Community model with multi-tenancy support."""
    
    __tablename__ = "communities"
    
    # ... existing fields ...
    
    # Ensure slug uniqueness per tenant
    __table_args__ = (
        UniqueConstraint('slug', 'tenant_id'),
    )


# Tenant-aware repository pattern

class TenantAwareRepository:
    """Base repository with automatic tenant filtering."""
    
    def __init__(self, session: Session, model_class: Type[BaseModel]):
        """Initialize repository.
        
        Args:
            session: Database session.
            model_class: Model class to manage.
        """
        self.session = session
        self.model_class = model_class
    
    def query(self) -> Query:
        """Get base query with tenant filter.
        
        Returns:
            Filtered query.
        """
        return self.session.query(self.model_class)
    
    async def get_by_id(
        self,
        id: int,
        include_all_tenants: bool = False
    ) -> Optional[BaseModel]:
        """Get model by ID.
        
        Args:
            id: Model ID.
            include_all_tenants: Whether to bypass tenant filter.
            
        Returns:
            Model instance or None.
        """
        query = self.query()
        
        if include_all_tenants:
            query = query.execution_options(include_all_tenants=True)
        
        return query.filter(self.model_class.id == id).first()
    
    async def create(
        self,
        **kwargs
    ) -> BaseModel:
        """Create new model instance.
        
        Args:
            **kwargs: Model attributes.
            
        Returns:
            Created instance.
        """
        # Auto-set tenant_id if not provided
        if hasattr(self.model_class, 'tenant_id') and 'tenant_id' not in kwargs:
            if tenant_context.current_tenant_id:
                kwargs['tenant_id'] = tenant_context.current_tenant_id
            else:
                raise ValueError("No tenant context set")
        
        instance = self.model_class(**kwargs)
        self.session.add(instance)
        self.session.commit()
        
        return instance


## Conclusion

This comprehensive PRD provides a production-ready blueprint for building a modern community management platform in Python. The architecture emphasizes:

1. **Type Safety**: Complete type annotations throughout
2. **Scalability**: Built for horizontal scaling with caching and optimization
3. **Multi-tenancy**: Full support for SaaS deployment
4. **Security**: Authentication, authorization, and data protection
5. **Extensibility**: Plugin architecture for custom integrations
6. **Performance**: Optimized queries, caching, and background processing
7. **Testing**: Comprehensive test coverage with advanced strategies

The library provides all the essential features needed to compete with platforms like Circle.so, Mighty Networks, Skool, and Bettermode while maintaining Python best practices and enterprise-grade architecture. >= criteria.get("value", 0)
        
        elif criteria_type == "custom":
            handler = criteria.get("handler")
            # Call custom handler function
            return await self._handle_custom_criteria(handler, member, context)
        
        return False
    
    async def create_challenge(
        self,
        community_id: int,
        challenge_data: ChallengeCreateSchema
    ) -> Challenge:
        """Create a new challenge.
        
        Args:
            community_id: Community to create challenge in.
            challenge_data: Challenge configuration.
            
        Returns:
            Created challenge.
        """
        challenge = Challenge(
            community_id=community_id,
            **challenge_data.dict()
        )
        
        self.session.add(challenge)
        self.session.commit()
        self.session.refresh(challenge)
        
        # Schedule notifications
        await self._schedule_challenge_notifications(challenge)
        
        return challenge
    
    async def join_challenge(
        self,
        member_id: int,
        challenge_id: int
    ) -> ChallengeParticipation:
        """Join a member to a challenge.
        
        Args:
            member_id: Member joining.
            challenge_id: Challenge to join.
            
        Returns:
            Participation record.
            
        Raises:
            ValueError: If cannot join challenge.
        """
        challenge = self.session.query(Challenge).get(challenge_id)
        if not challenge or not challenge.is_active():
            raise ValueError("Challenge not available")
        
        # Check if already participating
        existing = self.session.query(ChallengeParticipation).filter(
            ChallengeParticipation.member_id == member_id,
            ChallengeParticipation.challenge_id == challenge_id
        ).first()
        
        if existing:
            raise ValueError("Already participating in challenge")
        
        # Check participant limit
        if challenge.max_participants and challenge.participant_count >= challenge.max_participants:
            raise ValueError("Challenge is full")
        
        # Create participation
        participation = ChallengeParticipation(
            member_id=member_id,
            challenge_id=challenge_id,
            started_at=datetime.utcnow(),
            progress=self._initialize_challenge_progress(challenge)
        )
        
        self.session.add(participation)
        
        # Update challenge stats
        challenge.participant_count += 1
        
        self.session.commit()
        self.session.refresh(participation)
        
        return participation
    
    async def update_challenge_progress(
        self,
        member_id: int,
        challenge_id: int,
        action_type: str,
        action_data: Optional[Dict[str, Any]] = None
    ) -> Optional[ChallengeParticipation]:
        """Update member's progress in a challenge.
        
        Args:
            member_id: Member ID.
            challenge_id: Challenge ID.
            action_type: Type of action completed.
            action_data: Additional action data.
            
        Returns:
            Updated participation if challenge completed.
        """
        participation = self.session.query(ChallengeParticipation).filter(
            ChallengeParticipation.member_id == member_id,
            ChallengeParticipation.challenge_id == challenge_id,
            ChallengeParticipation.completed_at.is_(None)
        ).first()
        
        if not participation:
            return None
        
        challenge = participation.challenge
        if not challenge.is_active():
            return None
        
        # Update progress based on requirements
        requirements = challenge.requirements
        progress = participation.progress
        
        for action in requirements.get("actions", []):
            if action["type"] == action_type:
                current = progress.get(action_type, 0)
                progress[action_type] = current + 1
                
                # Check if this action requirement is met
                if progress[action_type] >= action.get("count", 1):
                    progress[f"{action_type}_completed"] = True
        
        # Calculate completion percentage
        total_actions = len(requirements.get("actions", []))
        completed_actions = sum(
            1 for key in progress if key.endswith("_completed")
        )
        
        participation.completion_percentage = (completed_actions / total_actions * 100) if total_actions > 0 else 0
        
        # Check if challenge is completed
        min_completion = requirements.get("min_completion", total_actions)
        if completed_actions >= min_completion:
            participation.completed_at = datetime.utcnow()
            challenge.completion_count += 1
            
            # Auto-claim rewards if configured
            if challenge.rewards and not participation.rewards_claimed:
                await self._claim_challenge_rewards(participation)
        
        participation.progress = progress
        self.session.commit()
        
        return participation if participation.completed_at else None
    
    async def update_leaderboards(
        self,
        leaderboard_id: Optional[int] = None
    ) -> None:
        """Update leaderboard entries.
        
        Args:
            leaderboard_id: Specific leaderboard to update, or None for all.
        """
        query = self.session.query(Leaderboard).filter(
            Leaderboard.is_active == True
        )
        
        if leaderboard_id:
            query = query.filter(Leaderboard.id == leaderboard_id)
        
        leaderboards = query.all()
        
        for leaderboard in leaderboards:
            # Check if update is needed
            if leaderboard.last_updated_at:
                time_since_update = datetime.utcnow() - leaderboard.last_updated_at
                if time_since_update.total_seconds() / 60 < leaderboard.update_frequency_minutes:
                    continue
            
            await self._update_single_leaderboard(leaderboard)
            
            leaderboard.last_updated_at = datetime.utcnow()
        
        self.session.commit()
    
    async def _update_single_leaderboard(
        self,
        leaderboard: Leaderboard
    ) -> None:
        """Update a single leaderboard.
        
        Args:
            leaderboard: Leaderboard to update.
        """
        # Determine time period
        now = datetime.utcnow()
        
        if leaderboard.timeframe == "daily":
            period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            period_end = period_start + timedelta(days=1)
        elif leaderboard.timeframe == "weekly":
            period_start = now - timedelta(days=now.weekday())
            period_start = period_start.replace(hour=0, minute=0, second=0, microsecond=0)
            period_end = period_start + timedelta(days=7)
        elif leaderboard.timeframe == "monthly":
            period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            # Calculate last day of month
            if now.month == 12:
                period_end = period_start.replace(year=now.year + 1, month=1)
            else:
                period_end = period_start.replace(month=now.month + 1)
        else:  # all_time
            period_start = datetime(2020, 1, 1)  # Arbitrary start
            period_end = now + timedelta(days=365)  # Far future
        
        # Clear existing entries for this period
        self.session.query(LeaderboardEntry).filter(
            LeaderboardEntry.leaderboard_id == leaderboard.id,
            LeaderboardEntry.period_start == period_start
        ).delete()
        
        # Calculate scores based on metric type
        if leaderboard.metric_type == "points":
            # Simple points leaderboard
            results = self.session.query(
                Member.id,
                Member.points
            ).filter(
                Member.is_deleted == False
            ).order_by(
                Member.points.desc()
            ).limit(leaderboard.show_top_n).all()
            
            for rank, (member_id, score) in enumerate(results, 1):
                entry = LeaderboardEntry(
                    leaderboard_id=leaderboard.id,
                    member_id=member_id,
                    rank=rank,
                    score=float(score),
                    period_start=period_start,
                    period_end=period_end,
                    metrics={"points": score}
                )
                self.session.add(entry)
        
        elif leaderboard.metric_type == "engagement_score":
            # Complex engagement calculation
            members = self.session.query(Member).filter(
                Member.is_deleted == False
            ).all()
            
            scores = []
            for member in members:
                score = await self._calculate_engagement_score(
                    member,
                    period_start,
                    period_end
                )
                if score > 0:
                    scores.append((member.id, score))
            
            # Sort and create entries
            scores.sort(key=lambda x: x[1], reverse=True)
            
            for rank, (member_id, score) in enumerate(scores[:leaderboard.show_top_n], 1):
                entry = LeaderboardEntry(
                    leaderboard_id=leaderboard.id,
                    member_id=member_id,
                    rank=rank,
                    score=score,
                    period_start=period_start,
                    period_end=period_end
                )
                self.session.add(entry)
    
    async def _calculate_engagement_score(
        self,
        member: Member,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> float:
        """Calculate member engagement score.
        
        Args:
            member: Member to calculate for.
            start_date: Period start.
            end_date: Period end.
            
        Returns:
            Engagement score.
        """
        score = 0.0
        
        # Base query filters
        filters = [Post.author_id == member.id]
        if start_date:
            filters.append(Post.created_at >= start_date)
        if end_date:
            filters.append(Post.created_at <= end_date)
        
        # Posts created
        post_count = self.session.query(func.count(Post.id)).filter(*filters).scalar()
        score += post_count * 10
        
        # Reactions given
        reaction_filters = [ContentReaction.member_id == member.id]
        if start_date:
            reaction_filters.append(ContentReaction.created_at >= start_date)
        if end_date:
            reaction_filters.append(ContentReaction.created_at <= end_date)
        
        reactions_given = self.session.query(func.count(ContentReaction.id)).filter(*reaction_filters).scalar()
        score += reactions_given * 2
        
        # Events attended
        event_filters = [
            event_attendees.c.member_id == member.id,
            event_attendees.c.status == AttendeeStatus.ATTENDED
        ]
        if start_date:
            event_filters.append(event_attendees.c.attended_at >= start_date)
        if end_date:
            event_filters.append(event_attendees.c.attended_at <= end_date)
        
        events_attended = self.session.query(func.count()).select_from(event_attendees).filter(*event_filters).scalar()
        score += events_attended * 20
        
        # Streak bonus
        if member.streak_days > 0:
            score += min(member.streak_days * 5, 100)  # Cap at 100 points
        
        return score