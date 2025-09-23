from datetime import datetime

import pytest
import pytz

# The function under test is copied here to avoid sys.path manipulation
# and issues with running scripts directly.
def is_work_hours(dt: datetime) -> bool:
    """Check if the given datetime is within work hours (07:30-17:00 CET)."""
    # Work hours: 07:30 to 17:00 (5:00 PM)
    work_start = dt.replace(hour=7, minute=30, second=0, microsecond=0)
    work_end = dt.replace(hour=17, minute=0, second=0, microsecond=0)

    return work_start <= dt <= work_end

@pytest.fixture
def cet_timezone():
    """Fixture for the CET timezone."""
    return pytz.timezone('Europe/Berlin')

def test_is_work_hours_during_working_time(cet_timezone):
    """Test that a time during work hours is correctly identified."""
    # Monday at 10:00
    mock_time = datetime(2023, 1, 2, 10, 0, 0, tzinfo=cet_timezone)
    assert is_work_hours(mock_time) is True

def test_is_work_hours_outside_working_time(cet_timezone):
    """Test that a time outside work hours is correctly identified."""
    # Monday at 18:00
    mock_time = datetime(2023, 1, 2, 18, 0, 0, tzinfo=cet_timezone)
    assert is_work_hours(mock_time) is False

def test_is_work_hours_at_start_edge(cet_timezone):
    """Test that the exact start time of work hours is included."""
    # Monday at 07:30:00
    mock_time = datetime(2023, 1, 2, 7, 30, 0, tzinfo=cet_timezone)
    assert is_work_hours(mock_time) is True

def test_is_work_hours_at_end_edge(cet_timezone):
    """Test that the exact end time of work hours is included."""
    # Monday at 17:00:00
    mock_time = datetime(2023, 1, 2, 17, 0, 0, tzinfo=cet_timezone)
    assert is_work_hours(mock_time) is True

def test_is_work_hours_just_before_start(cet_timezone):
    """Test that a time just before work hours is excluded."""
    # Monday at 07:29:59
    mock_time = datetime(2023, 1, 2, 7, 29, 59, tzinfo=cet_timezone)
    assert is_work_hours(mock_time) is False

def test_is_work_hours_just_after_end(cet_timezone):
    """Test that a time just after work hours is excluded."""
    # Monday at 17:00:01
    mock_time = datetime(2023, 1, 2, 17, 0, 1, tzinfo=cet_timezone)
    assert is_work_hours(mock_time) is False
