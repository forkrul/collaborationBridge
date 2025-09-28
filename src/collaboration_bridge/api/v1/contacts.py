import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from collaboration_bridge.api import deps
from collaboration_bridge.crud.contact import contact_crud
from collaboration_bridge.models.user import User
from collaboration_bridge.schemas.contact import (
    ContactCreate,
    ContactRead,
    ContactUpdate,
)
from collaboration_bridge.schemas.onboarding import OnboardingStatus

router = APIRouter()

@router.post("/", response_model=ContactRead, status_code=status.HTTP_201_CREATED)
async def create_contact(
    *,
    db: AsyncSession = Depends(deps.get_db),
    contact_in: ContactCreate,
    current_user: User = Depends(deps.get_current_user),
) -> ContactRead:
    """
    Create a new contact for the current user.
    This also advances the user's onboarding status if it's their first contact.
    """
    contact = await contact_crud.create_with_owner(
        db=db, obj_in=contact_in, user_id=current_user.id
    )

    # Advance onboarding status if this is the first contact added
    if current_user.onboarding_status == OnboardingStatus.NOT_STARTED:
        current_user.onboarding_status = OnboardingStatus.FIRST_CONTACT_ADDED
        db.add(current_user)
        await db.commit()
        await db.refresh(current_user)

    return contact

@router.get("/", response_model=List[ContactRead])
async def read_contacts(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> List[ContactRead]:
    """Retrieve all active contacts for the current user."""
    contacts = await contact_crud.get_multi_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return contacts

@router.get("/{contact_id}", response_model=ContactRead)
async def read_contact(
    *,
    contact_id: uuid.UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> ContactRead:
    """Get a specific contact by ID."""
    # get_by_user handles existence, ownership, and active status checks.
    contact = await contact_crud.get_by_user(
        db=db, user_id=current_user.id, contact_id=contact_id
    )
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found or inactive.",
        )
    return contact

@router.patch("/{contact_id}", response_model=ContactRead)
async def update_contact(
    *,
    contact_id: uuid.UUID,
    contact_in: ContactUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> ContactRead:
    """Update a contact (Partial Update)."""
    db_obj = await contact_crud.get_by_user(
        db=db, user_id=current_user.id, contact_id=contact_id
    )
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found or inactive.",
        )

    contact = await contact_crud.update(db=db, db_obj=db_obj, obj_in=contact_in)
    return contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    *,
    contact_id: uuid.UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> None:
    """Soft delete a contact."""
    # Ensure the contact exists, belongs to the user, and is active before deleting
    contact = await contact_crud.get_by_user(
        db=db, user_id=current_user.id, contact_id=contact_id
    )
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found or already deleted.",
        )

    # The remove method handles the soft-delete logic
    await contact_crud.remove(db=db, db_obj=contact)
    return
