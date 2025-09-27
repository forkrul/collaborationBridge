import pytest
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from src.collaboration_bridge.crud.contact import contact_crud
from src.collaboration_bridge.schemas.contact import ContactCreate, ContactUpdate
from src.collaboration_bridge.models.contact import ContactLevel, Contact
from src.collaboration_bridge.models.user import User

# Helper function to create a prerequisite user (necessary as we rely on real User IDs)
async def create_test_user(db: AsyncSession) -> User:
    """Creates a dummy user for testing relationships."""
    user = User(
        email=f"testuser_{uuid.uuid4()}@example.com",
        full_name="Test User",
        hashed_password="hashed_password",
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@pytest.mark.asyncio
async def test_create_contact(db_session: AsyncSession) -> None:
    """Test the creation of a contact associated with a user."""
    user = await create_test_user(db_session)

    contact_data = ContactCreate(
        name="Alex Chen",
        title="Director of Engineering",
        level=ContactLevel.SKIP_LEVEL
    )

    contact = await contact_crud.create_with_owner(
        db=db_session, obj_in=contact_data, user_id=user.id
    )

    assert contact.name == "Alex Chen"
    assert contact.user_id == user.id
    assert contact.deleted_at is None

@pytest.mark.asyncio
async def test_update_contact(db_session: AsyncSession) -> None:
    """Test partial update (PATCH) functionality."""
    user = await create_test_user(db_session)
    # 1. Create
    contact_data = ContactCreate(name="Original Name", level=ContactLevel.DIRECT_MANAGER)
    contact = await contact_crud.create_with_owner(db=db_session, obj_in=contact_data, user_id=user.id)

    # 2. Update (Partial)
    update_schema = ContactUpdate(title="Senior Manager")
    updated_contact = await contact_crud.update(db_session, db_obj=contact, obj_in=update_schema)

    assert updated_contact.title == "Senior Manager"
    assert updated_contact.name == "Original Name" # Name was not changed

@pytest.mark.asyncio
async def test_soft_delete_contact(db_session: AsyncSession) -> None:
    """Test that removing a contact soft-deletes it and prevents retrieval."""
    user = await create_test_user(db_session)

    # 1. Create the contact
    contact_data = ContactCreate(name="Beth Smith", level=ContactLevel.DIRECT_MANAGER)
    contact = await contact_crud.create_with_owner(
        db=db_session, obj_in=contact_data, user_id=user.id
    )
    contact_id = contact.id

    # 2. Verify it exists using specialized getter
    retrieved = await contact_crud.get_by_user(db=db_session, user_id=user.id, contact_id=contact_id)
    assert retrieved is not None

    # 3. Soft delete the contact
    deleted_obj = await contact_crud.remove(db=db_session, db_obj=contact)
    assert deleted_obj.deleted_at is not None

    # 4. Verify specialized retrieval fails (uses active filter)
    retrieved_after_delete = await contact_crud.get_by_user(db=db_session, user_id=user.id, contact_id=contact_id)
    assert retrieved_after_delete is None

    # 5. Verify generic retrieval fails (uses active filter)
    retrieved_generic_after_delete = await contact_crud.get(db=db_session, id=contact_id)
    assert retrieved_generic_after_delete is None

    # 6. Verify standard multi-retrieval excludes it
    all_contacts = await contact_crud.get_multi_by_user(db=db_session, user_id=user.id)
    assert len(all_contacts) == 0

    # 7. TDD Verification: Ensure the data is still in the database (Direct DB check, bypassing CRUD filters)
    from sqlalchemy.future import select
    query = select(Contact).where(Contact.id == contact_id)
    result = await db_session.execute(query)
    db_record = result.scalars().first()

    assert db_record is not None
    assert db_record.deleted_at is not None